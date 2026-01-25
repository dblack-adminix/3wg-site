import { useState, useEffect, useRef } from 'react';
import { Server, Globe, ExternalLink, Cpu, HardDrive, Activity, Terminal, ArrowRight } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { AnimatedSection } from '@/components/AnimatedSection';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

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

// World Map with Solid Continents
const WorldMap = () => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Node positions (percentage based) - Netherlands, Germany, Finland, USA East, Turkey
  const nodes = [
    { id: 'NL', x: 48, y: 28, label: 'Amsterdam', ping: '28ms' },
    { id: 'DE', x: 51, y: 32, label: 'Frankfurt', ping: '22ms' },
    { id: 'FI', x: 55, y: 22, label: 'Helsinki', ping: '32ms' },
    { id: 'US', x: 22, y: 35, label: 'New York', ping: '85ms' },
    { id: 'TR', x: 58, y: 38, label: 'Istanbul', ping: '45ms' },
  ];

  // Connection paths between nodes (curved lines)
  const connections = [
    { from: 'US', to: 'NL' },
    { from: 'NL', to: 'DE' },
    { from: 'DE', to: 'FI' },
    { from: 'NL', to: 'FI' },
    { from: 'DE', to: 'TR' },
  ];

  const getNodePos = (id: string) => nodes.find(n => n.id === id);

  return (
    <div className="relative w-full aspect-[2.5/1] min-h-[320px] rounded-xl border border-primary/30 bg-[#080808] overflow-hidden">
      {/* Tactical corner frames */}
      <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-primary/60" />
      <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-primary/60" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-primary/60" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-primary/60" />

      {/* Inner tactical frame */}
      <div className="absolute top-2 left-2 w-4 h-4 border-l border-t border-primary/30" />
      <div className="absolute top-2 right-2 w-4 h-4 border-r border-t border-primary/30" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-l border-b border-primary/30" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-r border-b border-primary/30" />

      {/* SVG World Map */}
      <svg 
        className="absolute inset-0 w-full h-full" 
        viewBox="0 0 1000 500" 
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Glow filter for nodes */}
          <filter id="nodeGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feFlood floodColor="#CCFF00" floodOpacity="0.8" result="color"/>
            <feComposite in="color" in2="blur" operator="in" result="glow"/>
            <feMerge>
              <feMergeNode in="glow"/>
              <feMergeNode in="glow"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Line glow filter */}
          <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feFlood floodColor="#CCFF00" floodOpacity="0.5" result="color"/>
            <feComposite in="color" in2="blur" operator="in" result="glow"/>
            <feMerge>
              <feMergeNode in="glow"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Gradient for connection lines */}
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#CCFF00" stopOpacity="0.1"/>
            <stop offset="50%" stopColor="#CCFF00" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#CCFF00" stopOpacity="0.1"/>
          </linearGradient>
        </defs>

        {/* World Map Continents - Solid shapes */}
        <g fill="#1A1A1A" stroke="#2A2A2A" strokeWidth="0.5">
          {/* North America */}
          <path d="M 50 80 L 80 60 L 120 50 L 160 45 L 200 50 L 240 55 L 260 70 L 280 90 L 290 120 L 280 150 L 260 180 L 240 200 L 220 210 L 200 200 L 180 195 L 160 200 L 140 210 L 120 200 L 100 180 L 80 160 L 60 140 L 50 120 Z" />
          {/* Greenland */}
          <path d="M 320 40 L 360 35 L 400 40 L 420 60 L 410 90 L 380 100 L 340 95 L 320 70 Z" />
          {/* South America */}
          <path d="M 220 250 L 260 240 L 300 250 L 320 280 L 330 320 L 320 360 L 300 400 L 280 430 L 260 450 L 240 440 L 230 400 L 220 360 L 210 320 L 215 280 Z" />
          {/* Europe */}
          <path d="M 440 100 L 480 90 L 520 95 L 560 100 L 580 120 L 570 150 L 540 170 L 500 175 L 460 165 L 430 150 L 420 130 L 430 110 Z" />
          {/* UK & Ireland */}
          <path d="M 420 110 L 440 105 L 450 120 L 445 140 L 425 145 L 415 130 Z" />
          {/* Africa */}
          <path d="M 440 200 L 490 190 L 540 195 L 580 210 L 600 250 L 610 300 L 600 350 L 580 400 L 550 430 L 510 440 L 470 430 L 440 400 L 420 350 L 415 300 L 420 250 Z" />
          {/* Russia / Northern Asia */}
          <path d="M 560 80 L 620 70 L 700 65 L 780 70 L 850 80 L 900 90 L 920 110 L 910 140 L 880 160 L 820 170 L 750 165 L 680 160 L 620 155 L 580 145 L 560 120 Z" />
          {/* Middle East */}
          <path d="M 560 180 L 600 175 L 640 185 L 660 210 L 650 240 L 620 260 L 580 255 L 550 230 L 545 200 Z" />
          {/* India */}
          <path d="M 660 220 L 700 210 L 740 230 L 750 280 L 730 330 L 700 350 L 670 330 L 655 280 L 660 240 Z" />
          {/* Southeast Asia */}
          <path d="M 750 260 L 790 250 L 830 260 L 860 290 L 850 330 L 820 350 L 780 340 L 760 310 L 755 280 Z" />
          {/* China / East Asia */}
          <path d="M 760 150 L 820 140 L 880 150 L 910 180 L 900 220 L 860 250 L 810 260 L 770 240 L 750 200 L 755 170 Z" />
          {/* Japan */}
          <path d="M 900 160 L 920 155 L 935 170 L 930 200 L 910 220 L 895 210 L 895 180 Z" />
          {/* Australia */}
          <path d="M 800 380 L 860 370 L 920 385 L 950 420 L 940 470 L 900 495 L 850 490 L 810 460 L 795 420 Z" />
          {/* Indonesia */}
          <path d="M 780 360 L 820 355 L 860 365 L 880 380 L 860 395 L 820 390 L 790 380 Z" />
        </g>

        {/* Connection lines */}
        {connections.map((conn, idx) => {
          const from = getNodePos(conn.from);
          const to = getNodePos(conn.to);
          if (!from || !to) return null;

          const x1 = from.x * 10;
          const y1 = from.y * 10;
          const x2 = to.x * 10;
          const y2 = to.y * 10;

          // Calculate control point for curved line
          const midX = (x1 + x2) / 2;
          const midY = (y1 + y2) / 2 - Math.abs(x2 - x1) * 0.15;

          const pathId = `connection-${idx}`;

          return (
            <g key={pathId}>
              {/* Main connection line */}
              <path
                id={pathId}
                d={`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`}
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="2"
                filter="url(#lineGlow)"
              />
              {/* Animated data packet */}
              <circle r="4" fill="#CCFF00" filter="url(#nodeGlow)">
                <animateMotion
                  dur={`${2 + idx * 0.5}s`}
                  repeatCount="indefinite"
                  begin={`${idx * 0.3}s`}
                >
                  <mpath href={`#${pathId}`} />
                </animateMotion>
              </circle>
            </g>
          );
        })}

        {/* Node markers */}
        {nodes.map((node) => {
          const x = node.x * 10;
          const y = node.y * 10;

          return (
            <g key={node.id}>
              {/* Outer pulse ring */}
              <circle cx={x} cy={y} r="12" fill="none" stroke="#CCFF00" strokeWidth="1" opacity="0.4">
                <animate attributeName="r" values="12;25;12" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
              </circle>
              {/* Middle glow */}
              <circle cx={x} cy={y} r="10" fill="rgba(204, 255, 0, 0.2)">
                <animate attributeName="r" values="10;14;10" dur="1.5s" repeatCount="indefinite" />
              </circle>
              {/* Core node */}
              <circle cx={x} cy={y} r="8" fill="#CCFF00" filter="url(#nodeGlow)" />
              {/* Inner highlight */}
              <circle cx={x - 2} cy={y - 2} r="3" fill="rgba(255,255,255,0.4)" />
            </g>
          );
        })}
      </svg>

      {/* Interactive hover zones for nodes */}
      {nodes.map((node) => (
        <div
          key={`hover-${node.id}`}
          className="absolute cursor-pointer z-10"
          style={{ 
            left: `${node.x}%`, 
            top: `${node.y}%`,
            width: '40px',
            height: '40px',
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
              className="absolute left-1/2 -translate-x-1/2 bottom-full mb-4 px-4 py-3 rounded-lg bg-[#0a0a0a]/95 backdrop-blur-sm border border-primary/50 whitespace-nowrap z-20"
              style={{ boxShadow: '0 0 25px rgba(204, 255, 0, 0.3)' }}
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
      <div className="absolute bottom-4 left-4 flex items-center gap-6 font-mono text-[11px] text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" style={{ boxShadow: '0 0 10px rgba(204, 255, 0, 0.8)' }} />
          <span>ACTIVE NODE</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
          <span>COVERAGE</span>
        </div>
      </div>

      {/* Status overlay */}
      <div className="absolute bottom-4 right-4 font-mono text-xs text-primary flex items-center gap-3 bg-[#0a0a0a]/80 px-3 py-2 rounded border border-primary/30">
        <span className="text-primary font-bold">{nodes.length} NODES ACTIVE</span>
        <span className="text-muted-foreground">/</span>
        <span className="text-primary">GLOBAL COVERAGE INITIATED</span>
      </div>

      {/* Top left data overlay */}
      <div className="absolute top-4 left-4 font-mono text-[10px] text-muted-foreground space-y-1">
        <div>NODES_ONLINE: <span className="text-primary">{nodes.length}</span></div>
        <div>UPTIME: <span className="text-primary">99.9%</span></div>
      </div>

      {/* Top right LIVE indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <motion.div
          className="w-2 h-2 rounded-full bg-primary"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <span className="font-mono text-xs text-primary">LIVE</span>
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