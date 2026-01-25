import { Shield, Zap, Eye, EyeOff, Cpu, Radio, Check, X, ArrowRight, Server } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/AnimatedSection';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const features = [
  {
    icon: Radio,
    title: 'Маскировка параметров',
    subtitle: 'Junk Data',
    description: 'Мы добавляем случайные байты в начало пакетов (Init Packet). Для цензора это выглядит как хаотичный набор данных, который невозможно классифицировать.',
  },
  {
    icon: Zap,
    title: 'Изменение размеров',
    subtitle: 'Packet Resizing',
    description: 'Стандартные пакеты VPN имеют фиксированный размер. AmneziaWG динамически меняет их длину, имитируя передачу обычного HTTPS-трафика.',
  },
  {
    icon: EyeOff,
    title: 'Бесшумное рукопожатие',
    subtitle: 'Silent Handshake',
    description: 'Процесс "рукопожатия" происходит бесшумно и не вызывает подозрений у систем мониторинга провайдера.',
  },
];

const nodeAdvantages = [
  {
    icon: Shield,
    title: 'Работа в "белых списках"',
    description: 'Даже если в вашей сети разрешен только ограниченный список сайтов, AmneziaWG найдет лазейку.',
  },
  {
    icon: Zap,
    title: 'Минимальный пинг',
    description: 'В отличие от тяжелых протоколов маскировки, AmneziaWG работает на уровне ядра (Kernel-space), сохраняя скорость.',
  },
  {
    icon: Cpu,
    title: 'Автоматизация',
    description: 'Вам не нужно знать порты и ключи. Прошивка сама выбирает оптимальные параметры маскировки.',
  },
];

const comparisonData = [
  { feature: 'Скорость', wireguard: 'До 1 Гбит/с', amnezia: 'До 800 Мбит/с' },
  { feature: 'Маскировка', wireguard: 'Базовая', amnezia: 'Ультра (Anti-DPI)' },
  { feature: 'Назначение', wireguard: 'Игры, 4K, Стриминг', amnezia: 'Обход жестких блокировок' },
  { feature: 'Расход батареи', wireguard: 'Минимальный', amnezia: 'Минимальный' },
];

