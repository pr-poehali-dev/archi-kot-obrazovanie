import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface Task {
  id: number;
  title: string;
  description: string;
  task_type: 'choice' | 'text' | 'number';
  options?: string[];
  points: number;
  is_completed?: boolean;
}

const ModuleDetail = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [answer, setAnswer] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const currentUser = { id: 1, role: 'student' };

  const modules = [
    { id: 1, title: 'Математика', icon: 'Calculator', color: 'bg-primary', description: 'Изучай числа, примеры и задачки' },
    { id: 2, title: 'Русский язык', icon: 'BookOpen', color: 'bg-secondary', description: 'Учи правила и развивай грамотность' },
    { id: 3, title: 'Окружающий мир', icon: 'Globe', color: 'bg-accent', description: 'Познавай природу и науку' },
    { id: 4, title: 'Логика', icon: 'Puzzle', color: 'bg-[hsl(var(--lavender))]', description: 'Развивай мышление и смекалку' },
    { id: 5, title: 'Творчество', icon: 'Palette', color: 'bg-primary', description: 'Рисуй, пиши и создавай' },
    { id: 6, title: 'История', icon: 'Scroll', color: 'bg-secondary', description: 'Узнавай о прошлом человечества' }
  ];

  const module = modules.find(m => m.id === Number(moduleId));

  useEffect(() => {
    loadTasks();
  }, [moduleId]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://functions.poehali.dev/5590c9b7-1315-42b7-9395-736bd8c4282b?module_id=${moduleId}&student_id=${currentUser.id}`);
      const data = await response.json();
      setTasks(data.tasks || []);
    } catch (error) {
      console.error('Error loading tasks:', error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskClick = (task: Task) => {
    if (task.is_completed) return;
    setSelectedTask(task);
    setAnswer('');
  };

  const handleSubmit = async () => {
    if (!answer.trim() || !selectedTask) return;

    try {
      const response = await fetch('https://functions.poehali.dev/5590c9b7-1315-42b7-9395-736bd8c4282b?action=submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_id: selectedTask.id,
          student_id: currentUser.id,
          answer: answer.trim()
        })
      });

      const result = await response.json();
      
      if (result.is_correct) {
        toast.success(`Правильно! +${result.points_earned} очков`, {
          description: 'Арчи гордится тобой! 🐱'
        });
      } else {
        toast.error('Неправильно, попробуй ещё раз!', {
          description: 'Не расстраивайся, у тебя получится!'
        });
      }

      setSelectedTask(null);
      setAnswer('');
      loadTasks();
    } catch (error) {
      console.error('Error submitting answer:', error);
      toast.error('Ошибка при отправке ответа');
    }
  };

  if (!module) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-muted-foreground">Модуль не найден</p>
      </div>
    );
  }

  const completedCount = tasks.filter(t => t.is_completed).length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
      <header className="bg-white/80 backdrop-blur-sm border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <Icon name="ArrowLeft" size={20} />
            </Button>
            <div className={`w-12 h-12 rounded-xl ${module.color} flex items-center justify-center`}>
              <Icon name={module.icon as any} size={24} className="text-foreground" />
            </div>
            <div>
              <h1 className="text-2xl text-foreground">{module.title}</h1>
              <p className="text-sm text-muted-foreground">{module.description}</p>
            </div>
          </div>
          <Badge variant="secondary" className="px-4 py-2">
            {completedCount} / {tasks.length} заданий
          </Badge>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl text-foreground">Твой прогресс</h2>
              <span className="text-muted-foreground font-semibold">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </Card>
        </section>

        <section>
          <h2 className="text-2xl mb-4 text-foreground">Задания</h2>
          {loading ? (
            <p className="text-center text-muted-foreground">Загрузка...</p>
          ) : tasks.length === 0 ? (
            <Card className="p-8 text-center">
              <Icon name="BookOpen" size={48} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg text-muted-foreground">Пока нет заданий</p>
              <p className="text-sm text-muted-foreground mt-2">Учитель скоро добавит новые задачки!</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tasks.map((task) => (
                <Card
                  key={task.id}
                  className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                    task.is_completed ? 'opacity-70 bg-secondary/20' : 'hover:-translate-y-1'
                  }`}
                  onClick={() => handleTaskClick(task)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-foreground flex-1">{task.title}</h3>
                    {task.is_completed ? (
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <Icon name="Check" size={20} className="text-primary-foreground" />
                      </div>
                    ) : (
                      <Badge variant="outline">+{task.points}</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon name="Clock" size={16} />
                    <span>{task.task_type === 'choice' ? 'Выбор ответа' : 'Свой ответ'}</span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>

      {selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedTask(null)}>
          <Card className="max-w-2xl w-full p-8 animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl text-foreground mb-2">{selectedTask.title}</h2>
                <p className="text-muted-foreground">{selectedTask.description}</p>
              </div>
              <Badge className="bg-accent text-accent-foreground">+{selectedTask.points} очков</Badge>
            </div>

            <div className="mb-6">
              {selectedTask.task_type === 'choice' && selectedTask.options ? (
                <RadioGroup value={answer} onValueChange={setAnswer}>
                  {selectedTask.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted">
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                <Input
                  type={selectedTask.task_type === 'number' ? 'number' : 'text'}
                  placeholder="Введи свой ответ..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="text-lg"
                />
              )}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setSelectedTask(null)}>
                Отмена
              </Button>
              <Button className="flex-1" onClick={handleSubmit} disabled={!answer.trim()}>
                Проверить ответ
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ModuleDetail;