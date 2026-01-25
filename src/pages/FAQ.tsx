import { ChevronDown, Shield, Zap, Globe, Smartphone, Lock, Server, CreditCard, Router, Settings } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Layout } from '@/components/Layout';
import { AnimatedSection } from '@/components/AnimatedSection';

const categories = [
  {
    id: 'security',
    title: 'Безопасность',
    icon: Shield,
    color: 'primary',
    items: [
      {
        icon: Shield,
        question: 'Чем AmneziaWG отличается от обычного VPN?',
        answer: `Обычные VPN используют стандартные протоколы, которые легко распознаются системами Deep Packet Inspection (DPI). 
        
AmneziaWG — это модифицированный WireGuard, который маскирует VPN-трафик под обычный HTTPS. Для систем фильтрации ваш трафик выглядит как обычный веб-сёрфинг.`,
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

Мы используем RAM-only режим — при перезагрузке сервера все данные стираются.`,
      },
    ],
  },
  {
    id: 'protocols',
    title: 'Протоколы',
    icon: Zap,
    color: 'wireguard',
    items: [
      {
        icon: Zap,
        question: 'Какая скорость у WireGuard сервера?',
        answer: `WireGuard — самый быстрый VPN-протокол на сегодняшний день. Наши серверы обеспечивают:

• **Скорость:** до 1 Гбит/с (зависит от вашего провайдера)
• **Пинг:** от 5ms до Европы, от 80ms до США
• **Шифрование:** ChaCha20-Poly1305 (не замедляет соединение)

Идеально для 4K стриминга, онлайн-игр и видеозвонков без лагов.`,
      },
      {
        icon: Globe,
        question: 'Работает ли в Китае, Иране, Туркменистане?',
        answer: `Да, но с нюансами. Для стран с агрессивной цензурой мы рекомендуем:

1. **AmneziaWG** — основной протокол с обфускацией
2. **ShadowSocks** — резервный вариант через CDN
3. **Cloak** — для экстремальных случаев

Мы не гарантируем 100% работу в любой момент времени, но наши инженеры оперативно адаптируют конфигурации.`,
      },
    ],
  },
  {
    id: 'billing',
    title: 'Оплата',
    icon: CreditCard,
    color: 'accent',
    items: [
      {
        icon: CreditCard,
        question: 'Какие способы оплаты вы принимаете?',
        answer: `Мы принимаем:

• **Банковские карты** — Visa, MasterCard, МИР
• **Криптовалюты** — BTC, ETH, USDT
• **СБП** — оплата по QR-коду
• **Telegram Stars** — для микроплатежей

Все платежи защищены и анонимны (при оплате крипто).`,
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
      },
    ],
  },
  {
    id: 'hardware',
    title: 'Hardware',
    icon: Router,
    color: 'primary',
    items: [
      {
        icon: Router,
        question: 'Зачем нужен аппаратный роутер?',
        answer: `Аппаратный роутер 3LAB NODE-1 решает несколько проблем:

• **Smart TV и консоли** — не поддерживают VPN-приложения
• **Вся сеть защищена** — не нужно настраивать каждое устройство
• **Kill Switch** — при обрыве VPN интернет блокируется
• **Производительность** — аппаратное шифрование не нагружает процессор

Plug & Play — достали из коробки, подключили, работает.`,
      },
      {
        icon: Settings,
        question: 'Как управлять роутером?',
        answer: `Управление через наш Telegram Mini App:

• **Мониторинг** — скорость, подключенные устройства, статус
• **Перезагрузка** — удалённая перезагрузка одной кнопкой
• **Смена локации** — переключение между серверами
• **Уведомления** — алерты о проблемах и обновлениях

Никакой командной строки — всё через удобный интерфейс.`,
      },
    ],
  },
  {
    id: 'setup',
    title: 'Настройка',
    icon: Smartphone,
    color: 'accent',
    items: [
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
      },
    ],
  },
];

const FAQ = () => {
  return (
    <Layout>
      <section className="pt-32 pb-24 relative">
        <div className="absolute inset-0 cyber-grid opacity-20" />
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <AnimatedSection>
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium mb-6">
                <span className="font-mono-tech text-xs">FAQ_DATABASE</span>
              </span>
              
              <h1 className="text-4xl md:text-6xl font-bold font-['Montserrat'] mb-4">
                Частые <span className="text-gradient-primary">вопросы</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Техническая документация для любопытных
              </p>
            </div>
          </AnimatedSection>

          {/* Category Navigation */}
          <AnimatedSection delay={0.1}>
            <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
              {categories.map((cat) => (
                <a
                  key={cat.id}
                  href={`#${cat.id}`}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 hover:scale-105 ${
                    cat.color === 'primary'
                      ? 'border-primary/30 bg-primary/5 text-primary hover:bg-primary/10'
                      : cat.color === 'wireguard'
                      ? 'border-[#B10000]/30 bg-[#B10000]/5 text-[#FF3333] hover:bg-[#B10000]/10'
                      : 'border-accent/30 bg-accent/5 text-accent hover:bg-accent/10'
                  }`}
                >
                  <cat.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{cat.title}</span>
                </a>
              ))}
            </div>
          </AnimatedSection>

          {/* FAQ Categories */}
          <div className="max-w-4xl mx-auto space-y-12">
            {categories.map((category, catIndex) => (
              <AnimatedSection key={category.id} delay={0.1 * (catIndex + 1)}>
                <div id={category.id}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      category.color === 'primary'
                        ? 'bg-primary/20'
                        : category.color === 'wireguard'
                        ? 'bg-[#B10000]/20'
                        : 'bg-accent/20'
                    }`}>
                      <category.icon className={`h-5 w-5 ${
                        category.color === 'primary'
                          ? 'text-primary'
                          : category.color === 'wireguard'
                          ? 'text-[#FF3333]'
                          : 'text-accent'
                      }`} />
                    </div>
                    <h2 className="text-2xl font-bold font-['Montserrat']">{category.title}</h2>
                  </div>
                  
                  <Accordion type="single" collapsible className="space-y-4">
                    {category.items.map((item, index) => (
                      <AccordionItem 
                        key={index} 
                        value={`${category.id}-${index}`}
                        className="border-0"
                      >
                        <div className="relative group">
                          <div 
                            className={`absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 ${
                              category.color === 'primary' 
                                ? 'bg-gradient-to-r from-primary/40 to-primary/20' 
                                : category.color === 'wireguard'
                                ? 'bg-gradient-to-r from-[#B10000]/40 to-primary/20'
                                : 'bg-gradient-to-r from-accent/40 to-purple-500/20'
                            }`}
                          />
                          
                          <div className="relative rounded-2xl bg-card/80 backdrop-blur-sm border border-white/10 overflow-hidden">
                            <AccordionTrigger className="px-6 py-5 hover:no-underline group/trigger">
                              <div className="flex items-center gap-4 text-left">
                                <div 
                                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                    category.color === 'primary' 
                                      ? 'bg-primary/20' 
                                      : category.color === 'wireguard'
                                      ? 'bg-[#B10000]/20'
                                      : 'bg-accent/20'
                                  }`}
                                >
                                  <item.icon 
                                    className={`h-5 w-5 ${
                                      category.color === 'primary' 
                                        ? 'text-primary' 
                                        : category.color === 'wireguard'
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
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Bottom CTA */}
          <AnimatedSection delay={0.3}>
            <div className="mt-16 text-center">
              <p className="text-muted-foreground mb-4 font-mono-tech text-sm">
                Не нашли ответ? // <a href="mailto:support@3lab.pro" className="text-primary hover:underline">support@3lab.pro</a>
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
};

export default FAQ;
