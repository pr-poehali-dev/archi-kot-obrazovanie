-- Создание таблицы пользователей
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('teacher', 'student')),
  points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы модулей/предметов
CREATE TABLE IF NOT EXISTS modules (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  icon VARCHAR(100) NOT NULL,
  color VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы заданий
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  module_id INTEGER NOT NULL REFERENCES modules(id),
  teacher_id INTEGER NOT NULL REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  task_type VARCHAR(50) NOT NULL CHECK (task_type IN ('choice', 'text', 'number')),
  correct_answer TEXT,
  options JSONB,
  points INTEGER DEFAULT 10,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы выполненных заданий
CREATE TABLE IF NOT EXISTS completed_tasks (
  id SERIAL PRIMARY KEY,
  task_id INTEGER NOT NULL REFERENCES tasks(id),
  student_id INTEGER NOT NULL REFERENCES users(id),
  answer TEXT,
  is_correct BOOLEAN DEFAULT FALSE,
  points_earned INTEGER DEFAULT 0,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(task_id, student_id)
);

-- Создание таблицы достижений
CREATE TABLE IF NOT EXISTS achievements (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  icon VARCHAR(100) NOT NULL,
  description TEXT,
  required_points INTEGER DEFAULT 0
);

-- Создание таблицы полученных достижений
CREATE TABLE IF NOT EXISTS user_achievements (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  achievement_id INTEGER NOT NULL REFERENCES achievements(id),
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, achievement_id)
);

-- Вставка начальных модулей
INSERT INTO modules (title, icon, color, description) VALUES
('Математика', 'Calculator', 'bg-primary', 'Изучай числа, примеры и задачки'),
('Русский язык', 'BookOpen', 'bg-secondary', 'Учи правила и развивай грамотность'),
('Окружающий мир', 'Globe', 'bg-accent', 'Познавай природу и науку'),
('Логика', 'Puzzle', 'bg-[hsl(var(--lavender))]', 'Развивай мышление и смекалку'),
('Творчество', 'Palette', 'bg-primary', 'Рисуй, пиши и создавай'),
('История', 'Scroll', 'bg-secondary', 'Узнавай о прошлом человечества');

-- Вставка начальных достижений
INSERT INTO achievements (title, icon, description, required_points) VALUES
('Первый урок', 'Star', 'Выполни первое задание', 10),
('Математик', 'Award', 'Реши 10 заданий по математике', 100),
('Читатель', 'BookMarked', 'Выполни 5 заданий по русскому языку', 50),
('Исследователь', 'Trophy', 'Набери 500 очков', 500);
