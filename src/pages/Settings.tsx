import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Zap, Shield, Copy, Send, Check, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MobileThemeToggle } from '@/components/MobileThemeToggle';
import { Logo } from '@/components/Logo';

type Theme = 'acid-green' | 'cyber-red';
type Language = 'RU' | 'EN';

const mockLogs = [
  '[INFO] System initialized successfully',
  '[DEBUG] Handshake timeout: 3000ms',
  '[INFO] Connection established to node-ams-01',
  '[DEBUG] Packet loss: 0.00%',
  '[ERROR] Node_not_reachable: node-fra-02',
  '[INFO] Fallback to node-hel-01',
  '[DEBUG] Encryption: AES-256-GCM',
  '[INFO] Session key rotated',
  '[DEBUG] Latency: 12ms',
  '[INFO] Traffic routed through AmneziaWG',
  '[DEBUG] MTU: 1420',
  '[INFO] Keep-alive: 25s',
];

const Settings = () => {
  const [theme, setTheme] = useState<Theme>('acid-green');
  const [language, setLanguage] = useState<Language>('RU');
  const [copied, setCopied] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);

  const themeColors = {
    'acid-green': {
      primary: '#CCFF00',
      border: 'border-[#CCFF00]',
      text: 'text-[#CCFF00]',
      bg: 'bg-[#CCFF00]',
      glow: 'shadow-[0_0_20px_rgba(204,255,0,0.5)]',
    },
    'cyber-red': {
      primary: '#FF003C',
      border: 'border-[#FF003C]',
      text: 'text-[#FF003C]',
      bg: 'bg-[#FF003C]',
      glow: 'shadow-[0_0_20px_rgba(255,0,60,0.5)]',
    },
  };

  const currentTheme = themeColors[theme];

  const handleCopyLogs = () => {
    navigator.clipboard.writeText(mockLogs.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendLogs = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setUploadDone(true);
      setTimeout(() => setUploadDone(false), 3000);
    }, 2000);
  };

  const handleOpenTelegram = () => {
    window.open('https://t.me/your_admin_username', '_blank');
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-mono-tech">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          {/* Logo and theme toggle */}
          <div className="flex items-center justify-between mb-4">
            <Logo className="scale-75" animated={false} />
            <MobileThemeToggle />
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <Link to="/dashboard">
              <Button
                variant="ghost"
                size="sm"
                className={`${currentTheme.text} hover:bg-white/5 font-mono-tech`}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                [ BACK ]
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Shield className={`w-6 h-6 ${currentTheme.text}`} />
            <h1 className={`text-2xl font-bold tracking-wider ${currentTheme.text}`}>
              SETTINGS_&_SUPPORT
            </h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-3 sm:px-4 py-6 max-w-2xl space-y-6 pb-24">
        {/* 1. Interface Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-2 border-border bg-card/30"
        >
          <div className="p-3 sm:p-4 border-b border-gray-800">
            <h2 className="text-xs sm:text-sm font-bold tracking-wider text-gray-400">
              {'>'} INTERFACE_SETTINGS
            </h2>
          </div>

          <div className="p-4 sm:p-6 space-y-6">
            {/* Theme Switcher */}
            <div>
              <label className="block text-xs text-gray-500 mb-3 tracking-wider">
                SYSTEM_VISUAL_MODE
              </label>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <button
                  onClick={() => setTheme('acid-green')}
                  className={`relative p-3 sm:p-4 border-2 transition-all min-h-[48px] ${
                    theme === 'acid-green'
                      ? 'border-[#CCFF00] bg-[#CCFF00]/10'
                      : 'border-border bg-card/50 hover:border-border/70'
                  }`}
                >
                  <div className="text-xs sm:text-sm font-bold text-[#CCFF00]">
                    [ ACID_GREEN ]
                  </div>
                  {theme === 'acid-green' && (
                    <motion.div
                      className="absolute inset-0 border-2 border-[#CCFF00]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </button>

                <button
                  onClick={() => setTheme('cyber-red')}
                  className={`relative p-3 sm:p-4 border-2 transition-all min-h-[48px] ${
                    theme === 'cyber-red'
                      ? 'border-[#FF003C] bg-[#FF003C]/10'
                      : 'border-border bg-card/50 hover:border-border/70'
                  }`}
                >
                  <div className="text-xs sm:text-sm font-bold text-[#FF003C]">
                    [ CYBER_RED ]
                  </div>
                  {theme === 'cyber-red' && (
                    <motion.div
                      className="absolute inset-0 border-2 border-[#FF003C]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </button>
              </div>
            </div>

            {/* Language Select */}
            <div>
              <label className="block text-xs text-gray-500 mb-3 tracking-wider">
                LANGUAGE
              </label>
              <div className="inline-flex border-2 border-gray-800 w-full sm:w-auto">
                <button
                  onClick={() => setLanguage('RU')}
                  className={`flex-1 sm:flex-none px-6 py-3 text-sm font-bold transition-all min-h-[48px] ${
                    language === 'RU'
                      ? `${currentTheme.bg} text-black`
                      : 'bg-card/50 text-muted-foreground hover:bg-card/70'
                  }`}
                >
                  [ RU ]
                </button>
                <button
                  onClick={() => setLanguage('EN')}
                  className={`flex-1 sm:flex-none px-6 py-3 text-sm font-bold transition-all border-l-2 border-gray-800 min-h-[48px] ${
                    language === 'EN'
                      ? `${currentTheme.bg} text-black`
                      : 'bg-card/50 text-muted-foreground hover:bg-card/70'
                  }`}
                >
                  [ EN ]
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 2. Support Channel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="border-2 border-border bg-card/30"
        >
          <div className="p-4 border-b border-gray-800">
            <h2 className="text-sm font-bold tracking-wider text-gray-400">
              {'>'} SUPPORT_CHANNEL
            </h2>
          </div>

          <div className="p-4 sm:p-6 space-y-4">
            <button
              onClick={handleOpenTelegram}
              className={`w-full p-4 sm:p-6 border-2 ${currentTheme.border} ${currentTheme.bg}/5 hover:${currentTheme.bg}/10 transition-all group ${currentTheme.glow} min-h-[48px]`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4">
                  <Zap className={`w-6 h-6 sm:w-8 sm:h-8 ${currentTheme.text}`} />
                  <div className="text-left">
                    <div className={`text-sm sm:text-lg font-bold ${currentTheme.text} tracking-wider`}>
                      OPEN_ENCRYPTED_CHANNEL
                    </div>
                    <div className="text-xs text-gray-500 mt-1 hidden sm:block">
                      Direct line to technical support
                    </div>
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 sm:w-6 sm:h-6 ${currentTheme.text} group-hover:translate-x-1 transition-transform`} />
              </div>
            </button>

            <div className="p-3 sm:p-4 bg-card/50 border border-border">
              <div className="text-xs text-gray-500 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                  <span>Среднее время ответа: <span className={currentTheme.text}>15 мин</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                  <span>Только технические вопросы</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 3. Debug & Logs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="border-2 border-border bg-card/30"
        >
          <div className="p-4 border-b border-gray-800">
            <h2 className="text-sm font-bold tracking-wider text-gray-400">
              {'>'} DEBUG_&_LOGS
            </h2>
          </div>

          <div className="p-4 sm:p-6 space-y-4">
            {/* Log Viewer */}
            <div className="bg-background border-2 border-border p-3 sm:p-4 h-48 sm:h-64 overflow-y-auto overflow-x-hidden font-mono text-[10px] sm:text-xs">
              {mockLogs.map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="mb-1 break-all"
                >
                  {log.includes('[ERROR]') ? (
                    <span className="text-red-500">{log}</span>
                  ) : log.includes('[DEBUG]') ? (
                    <span className="text-cyan-400">{log}</span>
                  ) : (
                    <span className={currentTheme.text}>{log}</span>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                onClick={handleCopyLogs}
                variant="outline"
                className={`border-2 border-border bg-card/50 hover:border-border/70 hover:bg-card/70 text-foreground font-mono-tech min-h-[48px] ${
                  copied ? 'border-green-500 bg-green-500/10' : ''
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    COPIED
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    COPY_LOG
                  </>
                )}
              </Button>

              <Button
                onClick={handleSendLogs}
                disabled={uploading || uploadDone}
                className={`border-2 ${currentTheme.border} ${currentTheme.bg}/10 hover:${currentTheme.bg}/20 ${currentTheme.text} font-mono-tech transition-all min-h-[48px] ${
                  uploadDone ? 'border-green-500 bg-green-500/10 text-green-500' : ''
                }`}
              >
                <AnimatePresence mode="wait">
                  {uploading ? (
                    <motion.div
                      key="uploading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <Send className="w-4 h-4" />
                      </motion.div>
                      UPLOADING...
                    </motion.div>
                  ) : uploadDone ? (
                    <motion.div
                      key="done"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      DONE
                    </motion.div>
                  ) : (
                    <motion.div
                      key="send"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      SEND_TO_ADMIN
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </div>

            {/* Upload Progress */}
            <AnimatePresence>
              {uploading && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 bg-background border-2 border-border">
                    <div className="text-xs text-gray-500 mb-2 tracking-wider">
                      UPLOADING_ENCRYPTED_DATA...
                    </div>
                    <div className="h-1 bg-gray-800 overflow-hidden">
                      <motion.div
                        className={`h-full ${currentTheme.bg}`}
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 2, ease: 'linear' }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Info Footer */}
        <div className="text-center text-xs text-gray-600 py-4 space-y-1">
          <div>VERSION: 1.0.0-beta</div>
          <div>BUILD: 2025.01.25</div>
          <div className={currentTheme.text}>3WG.RU © 2025</div>
        </div>
      </div>

      {/* Background grid */}
      <div className="fixed inset-0 pointer-events-none opacity-5 z-0">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(${currentTheme.primary} 1px, transparent 1px),
              linear-gradient(90deg, ${currentTheme.primary} 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>
    </div>
  );
};

export default Settings;
