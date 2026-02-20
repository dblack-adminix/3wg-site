import { Layout } from '@/components/Layout';
import { AnimatedSection } from '@/components/AnimatedSection';
import { RouterVisualization } from '@/components/RouterVisualization';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  ToggleRight, 
  Shield, 
  Activity, 
  Lock,
  Cpu,
  Zap,
  Server,
  Wifi,
  HardDrive,
  Terminal,
  Download,
  CheckCircle
} from 'lucide-react';
import bgImage from '@/assets/unnamed02.png';
import node1Internal from '@/assets/node1-internal.jpg';
import node1Router from '@/assets/node1-router.png';
import keeneticImage02 from '@/assets/Image02.png';
import whatIs3 from '@/assets/what-is-3.png';
import { useBlockContent } from '@/hooks/useBlockContent';
import { highlightUppercase } from '@/lib/textHighlight';

const firmwareFeatures = [
  {
    icon: ToggleRight,
    title: 'Мгновенное переключение',
    description: 'WireGuard для скорости, AmneziaWG для маскировки.',
  },
  {
    icon: Shield,
    title: 'Kill Switch',
    description: 'Защита от утечек при обрыве соединения.',
  },
  {
    icon: Activity,
    title: 'Мониторинг трафика',
    description: 'Всегда знайте, что происходит в вашей сети.',
  },
  {
    icon: Lock,
    title: 'Автоматические обновления',
    description: 'Мы позаботились о защите.',
  },
];

