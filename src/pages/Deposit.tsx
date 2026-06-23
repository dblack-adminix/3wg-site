import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { MobileThemeToggle } from '@/components/MobileThemeToggle';

// Crypto assets - temporarily disabled
const cryptoAssets = [
  { id: 'usdt', name: 'USDT', network: 'TRC20', icon: '₮', color: '#26A17B', disabled: true },
  { id: 'ton', name: 'TON', network: 'TON', icon: '💎', color: '#0088CC', disabled: true },
  { id: 'btc', name: 'BTC', network: 'Bitcoin', icon: '₿', color: '#F7931A', disabled: true },
  { id: 'eth', name: 'ETH', network: 'Ethereum', icon: 'Ξ', color: '#627EEA', disabled: true },
];

const quickAmounts = [100, 500, 1000, 2500];

const Deposit = () => {
  return (
    <div className="min-h-screen bg-background text-foreground font-mono-tech overflow-hidden">
      {/* Scanning line effect */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#CCFF00] to-transparent opacity-50 z-50"
        animate={{
          y: [0, window.innerHeight, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-primary/20">
        <div className="container mx-auto px-4 py-4">
          {/* Logo and theme toggle */}
          <div className="flex items-center justify-between mb-4">
            <Logo className="scale-75" animated={false} />
            <MobileThemeToggle />
          </div>
          
          {/* Navigation and title */}
          <div className="flex items-center justify-between">
            <Link to="/dashboard">
              <Button
                variant="ghost"
                size="sm"
                className="text-[#CCFF00] hover:bg-[#CCFF00]/10 font-mono-tech"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                [ BACK ]
              </Button>
            </Link>
            
            <h1 className="text-lg font-bold tracking-wider text-[#CCFF00]">
              RECHARGE_BALANCE
            </h1>
            
            <div className="w-16"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Step 1: Asset Selection */}
        <section className="mb-8">
          <div className="mb-4">
            <span className="text-xs text-gray-500 uppercase tracking-wider">
              [ STEP_1 ] SELECT_ASSET
            </span>
          </div>
          
          {/* Coming Soon Notice */}
          <div className="mb-6 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="text-orange-400 font-bold text-sm">КРИПТОВАЛЮТНЫЕ ПЛАТЕЖИ</span>
            </div>
            <p className="text-xs text-gray-400">
              Временно недоступны. Используйте банковские карты через личный кабинет.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {cryptoAssets.map((asset) => (
              <motion.div
                key={asset.id}
                className="relative p-4 rounded-lg border-2 transition-all opacity-60 cursor-not-allowed border-border bg-card/50"
              >
                {/* Coming Soon Badge */}
                <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                  СКОРО
                </div>
                
                <div className="text-3xl mb-2 opacity-50">{asset.icon}</div>
                <div className="text-sm font-bold text-gray-500">{asset.name}</div>
                <div className="text-xs text-gray-600">{asset.network}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Step 2: Amount Input - Disabled */}
        <section className="mb-8 opacity-50">
          <div className="mb-4">
            <span className="text-xs text-gray-500 uppercase tracking-wider">
              [ STEP_2 ] ENTER_AMOUNT
            </span>
          </div>

          <div className="relative mb-4">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 text-xl">
              ₽
            </div>
            <input
              type="text"
              value=""
              disabled
              placeholder="Временно недоступно"
              className="w-full bg-card/50 border-2 border-border rounded-lg px-12 py-4 text-2xl font-bold text-muted-foreground cursor-not-allowed placeholder:text-muted-foreground/70"
            />
          </div>

          {/* Quick amount buttons - disabled */}
          <div className="grid grid-cols-4 gap-2">
            {quickAmounts.map((value) => (
              <Button
                key={value}
                disabled
                variant="outline"
                className="border-border bg-card/30 text-muted-foreground font-mono-tech cursor-not-allowed"
              >
                {value}₽
              </Button>
            ))}
          </div>
        </section>

        {/* Step 3: Address Generation - Disabled for crypto payments */}

        {/* Info section */}
        <div className="space-y-4">
            <div className="p-4 bg-card/30 rounded-lg border border-border">
              <div className="text-xs text-gray-500 space-y-2">
                <div>[INFO] Криптовалютные платежи временно недоступны</div>
                <div>[INFO] Используйте банковские карты через личный кабинет</div>
                <div>[INFO] Мгновенное зачисление • 0% комиссия</div>
              </div>
            </div>
            
            {/* Redirect to Account Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                asChild
                className="w-full bg-[#CCFF00] text-black hover:bg-[#CCFF00]/90 font-mono-tech py-4 text-lg"
              >
                <Link to="/account">
                  <div className="flex items-center justify-center gap-2">
                    <span>₽</span>
                    <span>ПОПОЛНИТЬ ЧЕРЕЗ ЮKASSA</span>
                  </div>
                </Link>
              </Button>
            </motion.div>
        </div>
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
      <div className="fixed inset-0 pointer-events-none opacity-5">
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

export default Deposit;
