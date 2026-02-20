import { ChevronDown, Shield, Zap, Globe, Smartphone, Lock, Server } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useBlockContent } from '@/hooks/useBlockContent';
import { highlightUppercase } from '@/lib/textHighlight';

export const FAQSection = () => {
  const { content } = useBlockContent('faq_section', {
    section_title: 'Частые вопросы',
    section_subtitle: 'Техническая документация для любопытных',
    support_text: 'Не нашли ответ? // support@3lab.pro',
    faq_1_question: 'Чем AmneziaWG отличается от обычного VPN?',
    faq_1_answer: 'Обычные VPN используют стандартные протоколы, которые легко распознаются системами Deep Packet Inspection (DPI).\n\nAmneziaWG — это модифицированный WireGuard, который маскирует VPN-трафик под обычный HTTPS.',
    faq_2_question: 'Какая скорость у WireGuard сервера?',
    faq_2_answer: 'WireGuard — самый быстрый VPN-протокол на сегодняшний день.',
    faq_3_question: 'Работает ли в Китае, Иране, Туркменистане?',
    faq_3_answer: 'Да, но с нюансами. Для стран с агрессивной цензурой мы рекомендуем AmneziaWG.',
    faq_4_question: 'Как настроить VPN на телефоне/компьютере?',
    faq_4_answer: 'Мы предоставляем готовые конфигурационные файлы.',
    faq_5_question: 'Вы храните логи подключений?',
    faq_5_answer: 'Нет. Наши серверы не записывают логи.',
    faq_6_question: 'Что значит "личный сервер"?',
    faq_6_answer: 'Вы получаете выделенный IP и изолированные ресурсы.',
  });

  const faqItems = [
    {
      icon: Shield,
      question: content.faq_1_question,
      answer: content.faq_1_answer,
      color: 'primary',
    },
    {
      icon: Zap,
      question: content.faq_2_question,
      answer: content.faq_2_answer,
      color: 'wireguard',
    },
    {
      icon: Globe,
      question: content.faq_3_question,
      answer: content.faq_3_answer,
      color: 'accent',
    },
    {
      icon: Smartphone,
      question: content.faq_4_question,
      answer: content.faq_4_answer,
      color: 'primary',
    },
    {
      icon: Lock,
      question: content.faq_5_question,
      answer: content.faq_5_answer,
      color: 'accent',
    },
    {
      icon: Server,
      question: content.faq_6_question,
      answer: content.faq_6_answer,
      color: 'wireguard',
    },
  ];

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
              {highlightUppercase(content.section_title)}
            </h2>
            <p className="text-muted-foreground text-lg">
              {content.section_subtitle}
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
                          {highlightUppercase(item.answer)}
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
              {content.support_text}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
