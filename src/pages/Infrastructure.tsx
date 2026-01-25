import { useState, useEffect, useRef } from 'react';
import { Server, Globe, Cpu, HardDrive, Terminal, ArrowRight } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { AnimatedSection } from '@/components/AnimatedSection';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import worldMapSvg from '@/assets/world-map.svg';

// Server nodes data
const serverNodes = [
  { 
    id: 'NL-1',
    country: 'NL',
    flag: '🇳🇱',
    location: 'NETHERLANDS / AMSTERDAM',
    status: 'online',
    domain: 'amzwg.ru',
    cpuLoad: 45,
    ramLoad: 38,
    ping: 28,
  },
  { 
    id: 'DE-1',
    country: 'DE',
    flag: '🇩🇪',
    location: 'GERMANY / FRANKFURT',
    status: 'online',
    domain: 'wire3.ru',
    cpuLoad: 52,
    ramLoad: 44,
    ping: 22,
  },
  { 
    id: 'DE-2',
    country: 'DE',
    flag: '🇩🇪',
    location: 'GERMANY / MUNICH',
    status: 'online',
    domain: 'amzwg.ru',
    cpuLoad: 35,
    ramLoad: 29,
    ping: 25,
  },
  { 
    id: 'FI-1',
    country: 'FI',
    flag: '🇫🇮',
    location: 'FINLAND / HELSINKI',
    status: 'online',
    domain: 'wire3.ru',
    cpuLoad: 28,
    ramLoad: 31,
    ping: 32,
  },
  { 
    id: 'US-1',
    country: 'US',
    flag: '🇺🇸',
    location: 'USA / NEW YORK',
    status: 'online',
    domain: 'amzwg.ru',
    cpuLoad: 61,
    ramLoad: 55,
    ping: 85,
  },
  { 
    id: 'SG-1',
    country: 'SG',
    flag: '🇸🇬',
    location: 'SINGAPORE',
    status: 'online',
    domain: 'wire3.ru',
    cpuLoad: 42,
    ramLoad: 38,
    ping: 120,
  },
];

// Map nodes with correct SVG coordinates (viewBox 0 0 100 50)
const mapNodes = [
  { x: 51, y: 17, node: 'NL-1', label: 'Amsterdam', ping: '28ms' },
  { x: 52, y: 19, node: 'DE-1', label: 'Frankfurt', ping: '22ms' },
  { x: 53, y: 20, node: 'DE-2', label: 'Munich', ping: '25ms' },
  { x: 56, y: 14, node: 'FI-1', label: 'Helsinki', ping: '32ms' },
  { x: 24, y: 22, node: 'US-1', label: 'New York', ping: '85ms' },
  { x: 80, y: 35, node: 'SG-1', label: 'Singapore', ping: '120ms' },
];

// Log messages for terminal
const logMessages = [
  { type: 'OK', message: 'Node-NL-1: Handshake successful' },
  { type: 'INFO', message: 'Domain amzwg.ru: Traffic obfuscation active' },
  { type: 'OK', message: 'Node-DE-2: Latency 15ms' },
  { type: 'INFO', message: 'AmneziaWG: DPI bypass confirmed' },
  { type: 'OK', message: 'Node-FI-1: Connection established' },
  { type: 'INFO', message: 'Domain wire3.ru: Certificate renewed' },
  { type: 'OK', message: 'Node-US-1: Tunnel active' },
  { type: 'WARN', message: 'Node-SG-1: High latency detected (120ms)' },
  { type: 'OK', message: 'Node-DE-1: Packet loss 0.00%' },
  { type: 'INFO', message: 'System: All nodes operational' },
  { type: 'OK', message: 'Node-NL-1: MTU optimized (1420)' },
  { type: 'INFO', message: 'WireGuard: Key rotation complete' },
  { type: 'OK', message: 'Node-DE-2: Handshake successful' },
  { type: 'INFO', message: 'Network: Backbone redundancy active' },
  { type: 'OK', message: 'Node-FI-1: Latency 32ms' },
];

