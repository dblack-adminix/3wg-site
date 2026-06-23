import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Plus,
  Shield,
  Lock,
  Loader2,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useUserKeys } from '@/hooks/useUserKeys';
import { useEffect, useState } from 'react';
import { VPNKey } from '@/lib/api';
import { Logo } from '@/components/Logo';
import { MobileThemeToggle } from '@/components/MobileThemeToggle';

const Keys = () => {
  const navigate = useNavigate();
  const { keys, isLoading, refreshKeys } = useUserKeys();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Автообновление каждые 5 секунд
  useEffect(() => {
    const interval = setInterval(() => {
      refreshKeys();
      setLastUpdate(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, [refreshKeys]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refreshKeys(false); // false = показать loading
    setLastUpdate(new Date());
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Форматирование даты
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const formatLastUsed = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'только что';
    if (minutes < 60) return `${minutes} мин назад`;
    if (hours < 24) return `${hours} ч назад`;
    return `${days} дн назад`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground font-mono flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[#CCFF00] animate-spin mx-auto mb-4" />
          <div className="text-sm text-gray-400">Загрузка ключей...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-mono-tech">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-primary/20">
        <div className="container mx-auto px-4 py-4">
          {/* Logo and theme toggle */}
          <div className="flex items-center justify-between mb-4">
            <Logo className="scale-75" animated={false} />
            <MobileThemeToggle />
          </div>
          
          {/* Navigation and controls below logo */}
          <div className="flex items-center justify-between mb-3">
            <Link to="/dashboard">
              <Button
                variant="ghost"
                size="sm"
                className="text-primary hover:bg-primary/10 font-mono-tech"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                [ BACK ]
              </Button>
            </Link>

            <div className="flex items-center gap-2">
              <Button
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary hover:bg-primary/10"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>

              <Link to="/mobile-generator">
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold font-mono-tech"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  НОВЫЙ КЛЮЧ
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-6 h-6 text-[#CCFF00]" />
            <h1 className="text-2xl font-bold tracking-wider text-[#CCFF00]">
              MY_ACCESS_KEYS
            </h1>
          </div>
          <p className="text-sm text-gray-400">
            Управление активными конфигурациями и доступами
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-2xl pb-32">
        {/* Keys List */}
        {keys.length > 0 ? (
          <div className="space-y-4">
            {keys.map((key, index) => (
              <motion.div
                key={key.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-primary/30 rounded-lg bg-card/30 overflow-hidden"
              >
                {/* Key Card Header */}
                <button
                  onClick={() => navigate(`/keys/${key.id}`)}
                  className="w-full p-4 text-left hover:bg-primary/5 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="text-lg font-bold text-white tracking-wider break-all">
                          {key.name || `KEY_${key.id}`}
                        </h3>
                        <div
                          className={`px-2 py-0.5 rounded text-xs font-bold whitespace-nowrap flex-shrink-0 ${
                            key.protocol.toLowerCase().includes('amnezia')
                              ? 'bg-primary/20 text-primary border border-primary/40'
                              : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                          }`}
                        >
                          {key.protocol.toUpperCase()}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <span className="font-mono">{key.ip_address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <motion.div
                            className={`w-2 h-2 rounded-full ${
                              key.status === 'active' ? 'bg-primary' : 'bg-muted-foreground'
                            }`}
                            animate={key.status === 'active' ? {
                              boxShadow: [
                                '0 0 4px rgba(204, 255, 0, 0.4)',
                                '0 0 12px rgba(204, 255, 0, 0.8)',
                                '0 0 4px rgba(204, 255, 0, 0.4)',
                              ],
                            } : {}}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                          <span className={`font-bold text-xs ${
                            key.status === 'active' ? 'text-[#CCFF00]' : 'text-gray-500'
                          }`}>
                            {key.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Last used: {formatLastUsed(key.updated_at)}</span>
                    <span>Created: {formatDate(key.created_at)}</span>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          // Empty State
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 px-4"
          >
            <motion.div
              animate={{
                rotateY: [0, 360],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
              className="mb-6"
            >
              <Lock className="w-24 h-24 text-gray-700" />
            </motion.div>

            <h2 className="text-xl font-bold text-gray-400 mb-2 tracking-wider">
              NO_ACTIVE_KEYS_FOUND
            </h2>
            <p className="text-sm text-gray-600 mb-8">
              GENERATE_NEW_ONE?
            </p>

            <Link to="/mobile-generator">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold font-mono-tech">
                <Plus className="w-4 h-4 mr-2" />
                CREATE NEW ACCESS KEY
              </Button>
            </Link>
          </motion.div>
        )}
      </div>

      {/* Footer with Version Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-0 left-0 right-0 text-center py-4 border-t border-primary/20 bg-background/95 backdrop-blur-sm"
      >
        <div className="space-y-1 font-mono text-xs">
          <div className="text-gray-400">VERSION: 1.0.0-beta</div>
          <div className="text-gray-400">BUILD: 2025.01.25</div>
          <div className="text-[#CCFF00] font-semibold">3WG.RU © 2025</div>
        </div>
      </motion.div>

      {/* Background grid effect */}
      <div className="fixed inset-0 pointer-events-none opacity-5 z-0">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(#CCFF00 1px, transparent 1px),
              linear-gradient(90deg, #CCFF00 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>
    </div>
  );
};

export default Keys;
