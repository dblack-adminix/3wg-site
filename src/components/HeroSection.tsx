import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Shield, Zap, Lock, Server, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OrderForm } from '@/components/OrderForm';
import { motion } from 'framer-motion';
import { FloatingParticles } from '@/components/FloatingParticles';
import { HolographicEffect } from '@/components/HolographicEffect';
import { useBlockContent } from '@/hooks/useBlockContent';
import wireguardLogo from '@/assets/wireguard-dark.svg';
import amneziaSymbol from '@/assets/amnezia-symbol.svg';
// Blinking Node positions (fixed for consistency)
const blinkingNodes = [
  { x: 15, y: 20 }, { x: 45, y: 35 }, { x: 75, y: 15 },
  { x: 25, y: 55 }, { x: 85, y: 45 }, { x: 55, y: 70 },
  { x: 10, y: 80 }, { x: 65, y: 25 }, { x: 35, y: 85 },
];

// 3D Grid Server Rack Component with Advanced Effects
const ServerRack3D = ({ mousePos }: { mousePos: { x: number; y: number } }) => {
  // Calculate parallax offsets based on mouse position (center is 50,50)
  const parallaxX = (mousePos.x - 50) / 50; // -1 to 1
  const parallaxY = (mousePos.y - 50) / 50; // -1 to 1

  return (
    <div className="relative w-full max-w-lg mx-auto h-96" style={{ perspective: '1200px' }}>
      
      {/* Outer Orbit Ring */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-80 h-80 rounded-full border border-primary/20"
        style={{ 
          x: '-50%', 
          y: '-50%',
          transformStyle: 'preserve-3d',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        {/* Orbit Data Points */}
        {[0, 90, 180, 270].map((deg) => (
          <motion.div
            key={deg}
            className="absolute w-2 h-2 rounded-full bg-primary"
            style={{
              top: '50%',
              left: '50%',
              boxShadow: '0 0 10px 3px rgba(204, 255, 0, 0.6)',
            }}
            animate={{
              x: [
                `${Math.cos((deg * Math.PI) / 180) * 160 - 4}px`,
                `${Math.cos(((deg + 360) * Math.PI) / 180) * 160 - 4}px`,
              ],
              y: [
                `${Math.sin((deg * Math.PI) / 180) * 160 - 4}px`,
                `${Math.sin(((deg + 360) * Math.PI) / 180) * 160 - 4}px`,
              ],
            }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          />
        ))}
      </motion.div>

      {/* Inner Orbit Ring */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-56 h-56 rounded-full border border-accent/15"
        style={{ 
          x: '-50%', 
          y: '-50%',
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        {[45, 135, 225, 315].map((deg) => (
          <motion.div
            key={deg}
            className="absolute w-1.5 h-1.5 rounded-full bg-accent"
            style={{
              top: '50%',
              left: '50%',
              boxShadow: '0 0 8px 2px rgba(255, 153, 0, 0.5)',
            }}
            animate={{
              x: [
                `${Math.cos((deg * Math.PI) / 180) * 112 - 3}px`,
                `${Math.cos(((deg - 360) * Math.PI) / 180) * 112 - 3}px`,
              ],
              y: [
                `${Math.sin((deg * Math.PI) / 180) * 112 - 3}px`,
                `${Math.sin(((deg - 360) * Math.PI) / 180) * 112 - 3}px`,
              ],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />
        ))}
      </motion.div>

      {/* Floating Server Units Container */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{ 
          scale: 1.05,
          rotateX: 5,
          rotateY: -5,
        }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="relative">
          {/* Server Stack */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="relative w-56 h-10 mb-3 rounded-lg bg-gradient-to-r from-card via-card/90 to-card border border-primary/40 overflow-hidden group"
              style={{
                transform: `perspective(500px) rotateX(8deg) translateZ(${i * 15}px)`,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
              }}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              whileHover={{
                borderColor: 'rgba(204, 255, 0, 0.8)',
                boxShadow: '0 4px 30px rgba(204, 255, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              }}
            >
              {/* LED Lights */}
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex gap-1.5">
                <motion.div 
                  className={`w-2 h-2 rounded-full ${i === 1 ? 'bg-primary' : 'bg-[#B10000]'}`}
                  animate={{ 
                    boxShadow: [
                      `0 0 4px 1px ${i === 1 ? 'rgba(204, 255, 0, 0.5)' : 'rgba(177, 0, 0, 0.5)'}`,
                      `0 0 10px 3px ${i === 1 ? 'rgba(204, 255, 0, 0.8)' : 'rgba(177, 0, 0, 0.8)'}`,
                      `0 0 4px 1px ${i === 1 ? 'rgba(204, 255, 0, 0.5)' : 'rgba(177, 0, 0, 0.5)'}`,
                    ]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                />
                <div className="w-2 h-2 rounded-full bg-primary/40" />
                <div className="w-2 h-2 rounded-full bg-primary/20" />
              </div>
              
              {/* Activity Bar */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 w-20 h-1.5 bg-muted/60 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                  animate={{ width: ['30%', `${60 + i * 15}%`, '30%'] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                />
              </div>
              
              {/* Glow Effect on Hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
          
          {/* Connection Lines */}
          <svg className="absolute -left-10 top-0 w-10 h-full" viewBox="0 0 40 120">
            <motion.path
              d="M40 25 L20 25 L20 60 L0 60"
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.5 }}
            />
            <motion.path
              d="M40 60 L20 60 L20 95 L0 95"
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.8 }}
            />
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#CCFF00" stopOpacity="0" />
                <stop offset="50%" stopColor="#CCFF00" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#CCFF00" stopOpacity="0.3" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </motion.div>

      {/* Pulsing Point on Server */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full bg-primary"
        style={{ 
          x: 'calc(-50% + 80px)', 
          y: 'calc(-50% - 5px)',
        }}
        animate={{
          boxShadow: [
            '0 0 5px 2px rgba(204, 255, 0, 0.4)',
            '0 0 20px 8px rgba(204, 255, 0, 0.7)',
            '0 0 5px 2px rgba(204, 255, 0, 0.4)',
          ],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Animated Logo - WireGuard (Top Right) - Behind servers with parallax */}
      <motion.div
        className="absolute top-[15%] right-[5%] z-[-1]"
        initial={{ opacity: 0, x: 40, scale: 0.8 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          x: parallaxX * 25,
          y: parallaxY * 15,
        }}
        transition={{ 
          opacity: { duration: 1, delay: 0.5 },
          scale: { duration: 1, delay: 0.5 },
          x: { duration: 0.3, ease: 'easeOut' },
          y: { duration: 0.3, ease: 'easeOut' },
        }}
      >
        <motion.div
          className="relative"
          animate={{ 
            rotateX: parallaxY * -8,
            rotateY: parallaxX * 8,
          }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Large Logo Glow */}
          <motion.div
            className="absolute inset-[-50%] blur-3xl pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(136, 23, 26, 0.4) 0%, transparent 60%)' }}
            animate={{ 
              scale: [1, 1.4, 1],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.img
            src={wireguardLogo}
            alt="WireGuard"
            className="h-32 w-auto relative"
            style={{ 
              filter: 'drop-shadow(0 0 30px rgba(136, 23, 26, 0.5))',
              opacity: 0.7,
            }}
            animate={{
              filter: [
                'drop-shadow(0 0 20px rgba(136, 23, 26, 0.3))',
                'drop-shadow(0 0 50px rgba(136, 23, 26, 0.7))',
                'drop-shadow(0 0 20px rgba(136, 23, 26, 0.3))',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>

      {/* Animated Logo - AmneziaWG (Bottom Left) - Behind servers with parallax */}
      <motion.div
        className="absolute bottom-[10%] left-[15%] z-[-1]"
        initial={{ opacity: 0, x: -40, scale: 0.8 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          x: parallaxX * -30,
          y: parallaxY * -20,
        }}
        transition={{ 
          opacity: { duration: 1, delay: 0.7 },
          scale: { duration: 1, delay: 0.7 },
          x: { duration: 0.4, ease: 'easeOut' },
          y: { duration: 0.4, ease: 'easeOut' },
        }}
      >
        <motion.div
          className="relative"
          animate={{ 
            rotateX: parallaxY * 10,
            rotateY: parallaxX * -10,
            rotate: parallaxX * 5,
          }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Large Logo Glow */}
          <motion.div
            className="absolute inset-[-60%] blur-3xl pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(255, 153, 0, 0.5) 0%, transparent 60%)' }}
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
          />
          <motion.img
            src={amneziaSymbol}
            alt="AmneziaWG"
            className="h-40 w-auto relative"
            style={{ 
              filter: 'drop-shadow(0 0 35px rgba(255, 153, 0, 0.5))',
              opacity: 0.75,
            }}
            animate={{
              filter: [
                'drop-shadow(0 0 25px rgba(255, 153, 0, 0.3))',
                'drop-shadow(0 0 60px rgba(255, 153, 0, 0.8))',
                'drop-shadow(0 0 25px rgba(255, 153, 0, 0.3))',
              ],
            }}
            transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
          />
        </motion.div>
      </motion.div>

      {/* Multi-layer Ambient Glows */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full blur-[100px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(204, 255, 0, 0.25) 0%, transparent 70%)' }}
        animate={{ 
          scale: [1, 1.15, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-[60px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0, 200, 255, 0.15) 0%, transparent 70%)' }}
        animate={{ 
          scale: [1.1, 1, 1.1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      {/* Dynamic Shadow */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-6 rounded-[100%] bg-background/60 blur-xl"
        animate={{ 
          scaleX: [1, 1.1, 1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
};

export const HeroSection = () => {
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [activePainPoint, setActivePainPoint] = useState(0);

  const { content } = useBlockContent('hero_section', {
    badge_text: 'MANIFESTO_2024',
    main_title: '3WG.RU — Ваш ЦИФРОВОЙ СУВЕРЕНИТЕТ.',
    main_subtitle: 'ВАШ ТРАФИК — ВАШЕ ПРАВО.',
    manifesto_title: 'Остальное — иллюзия.',
    manifesto_subtitle: 'Пока другие обещают «анонимность», мы даем инструменты суверенитета.',
    why_3wg_title: 'Почему 3WG?',
    pain_point_1_title: 'Устали от блокировок?',
    pain_point_1_text: 'Обычные VPN определяются за секунды. Наш AmneziaWG мимикрирует под обычный веб-серфинг. Для цензоров вы просто читаете новости.',
    pain_point_2_title: 'Медленный интернет?',
    pain_point_2_text: 'Мы не перепродаем чужие сервера. Наши узлы в Нидерландах и США работают на 10Gbps каналах.',
    pain_point_3_title: 'Боитесь сливов?',
    pain_point_3_text: 'Мы не просим почту. Мы не храним логи. Ваша личность заканчивается там, где начинается наш шифр.',
    pain_point_4_title: 'Свой домен — свои правила',
    pain_point_4_text: 'Домены amzwg.ru и wire3.ru — это ваша гарантия стабильного коннекта без посредников.',
    cta_button_text: 'Получить VPN-сервер',
    cta_button_secondary: 'ИТ-аутсорсинг',
    stat_uptime: '99.9%',
    stat_latency: '5ms',
    stat_encryption: '256-bit',
  });

  const painPoints = [
    {
      title: content.pain_point_1_title,
      text: content.pain_point_1_text,
      highlight: 'AmneziaWG',
      color: 'primary',
    },
    {
      title: content.pain_point_2_title,
      text: content.pain_point_2_text,
      highlight: '10Gbps',
      color: 'accent',
    },
    {
      title: content.pain_point_3_title,
      text: content.pain_point_3_text,
      highlight: 'шифр',
      color: 'primary',
    },
    {
      title: content.pain_point_4_title,
      text: content.pain_point_4_text,
      highlight: 'amzwg.ru',
      color: 'accent',
    },
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setMousePos({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Auto-rotate pain points every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePainPoint((prev) => (prev + 1) % painPoints.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [painPoints.length]);

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-background"
    >
      {/* Floating Particles */}
      <FloatingParticles />
      
      {/* 3D Perspective Grid - Tactical HUD */}
      <div 
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ perspective: '1000px' }}
      >
        {/* Base Grid */}
        <div 
          className="absolute w-[200%] h-[200%] left-[-50%] top-[-20%]"
          style={{
            transform: 'rotateX(60deg)',
            backgroundImage: `
              linear-gradient(rgba(204, 255, 0, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(204, 255, 0, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />
      </div>
      
      {/* Electric Pulse Lines - Running in different directions */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ perspective: '1000px' }}>
        {/* Horizontal pulses - left to right */}
        {[30, 60].map((top, i) => (
          <div
            key={`h-pulse-${i}`}
            className="absolute h-px left-0 right-0"
            style={{
              top: `${top}%`,
              transform: 'rotateX(60deg)',
              transformOrigin: 'center',
            }}
          >
            <div 
              className="absolute h-full w-16 animate-electric-pulse-h"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(204, 255, 0, 0.6), rgba(204, 255, 0, 0.8), rgba(204, 255, 0, 0.6), transparent)',
                boxShadow: '0 0 10px 1px rgba(204, 255, 0, 0.4)',
                animationDelay: `${i * 2}s`,
                animationDuration: `${4 + i}s`,
              }}
            />
          </div>
        ))}
        
        {/* Horizontal pulse - right to left */}
        <div
          className="absolute h-px left-0 right-0"
          style={{
            top: '45%',
            transform: 'rotateX(60deg)',
            transformOrigin: 'center',
          }}
        >
          <div 
            className="absolute h-full w-12 animate-electric-pulse-h-rev"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255, 153, 0, 0.6), rgba(255, 153, 0, 0.8), rgba(255, 153, 0, 0.6), transparent)',
              boxShadow: '0 0 10px 1px rgba(255, 153, 0, 0.4)',
              animationDelay: '1s',
              animationDuration: '5s',
            }}
          />
        </div>
        
        {/* Vertical pulses - top to bottom */}
        {[25, 75].map((left, i) => (
          <div
            key={`v-pulse-${i}`}
            className="absolute w-px top-0 bottom-0"
            style={{ left: `${left}%` }}
          >
            <div 
              className="absolute w-full h-12 animate-electric-pulse-v"
              style={{
                background: 'linear-gradient(180deg, transparent, rgba(204, 255, 0, 0.6), rgba(204, 255, 0, 0.8), rgba(204, 255, 0, 0.6), transparent)',
                boxShadow: '0 0 8px 1px rgba(204, 255, 0, 0.3)',
                animationDelay: `${i * 1.5 + 0.5}s`,
                animationDuration: `${3 + i}s`,
              }}
            />
          </div>
        ))}
        
        {/* Vertical pulse - bottom to top */}
        <div
          className="absolute w-px top-0 bottom-0"
          style={{ left: '50%' }}
        >
          <div 
            className="absolute w-full h-10 animate-electric-pulse-v-rev"
            style={{
              background: 'linear-gradient(180deg, transparent, rgba(255, 153, 0, 0.5), rgba(255, 153, 0, 0.7), rgba(255, 153, 0, 0.5), transparent)',
              boxShadow: '0 0 8px 1px rgba(255, 153, 0, 0.3)',
              animationDelay: '2s',
              animationDuration: '4s',
            }}
          />
        </div>
      </div>

      {/* Mouse Follow Glow */}
      <div 
        className="absolute inset-0 pointer-events-none z-[1] transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(204, 255, 0, 0.08) 0%, transparent 25%)`,
        }}
      />

      {/* Blinking Nodes at Grid Intersections */}
      <div className="absolute inset-0 pointer-events-none">
        {blinkingNodes.map((node, i) => (
          <div
            key={i}
            className="absolute w-[3px] h-[3px] bg-primary rounded-sm"
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              boxShadow: '0 0 8px 2px rgba(204, 255, 0, 0.6), 0 0 16px 4px rgba(204, 255, 0, 0.3)',
              animation: `node-blink ${2 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
      </div>
      
      {/* Animated Floating Blobs */}
      <div 
        className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full blur-[150px] opacity-25 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #CCFF00 0%, transparent 70%)',
          animation: 'float-blob-1 12s ease-in-out infinite',
        }}
      />
      <div 
        className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full blur-[180px] opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #FF9900 0%, #1a1a1a 70%)',
          animation: 'float-blob-2 15s ease-in-out infinite',
        }}
      />
      
      {/* Scanline Overlay Effect */}
      <div 
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(204, 255, 0, 0.04) 50%, transparent 100%)',
          backgroundSize: '100% 200%',
          animation: 'scanline-move 8s linear infinite',
        }}
      />

      {/* Vignette Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-[3] hero-gradient"
      />

      {/* Terminal Elements - Left Bottom */}
      <div className="absolute bottom-6 left-6 z-10 hidden md:block">
        <div className="font-mono text-[10px] text-muted-foreground tracking-wider space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse" />
            <span>LATENCY: <span className="text-primary">12ms</span></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
            <span>PACKET_LOSS: <span className="text-primary">0.00%</span></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
            <span>ENCRYPTION: <span className="text-primary">AES-256-GCM</span></span>
          </div>
        </div>
      </div>

      {/* Terminal Elements - Right Bottom */}
      <div className="absolute bottom-6 right-6 z-10 hidden md:block text-right">
        <div className="font-mono text-[10px] text-muted-foreground tracking-wider space-y-1">
          <div className="flex items-center justify-end gap-2">
            <span>NODE-1 STATUS: <span className="text-primary">ACTIVE</span></span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse" />
          </div>
          <div className="flex items-center justify-end gap-2">
            <span>UPLINK: <span className="text-primary">1000Mbps</span></span>
            <span className="w-1.5 h-1.5 rounded-full bg-accent/60" />
          </div>
          <div className="flex items-center justify-end gap-2">
            <span>LOCATION: <span className="text-muted-foreground">[55.7558, 37.6173]</span></span>
            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
          </div>
        </div>
      </div>
      
      {/* AuthKit-style Light Beams */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden z-[3]">
        {/* Left Light Beam */}
        <div 
          className="absolute top-0 left-1/2 w-[600px] h-[800px] opacity-20"
          style={{
            transform: 'translateX(-100%) rotate(-25deg)',
            transformOrigin: 'top center',
            background: 'linear-gradient(180deg, rgba(204, 255, 0, 0.3) 0%, transparent 60%)',
            filter: 'blur(40px)',
          }}
        />
        {/* Right Light Beam */}
        <div 
          className="absolute top-0 left-1/2 w-[600px] h-[800px] opacity-20"
          style={{
            transform: 'translateX(0%) rotate(25deg)',
            transformOrigin: 'top center',
            background: 'linear-gradient(180deg, rgba(204, 255, 0, 0.3) 0%, transparent 60%)',
            filter: 'blur(40px)',
          }}
        />
        {/* Center Glow */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[400px]"
          style={{
            background: 'linear-gradient(180deg, rgba(204, 255, 0, 0.4) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
      </div>

      {/* Horizontal Accent Lines */}
      <div className="absolute top-[12%] left-1/2 -translate-x-1/2 flex items-center gap-4 z-[5]">
        <div className="w-24 md:w-40 h-px bg-gradient-to-r from-transparent via-primary/40 to-primary/20" />
        <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
        <div className="w-24 md:w-40 h-px bg-gradient-to-l from-transparent via-primary/40 to-primary/20" />
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left - Text Content */}
          <div className="text-center lg:text-left">
            {/* Badge - Glassmorphism */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/10 bg-card/40 backdrop-blur-md mb-8">
              <span className="w-2 h-2 rounded-full bg-primary pulse-indicator" />
              <span className="text-sm font-medium text-primary font-mono-tech">{content.badge_text}</span>
            </div>

            {/* Main Heading with AuthKit-style Ignite Animation */}
            <div className="relative">
              {/* Background Glow for Text - Static */}
              <div 
                className="absolute -inset-8 blur-3xl pointer-events-none opacity-30"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(204, 255, 0, 0.3) 0%, transparent 70%)',
                }}
              />
              
              <h1 className="relative text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6 font-['Montserrat']">
                <span className="text-gradient-primary animate-text-reveal" style={{ animationDelay: '0.1s' }}>
                  {content.main_title?.split(' ')[0] || '3WG.RU'}
                </span>
                <span className="text-foreground animate-text-reveal" style={{ animationDelay: '0.2s' }}>
                  {' — ' + (content.main_title?.split(' ').slice(2, 3).join(' ') || 'Ваш')}
                </span>
                <br />
                <span 
                  className="text-foreground inline-block relative animate-text-ignite"
                  style={{ animationDelay: '0.4s' }}
                >
                  {content.main_title?.split(' ')[3] || 'ЦИФРОВОЙ'}
                  {/* Animated Underline */}
                  <span className="absolute -bottom-2 left-0 right-0 h-px animate-line-expand" style={{ animationDelay: '0.8s' }} />
                </span>
                <br />
                <span 
                  className="inline-block animate-text-ignite-orange"
                  style={{ animationDelay: '0.6s' }}
                >
                  {content.main_title?.split(' ')[4] || 'СУВЕРЕНИТЕТ.'}
                </span>
              </h1>
            </div>

            {/* Manifesto Text - Убойный текст */}
            <div className="space-y-6 mb-10">
              <div className="space-y-3">
                <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                  {content.main_subtitle}
                  <br />
                  <span className="text-muted-foreground">{content.manifesto_title}</span>
                </h2>
                <p className="text-lg text-primary font-semibold">
                  {content.manifesto_subtitle}
                </p>
              </div>

              {/* Блок "Почему 3WG?" - Боли */}
              <div className="space-y-4 pt-4">
                <h3 className="text-sm font-bold text-accent uppercase tracking-wider">
                  {content.why_3wg_title || 'Почему 3WG?'}
                </h3>
                
                {/* Carousel Container */}
                <div className="relative min-h-[140px]">
                  {painPoints.map((point, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{
                        opacity: activePainPoint === index ? 1 : 0,
                        x: activePainPoint === index ? 0 : -50,
                        display: activePainPoint === index ? 'block' : 'none',
                      }}
                      transition={{ duration: 0.5 }}
                      className={`border-l-2 ${point.color === 'primary' ? 'border-primary' : 'border-accent'} pl-4 absolute inset-0`}
                    >
                      <h4 className="text-base font-bold text-white mb-1">
                        {point.title}
                      </h4>
                      <p 
                        className="text-sm text-muted-foreground leading-relaxed" 
                        dangerouslySetInnerHTML={{ 
                          __html: point.text?.replace(
                            new RegExp(point.highlight, 'g'), 
                            `<span class="text-${point.color} font-semibold">${point.highlight}</span>`
                          ).replace(/wire3\.ru/g, '<span class="text-accent font-semibold">wire3.ru</span>') || '' 
                        }} 
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Progress Indicators */}
                <div className="flex items-center gap-2 pt-2">
                  {painPoints.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActivePainPoint(index)}
                      className="relative h-1 flex-1 bg-muted/30 rounded-full overflow-hidden"
                    >
                      <motion.div
                        className={`absolute inset-0 ${index % 2 === 0 ? 'bg-primary' : 'bg-accent'}`}
                        initial={{ scaleX: 0 }}
                        animate={{
                          scaleX: activePainPoint === index ? 1 : 0,
                        }}
                        transition={{
                          duration: activePainPoint === index ? 10 : 0.3,
                          ease: 'linear',
                        }}
                        style={{ transformOrigin: 'left' }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 mb-8">
              <Button 
                size="lg" 
                onClick={() => setIsOrderOpen(true)}
                className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 glow-primary group transition-all duration-300 hover:scale-105 min-h-[48px]"
              >
                <Shield className="mr-2 h-5 w-5" />
                {content.cta_button_text}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto border-accent text-accent hover:bg-accent/10 font-semibold text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 transition-all duration-300 hover:scale-105 min-h-[48px]"
              >
                <Server className="mr-2 h-5 w-5" />
                {content.cta_button_secondary}
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm font-mono-tech">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary pulse-indicator" />
                <span className="text-muted-foreground">uptime: <span className="text-primary">{content.stat_uptime}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-destructive" />
                <span className="text-muted-foreground">latency: <span className="text-destructive">{content.stat_latency}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <span className="text-muted-foreground">encryption: <span className="text-accent">{content.stat_encryption}</span></span>
              </div>
            </div>
          </div>

          {/* Right - 3D Server Rack */}
          <div className="hidden lg:block">
            <ServerRack3D mousePos={mousePos} />
          </div>
        </div>

        {/* Protocol Cards - Mobile Only - Glassmorphism Style */}
        <div className="lg:hidden mt-12 grid grid-cols-3 gap-4 max-w-md mx-auto">
          <div className="flex flex-col items-center p-4 rounded-xl bg-card/40 backdrop-blur-md border border-border/10 shadow-lg">
            <Shield className="h-6 w-6 text-primary mb-2" />
            <span className="text-sm font-bold text-foreground">Amnezia</span>
            <span className="text-[10px] text-muted-foreground">DPI bypass</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-xl bg-card/40 backdrop-blur-md border border-border/10 shadow-lg">
            <Zap className="h-6 w-6 text-destructive mb-2" />
            <span className="text-sm font-bold text-foreground">WireGuard</span>
            <span className="text-[10px] text-muted-foreground">5ms ping</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-xl bg-card/40 backdrop-blur-md border border-border/10 shadow-lg">
            <Lock className="h-6 w-6 text-accent mb-2" />
            <span className="text-sm font-bold text-foreground">Zero Logs</span>
            <span className="text-[10px] text-muted-foreground">privacy</span>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />

      {/* Order Form Modal */}
      <OrderForm isOpen={isOrderOpen} onClose={() => setIsOrderOpen(false)} />

      {/* CSS Animations */}
      <style>{`
        @keyframes float-server {
          0%, 100% { transform: perspective(500px) rotateX(10deg) translateY(0); }
          50% { transform: perspective(500px) rotateX(10deg) translateY(-5px); }
        }
        @keyframes pulse-line {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        @keyframes data-flow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes float-blob-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(30px, -20px) scale(1.05); }
          50% { transform: translate(-20px, 30px) scale(0.95); }
          75% { transform: translate(20px, 20px) scale(1.02); }
        }
        @keyframes float-blob-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-40px, 20px) scale(1.08); }
          66% { transform: translate(30px, -30px) scale(0.92); }
        }
        @keyframes scanline-move {
          0% { background-position: 0% 0%; }
          100% { background-position: 0% 200%; }
        }
        @keyframes node-blink {
          0%, 100% { opacity: 0.3; box-shadow: 0 0 4px 1px rgba(204, 255, 0, 0.3); }
          50% { opacity: 1; box-shadow: 0 0 12px 4px rgba(204, 255, 0, 0.8), 0 0 24px 8px rgba(204, 255, 0, 0.4); }
        }
        
        /* Text Ignite Animations */
        @keyframes text-glow-in {
          0% { opacity: 0; transform: scale(0.8); }
          50% { opacity: 0.6; }
          100% { opacity: 0.4; transform: scale(1); }
        }
        @keyframes text-reveal {
          0% { opacity: 0; transform: translateY(20px); filter: blur(10px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @keyframes text-ignite {
          0% { 
            opacity: 0; 
            transform: translateY(20px); 
            filter: blur(8px);
            text-shadow: none;
          }
          50% { 
            opacity: 1;
            text-shadow: 0 0 80px rgba(204, 255, 0, 0.8), 0 0 120px rgba(204, 255, 0, 0.6), 0 0 160px rgba(204, 255, 0, 0.4);
          }
          100% { 
            opacity: 1; 
            transform: translateY(0); 
            filter: blur(0);
            text-shadow: 0 0 40px rgba(204, 255, 0, 0.4), 0 0 80px rgba(204, 255, 0, 0.2);
          }
        }
        @keyframes text-ignite-orange {
          0% { 
            opacity: 0; 
            transform: translateY(20px); 
            filter: blur(8px);
            text-shadow: none;
            background: linear-gradient(90deg, #666, #888);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
          }
          50% { 
            opacity: 1;
            text-shadow: 0 0 80px rgba(255, 153, 0, 0.8), 0 0 120px rgba(255, 153, 0, 0.6);
            background: linear-gradient(90deg, #FF9900, #FFB347);
            -webkit-background-clip: text;
            background-clip: text;
          }
          100% { 
            opacity: 1; 
            transform: translateY(0); 
            filter: blur(0);
            text-shadow: 0 0 40px rgba(255, 153, 0, 0.4), 0 0 80px rgba(255, 153, 0, 0.2);
            background: linear-gradient(90deg, #FF9900, #FFB347, #FF9900);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
          }
        }
        @keyframes line-expand {
          0% { 
            transform: scaleX(0); 
            opacity: 0;
            background: linear-gradient(90deg, transparent, rgba(204, 255, 0, 0.8), transparent);
          }
          50% {
            opacity: 1;
            background: linear-gradient(90deg, transparent, rgba(204, 255, 0, 1), transparent);
          }
          100% { 
            transform: scaleX(1); 
            opacity: 1;
            background: linear-gradient(90deg, transparent, rgba(204, 255, 0, 0.6), transparent);
          }
        }
        
        .animate-text-glow-in {
          animation: text-glow-in 1.5s ease-out forwards;
        }
        .animate-text-reveal {
          opacity: 0;
          animation: text-reveal 0.8s ease-out forwards;
        }
        .animate-text-ignite {
          opacity: 0;
          animation: text-ignite 1.2s ease-out forwards;
        }
        .animate-text-ignite-orange {
          opacity: 0;
          animation: text-ignite-orange 1.2s ease-out forwards;
        }
        .animate-line-expand {
          transform: scaleX(0);
          animation: line-expand 0.8s ease-out forwards;
        }
        
        /* Electric Pulse Animations */
        @keyframes electric-pulse-h {
          0% { left: -15%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 105%; opacity: 0; }
        }
        @keyframes electric-pulse-h-rev {
          0% { right: -15%; left: auto; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { right: 105%; left: auto; opacity: 0; }
        }
        @keyframes electric-pulse-v {
          0% { top: -15%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 105%; opacity: 0; }
        }
        @keyframes electric-pulse-v-rev {
          0% { bottom: -15%; top: auto; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { bottom: 105%; top: auto; opacity: 0; }
        }
        .animate-electric-pulse-h {
          animation: electric-pulse-h 3s linear infinite;
        }
        .animate-electric-pulse-h-rev {
          animation: electric-pulse-h-rev 4s linear infinite;
        }
        .animate-electric-pulse-v {
          animation: electric-pulse-v 2.5s linear infinite;
        }
        .animate-electric-pulse-v-rev {
          animation: electric-pulse-v-rev 3s linear infinite;
        }
        
        .perspective-1000 { perspective: 1000px; }
        .rotateX-60 { transform: rotateX(60deg); }
      `}</style>
    </section>
  );
};