// Server Node Card Component
const ServerNodeCard = ({ node, index }: { node: typeof serverNodes[0]; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="relative p-5 rounded-xl border border-primary/20 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 group"
      style={{
        boxShadow: '0 0 30px rgba(204, 255, 0, 0.03)',
      }}
      whileHover={{
        y: -4,
        boxShadow: '0 0 40px rgba(204, 255, 0, 0.1)',
      }}
    >
      {/* Status indicator glow */}
      <div className="absolute top-3 right-3">
        <motion.div
          className="w-2.5 h-2.5 rounded-full bg-primary"
          animate={{
            boxShadow: [
              '0 0 4px 1px rgba(204, 255, 0, 0.4)',
              '0 0 12px 4px rgba(204, 255, 0, 0.7)',
              '0 0 4px 1px rgba(204, 255, 0, 0.4)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{node.flag}</span>
        <div>
          <h3 className="font-mono text-sm font-bold text-foreground tracking-wider">
            {node.location}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-mono text-primary uppercase tracking-widest">
              {node.status}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground">
              • {node.ping}ms
            </span>
          </div>
        </div>
      </div>

      {/* Domain */}
      <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-muted/30 border border-border">
        <Globe className="w-3.5 h-3.5 text-primary" />
        <span className="font-mono text-xs text-foreground">{node.domain}</span>
      </div>

      {/* Load Bars */}
      <div className="space-y-3">
        {/* CPU */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[10px] text-muted-foreground flex items-center gap-1.5">
              <Cpu className="w-3 h-3" /> CPU
            </span>
            <span className="font-mono text-[10px] text-primary">{node.cpuLoad}%</span>
          </div>
          <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)',
              }}
              initial={{ width: 0 }}
              animate={{ width: `${node.cpuLoad}%` }}
              transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
            />
          </div>
        </div>

        {/* RAM */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[10px] text-muted-foreground flex items-center gap-1.5">
              <HardDrive className="w-3 h-3" /> RAM
            </span>
            <span className="font-mono text-[10px] text-accent">{node.ramLoad}%</span>
          </div>
          <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-accent"
              initial={{ width: 0 }}
              animate={{ width: `${node.ramLoad}%` }}
              transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Node ID */}
      <div className="mt-4 pt-3 border-t border-border/50">
        <span className="font-mono text-[10px] text-muted-foreground">
          NODE-{node.id}
        </span>
      </div>
    </motion.div>
  );
};

// Live Terminal Component
const LiveTerminal = () => {
  const [logs, setLogs] = useState<typeof logMessages>([]);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setLogs(prev => [...prev, logMessages[index % logMessages.length]]);
      index++;
      
      // Keep only last 20 logs
      if (index > 20) {
        setLogs(prev => prev.slice(-15));
      }
    }, 2000);

    // Initial logs
    setLogs(logMessages.slice(0, 5));

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'OK': return 'text-primary';
      case 'INFO': return 'text-accent';
      case 'WARN': return 'text-yellow-500';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="rounded-xl border border-primary/20 bg-[#0a0a0a] overflow-hidden">
      {/* Terminal Header */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-primary/20 bg-card/50">
        <Terminal className="w-4 h-4 text-primary" />
        <span className="font-mono text-xs text-primary">LIVE_NETWORK_LOG</span>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="font-mono text-[10px] text-muted-foreground">STREAMING</span>
        </div>
      </div>

      {/* Terminal Body */}
      <div 
        ref={terminalRef}
        className="h-64 lg:h-96 overflow-y-auto p-4 space-y-1.5 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent"
        style={{ scrollBehavior: 'smooth' }}
      >
        {logs.map((log, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-mono text-xs leading-relaxed"
          >
            <span className="text-muted-foreground">[</span>
            <span className={getTypeColor(log.type)}>{log.type}</span>
            <span className="text-muted-foreground">] </span>
            <span className="text-foreground/80">{log.message}</span>
          </motion.div>
        ))}
        <div className="flex items-center gap-1 text-primary font-mono text-xs">
          <span>{'>'}</span>
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            _
          </motion.span>
        </div>
      </div>
    </div>
  );
};

