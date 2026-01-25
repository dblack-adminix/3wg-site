import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Key, Settings, Home, Wifi, Signal,
  Plus, User, ChevronRight
} from 'lucide-react';

// Node data with signal strength
const nodes = [
  { id: 'NL', code: 'NL', name: 'AMSTERDAM', status: 'active', signal: 4, ping: 24 },
  { id: 'DE', code: 'DE', name: 'FRANKFURT', status: 'available', signal: 5, ping: 18 },
  { id: 'FI', code: 'FI', name: 'HELSINKI', status: 'available', signal: 3, ping: 32 },
  { id: 'US', code: 'US', name: 'NEW YORK', status: 'available', signal: 2, ping: 85 },
  { id: 'TR', code: 'TR', name: 'ISTANBUL', status: 'available', signal: 4, ping: 45 },
];

// Signal strength component
const SignalStrength = ({ level }: { level: number }) => {
  return (
    <div className="flex items-end gap-0.5 h-4">
      {[1, 2, 3, 4, 5].map((bar) => (
        <div
          key={bar}
          className={`w-1 rounded-sm transition-all ${
            bar <= level ? 'bg-primary' : 'bg-white/20'
          }`}
          style={{ height: `${bar * 3 + 2}px` }}
        />
      ))}
    </div>
  );
};

// Haptic feedback simulation
const triggerHaptic = () => {
  // Visual feedback - could be enhanced with actual haptic API
  if (navigator.vibrate) {
    navigator.vibrate(10);
  }
};

