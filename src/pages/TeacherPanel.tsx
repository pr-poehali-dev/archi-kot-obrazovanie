import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface TaskForm {
  module_id: string;
  title: string;
  description: string;
  task_type: 'choice' | 'text' | 'number';
  correct_answer: string;
  options: string[];
  points: number;
}

const TeacherPanel = () => {
  const [showForm, setShowForm] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);
  const currentTeacher = { id: 1, name: 'Мария Ивановна' };
  
  const [form, setForm] = useState<TaskForm>({
    module_id: '',
    title: '',
    description: '',
    task_type: 'choice',
    correct_answer: '',
    options: ['', '', '', ''],
    points: 10
  });

  const modules = [
    { id: 1, title: 'Математика', icon: 'Calculator' },
    { id: 2, title: 'Русский язык', icon: 'BookOpen' },
    { id: 3, title: 'Окружающий мир', icon: 'Globe' },
    { id: 4, title: 'Логика', icon: 'Puzzle' },
    { id: 5, title: 'Творчество', icon: 'Palette' },
    { id: 6, title: 'История', icon: 'Scroll' }
  ];

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const response = await fetch(`/api/tasks/teacher?teacher_id=${currentTeacher.id}`);
      const data = await response.json();
      setTasks(data.tasks || []);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.module_id || !form.title || !form.description || !form.correct_answer) {
      toast.error('Заполните все обязательные поля');
      return;
    }

    if (form.task_type === 'choice' && form.options.filter(o => o.trim()).length < 2) {
      toast.error('Добавьте минимум 2 варианта ответа');
      return;
    }

    try {
      const response = await fetch('/api/tasks/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          teacher_id: currentTeacher.id,
          options: form.task_type === 'choice' ? form.options.filter(o => o.trim()) : null
        })
      });

      if (response.ok) {
        toast.success('Задание создано!');
        setShowForm(false);
        setForm({
          module_id: '',
          title: '',
          description: '',
          task_type: 'choice',
          correct_answer: '',
          options: ['', '', '', ''],
          points: 10
        });
        loadTasks();
      }
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Ошибка при создании задания');
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...form.options];
    newOptions[index] = value;
    setForm({ ...form, options: newOptions });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
      <header className="bg-white/80 backdrop-blur-sm border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <Icon name="GraduationCap" size={24} className="text-foreground" />
              </div>
              <div>
                <h1 className="text-2xl text-foreground">Панель учителя</h1>
                <p className="text-sm text-muted-foreground">{currentTeacher.name}</p>
              </div>
            </div>
            <Button onClick={() => setShowForm(true)}>
              <Icon name="Plus" size={20} className="mr-2" />
              Создать задание
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section>
          <h2 className="text-2xl mb-4 text-foreground flex items-center gap-2">
            <Icon name="List" size={28} />
            Мои задания ({tasks.length})
          </h2>

          {tasks.length === 0 ? (
            <Card className="p-8 text-center">
              <Icon name="FileText" size={48} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg text-muted-foreground">У вас пока нет заданий</p>
              <p className="text-sm text-muted-foreground mt-2">Создайте первое задание для учеников!</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tasks.map((task) => (
                <Card key={task.id} className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="secondary">{task.module_title}</Badge>
                    <Badge variant="outline">+{task.points}</Badge>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{task.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{task.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Icon name="Users" size={16} />
                      {task.completed_count || 0} выполнили
                    </span>
                    <span className="text-muted-foreground">
                      {task.task_type === 'choice' ? 'Тест' : 'Свой ответ'}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto" onClick={() => setShowForm(false)}>
          <Card className="max-w-2xl w-full p-8 my-8 animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl text-foreground mb-6">Создать новое задание</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="module">Предмет *</Label>
                <Select value={form.module_id} onValueChange={(value) => setForm({ ...form, module_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите предмет" />
                  </SelectTrigger>
                  <SelectContent>
                    {modules.map((module) => (
                      <SelectItem key={module.id} value={String(module.id)}>
                        <div className="flex items-center gap-2">
                          <Icon name={module.icon as any} size={16} />
                          {module.title}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="title">Название задания *</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Например: Решение примеров на сложение"
                />
              </div>

              <div>
                <Label htmlFor="description">Описание задания *</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Опишите, что нужно сделать..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="task_type">Тип задания</Label>
                <Select value={form.task_type} onValueChange={(value: any) => setForm({ ...form, task_type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="choice">Выбор из вариантов</SelectItem>
                    <SelectItem value="text">Текстовый ответ</SelectItem>
                    <SelectItem value="number">Числовой ответ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {form.task_type === 'choice' && (
                <div>
                  <Label>Варианты ответов</Label>
                  <div className="space-y-2 mt-2">
                    {form.options.map((option, index) => (
                      <Input
                        key={index}
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        placeholder={`Вариант ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="correct_answer">Правильный ответ *</Label>
                <Input
                  id="correct_answer"
                  type={form.task_type === 'number' ? 'number' : 'text'}
                  value={form.correct_answer}
                  onChange={(e) => setForm({ ...form, correct_answer: e.target.value })}
                  placeholder={form.task_type === 'choice' ? 'Введите точный текст правильного варианта' : 'Введите правильный ответ'}
                />
              </div>

              <div>
                <Label htmlFor="points">Баллы за задание</Label>
                <Input
                  id="points"
                  type="number"
                  value={form.points}
                  onChange={(e) => setForm({ ...form, points: Number(e.target.value) })}
                  min="1"
                  max="100"
                />
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowForm(false)}>
                  Отмена
                </Button>
                <Button type="submit" className="flex-1">
                  Создать задание
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TeacherPanel;