// World Map Component using imported SVG
const WorldMap = () => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Node positions based on actual SVG viewBox (2000 x 857), converted to percentages
  // Netherlands, Germany, Finland, USA East, Turkey, Singapore
  const nodes = [
    { id: 'NL', x: 50.5, y: 19, label: 'Amsterdam', ping: '28ms' },
    { id: 'DE', x: 52, y: 22, label: 'Frankfurt', ping: '22ms' },
    { id: 'FI', x: 56, y: 14, label: 'Helsinki', ping: '32ms' },
    { id: 'US', x: 24, y: 28, label: 'New York', ping: '85ms' },
    { id: 'TR', x: 58, y: 28, label: 'Istanbul', ping: '45ms' },
    { id: 'SG', x: 78, y: 54, label: 'Singapore', ping: '120ms' },
  ];

  // Connection paths between nodes
  const connections = [
    { from: 'US', to: 'NL' },
    { from: 'NL', to: 'DE' },
    { from: 'DE', to: 'FI' },
    { from: 'NL', to: 'FI' },
    { from: 'DE', to: 'TR' },
    { from: 'TR', to: 'SG' },
  ];

  const getNodePos = (id: string) => nodes.find(n => n.id === id);

  return (
    <div className="relative w-full aspect-[2.33/1] min-h-[340px] rounded-xl border border-primary/30 bg-[#080808] overflow-hidden">
      {/* Tactical corner frames */}
      <div className="absolute top-0 left-0 w-10 h-10 border-l-2 border-t-2 border-primary/60 z-10" />
      <div className="absolute top-0 right-0 w-10 h-10 border-r-2 border-t-2 border-primary/60 z-10" />
      <div className="absolute bottom-0 left-0 w-10 h-10 border-l-2 border-b-2 border-primary/60 z-10" />
      <div className="absolute bottom-0 right-0 w-10 h-10 border-r-2 border-b-2 border-primary/60 z-10" />

      {/* Inner tactical frame */}
      <div className="absolute top-3 left-3 w-5 h-5 border-l border-t border-primary/30 z-10" />
      <div className="absolute top-3 right-3 w-5 h-5 border-r border-t border-primary/30 z-10" />
      <div className="absolute bottom-3 left-3 w-5 h-5 border-l border-b border-primary/30 z-10" />
      <div className="absolute bottom-3 right-3 w-5 h-5 border-r border-b border-primary/30 z-10" />

      {/* Background world map image */}
      <img 
        src={worldMapSvg} 
        alt="World Map" 
        className="absolute inset-0 w-full h-full object-cover opacity-40"
        style={{ 
          filter: 'brightness(0.3) saturate(0)',
        }}
      />

      {/* SVG overlay for nodes and connections */}
      <svg 
        className="absolute inset-0 w-full h-full" 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
      >
        <defs>
          {/* Glow filter for nodes */}
          <filter id="nodeGlowMap" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="0.4" result="blur"/>
            <feFlood floodColor="#CCFF00" floodOpacity="0.9" result="color"/>
            <feComposite in="color" in2="blur" operator="in" result="glow"/>
            <feMerge>
              <feMergeNode in="glow"/>
              <feMergeNode in="glow"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Line glow filter */}
          <filter id="lineGlowMap" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.3" result="blur"/>
            <feFlood floodColor="#CCFF00" floodOpacity="0.6" result="color"/>
            <feComposite in="color" in2="blur" operator="in" result="glow"/>
            <feMerge>
              <feMergeNode in="glow"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Connection lines */}
        {connections.map((conn, idx) => {
          const from = getNodePos(conn.from);
          const to = getNodePos(conn.to);
          if (!from || !to) return null;

          // Calculate control point for curved line
          const midX = (from.x + to.x) / 2;
          const midY = Math.min(from.y, to.y) - Math.abs(to.x - from.x) * 0.12;

          const pathId = `conn-${idx}`;

          return (
            <g key={pathId}>
              {/* Main connection line */}
              <path
                id={pathId}
                d={`M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`}
                fill="none"
                stroke="#CCFF00"
                strokeWidth="0.25"
                strokeOpacity="0.5"
                filter="url(#lineGlowMap)"
              />
              {/* Animated data packet */}
              <circle r="0.5" fill="#CCFF00" filter="url(#nodeGlowMap)">
                <animateMotion
                  dur={`${2.5 + idx * 0.4}s`}
                  repeatCount="indefinite"
                  begin={`${idx * 0.5}s`}
                >
                  <mpath href={`#${pathId}`} />
                </animateMotion>
              </circle>
            </g>
          );
        })}

        {/* Node markers */}
        {nodes.map((node) => (
          <g key={node.id}>
            {/* Outer pulse ring */}
            <circle cx={node.x} cy={node.y} r="1.5" fill="none" stroke="#CCFF00" strokeWidth="0.15" opacity="0.5">
              <animate attributeName="r" values="1.5;3;1.5" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
            </circle>
            {/* Middle glow */}
            <circle cx={node.x} cy={node.y} r="1.2" fill="rgba(204, 255, 0, 0.25)">
              <animate attributeName="r" values="1.2;1.6;1.2" dur="1.5s" repeatCount="indefinite" />
            </circle>
            {/* Core node */}
            <circle cx={node.x} cy={node.y} r="1" fill="#CCFF00" filter="url(#nodeGlowMap)" />
            {/* Inner highlight */}
            <circle cx={node.x - 0.25} cy={node.y - 0.25} r="0.35" fill="rgba(255,255,255,0.5)" />
          </g>
        ))}
      </svg>

      {/* Interactive hover zones for nodes */}
      {nodes.map((node) => (
        <div
          key={`hover-${node.id}`}
          className="absolute cursor-pointer z-20"
          style={{ 
            left: `${node.x}%`, 
            top: `${node.y}%`,
            width: '50px',
            height: '50px',
            transform: 'translate(-50%, -50%)',
          }}
          onMouseEnter={() => setHoveredNode(node.id)}
          onMouseLeave={() => setHoveredNode(null)}
        >
          {/* Tooltip */}
          {hoveredNode === node.id && (
            <motion.div
              initial={{ opacity: 0, y: 5, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="absolute left-1/2 -translate-x-1/2 bottom-full mb-4 px-4 py-3 rounded-lg bg-[#0a0a0a]/95 backdrop-blur-sm border border-primary/50 whitespace-nowrap z-30"
              style={{ boxShadow: '0 0 30px rgba(204, 255, 0, 0.4)' }}
            >
              <div className="font-mono text-sm text-foreground font-bold">{node.label}</div>
              <div className="font-mono text-xs text-primary mt-1">PING: {node.ping}</div>
              <div className="font-mono text-[10px] text-muted-foreground mt-0.5">NODE-{node.id}-1</div>
              <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-primary/50" />
            </motion.div>
          )}
        </div>
      ))}

      {/* Legend */}
      <div className="absolute bottom-5 left-5 flex items-center gap-6 font-mono text-[11px] text-muted-foreground z-10">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" style={{ boxShadow: '0 0 12px rgba(204, 255, 0, 0.9)' }} />
          <span>ACTIVE NODE</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
          <span>COVERAGE</span>
        </div>
      </div>

      {/* Status overlay */}
      <div className="absolute bottom-5 right-5 font-mono text-xs flex items-center gap-2 bg-[#0a0a0a]/90 px-4 py-2 rounded border border-primary/40 z-10">
        <span className="text-primary font-bold">{nodes.length} NODES ACTIVE</span>
        <span className="text-muted-foreground">/</span>
        <span className="text-primary">GLOBAL COVERAGE INITIATED</span>
      </div>

      {/* Top left data overlay */}
      <div className="absolute top-5 left-5 font-mono text-[11px] text-muted-foreground space-y-1 z-10">
        <div>NODES_ONLINE: <span className="text-primary font-bold">{nodes.length}</span></div>
        <div>UPTIME: <span className="text-primary font-bold">99.9%</span></div>
      </div>

      {/* Top right LIVE indicator */}
      <div className="absolute top-5 right-5 flex items-center gap-2 z-10">
        <motion.div
          className="w-2.5 h-2.5 rounded-full bg-primary"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ boxShadow: '0 0 8px rgba(204, 255, 0, 0.8)' }}
        />
        <span className="font-mono text-xs text-primary font-bold">LIVE</span>
      </div>
    </div>
  );
};


