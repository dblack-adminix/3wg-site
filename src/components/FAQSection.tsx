import { ChevronDown, Shield, Zap, Globe, Smartphone, Lock, Server } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqItems = [
  {
    icon: Shield,
    question: 'Чем AmneziaWG отличается от обычного VPN?',
    answer: `Обычные VPN используют стандартные протоколы, которые легко распознаются системами Deep Packet Inspection (DPI). 
    
AmneziaWG — это модифицированный WireGuard, который маскирует VPN-трафик под обычный HTTPS. Для систем фильтрации ваш трафик выглядит как обычный веб-сёрфинг.

**Технические детали:**
\`\`\`
protocol: AmneziaWG
obfuscation: enabled
dpi_bypass: true
packet_signature: randomized
\`\`\``,
    color: 'primary',
  },
  {
    icon: Zap,
    question: 'Какая скорость у WireGuard сервера?',
    answer: `WireGuard — самый быстрый VPN-протокол на сегодняшний день. Наши серверы обеспечивают:

• **Скорость:** до 1 Гбит/с (зависит от вашего провайдера)
• **Пинг:** от 5ms до Европы, от 80ms до США
• **Шифрование:** ChaCha20-Poly1305 (не замедляет соединение)

Идеально для 4K стриминга, онлайн-игр и видеозвонков без лагов.`,
    color: 'wireguard',
  },
  {
    icon: Globe,
    question: 'Работает ли в Китае, Иране, Туркменистане?',
    answer: `Да, но с нюансами. Для стран с агрессивной цензурой мы рекомендуем:

1. **AmneziaWG** — основной протокол с обфускацией
2. **ShadowSocks** — резервный вариант через CDN
3. **Cloak** — для экстремальных случаев

Мы не гарантируем 100% работу в любой момент времени, так как блокировки постоянно обновляются. Но наши инженеры оперативно адаптируют конфигурации.`,
    color: 'accent',
  },
  {
    icon: Smartphone,
    question: 'Как настроить VPN на телефоне/компьютере?',
    answer: `Мы предоставляем готовые конфигурационные файлы:

**Для WireGuard:**
1. Скачайте приложение WireGuard (iOS/Android/Windows/macOS)
2. Импортируйте .conf файл из личного кабинета или Telegram-бота
3. Нажмите "Подключить"

**Для Amnezia:**
1. Скачайте AmneziaVPN с официального сайта
2. Отсканируйте QR-код из бота
3. Готово!

Весь процесс занимает около 2 минут.`,
    color: 'primary',
  },
  {
    icon: Lock,
    question: 'Вы храните логи подключений?',
    answer: `**Нет.** Это не маркетинг — это архитектура.

Наши серверы настроены так, что технически не могут записывать:
• IP-адреса пользователей
• Временные метки подключений
• Объём переданных данных
• Посещённые сайты

Мы используем RAM-only режим — при перезагрузке сервера все данные стираются. Юридически мы находимся в юрисдикции, где нет требований о хранении данных.`,
    color: 'accent',
  },
  {
    icon: Server,
    question: 'Что значит "личный сервер"?',
    answer: `В отличие от массовых VPN-сервисов (NordVPN, ExpressVPN), где тысячи пользователей делят один IP-адрес, в 3LAB вы получаете:

• **Выделенный IP** — не в спам-листах, не забанен
• **Изолированные ресурсы** — никто не влияет на вашу скорость
• **Полный контроль** — root-доступ по запросу
• **Приватность** — только вы знаете, что делаете через этот IP

Это как разница между коммуналкой и личной квартирой.`,
    color: 'wireguard',
  },
];

export const FAQSection = () => {
  return (
    <section id="faq" className="py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 cyber-grid opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium mb-6">
              <span className="font-mono-tech text-xs">FAQ_DATABASE</span>
            </span>
            
            <h2 className="text-3xl md:text-5xl font-bold font-['Montserrat'] mb-4">
              Частые <span className="text-gradient-primary">вопросы</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Техническая документация для любопытных
            </p>
          </div>

          {/* Accordion */}
          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border-0"
              >
                <div className="relative group">
                  {/* Glow Border */}
                  <div 
                    className={`absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 ${
                      item.color === 'primary' 
                        ? 'bg-gradient-to-r from-primary/40 to-primary/20' 
                        : item.color === 'wireguard'
                        ? 'bg-gradient-to-r from-[#B10000]/40 to-primary/20'
                        : 'bg-gradient-to-r from-accent/40 to-purple-500/20'
                    }`}
                  />
                  
                  <div className="relative rounded-2xl bg-card/80 backdrop-blur-sm border border-white/10 overflow-hidden">
                    <AccordionTrigger className="px-6 py-5 hover:no-underline group/trigger">
                      <div className="flex items-center gap-4 text-left">
                        <div 
                          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            item.color === 'primary' 
                              ? 'bg-primary/20' 
                              : item.color === 'wireguard'
                              ? 'bg-[#B10000]/20'
                              : 'bg-accent/20'
                          }`}
                        >
                          <item.icon 
                            className={`h-5 w-5 ${
                              item.color === 'primary' 
                                ? 'text-primary' 
                                : item.color === 'wireguard'
                                ? 'text-[#FF3333]'
                                : 'text-accent'
                            }`}
                          />
                        </div>
                        <span className="font-semibold text-foreground group-hover/trigger:text-primary transition-colors">
                          {item.question}
                        </span>
                      </div>
                    </AccordionTrigger>
                    
                    <AccordionContent className="px-6 pb-6">
                      <div className="pl-14 prose prose-invert prose-sm max-w-none">
                        <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                          {item.answer}
                        </div>
                      </div>
                    </AccordionContent>
                  </div>
                </div>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Bottom CTA */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4 font-mono-tech text-sm">
              Не нашли ответ? // support@3lab.pro
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
