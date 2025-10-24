import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Module {
  id: string;
  title: string;
  icon: string;
  color: string;
  progress: number;
  locked: boolean;
}

const Index = () => {
  const [userPoints, setUserPoints] = useState(125);
  const [userLevel, setUserLevel] = useState(3);

  const modules: Module[] = [
    { id: '1', title: 'Математика', icon: 'Calculator', color: 'bg-primary', progress: 65, locked: false },
    { id: '2', title: 'Русский язык', icon: 'BookOpen', color: 'bg-secondary', progress: 45, locked: false },
    { id: '3', title: 'Окружающий мир', icon: 'Globe', color: 'bg-accent', progress: 30, locked: false },
    { id: '4', title: 'Логика', icon: 'Puzzle', color: 'bg-[hsl(var(--lavender))]', progress: 20, locked: false },
    { id: '5', title: 'Творчество', icon: 'Palette', color: 'bg-primary', progress: 0, locked: false },
    { id: '6', title: 'История', icon: 'Scroll', color: 'bg-secondary', progress: 0, locked: true }
  ];

  const achievements = [
    { id: '1', title: 'Первый урок', icon: 'Star', earned: true },
    { id: '2', title: 'Математик', icon: 'Award', earned: true },
    { id: '3', title: 'Читатель', icon: 'BookMarked', earned: true },
    { id: '4', title: 'Исследователь', icon: 'Trophy', earned: false }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
      <header className="bg-white/80 backdrop-blur-sm border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="https://cdn.poehali.dev/projects/b25b5c2e-c7a9-4a02-b94c-82bfaa54eed5/files/fa6a6bbf-f4e4-4826-9a64-dd73b365059f.jpg" 
              alt="Котик Арчи" 
              className="w-16 h-16 rounded-full animate-bounce-gentle"
            />
            <div>
              <h1 className="text-2xl md:text-3xl text-foreground">Приключения с Арчи</h1>
              <p className="text-sm text-muted-foreground">Учись с удовольствием!</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="px-4 py-2 text-base">
              <Icon name="Sparkles" size={16} className="mr-1" />
              {userPoints} очков
            </Badge>
            <Badge className="px-4 py-2 text-base bg-accent text-accent-foreground">
              Уровень {userLevel}
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="mb-12 animate-fade-in">
          <Card className="p-8 bg-gradient-to-r from-primary/20 to-secondary/20 border-none shadow-lg">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <img 
                src="https://cdn.poehali.dev/projects/b25b5c2e-c7a9-4a02-b94c-82bfaa54eed5/files/fa6a6bbf-f4e4-4826-9a64-dd73b365059f.jpg" 
                alt="Арчи приветствует" 
                className="w-32 h-32 rounded-full animate-float shadow-xl"
              />
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl mb-3 text-foreground">Привет! Я Арчи! 🐱</h2>
                <p className="text-lg text-foreground/80 mb-4">
                  Сегодня у нас много интересных заданий! Давай учиться вместе и зарабатывать награды!
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-foreground/70">
                    <span>Прогресс до следующего уровня</span>
                    <span className="font-semibold">75%</span>
                  </div>
                  <Progress value={75} className="h-3" />
                </div>
              </div>
            </div>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl mb-6 text-foreground flex items-center gap-2">
            <Icon name="BookOpen" size={32} />
            Образовательные модули
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module, index) => (
              <Card 
                key={module.id} 
                className={`p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer relative overflow-hidden animate-scale-in ${
                  module.locked ? 'opacity-60 cursor-not-allowed' : ''
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {module.locked && (
                  <div className="absolute top-4 right-4">
                    <Icon name="Lock" size={24} className="text-muted-foreground" />
                  </div>
                )}
                <div className={`w-16 h-16 rounded-2xl ${module.color} flex items-center justify-center mb-4 shadow-md`}>
                  <Icon name={module.icon as any} size={32} className="text-foreground" />
                </div>
                <h3 className="text-xl mb-3 text-foreground">{module.title}</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Прогресс</span>
                    <span className="font-semibold">{module.progress}%</span>
                  </div>
                  <Progress value={module.progress} className="h-2" />
                </div>
                <Button 
                  className="w-full mt-4" 
                  disabled={module.locked}
                  variant={module.locked ? 'secondary' : 'default'}
                >
                  {module.locked ? 'Скоро откроется' : 'Продолжить'}
                </Button>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl mb-6 text-foreground flex items-center gap-2">
            <Icon name="Trophy" size={32} />
            Мои достижения
          </h2>
          <Card className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.id}
                  className={`flex flex-col items-center p-4 rounded-xl transition-all ${
                    achievement.earned 
                      ? 'bg-gradient-to-br from-primary/20 to-secondary/20 shadow-md' 
                      : 'bg-muted/50 opacity-50'
                  }`}
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${
                    achievement.earned ? 'bg-accent' : 'bg-muted'
                  }`}>
                    <Icon 
                      name={achievement.icon as any} 
                      size={32} 
                      className={achievement.earned ? 'text-accent-foreground' : 'text-muted-foreground'}
                    />
                  </div>
                  <p className="text-sm text-center font-medium text-foreground">{achievement.title}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section>
          <Card className="p-8 bg-gradient-to-r from-secondary/20 to-accent/20 border-none">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <h2 className="text-3xl mb-3 text-foreground">Ежедневные задания от Арчи</h2>
                <p className="text-foreground/80 mb-4">
                  Выполни 3 задания сегодня и получи бонус +50 очков!
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Icon name="Check" size={16} className="text-primary-foreground" />
                    </div>
                    <span className="text-foreground line-through opacity-70">Реши 5 примеров по математике</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Icon name="Check" size={16} className="text-primary-foreground" />
                    </div>
                    <span className="text-foreground line-through opacity-70">Прочитай рассказ</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg border-2 border-primary">
                    <div className="w-6 h-6 rounded-full border-2 border-primary"></div>
                    <span className="text-foreground font-medium">Пройди урок по окружающему миру</span>
                  </div>
                </div>
              </div>
              <img 
                src="https://cdn.poehali.dev/projects/b25b5c2e-c7a9-4a02-b94c-82bfaa54eed5/files/fa6a6bbf-f4e4-4826-9a64-dd73b365059f.jpg" 
                alt="Арчи мотивирует" 
                className="w-48 h-48 rounded-full animate-float shadow-2xl"
              />
            </div>
          </Card>
        </section>
      </main>

      <footer className="bg-white/80 backdrop-blur-sm border-t border-border mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            Сделано с любовью 
            <Icon name="Heart" size={16} className="text-primary" />
            для юных исследователей
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
