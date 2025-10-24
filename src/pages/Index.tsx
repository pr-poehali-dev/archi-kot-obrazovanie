import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

const Index = () => {
  const navigate = useNavigate();
  const [currentUser] = useState({ 
    id: 1, 
    name: 'Маша', 
    role: 'student',
    points: 250,
    level: 3
  });

  const modules = [
    { id: 1, title: 'Математика', icon: 'Calculator', color: 'bg-primary', description: 'Изучай числа, примеры и задачки', progress: 60 },
    { id: 2, title: 'Русский язык', icon: 'BookOpen', color: 'bg-secondary', description: 'Учи правила и развивай грамотность', progress: 40 },
    { id: 3, title: 'Окружающий мир', icon: 'Globe', color: 'bg-accent', description: 'Познавай природу и науку', progress: 30 },
    { id: 4, title: 'Логика', icon: 'Puzzle', color: 'bg-[hsl(var(--lavender))]', description: 'Развивай мышление и смекалку', progress: 20 },
    { id: 5, title: 'Творчество', icon: 'Palette', color: 'bg-primary', description: 'Рисуй, пиши и создавай', progress: 50 },
    { id: 6, title: 'История', icon: 'Scroll', color: 'bg-secondary', description: 'Узнавай о прошлом человечества', progress: 10 }
  ];

  const achievements = [
    { id: 1, title: 'Первый урок', icon: 'Star', earned: true },
    { id: 2, title: 'Математик', icon: 'Award', earned: true },
    { id: 3, title: 'Читатель', icon: 'BookMarked', earned: false },
    { id: 4, title: 'Исследователь', icon: 'Trophy', earned: false }
  ];

  const nextLevelPoints = 300;
  const levelProgress = (currentUser.points / nextLevelPoints) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
      <header className="bg-white/80 backdrop-blur-sm border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-3xl">
                🐱
              </div>
              <div>
                <h1 className="text-2xl text-foreground">Котик Арчи</h1>
                <p className="text-sm text-muted-foreground">Учись с удовольствием!</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="px-4 py-2 text-base">
                <Icon name="Star" size={16} className="mr-1" />
                {currentUser.points}
              </Badge>
              <Badge className="px-4 py-2 text-base bg-accent text-accent-foreground">
                Уровень {currentUser.level}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="mb-8">
          <Card className="p-6 bg-gradient-to-r from-primary/20 to-secondary/20">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-5xl">🎉</div>
              <div className="flex-1">
                <h2 className="text-2xl mb-2 text-foreground">Привет, {currentUser.name}!</h2>
                <p className="text-muted-foreground">У тебя {currentUser.points} очков. До {currentUser.level + 1} уровня осталось {nextLevelPoints - currentUser.points} очков!</p>
              </div>
            </div>
            <Progress value={levelProgress} className="h-3" />
          </Card>
        </section>

        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl text-foreground flex items-center gap-2">
              <Icon name="BookOpen" size={28} />
              Предметы
            </h2>
            {currentUser.role === 'teacher' && (
              <Button onClick={() => navigate('/teacher')}>
                <Icon name="Settings" size={20} className="mr-2" />
                Панель учителя
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <Card
                key={module.id}
                className="p-6 cursor-pointer transition-all hover:shadow-xl hover:-translate-y-2"
                onClick={() => navigate(`/module/${module.id}`)}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-16 h-16 rounded-2xl ${module.color} flex items-center justify-center`}>
                    <Icon name={module.icon as any} size={32} className="text-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-1">{module.title}</h3>
                    <p className="text-sm text-muted-foreground">{module.description}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Прогресс</span>
                    <span className="font-semibold text-foreground">{module.progress}%</span>
                  </div>
                  <Progress value={module.progress} className="h-2" />
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl mb-4 text-foreground flex items-center gap-2">
            <Icon name="Trophy" size={28} />
            Достижения
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((achievement) => (
              <Card
                key={achievement.id}
                className={`p-6 text-center transition-all ${
                  achievement.earned
                    ? 'bg-gradient-to-br from-primary/20 to-accent/20 shadow-md'
                    : 'opacity-50 grayscale'
                }`}
              >
                <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${
                  achievement.earned ? 'bg-primary' : 'bg-muted'
                }`}>
                  <Icon name={achievement.icon as any} size={32} className={achievement.earned ? 'text-primary-foreground' : 'text-muted-foreground'} />
                </div>
                <h3 className="font-semibold text-foreground">{achievement.title}</h3>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-white/80 backdrop-blur-sm border-t border-border mt-16 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="text-4xl mb-3">🐱</div>
          <p className="text-muted-foreground">Котик Арчи всегда рядом! Учись с радостью! 🎓</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
