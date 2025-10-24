'''
Business: API для работы с заданиями - получение списка, создание, проверка ответов
Args: event с httpMethod, queryStringParameters, body
Returns: JSON с данными заданий или результатом проверки
'''

import json
import os
from typing import Dict, Any, Optional
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    
    conn = get_db_connection()
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters', {})
            
            if params.get('teacher_id'):
                return get_teacher_tasks(conn, params['teacher_id'], headers)
            elif params.get('module_id') and params.get('student_id'):
                return get_module_tasks(conn, params['module_id'], params['student_id'], headers)
            else:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Missing parameters'})
                }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            params = event.get('queryStringParameters', {})
            
            if params.get('action') == 'create':
                return create_task(conn, body_data, headers)
            elif params.get('action') == 'submit':
                return submit_answer(conn, body_data, headers)
            else:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Unknown endpoint'})
                }
        
        return {
            'statusCode': 405,
            'headers': headers,
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    finally:
        conn.close()

def get_teacher_tasks(conn, teacher_id: str, headers: Dict) -> Dict[str, Any]:
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute('''
            SELECT 
                t.id, t.title, t.description, t.task_type, t.points,
                m.title as module_title,
                COUNT(ct.id) as completed_count
            FROM tasks t
            JOIN modules m ON t.module_id = m.id
            LEFT JOIN completed_tasks ct ON t.id = ct.task_id
            WHERE t.teacher_id = %s
            GROUP BY t.id, m.title
            ORDER BY t.created_at DESC
        ''', (teacher_id,))
        
        tasks = cur.fetchall()
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'tasks': [dict(row) for row in tasks]})
        }

def get_module_tasks(conn, module_id: str, student_id: str, headers: Dict) -> Dict[str, Any]:
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute('''
            SELECT 
                t.id, t.title, t.description, t.task_type, t.options, t.points,
                CASE WHEN ct.id IS NOT NULL THEN TRUE ELSE FALSE END as is_completed
            FROM tasks t
            LEFT JOIN completed_tasks ct ON t.id = ct.task_id AND ct.student_id = %s
            WHERE t.module_id = %s
            ORDER BY t.created_at ASC
        ''', (student_id, module_id))
        
        tasks = cur.fetchall()
        
        return {
            'statusCode': 200,
            'headers': headers,
            'isBase64Encoded': False,
            'body': json.dumps({'tasks': [dict(row) for row in tasks]})
        }

def create_task(conn, data: Dict[str, Any], headers: Dict) -> Dict[str, Any]:
    module_id = data.get('module_id')
    teacher_id = data.get('teacher_id')
    title = data.get('title')
    description = data.get('description')
    task_type = data.get('task_type')
    correct_answer = data.get('correct_answer')
    options = data.get('options')
    points = data.get('points', 10)
    
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute('''
            INSERT INTO tasks (module_id, teacher_id, title, description, task_type, correct_answer, options, points)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id
        ''', (module_id, teacher_id, title, description, task_type, correct_answer, json.dumps(options), points))
        
        task_id = cur.fetchone()['id']
        conn.commit()
        
        return {
            'statusCode': 201,
            'headers': headers,
            'isBase64Encoded': False,
            'body': json.dumps({'task_id': task_id, 'message': 'Task created'})
        }

def submit_answer(conn, data: Dict[str, Any], headers: Dict) -> Dict[str, Any]:
    task_id = data.get('task_id')
    student_id = data.get('student_id')
    answer = data.get('answer')
    
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute('SELECT correct_answer, points FROM tasks WHERE id = %s', (task_id,))
        task = cur.fetchone()
        
        if not task:
            return {
                'statusCode': 404,
                'headers': headers,
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Task not found'})
            }
        
        is_correct = str(answer).strip().lower() == str(task['correct_answer']).strip().lower()
        points_earned = task['points'] if is_correct else 0
        
        cur.execute('''
            INSERT INTO completed_tasks (task_id, student_id, answer, is_correct, points_earned)
            VALUES (%s, %s, %s, %s, %s)
            ON CONFLICT (task_id, student_id) DO UPDATE
            SET answer = EXCLUDED.answer, is_correct = EXCLUDED.is_correct, points_earned = EXCLUDED.points_earned
        ''', (task_id, student_id, answer, is_correct, points_earned))
        
        if is_correct:
            cur.execute('''
                UPDATE users 
                SET points = points + %s
                WHERE id = %s AND NOT EXISTS (
                    SELECT 1 FROM completed_tasks 
                    WHERE task_id = %s AND student_id = %s AND is_correct = TRUE
                )
            ''', (points_earned, student_id, task_id, student_id))
        
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': headers,
            'isBase64Encoded': False,
            'body': json.dumps({
                'is_correct': is_correct,
                'points_earned': points_earned
            })
        }