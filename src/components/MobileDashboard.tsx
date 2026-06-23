import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Key, Settings, Home, Wifi, Signal,
  Plus, User, ChevronRight, Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useUserKeys } from '@/hooks/useUserKeys';
import { useUserStats } from '@/hooks/useUserStats';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from '@/components/Logo';
import { MobileThemeToggle } from '@/components/MobileThemeToggle';

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
  
  // Загружаем реальные данные
  const { user } = useAuth();
  const { profile, isLoading: profileLoading } = useUserProfile();
  const { keys, isLoading: keysLoading } = useUserKeys();
  const { stats, isLoading: statsLoading, formatDataUsed, formatUptime } = useUserStats();

  // Вычисляем активный ключ
  const activeKey = keys.find(k => k.status === 'active');
  const daysRemaining = activeKey ? Math.ceil((new Date(activeKey.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0;
  const totalDays = 30; // Предполагаем 30 дней подписки
  const subscriptionProgress = daysRemaining > 0 ? (daysRemaining / totalDays) * 100 : 0;

  const handleNodeSelect = useCallback((nodeId: string) => {
    triggerHaptic();
    setActiveNode(nodeId);
  }, []);

  const handleTabChange = useCallback((tab: typeof activeTab) => {
    triggerHaptic();
    setActiveTab(tab);
  }, []);

  // Показываем загрузку
  if (profileLoading || keysLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground font-mono flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
          <div className="text-sm text-muted-foreground">Загрузка данных...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      {/* Container - Max width for desktop to look like mobile app */}
      <div className="max-w-[480px] mx-auto min-h-screen flex flex-col relative">
        
        {/* App Header - Fixed Top */}
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/10 px-4 py-3">
          {/* Logo and theme toggle */}
          <div className="flex items-center justify-between mb-4">
            <Logo className="scale-75" animated={false} />
            <MobileThemeToggle />
          </div>
          
          {/* User info and status below logo */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-primary/20 border border-primary/40 flex items-center justify-center overflow-hidden">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground tracking-wider">USER_ID</div>
                <div className="text-sm font-bold text-primary tracking-wider">{profile?.id || user?.id || '---'}</div>
              </div>
            </div>

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
            className="relative overflow-hidden rounded border border-border/10 mobile-dashboard-gradient"
          >
            <div className="p-6">
              <div className="text-[10px] text-muted-foreground tracking-wider mb-2">БАЛАНС</div>
              <div className="text-4xl font-bold text-white mb-1 tracking-tight">
                {profile?.balance?.toFixed(2) || '0.00'} <span className="text-lg text-muted-foreground">USDT</span>
              </div>
              <div className="text-[10px] text-muted-foreground tracking-wider">≈ ${profile?.balance?.toFixed(2) || '0.00'} USD</div>
            </div>

            {/* Deposit Button */}
            <Link to="/deposit" className="block">
              <motion.button
                onClick={() => triggerHaptic()}
                className="w-full py-4 bg-primary text-black font-bold text-sm tracking-widest flex items-center justify-center gap-2 transition-all hover:bg-primary/90"
                whileTap={{ scale: 0.98 }}
                style={{ borderRadius: 0 }}
              >
                <Plus className="w-4 h-4" />
                ПОПОЛНИТЬ
              </motion.button>
            </Link>

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
          {activeKey ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-5 rounded border border-accent/30 bg-accent/5"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-[10px] text-muted-foreground tracking-wider mb-1">ПРОТОКОЛ</div>
                  <div className="text-sm font-bold text-accent tracking-wider">{activeKey.protocol?.toUpperCase() || 'WIREGUARD'}</div>
                </div>
                <Shield className="w-6 h-6 text-accent" />
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-muted-foreground tracking-wider">ОСТАЛОСЬ</span>
                  <span className="text-xs font-bold text-accent">{daysRemaining} ДНЕЙ</span>
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
                <span className="text-[10px] text-muted-foreground tracking-wider">ИСТЕКАЕТ</span>
                <span className="text-xs text-muted-foreground">{new Date(activeKey.expires_at).toLocaleDateString()}</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-5 rounded border border-white/10 bg-white/5 text-center"
            >
              <Shield className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <div className="text-sm font-bold text-muted-foreground mb-2">Нет активных ключей</div>
              <Link to="/mobile-generator">
                <button className="px-4 py-2 bg-primary text-black font-bold text-xs rounded hover:bg-primary/90 transition-all">
                  Создать ключ
                </button>
              </Link>
            </motion.div>
          )}

          {/* Node Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-[10px] text-muted-foreground tracking-wider">УПРАВЛЕНИЕ_НОДАМИ</div>
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
                    {activeNode === node.id ? 'АКТИВЕН' : 'ПОДКЛЮЧИТЬ'}
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
            <Link to="/keys" className="block">
              <motion.button
                onClick={() => triggerHaptic()}
                className="w-full p-4 rounded border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-left"
                whileTap={{ scale: 0.98 }}
              >
                <Key className="w-5 h-5 text-primary mb-2" />
                <div className="text-xs font-bold tracking-wider">МОИ_КЛЮЧИ</div>
                <div className="text-[10px] text-muted-foreground mt-1">Управление доступом</div>
              </motion.button>
            </Link>

            <Link to="/speed-test" className="block">
              <motion.button
                onClick={() => triggerHaptic()}
                className="p-4 rounded border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-left"
                whileTap={{ scale: 0.98 }}
              >
                <Signal className="w-5 h-5 text-accent mb-2" />
                <div className="text-xs font-bold tracking-wider">ТЕСТ_СКОРОСТИ</div>
                <div className="text-[10px] text-muted-foreground mt-1">Проверка задержки</div>
              </motion.button>
            </Link>
          </motion.div>

          {/* Connection Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-3 gap-3"
          >
            {[
              { label: 'АПТАЙМ', value: formatUptime(), color: 'text-primary' },
              { label: 'ДАННЫЕ', value: `${formatDataUsed()} GB`, color: 'text-accent' },
              { label: 'СЕССИИ', value: (stats?.total_sessions || 0).toString(), color: 'text-primary' },
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
          <div className="max-w-[480px] mx-auto bg-background/95 backdrop-blur-sm border-t border-border/10">
            <div className="flex items-stretch">
              {[
                { id: 'home', icon: Home, label: 'Главная', link: null },
                { id: 'configs', icon: Key, label: 'Ключи', link: '/keys' },
                { id: 'security', icon: Shield, label: 'Защита', link: null },
                { id: 'settings', icon: Settings, label: 'Настройки', link: '/settings' },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                const buttonContent = (
                  <>
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
                  </>
                );
                
                return item.link ? (
                  <Link key={item.id} to={item.link} className="flex-1">
                    <motion.button
                      onClick={() => handleTabChange(item.id as typeof activeTab)}
                      className={`w-full py-4 flex flex-col items-center gap-1 transition-all relative ${
                        isActive ? 'text-primary' : 'text-muted-foreground'
                      }`}
                      whileTap={{ scale: 0.95 }}
                    >
                      {buttonContent}
                    </motion.button>
                  </Link>
                ) : (
                  <motion.button
                    key={item.id}
                    onClick={() => handleTabChange(item.id as typeof activeTab)}
                    className={`flex-1 py-4 flex flex-col items-center gap-1 transition-all relative ${
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    {buttonContent}
                  </motion.button>
                );
              })}
            </div>
            
            {/* Safe area spacer for iOS */}
            <div className="h-safe-area-inset-bottom bg-background" />
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