const Infrastructure = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden bg-[#080808]">
        {/* Grid Background */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(204, 255, 0, 0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(204, 255, 0, 0.02) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection>
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium mb-6"
              >
                <Server className="h-4 w-4" />
                <span className="font-mono text-xs tracking-widest">NETWORK_MONITORING</span>
              </motion.div>
              
              <h1 className="text-4xl md:text-6xl font-bold font-['Montserrat'] mb-4">
                Инфраструктура <span className="text-gradient-primary">3LAB</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-mono">
                Глобальная сеть высокопроизводительных узлов с круглосуточным мониторингом
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Interactive World Map */}
      <section className="py-12 relative bg-[#080808]">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-6xl mx-auto">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-mono text-sm text-muted-foreground tracking-widest">
                  GLOBAL_NETWORK_MAP
                </h2>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="font-mono text-xs text-primary">LIVE</span>
                </div>
              </div>
              <WorldMap />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Main Content: Server Grid + Terminal */}
      <section className="py-16 relative bg-[#080808]">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Server Nodes Grid */}
            <div className="lg:col-span-2">
              <AnimatedSection>
                <div className="mb-6">
                  <h2 className="font-mono text-sm text-muted-foreground tracking-widest mb-2">
                    TACTICAL_SERVER_LIST
                  </h2>
                  <p className="text-xs text-muted-foreground font-mono">
                    Статус и нагрузка всех активных узлов в реальном времени
                  </p>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  {serverNodes.map((node, index) => (
                    <ServerNodeCard key={node.id} node={node} index={index} />
                  ))}
                </div>
              </AnimatedSection>
            </div>

            {/* Live Terminal Sidebar */}
            <div className="lg:col-span-1">
              <AnimatedSection delay={0.2}>
                <div className="lg:sticky lg:top-24">
                  <div className="mb-6">
                    <h2 className="font-mono text-sm text-muted-foreground tracking-widest mb-2">
                      SYSTEM_LOG
                    </h2>
                  </div>
                  <LiveTerminal />
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Hardware Specs Link Block */}
      <section className="py-16 relative bg-[#080808]">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <motion.div 
              className="max-w-4xl mx-auto p-8 rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/5 to-transparent relative overflow-hidden group"
              whileHover={{ borderColor: 'rgba(255, 153, 0, 0.5)' }}
            >
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[100px] group-hover:bg-accent/20 transition-all" />
              
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
                    <Cpu className="w-8 h-8 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-['Montserrat'] text-foreground mb-1">
                      Кастомное железо NODE-1
                    </h3>
                    <p className="text-sm text-muted-foreground font-mono">
                      Все узлы работают на идентичной архитектуре — ARM64/x86 гибрид с аппаратным шифрованием
                    </p>
                  </div>
                </div>
                
                <Link to="/node-1">
                  <motion.button
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-accent-foreground font-bold font-mono text-sm transition-all"
                    whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(255, 153, 0, 0.4)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Подробнее о NODE-1
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* Stats Footer */}
      <section className="py-16 relative bg-[#080808] border-t border-primary/10">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { label: 'UPTIME SLA', value: '99.98%', color: 'text-primary' },
                { label: 'ACTIVE NODES', value: '6', color: 'text-accent' },
                { label: 'AVG LATENCY', value: '52ms', color: 'text-primary' },
                { label: 'BANDWIDTH', value: '100Gbps', color: 'text-accent' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-6 rounded-xl border border-border bg-card/30"
                >
                  <div className={`font-mono text-3xl font-bold ${stat.color} mb-2`}>
                    {stat.value}
                  </div>
                  <div className="font-mono text-[10px] text-muted-foreground tracking-widest">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
};

export default Infrastructure;