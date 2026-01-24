import { Bot, Activity, Download, Headphones, Terminal, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const botFeatures = [
  {
    icon: Activity,
    command: '/status',
    title: 'Статус моих VPN',
    description: 'Бот проверяет статус сервера (Online/Offline) и выводит текущую нагрузку.',
  },
  {
    icon: Download,
    command: '/config',
    title: 'Получить конфиг',
    description: 'Бот выдает файл .conf для WireGuard или ссылку для Amnezia прямо в мессенджер.',
  },
  {
    icon: Headphones,
    command: '/support',
    title: 'Поддержка',
    description: 'Прямой чат с инженером 3LAB. Ответ в течение 15 минут.',
  },
];

export const TelegramSection = () => {
  return (
    <section id="cabinet" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      <div className="absolute inset-0 cyber-grid opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium mb-6">
              <Bot className="h-4 w-4" />
              Личный кабинет
            </span>
            
            <h2 className="text-3xl md:text-5xl font-bold font-['Montserrat'] mb-6">
              Telegram-бот <span className="text-gradient-primary">3LAB</span>
            </h2>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Управляйте VPN-серверами прямо из Telegram. 
              Мониторинг, конфиги, поддержка — всё в одном месте.
            </p>
          </div>

          {/* Bot Preview Card */}
          <div className="relative p-8 rounded-2xl border border-primary/30 bg-card/80 backdrop-blur-sm overflow-hidden mb-8">
            {/* Glow Effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
            
            <div className="relative z-10">
              {/* Bot Header */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 border border-border mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-foreground">3LAB_Bot</h4>
                  <p className="text-sm text-muted-foreground">Система мониторинга</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary pulse-indicator" />
                  <span className="text-sm text-primary">Online</span>
                </div>
              </div>

              {/* Welcome Message */}
              <div className="p-4 rounded-xl bg-muted/30 border border-border mb-6">
                <div className="flex items-start gap-3">
                  <Terminal className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="text-foreground font-mono text-sm mb-2">
                      <span className="text-primary">/start</span>
                    </p>
                    <p className="text-muted-foreground">
                      Добро пожаловать в систему мониторинга <span className="text-primary font-bold">3LAB</span>. 
                      <br />Выберите действие:
                    </p>
                  </div>
                </div>
              </div>

              {/* Bot Commands */}
              <div className="grid md:grid-cols-3 gap-4">
                {botFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="group p-4 rounded-xl border border-border bg-card/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <feature.icon className="h-5 w-5 text-primary" />
                      </div>
                      <code className="text-sm font-mono text-primary">{feature.command}</code>
                    </div>
                    <h4 className="font-semibold text-foreground mb-1">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-lg px-8 glow-primary group"
            >
              <Bot className="mr-2 h-5 w-5" />
              Подключить Telegram-бота
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              После заказа VPN вы получите ссылку на бота автоматически
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