const AmneziaWG = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]">
            {/* Morphing Packet Animation */}
            <div className="absolute inset-0 animate-pulse">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#FF9900]/20 rounded-full blur-3xl animate-[ping_3s_ease-in-out_infinite]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#FF9900]/10 rounded-full blur-3xl animate-[ping_4s_ease-in-out_infinite_0.5s]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#FF9900]/5 rounded-full blur-3xl animate-[ping_5s_ease-in-out_infinite_1s]" />
            </div>
            
            {/* Packet Morph Visual */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                {/* Core packet */}
                <div className="w-20 h-20 border-2 border-[#FF9900] bg-[#FF9900]/10 animate-[spin_8s_linear_infinite] flex items-center justify-center"
                     style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                  <Shield className="w-8 h-8 text-[#FF9900]" />
                </div>
                
                {/* Orbiting data fragments */}
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-3 h-3 bg-[#FF9900] rounded-sm"
                    style={{
                      top: '50%',
                      left: '50%',
                      animation: `orbit ${3 + i * 0.5}s linear infinite`,
                      animationDelay: `${i * 0.3}s`,
                      transformOrigin: `${40 + i * 15}px 0`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-5">
            <div className="h-full w-full" style={{
              backgroundImage: 'linear-gradient(#FF9900 1px, transparent 1px), linear-gradient(90deg, #FF9900 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }} />
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF9900]/10 border border-[#FF9900]/30 rounded-full mb-8">
              <Eye className="w-4 h-4 text-[#FF9900]" />
              <span className="text-[#FF9900] text-sm font-mono">STEALTH_PROTOCOL</span>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              Amnezia<span className="text-[#FF9900]">WG</span>
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <p className="text-2xl md:text-3xl text-white/90 mb-4">
              Невидимый щит <span className="text-[#CCFF00]">3LAB.PRO</span>
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Протокол, который невозможно заблокировать
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-red-500 font-mono text-sm">ПРОБЛЕМА</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                Почему стандартные VPN больше не работают?
              </h2>
              
              <div className="p-8 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
                <p className="text-lg text-white/70 leading-relaxed">
                  Обычные протоколы (<span className="text-white">WireGuard</span>, <span className="text-white">OpenVPN</span>) имеют характерный "цифровой почерк". 
                  Современные системы анализа трафика (<span className="text-[#FF9900]">DPI</span>) легко распознают их и блокируют за миллисекунды.
                </p>
                <div className="mt-6 pt-6 border-t border-white/10">
                  <p className="text-white/90">
                    <span className="text-[#FF9900] font-semibold">AmneziaWG</span> — это эволюция WireGuard, созданная для того, чтобы ваш трафик выглядел как обычный шум или безобидный веб-серфинг.
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF9900]/10 border border-[#FF9900]/30 rounded-full mb-6">
                <Server className="w-4 h-4 text-[#FF9900]" />
                <span className="text-[#FF9900] text-sm font-mono">amzwg.ru</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Как это работает в 3LAB?
              </h2>
              <p className="text-white/60 max-w-2xl mx-auto">
                Технология AmneziaWG модифицирует заголовки пакетов WireGuard, лишая их узнаваемых признаков. 
                В нашей инфраструктуре мы довели эту технологию до абсолюта.
              </p>
            </div>
          </AnimatedSection>

          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <StaggerItem key={feature.title}>
                <div className="group relative h-full">
                  <div className="absolute inset-0 bg-gradient-to-b from-[#FF9900]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                  <div className="relative h-full p-8 bg-white/5 border border-[#FF9900]/20 rounded-2xl hover:border-[#FF9900]/50 transition-all duration-300">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 bg-[#FF9900]/10 rounded-xl flex items-center justify-center border border-[#FF9900]/30">
                        <feature.icon className="w-7 h-7 text-[#FF9900]" />
                      </div>
                      <div className="text-[#FF9900] font-mono text-sm">0{index + 1}</div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-[#FF9900] text-sm font-mono mb-4">{feature.subtitle}</p>
                    <p className="text-white/60">{feature.description}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* NODE-1 Advantages */}
      <section className="py-24 relative bg-gradient-to-b from-transparent via-[#FF9900]/5 to-transparent">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Преимущества для пользователя <span className="text-[#CCFF00]">NODE-1</span>
              </h2>
              <p className="text-white/60">
                Использование AmneziaWG на нашем роутере 3LAB NODE-1
              </p>
            </div>
          </AnimatedSection>

          <StaggerContainer className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {nodeAdvantages.map((advantage) => (
              <StaggerItem key={advantage.title}>
                <div className="p-6 bg-white/5 border border-white/10 rounded-xl hover:border-[#CCFF00]/30 transition-colors">
                  <advantage.icon className="w-10 h-10 text-[#CCFF00] mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2">{advantage.title}</h3>
                  <p className="text-white/60 text-sm">{advantage.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Сравнение протоколов
              </h2>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="max-w-4xl mx-auto overflow-hidden rounded-2xl border border-white/10">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-white/60 font-mono">Характеристика</TableHead>
                    <TableHead className="text-center">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#B10000]/20 border border-[#B10000]/50 rounded-full">
                        <span className="text-[#ff4444] font-mono text-sm">WireGuard</span>
                      </div>
                      <div className="text-white/40 text-xs mt-1 font-mono">wire3.ru</div>
                    </TableHead>
                    <TableHead className="text-center">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF9900]/20 border border-[#FF9900]/50 rounded-full">
                        <span className="text-[#FF9900] font-mono text-sm">AmneziaWG</span>
                      </div>
                      <div className="text-white/40 text-xs mt-1 font-mono">amzwg.ru</div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comparisonData.map((row, index) => (
                    <TableRow key={row.feature} className="border-white/10 hover:bg-white/5">
                      <TableCell className="text-white font-medium">{row.feature}</TableCell>
                      <TableCell className="text-center text-white/70">{row.wireguard}</TableCell>
                      <TableCell className="text-center">
                        <span className={index === 1 ? 'text-[#FF9900] font-semibold' : 'text-white/70'}>
                          {row.amnezia}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center">
              <div className="p-12 bg-gradient-to-br from-[#FF9900]/10 to-[#CCFF00]/5 border border-[#FF9900]/30 rounded-3xl">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Попробуйте AmneziaWG в действии
                </h2>
                <p className="text-xl text-white/70 mb-8">
                  с роутером <span className="text-[#CCFF00]">NODE-1</span>
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/hardware">
                    <Button className="bg-[#FF9900] hover:bg-[#FF9900]/90 text-black font-bold px-8 py-6 text-lg group">
                      Купить Hardware
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link to="/pricing">
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg">
                      Смотреть тарифы
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <style>{`
        @keyframes orbit {
          from {
            transform: rotate(0deg) translateX(60px) rotate(0deg);
          }
          to {
            transform: rotate(360deg) translateX(60px) rotate(-360deg);
          }
        }
      `}</style>
    </Layout>
  );
};

export default AmneziaWG;
