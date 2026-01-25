import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/Layout';
import { AnimatedSection } from '@/components/AnimatedSection';
import { Download, Copy, Check, Shield, Zap, Globe, Terminal, Lock, Radio } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import wireguardLogo from '@/assets/wireguard-logo.svg';
import amneziaLogo from '@/assets/amneziawg-logo.webp';

// Location data with simulated latency
const locations = [
  { code: 'AMS', name: 'Amsterdam', country: 'NL', flag: '🇳🇱', latency: 24 },
  { code: 'FRA', name: 'Frankfurt', country: 'DE', flag: '🇩🇪', latency: 18 },
  { code: 'HEL', name: 'Helsinki', country: 'FI', flag: '🇫🇮', latency: 32 },
  { code: 'IST', name: 'Istanbul', country: 'TR', flag: '🇹🇷', latency: 45 },
  { code: 'NYC', name: 'New York', country: 'US', flag: '🇺🇸', latency: 85 },
  { code: 'SIN', name: 'Singapore', country: 'SG', flag: '🇸🇬', latency: 120 },
];

// Terminal generation messages
const generationSteps = [
  { text: '[ INITIALIZING SECURE CHANNEL... ]', delay: 300 },
  { text: '[ GENERATING PRIVATE KEY... ]', delay: 600 },
  { text: '[ CREATING PUBLIC KEY PAIR... ]', delay: 400 },
  { text: '[ ENCRYPTING CONFIGURATION... ]', delay: 500 },
  { text: '[ ESTABLISHING TUNNEL PARAMS... ]', delay: 350 },
  { text: '[ HANDSHAKE_INITIALIZED ]', delay: 400 },
  { text: '[ APPLYING DPI OBFUSCATION... ]', delay: 450 },
  { text: '[ CONFIG_READY ]', delay: 300 },
];

// Mock config output
const generateMockConfig = (protocol: 'wireguard' | 'amnezia', location: typeof locations[0]) => `[Interface]
PrivateKey = ${btoa(Math.random().toString()).slice(0, 44)}=
Address = 10.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}/32
DNS = 1.1.1.1, 8.8.8.8
${protocol === 'amnezia' ? `
# AmneziaWG Stealth Settings
Jc = 4
Jmin = 40
Jmax = 70
S1 = 0
S2 = 0
H1 = 1
H2 = 2
H3 = 3
H4 = 4
` : ''}
[Peer]
PublicKey = ${btoa(Math.random().toString()).slice(0, 44)}=
AllowedIPs = 0.0.0.0/0, ::/0
Endpoint = ${location.code.toLowerCase()}.3lab.pro:51820
PersistentKeepalive = 25`;