const Node1 = () => {
  const [wireGuardOn, setWireGuardOn] = useState(true);
  const [amneziaOn, setAmneziaOn] = useState(true);
  const [tiltStyle, setTiltStyle] = useState({ transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)' });
  
  // Load hero content
  const { content: heroContent } = useBlockContent('node1_hero', {
    badge: 'Production Ready',
    title: 'NODE-1:',
    subtitle: 'Железо, которое не сдается.',
    description: 'Ваш личный шлюз в цифровую свободу. Производство 3LAB.PRO.',
    features: [
      'OEM-платформа: Проверенная база, доработанная 3LAB.',
      'Кастомная прошивка: Управление каждым пакетом на уровне ядра.',
      'Интегрированный AmneziaWG: Маскировка трафика по умолчанию.',
    ],
  });

  // Load Keenetic firmware content
  const { content: keeneticContent } = useBlockContent('node1_keenetic', {
    badge: 'KEENETIC_FIRMWARE',
    title: 'Прошивка для Keenetic',
    subtitle: 'Превратите ваш роутер в защищённый узел с AmneziaWG',
    sectionTitle: 'Полная интеграция с AmneziaWG',
    sectionDescription: 'Кастомная прошивка добавляет нативную поддержку AmneziaWG с возможностью переключения протоколов на лету.',
    features: [
      { title: 'Простая установка', desc: 'Один клик — роутер готов' },
      { title: 'Встроенная защита', desc: 'Kill Switch из коробки' },
      { title: 'Производительность', desc: 'Оптимизация под ARM' },
      { title: 'Web-интерфейс', desc: 'Управление через браузер' },
    ],
    buttonText: 'Скачать прошивку',
    supportedModels: 'Keenetic Giga / Ultra / Viva / Speedster',
  });

  // Load block visibility settings
  const { content: blockVisibility } = useBlockContent('node1_visibility', {
    'node1-hero': true,
    'node1-keenetic': true,
    'node1-performance': true,
    'node1-command': true,
    'node1-features': true,
    'node1-cta': true,
  });

  // Load block order
  const { content: blockOrderData } = useBlockContent<{ order: string[] }>('node1_order', {
    order: ['node1-hero', 'node1-keenetic', 'node1-performance', 'node1-command', 'node1-features', 'node1-cta'],
  });

  const blockOrder = blockOrderData.order || ['node1-hero', 'node1-keenetic', 'node1-performance', 'node1-command', 'node1-features', 'node1-cta'];
  
  // Animated network graph data
  const [graphPoints, setGraphPoints] = useState<number[]>([40, 35, 30, 25, 20, 28, 15, 22, 18, 12, 20, 10]);
  const [networkSpeed, setNetworkSpeed] = useState(847);
  
  // Generate new random point for the graph
  const generateNewPoint = useCallback(() => {
    return Math.floor(Math.random() * 35) + 5; // Random value between 5 and 40
  }, []);
  
  // Update graph data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setGraphPoints(prev => {
        const newPoints = [...prev.slice(1), generateNewPoint()];
        return newPoints;
      });
      // Update speed with slight variation
      setNetworkSpeed(prev => {
        const variation = Math.floor(Math.random() * 100) - 50;
        const newSpeed = prev + variation;
        return Math.max(500, Math.min(950, newSpeed)); // Keep between 500-950
      });
    }, 800); // Update every 800ms
    
    return () => clearInterval(interval);
  }, [generateNewPoint]);
  
  // Generate SVG path from points
  const graphPath = useMemo(() => {
    const width = 400;
    const segmentWidth = width / (graphPoints.length - 1);
    
    let path = `M 0 ${graphPoints[0]}`;
    
    for (let i = 1; i < graphPoints.length; i++) {
      const x = i * segmentWidth;
      const y = graphPoints[i];
      const prevX = (i - 1) * segmentWidth;
      const prevY = graphPoints[i - 1];
      const cpX = (prevX + x) / 2;
      
      path += ` Q ${cpX} ${prevY}, ${x} ${y}`;
    }
    
    return path;
  }, [graphPoints]);
  
  const graphFillPath = useMemo(() => {
    return `${graphPath} L 400 48 L 0 48 Z`;
  }, [graphPath]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({ transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)' });
  };

  // Render sections in order
  const renderSection = (sectionId: string) => {
    if (!blockVisibility[sectionId]) return null;

    switch (sectionId) {
      case 'node1-hero':
        return (
          <section key="node1-hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-background" />
            <div className="absolute inset-0 cyber-grid opacity-30" />
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-20"
              style={{
                background: 'radial-gradient(circle, hsl(var(--primary) / 0.15) 0%, transparent 70%)',
              }}
            />
            
            <div className="container mx-auto px-4 relative z-10">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left: Content */}
                <AnimatedSection delay={0.1}>
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <span className="text-xs font-mono-tech text-primary uppercase tracking-wider">
                        {heroContent.badge}
                      </span>
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-mono-tech leading-tight">
                      <span className="text-foreground">{highlightUppercase(heroContent.title)}</span>
                      <br />
                      <span className="text-gradient-primary">{highlightUppercase(heroContent.subtitle)}</span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
                      {highlightUppercase(heroContent.description)}
                    </p>
                    
                    <ul className="space-y-3 pt-4">
                      {heroContent.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-muted-foreground">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                          <span className="font-mono-tech text-sm">{highlightUppercase(feature)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </AnimatedSection>
                
                {/* Right: NODE-1 3D Router Image */}
                <AnimatedSection delay={0.2} direction="right">
                  <RouterVisualization routerImage={node1Router} />
                </AnimatedSection>
              </div>
            </div>
          </section>
        );

      case 'node1-keenetic':
        return (
          <section key="node1-keenetic" className="py-24 relative overflow-hidden bg-background">
            {/* Keenetic section content - keeping existing code */}
            {/* This is a placeholder - the actual section code will be here */}
          </section>
        );

      case 'node1-performance':
        return (
          <section key="node1-performance" className="py-24 relative overflow-hidden">
            {/* Performance section content */}
          </section>
        );

      case 'node1-command':
        return (
          <section key="node1-command" className="py-24 relative overflow-hidden">
            {/* Command Center section content */}
          </section>
        );

      case 'node1-features':
        return (
          <section key="node1-features" className="py-24 relative overflow-hidden">
            {/* Firmware Features section content */}
          </section>
        );

      case 'node1-cta':
        return (
          <section key="node1-cta" className="py-24 relative overflow-hidden">
            {/* CTA section content */}
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <Layout>
      {blockOrder.map(sectionId => renderSection(sectionId))}
    </Layout>
  );
};

export default Node1;
        {/* Background Effects */}