import { ArrowRight, Shield, AlertTriangle, Lightbulb, Server, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const articles = [
  {
    icon: AlertTriangle,
    category: 'Безопасность',
    title: 'Почему обычные VPN больше не работают?',
    excerpt: 'РКН использует DPI (Deep Packet Inspection) для анализа структуры трафика. Узнайте, как AmneziaWG меняет «почерк» пакетов.',
    points: [
      { icon: Shield, text: 'DPI распознает VPN-трафик по характерным сигнатурам' },
      { icon: Lightbulb, text: 'AmneziaWG маскирует пакеты под обычный HTTPS' },
      { icon: Server, text: 'Личный сервер = никаких соседей и чистый IP' },
    ],
    accent: 'primary',
  },
  {
    icon: Users,
    category: 'Бизнес',
    title: 'ИТ-аутсорсинг нового поколения',
    excerpt: 'Пока ваш VPN работает, мы следим за вашим бизнесом. Настройка сетей, защита от атак, удаленная поддержка.',
    points: [
      { icon: Shield, text: 'Защита от DDoS и кибератак' },
      { icon: Server, text: 'Настройка и мониторинг инфраструктуры' },
      { icon: Clock, text: 'Поддержка 24/7 без выходных и отпусков' },
    ],
    accent: 'accent',
    slogan: '«Мы — ваш ИТ-отдел на аутсорсе, который никогда не уходит в отпуск»',
  },
];

export const ArticlesSection = () => {
  return (
    <section id="articles" className="py-24 relative">
      <div className="absolute inset-0 cyber-grid opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium mb-4">
            Блог
          </span>
          <h2 className="text-3xl md:text-5xl font-bold font-['Montserrat'] mb-4">
            Экспертные <span className="text-gradient-primary">материалы</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Разбираем технологии и решения для вашей цифровой свободы
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {articles.map((article, index) => (
            <article
              key={index}
              className={`group relative p-8 rounded-2xl border transition-all duration-500 overflow-hidden hover:scale-[1.02] ${
                article.accent === 'primary'
                  ? 'border-primary/30 bg-card hover:border-primary/50'
                  : 'border-accent/30 bg-card hover:border-accent/50'
              }`}
            >
              {/* Background Glow */}
              <div className={`absolute top-0 right-0 w-48 h-48 rounded-full blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity ${
                article.accent === 'primary' ? 'bg-primary' : 'bg-accent'
              }`} />
              
              <div className="relative z-10">
                {/* Category */}
                <div className="flex items-center gap-2 mb-4">
                  <div className={`p-2 rounded-lg ${
                    article.accent === 'primary' ? 'bg-primary/10' : 'bg-accent/10'
                  }`}>
                    <article.icon className={`h-5 w-5 ${
                      article.accent === 'primary' ? 'text-primary' : 'text-accent'
                    }`} />
                  </div>
                  <span className={`text-sm font-medium ${
                    article.accent === 'primary' ? 'text-primary' : 'text-accent'
                  }`}>
                    {article.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold font-['Montserrat'] text-foreground mb-3 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>

                {/* Excerpt */}
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {article.excerpt}
                </p>

                {/* Key Points */}
                <ul className="space-y-3 mb-6">
                  {article.points.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <point.icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                        article.accent === 'primary' ? 'text-primary' : 'text-accent'
                      }`} />
                      <span className="text-sm text-muted-foreground">{point.text}</span>
                    </li>
                  ))}
                </ul>

                {/* Slogan */}
                {article.slogan && (
                  <blockquote className={`text-lg font-medium italic border-l-4 pl-4 mb-6 ${
                    article.accent === 'primary' ? 'border-primary text-primary' : 'border-accent text-accent'
                  }`}>
                    {article.slogan}
                  </blockquote>
                )}

                {/* Read More */}
                <Button 
                  variant="ghost" 
                  className={`p-0 h-auto font-semibold group/btn ${
                    article.accent === 'primary' ? 'text-primary hover:text-primary' : 'text-accent hover:text-accent'
                  }`}
                >
                  Читать полностью
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