export const MobileDashboard = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'configs' | 'security' | 'settings'>('home');
  const [activeNode, setActiveNode] = useState('NL');
  const [subscriptionProgress] = useState(50); // 14 days out of 28

  const handleNodeSelect = useCallback((nodeId: string) => {
    triggerHaptic();
    setActiveNode(nodeId);
  }, []);

  const handleTabChange = useCallback((tab: typeof activeTab) => {
    triggerHaptic();
    setActiveTab(tab);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Container - Max width for desktop to look like mobile app */}
      <div className="max-w-[480px] mx-auto min-h-screen flex flex-col relative">
        
        {/* App Header - Fixed Top */}
        <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-sm border-b border-white/10 px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left: Avatar & User ID */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-primary/20 border border-primary/40 flex items-center justify-center overflow-hidden">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground tracking-wider">USER_ID</div>
                <div className="text-sm font-bold text-primary tracking-wider">774129</div>
              </div>
            </div>

            {/* Right: Network Status */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-primary/30 bg-primary/5">
              <motion.div
                className="w-2 h-2 rounded-full bg-primary"
                animate={{ 
                  boxShadow: [
                    '0 0 4px rgba(204, 255, 0, 0.4)',
                    '0 0 12px rgba(204, 255, 0, 0.8)',
                    '0 0 4px rgba(204, 255, 0, 0.4)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-[10px] text-primary font-bold tracking-wider">[ PROTECTED ]</span>
            </div>
          </div>
        </header>

        {/* Main Content - Scrollable */}
        <main className="flex-1 overflow-y-auto pb-24 px-4 py-6 space-y-6">
          
          {/* Balance Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded border border-white/10"
            style={{
              background: 'linear-gradient(180deg, #1a1a1a 0%, #000000 100%)',
            }}
          >
            <div className="p-6">
              <div className="text-[10px] text-muted-foreground tracking-wider mb-2">BALANCE</div>
              <div className="text-4xl font-bold text-white mb-1 tracking-tight">
                15.50 <span className="text-lg text-muted-foreground">USDT</span>
              </div>
              <div className="text-[10px] text-muted-foreground tracking-wider">≈ $15.50 USD</div>
            </div>

            {/* Deposit Button */}
            <motion.button
              onClick={() => triggerHaptic()}
              className="w-full py-4 bg-primary text-black font-bold text-sm tracking-widest flex items-center justify-center gap-2 transition-all hover:bg-primary/90"
              whileTap={{ scale: 0.98 }}
              style={{ borderRadius: 0 }}
            >
              <Plus className="w-4 h-4" />
              DEPOSIT
            </motion.button>

            {/* Decorative grid */}
            <div 
              className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none"
              style={{
                backgroundImage: 'linear-gradient(rgba(204,255,0,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(204,255,0,0.3) 1px, transparent 1px)',
                backgroundSize: '8px 8px',
              }}
            />
          </motion.div>

          {/* Active Subscription Widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-5 rounded border border-accent/30 bg-accent/5"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-[10px] text-muted-foreground tracking-wider mb-1">PROTOCOL</div>
                <div className="text-sm font-bold text-accent tracking-wider">AMNEZIA_WG</div>
              </div>
              <Shield className="w-6 h-6 text-accent" />
            </div>

            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-muted-foreground tracking-wider">REMAINING</span>
                <span className="text-xs font-bold text-accent">14 DAYS</span>
              </div>
              
              {/* Progress Bar */}
              <div className="h-2 bg-white/10 rounded-sm overflow-hidden">
                <motion.div
                  className="h-full bg-accent rounded-sm"
                  initial={{ width: 0 }}
                  animate={{ width: `${subscriptionProgress}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  style={{
                    boxShadow: '0 0 10px rgba(255, 153, 0, 0.5)',
                  }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <span className="text-[10px] text-muted-foreground tracking-wider">EXPIRES</span>
              <span className="text-xs text-muted-foreground">2025-02-08</span>
            </div>
          </motion.div>

          {/* Node Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-[10px] text-muted-foreground tracking-wider">NODE_MANAGEMENT</div>
              <Wifi className="w-4 h-4 text-muted-foreground" />
            </div>

            <div className="space-y-2">
              {nodes.map((node, index) => (
                <motion.button
                  key={node.id}
                  onClick={() => handleNodeSelect(node.id)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className={`w-full p-4 rounded border transition-all text-left flex items-center gap-4 ${
                    activeNode === node.id
                      ? 'border-primary bg-primary/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    boxShadow: activeNode === node.id ? '0 0 20px rgba(204, 255, 0, 0.15)' : 'none',
                  }}
                >
                  {/* Country Code */}
                  <div className={`w-10 h-10 rounded flex items-center justify-center font-bold text-sm ${
                    activeNode === node.id 
                      ? 'bg-primary text-black' 
                      : 'bg-white/10 text-white'
                  }`}>
                    {node.code}
                  </div>

                  {/* Node Info */}
                  <div className="flex-1">
                    <div className="text-sm font-bold tracking-wider">{node.name}</div>
                    <div className="text-[10px] text-muted-foreground tracking-wider">
                      PING: {node.ping}ms
                    </div>
                  </div>

                  {/* Signal Strength */}
                  <SignalStrength level={node.signal} />

                  {/* Status */}
                  <div className={`px-2 py-1 rounded text-[10px] font-bold tracking-wider ${
                    activeNode === node.id
                      ? 'bg-primary text-black'
                      : 'bg-white/10 text-muted-foreground'
                  }`}>
                    {activeNode === node.id ? 'ACTIVE' : 'CONNECT'}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 gap-3"
          >
            <motion.button
              onClick={() => triggerHaptic()}
              className="p-4 rounded border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-left"
              whileTap={{ scale: 0.98 }}
            >
              <Key className="w-5 h-5 text-primary mb-2" />
              <div className="text-xs font-bold tracking-wider">GET_CONFIG</div>
              <div className="text-[10px] text-muted-foreground mt-1">Download .conf</div>
            </motion.button>

            <motion.button
              onClick={() => triggerHaptic()}
              className="p-4 rounded border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-left"
              whileTap={{ scale: 0.98 }}
            >
              <Signal className="w-5 h-5 text-accent mb-2" />
              <div className="text-xs font-bold tracking-wider">SPEED_TEST</div>
              <div className="text-[10px] text-muted-foreground mt-1">Check latency</div>
            </motion.button>
          </motion.div>

          {/* Connection Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-3 gap-3"
          >
            {[
              { label: 'UPTIME', value: '14d 6h', color: 'text-primary' },
              { label: 'DATA', value: '124 GB', color: 'text-accent' },
              { label: 'SESSIONS', value: '847', color: 'text-primary' },
            ].map((stat, index) => (
              <div key={stat.label} className="p-3 rounded border border-white/10 bg-white/5 text-center">
                <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-[9px] text-muted-foreground tracking-wider mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </main>

        {/* Bottom Navigation - Fixed Dock */}
        <nav className="fixed bottom-0 left-0 right-0 z-50">
          <div className="max-w-[480px] mx-auto bg-black/95 backdrop-blur-sm border-t border-white/10">
            <div className="flex items-stretch">
              {[
                { id: 'home', icon: Home, label: 'Home' },
                { id: 'configs', icon: Key, label: 'Configs' },
                { id: 'security', icon: Shield, label: 'Security' },
                { id: 'settings', icon: Settings, label: 'Settings' },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => handleTabChange(item.id as typeof activeTab)}
                    className={`flex-1 py-4 flex flex-col items-center gap-1 transition-all ${
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      animate={{
                        filter: isActive ? 'drop-shadow(0 0 8px rgba(204, 255, 0, 0.8))' : 'none',
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.div>
                    <span className="text-[9px] font-bold tracking-wider">{item.label.toUpperCase()}</span>
                    
                    {/* Active indicator */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          exit={{ scaleX: 0 }}
                          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full"
                          style={{ boxShadow: '0 0 10px rgba(204, 255, 0, 0.8)' }}
                        />
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </div>
            
            {/* Safe area spacer for iOS */}
            <div className="h-safe-area-inset-bottom bg-black" />
          </div>
        </nav>

        {/* Scan lines overlay */}
        <div 
          className="fixed inset-0 pointer-events-none opacity-[0.015] z-[100]"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
          }}
        />
      </div>
    </div>
  );
};
