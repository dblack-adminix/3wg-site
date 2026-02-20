import { Activity, CheckCircle, Server, Database, Globe } from 'lucide-react';
import { useBlockContent } from '@/hooks/useBlockContent';
import { highlightUppercase } from '@/lib/textHighlight';

const systems = [
  { name: 'Серверы', status: 'operational', icon: Server },
  { name: 'База данных', status: 'operational', icon: Database },
  { name: 'Сеть', status: 'operational', icon: Globe },
  { name: 'API', status: 'operational', icon: Activity },
];

export const StatusWidget = () => {
  const { content } = useBlockContent('status_widget', {
    widget_title: 'Статус систем',
    status_text: 'РАБОТАЕТ ШТАТНО',
    uptime_label: 'Uptime за 30 дней',
    uptime_value: '99.98%',
  });

  return (
    <section className="py-16 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Main Status Card */}
          <div className="relative p-8 rounded-2xl border border-primary/30 bg-card/80 backdrop-blur-sm overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />
            
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-4 h-4 rounded-full bg-primary pulse-indicator" />
                    <div className="absolute inset-0 w-4 h-4 rounded-full bg-primary animate-ping opacity-50" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold font-['Montserrat'] text-foreground">
                      {content.widget_title}
                    </h3>
                    <p className="text-primary font-semibold text-lg">
                      {highlightUppercase(content.status_text)}
                    </p>
                  </div>
                </div>
                <CheckCircle className="h-12 w-12 text-primary" />
              </div>

              {/* Systems Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {systems.map((system, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border"
                  >
                    <system.icon className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{system.name}</p>
                      <p className="text-xs text-primary">Онлайн</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Uptime Bar */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{content.uptime_label}</span>
                  <span className="text-sm font-bold text-primary">{content.uptime_value}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
                    style={{ width: content.uptime_value }}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-muted-foreground">30 дней назад</span>
                  <span className="text-xs text-muted-foreground">Сегодня</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