const Generator = () => {
  const { toast } = useToast();
  const [protocol, setProtocol] = useState<'wireguard' | 'amnezia'>('wireguard');
  const [selectedLocation, setSelectedLocation] = useState<typeof locations[0] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [generatedConfig, setGeneratedConfig] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [screenFlicker, setScreenFlicker] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Flicker effect on button press
  const triggerFlicker = () => {
    setScreenFlicker(true);
    setTimeout(() => setScreenFlicker(false), 100);
  };

  // Handle generation
  const handleGenerate = async () => {
    if (!selectedLocation) return;
    
    triggerFlicker();
    setIsGenerating(true);
    setGenerationProgress(0);
    setTerminalLines([]);
    setGeneratedConfig(null);

    // Simulate terminal output
    for (let i = 0; i < generationSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, generationSteps[i].delay));
      setTerminalLines(prev => [...prev, generationSteps[i].text]);
      setGenerationProgress(((i + 1) / generationSteps.length) * 100);
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    setGeneratedConfig(generateMockConfig(protocol, selectedLocation));
    setIsGenerating(false);
  };

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLines]);

  // Copy to clipboard
  const handleCopy = () => {
    if (generatedConfig) {
      navigator.clipboard.writeText(generatedConfig);
      setCopied(true);
      triggerFlicker();
      toast({
        title: "SUCCESS: COPIED TO SECURE BUFFER",
        description: "Configuration has been copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Download config
  const handleDownload = () => {
    if (generatedConfig && selectedLocation) {
      triggerFlicker();
      const blob = new Blob([generatedConfig], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `3lab_${protocol}_${selectedLocation.code.toLowerCase()}.conf`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const isAmnezia = protocol === 'amnezia';

  return (
    <Layout>
      {/* Screen flicker overlay */}
      <AnimatePresence>
        {screenFlicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-50 pointer-events-none"
          />
        )}
      </AnimatePresence>

      <section 
        className="min-h-screen pt-28 pb-20 relative overflow-hidden transition-all duration-500"
        style={{
          background: isAmnezia 
            ? 'radial-gradient(ellipse at center, rgba(255, 153, 0, 0.05) 0%, #080808 70%)' 
            : '#080808',
        }}
      >
        {/* Grain texture overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Scanlines */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection>
            {/* Header */}
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-6"
              >
                <Terminal className="h-4 w-4 text-primary" />
                <span className="font-mono text-xs text-primary tracking-widest">CONFIG_GENERATOR</span>
              </motion.div>
              
              <h1 className="text-4xl md:text-5xl font-bold font-['Montserrat'] mb-4">
                Генератор <span className={isAmnezia ? 'text-accent' : 'text-primary'}>Доступа</span>
              </h1>
              <p className="text-muted-foreground font-mono text-sm max-w-lg mx-auto">
                Создайте персональный конфигурационный файл для подключения к защищенной сети 3LAB
              </p>
            </div>

            {/* Main Terminal Panel */}
            <motion.div 
              className="max-w-3xl mx-auto rounded-2xl border-2 overflow-hidden backdrop-blur-sm transition-all duration-500"
              style={{
                borderColor: isAmnezia ? 'rgba(255, 153, 0, 0.4)' : 'rgba(204, 255, 0, 0.3)',
                boxShadow: isAmnezia 
                  ? '0 0 60px rgba(255, 153, 0, 0.15), inset 0 0 60px rgba(255, 153, 0, 0.03)' 
                  : '0 0 60px rgba(204, 255, 0, 0.1), inset 0 0 60px rgba(204, 255, 0, 0.02)',
                background: 'rgba(10, 10, 10, 0.95)',
              }}
            >
              {/* Terminal Header */}
              <div 
                className="flex items-center gap-3 px-5 py-3 border-b transition-colors duration-500"
                style={{ borderColor: isAmnezia ? 'rgba(255, 153, 0, 0.3)' : 'rgba(204, 255, 0, 0.2)' }}
              >
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="font-mono text-xs text-muted-foreground ml-2">
                  3LAB://secure-terminal
                </span>
                <div className="ml-auto flex items-center gap-2">
                  <Lock className="w-3 h-3 text-primary" />
                  <span className="font-mono text-[10px] text-primary">ENCRYPTED</span>
                </div>
              </div>

              {/* Terminal Body */}
              <div className="p-6 md:p-8 space-y-8">
                
                {/* Step 1: Protocol Selection */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                    <span className={isAmnezia ? 'text-accent' : 'text-primary'}>01</span>
                    <span>SELECT_PROTOCOL</span>
                  </div>

                  <div className="flex items-center justify-center gap-4">
                    {/* WireGuard Option */}
                    <motion.button
                      onClick={() => { setProtocol('wireguard'); triggerFlicker(); }}
                      className={`relative flex-1 p-5 rounded-xl border-2 transition-all duration-300 ${
                        protocol === 'wireguard' 
                          ? 'border-[#B10000] bg-[#B10000]/10' 
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        boxShadow: protocol === 'wireguard' ? '0 0 30px rgba(177, 0, 0, 0.3)' : 'none',
                      }}
                    >
                      <img src={wireguardLogo} alt="WireGuard" className="h-8 mx-auto mb-3 opacity-90" />
                      <div className="font-mono text-xs text-center">
                        <div className={protocol === 'wireguard' ? 'text-[#ff4444]' : 'text-foreground'}>WireGuard</div>
                        <div className="text-muted-foreground text-[10px] mt-1">High Speed / Standard</div>
                      </div>
                      {protocol === 'wireguard' && (
                        <motion.div
                          layoutId="protocolIndicator"
                          className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#B10000] flex items-center justify-center"
                        >
                          <Check className="w-2.5 h-2.5 text-white" />
                        </motion.div>
                      )}
                    </motion.button>

                    {/* Toggle in the middle */}
                    <div className="flex flex-col items-center gap-2">
                      <Radio className="w-4 h-4 text-muted-foreground" />
                    </div>

                    {/* AmneziaWG Option */}
                    <motion.button
                      onClick={() => { setProtocol('amnezia'); triggerFlicker(); }}
                      className={`relative flex-1 p-5 rounded-xl border-2 transition-all duration-300 ${
                        protocol === 'amnezia' 
                          ? 'border-accent bg-accent/10' 
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        boxShadow: protocol === 'amnezia' ? '0 0 30px rgba(255, 153, 0, 0.3)' : 'none',
                      }}
                    >
                      <img src={amneziaLogo} alt="AmneziaWG" className="h-8 mx-auto mb-3 opacity-90" />
                      <div className="font-mono text-xs text-center">
                        <div className={protocol === 'amnezia' ? 'text-accent' : 'text-foreground'}>AmneziaWG</div>
                        <div className="text-muted-foreground text-[10px] mt-1">Deep Stealth / Zero Visibility</div>
                      </div>
                      {protocol === 'amnezia' && (
                        <motion.div
                          layoutId="protocolIndicator"
                          className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent flex items-center justify-center"
                        >
                          <Check className="w-2.5 h-2.5 text-black" />
                        </motion.div>
                      )}
                    </motion.button>
                  </div>
                </div>

                {/* Step 2: Location Selection */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                    <span className={isAmnezia ? 'text-accent' : 'text-primary'}>02</span>
                    <span>SELECT_LOCATION</span>
                  </div>

                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {locations.map((loc) => (
                      <motion.button
                        key={loc.code}
                        onClick={() => { setSelectedLocation(loc); triggerFlicker(); }}
                        className={`relative p-3 rounded-lg border transition-all duration-300 ${
                          selectedLocation?.code === loc.code
                            ? isAmnezia 
                              ? 'border-accent bg-accent/10' 
                              : 'border-primary bg-primary/10'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          boxShadow: selectedLocation?.code === loc.code 
                            ? `0 0 20px ${isAmnezia ? 'rgba(255, 153, 0, 0.3)' : 'rgba(204, 255, 0, 0.3)'}` 
                            : 'none',
                        }}
                      >
                        <div className="text-xl mb-1">{loc.flag}</div>
                        <div className={`font-mono text-sm font-bold ${
                          selectedLocation?.code === loc.code 
                            ? isAmnezia ? 'text-accent' : 'text-primary' 
                            : 'text-foreground'
                        }`}>
                          {loc.code}
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  {/* Latency Display */}
                  <AnimatePresence>
                    {selectedLocation && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center justify-center gap-4 py-3 px-4 rounded-lg bg-white/5 border border-white/10"
                      >
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        <span className="font-mono text-xs text-muted-foreground">
                          {selectedLocation.name}, {selectedLocation.country}
                        </span>
                        <span className="text-muted-foreground">•</span>
                        <span className={`font-mono text-xs font-bold ${isAmnezia ? 'text-accent' : 'text-primary'}`}>
                          LATENCY: {selectedLocation.latency}ms
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Step 3: Generate Button */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                    <span className={isAmnezia ? 'text-accent' : 'text-primary'}>03</span>
                    <span>GENERATE_CONFIG</span>
                  </div>

                  <motion.button
                    onClick={handleGenerate}
                    disabled={!selectedLocation || isGenerating}
                    className={`w-full py-4 rounded-xl font-mono text-sm font-bold uppercase tracking-widest transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                      isAmnezia
                        ? 'bg-accent text-black hover:shadow-[0_0_40px_rgba(255,153,0,0.4)]'
                        : 'bg-primary text-black hover:shadow-[0_0_40px_rgba(204,255,0,0.4)]'
                    }`}
                    whileHover={{ scale: selectedLocation && !isGenerating ? 1.02 : 1 }}
                    whileTap={{ scale: selectedLocation && !isGenerating ? 0.98 : 1 }}
                  >
                    {isGenerating ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                          <Shield className="w-4 h-4" />
                        </motion.div>
                        GENERATING...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Zap className="w-4 h-4" />
                        GENERATE CONFIG
                      </span>
                    )}
                  </motion.button>
                </div>

                {/* Generation Terminal */}
                <AnimatePresence>
                  {(isGenerating || generatedConfig) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4"
                    >
                      {/* Terminal Output */}
                      {isGenerating && (
                        <div className="space-y-3">
                          <div 
                            ref={terminalRef}
                            className="h-40 overflow-y-auto rounded-lg bg-black/80 border border-white/10 p-4 font-mono text-xs space-y-1"
                          >
                            {terminalLines.map((line, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={isAmnezia ? 'text-accent' : 'text-primary'}
                              >
                                {line}
                              </motion.div>
                            ))}
                            <motion.span
                              animate={{ opacity: [1, 0, 1] }}
                              transition={{ duration: 0.8, repeat: Infinity }}
                              className={isAmnezia ? 'text-accent' : 'text-primary'}
                            >
                              █
                            </motion.span>
                          </div>

                          {/* ASCII Progress Bar */}
                          <div className="font-mono text-xs text-center">
                            <span className="text-muted-foreground">PROGRESS: [</span>
                            {Array.from({ length: 20 }).map((_, i) => (
                              <span
                                key={i}
                                className={i < Math.floor(generationProgress / 5) 
                                  ? isAmnezia ? 'text-accent' : 'text-primary' 
                                  : 'text-muted-foreground/30'
                                }
                              >
                                █
                              </span>
                            ))}
                            <span className="text-muted-foreground">] {Math.floor(generationProgress)}%</span>
                          </div>
                        </div>
                      )}

                      {/* Generated Config */}
                      {generatedConfig && !isGenerating && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-4"
                        >
                          {/* Config Output */}
                          <div 
                            className="rounded-lg border p-4 font-mono text-[11px] overflow-x-auto transition-colors duration-500"
                            style={{
                              borderColor: isAmnezia ? 'rgba(255, 153, 0, 0.3)' : 'rgba(204, 255, 0, 0.2)',
                              background: 'rgba(0, 0, 0, 0.6)',
                            }}
                          >
                            <pre className={`whitespace-pre-wrap ${isAmnezia ? 'text-accent/90' : 'text-primary/90'}`}>
                              {generatedConfig}
                            </pre>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-3">
                            <motion.button
                              onClick={handleDownload}
                              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border-2 font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                                isAmnezia
                                  ? 'border-accent text-accent hover:bg-accent/10'
                                  : 'border-primary text-primary hover:bg-primary/10'
                              }`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Download className="w-4 h-4" />
                              Download .conf
                            </motion.button>

                            <motion.button
                              onClick={handleCopy}
                              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                                copied
                                  ? 'bg-green-500 text-black'
                                  : isAmnezia
                                    ? 'bg-accent text-black hover:shadow-[0_0_20px_rgba(255,153,0,0.3)]'
                                    : 'bg-primary text-black hover:shadow-[0_0_20px_rgba(204,255,0,0.3)]'
                              }`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {copied ? (
                                <>
                                  <Check className="w-4 h-4" />
                                  COPIED!
                                </>
                              ) : (
                                <>
                                  <Copy className="w-4 h-4" />
                                  Copy to Clipboard
                                </>
                              )}
                            </motion.button>
                          </div>

                          {/* Security Notice */}
                          <div className="flex items-center justify-center gap-2 py-3 text-center">
                            <Shield className="w-4 h-4 text-muted-foreground" />
                            <span className="font-mono text-[10px] text-muted-foreground">
                              CONFIGURATION ENCRYPTED WITH AES-256 • EXPIRES IN 24H
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Bottom Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="max-w-3xl mx-auto mt-8 text-center"
            >
              <p className="font-mono text-[10px] text-muted-foreground">
                * Конфигурация генерируется локально. Приватный ключ никогда не покидает ваше устройство.
              </p>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
};

export default Generator;
