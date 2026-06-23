import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Download, Upload, Wifi, Clock, Server, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api, TestState, TestPhase, LatencyStats } from '@/lib/api';
import { toast } from 'sonner';
import { useServers } from '@/hooks/useServers';
import { Logo } from '@/components/Logo';
import { MobileThemeToggle } from '@/components/MobileThemeToggle';

export default function SpeedTest() {
  const { servers, isLoading: serversLoading } = useServers();
  const [selectedServerId, setSelectedServerId] = useState<number>(1);
  const [testState, setTestState] = useState<TestState>({
    phase: 'idle',
    isRunning: false,
    progress: 0,
  });
  const [history, setHistory] = useState<any[]>([]);
  const [comparison, setComparison] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [animatedSpeed, setAnimatedSpeed] = useState(0);

  // Анимация скорости
  useEffect(() => {
    if (testState.currentSpeed !== undefined) {
      const interval = setInterval(() => {
        setAnimatedSpeed(prev => {
          const diff = testState.currentSpeed! - prev;
          if (Math.abs(diff) < 0.1) return testState.currentSpeed!;
          return prev + diff * 0.1;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [testState.currentSpeed]);

  const runSpeedTest = async () => {
    if (!selectedServerId) {
      toast.error("Выберите сервер для тестирования");
      return;
    }

    try {
      setTestState({ phase: 'starting', isRunning: true, progress: 10, currentSpeed: 0 });

      // 1. Инициируем тест
      const startResponse = await api.startSpeedTest(selectedServerId);
      console.log('Start response:', startResponse);
      
      setTestState({ phase: 'download', isRunning: true, progress: 25, currentSpeed: 0 });
      
      // 2. Тест загрузки
      const downloadResponse = await api.downloadTest(selectedServerId);
      console.log('Download response:', downloadResponse);
      
      // Симулируем нарастание скорости
      for (let i = 0; i <= 100; i += 10) {
        setTestState(prev => ({ 
          ...prev, 
          progress: 25 + (i * 0.25), 
          currentSpeed: (downloadResponse.download_speed || 0) * (i / 100) 
        }));
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      setTestState({ phase: 'upload', isRunning: true, progress: 50, currentSpeed: 0 });
      
      // 3. Тест отдачи
      const uploadResponse = await api.uploadTest(selectedServerId);
      console.log('Upload response:', uploadResponse);
      
      // Симулируем нарастание скорости
      for (let i = 0; i <= 100; i += 10) {
        setTestState(prev => ({ 
          ...prev, 
          progress: 50 + (i * 0.25), 
          currentSpeed: (uploadResponse.upload_speed || 0) * (i / 100) 
        }));
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      setTestState({ phase: 'ping', isRunning: true, progress: 75, currentSpeed: 0 });
      
      // 4. Тест пинга
      const pingResponse = await api.pingTest(selectedServerId);
      console.log('Ping response:', pingResponse);
      
      setTestState({ phase: 'saving', isRunning: true, progress: 90, currentSpeed: 0 });
      
      // 5. Сохраняем результат
      const saveResponse = await api.saveSpeedTestResult({
        server_id: selectedServerId,
        download_speed: downloadResponse.download_speed || 0,
        upload_speed: uploadResponse.upload_speed || 0,
        latency_avg: pingResponse.average,
        latency_min: pingResponse.min,
        latency_max: pingResponse.max,
        test_duration: 15,
        data_transferred: 2097152,
      });
      console.log('Save response:', saveResponse);
      
      // 6. Завершаем тест
      setTestState({
        phase: 'complete',
        isRunning: false,
        progress: 100,
        currentSpeed: 0,
        results: {
          download_speed: downloadResponse.download_speed || 0,
          upload_speed: uploadResponse.upload_speed || 0,
          latency: pingResponse,
        },
      });

      toast.success(`Результат сохранен с ID: ${saveResponse.result_id}`);

    } catch (error: any) {
      console.error('Speed test error:', error);
      setTestState({
        phase: 'error',
        isRunning: false,
        progress: 0,
        currentSpeed: 0,
        error: error.message,
      });
      
      toast.error(`Ошибка теста: ${error.message}`);
    }
  };

  const loadHistory = async () => {
    try {
      const historyResponse = await api.getSpeedTestHistory(10);
      setHistory(historyResponse.history);
      setShowHistory(true);
    } catch (error: any) {
      console.error('Failed to load history:', error);
    }
  };

  const loadComparison = async () => {
    try {
      const comparisonResponse = await api.getServerComparison();
      setComparison(comparisonResponse.comparison);
      setShowComparison(true);
    } catch (error: any) {
      console.error('Failed to load comparison:', error);
    }
  };

  const resetTest = () => {
    setTestState({
      phase: 'idle',
      isRunning: false,
      progress: 0,
      currentSpeed: 0,
    });
    setAnimatedSpeed(0);
    setShowHistory(false);
    setShowComparison(false);
  };

  const getPhaseText = (phase: TestPhase): string => {
    switch (phase) {
      case 'idle': return 'Готов к тестированию';
      case 'starting': return 'Инициализация теста...';
      case 'download': return 'Тестирование загрузки...';
      case 'upload': return 'Тестирование отдачи...';
      case 'ping': return 'Измерение задержки...';
      case 'saving': return 'Сохранение результатов...';
      case 'complete': return 'Тест завершен';
      case 'error': return 'Ошибка теста';
      default: return 'Неизвестное состояние';
    }
  };

  const getPhaseIcon = (phase: TestPhase) => {
    switch (phase) {
      case 'download': return <Download className="w-5 h-5" />;
      case 'upload': return <Upload className="w-5 h-5" />;
      case 'ping': return <Wifi className="w-5 h-5" />;
      case 'saving': return <Clock className="w-5 h-5" />;
      default: return <Zap className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border/10">
        <div className="p-4">
          {/* Logo and theme toggle */}
          <div className="flex items-center justify-between mb-4">
            <Logo className="scale-75" animated={false} />
            <MobileThemeToggle />
          </div>
          
          {/* Navigation and title */}
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-mono-tech text-sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              [ BACK ]
            </Link>
            
            <h1 className="text-lg font-bold tracking-wider text-primary">ТЕСТ_СКОРОСТИ</h1>
            
            <div className="w-16"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Server Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="text-xs text-muted-foreground tracking-wider uppercase">Выбор сервера</div>
          <div className="space-y-2">
            {serversLoading ? (
              <div className="p-4 rounded border border-white/10 bg-white/5">
                <div className="text-sm">Загрузка серверов...</div>
              </div>
            ) : (
              servers.map((server) => (
                <motion.button
                  key={server.id}
                  onClick={() => setSelectedServerId(server.id)}
                  disabled={testState.isRunning}
                  className={`w-full p-4 rounded border text-left transition-all ${
                    selectedServerId === server.id
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-sm tracking-wider">{server.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">{server.location}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      0% загрузка
                    </div>
                  </div>
                </motion.button>
              ))
            )}
          </div>
        </motion.div>

        {/* Speed Gauge Circle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center py-8"
        >
          <div className="relative w-64 h-64">
            {/* Glow effect */}
            <div className="absolute -inset-4 rounded-full bg-primary/20 blur-2xl animate-pulse" />
            <div className="absolute -inset-2 rounded-full bg-primary/30 blur-xl animate-pulse" style={{ animationDelay: '0.5s' }} />
            
            {/* Progress Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="2"
                opacity="0.2"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="hsl(73 100% 50%)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - testState.progress / 100)}`}
                animate={{
                  strokeDashoffset: `${2 * Math.PI * 45 * (1 - testState.progress / 100)}`
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </svg>
            
            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div
                key={testState.phase}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center"
              >
                <div className="mb-2">
                  {getPhaseIcon(testState.phase)}
                </div>
                
                {testState.isRunning && testState.currentSpeed !== undefined ? (
                  <motion.div
                    className="text-2xl font-bold font-mono text-primary"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    {animatedSpeed.toFixed(1)}
                    <span className="text-sm text-muted-foreground ml-1">Mbps</span>
                  </motion.div>
                ) : testState.results ? (
                  <div className="space-y-1">
                    <div className="text-xl font-bold font-mono text-primary">
                      ↓ {testState.results.download_speed.toFixed(1)}
                    </div>
                    <div className="text-xl font-bold font-mono text-accent">
                      ↑ {testState.results.upload_speed.toFixed(1)}
                    </div>
                    <div className="text-sm font-mono text-muted-foreground">
                      {testState.results.latency.average.toFixed(0)}ms
                    </div>
                  </div>
                ) : (
                  <div className="text-xl font-bold font-mono text-muted-foreground">
                    Готов
                  </div>
                )}
                
                <div className="text-xs font-mono text-muted-foreground mt-2">
                  {getPhaseText(testState.phase)}
                </div>
                
                {testState.isRunning && (
                  <div className="text-xs text-primary mt-1">
                    {testState.progress.toFixed(0)}%
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Control Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <button
            onClick={runSpeedTest}
            disabled={testState.isRunning || !selectedServerId}
            className="w-full py-4 bg-primary text-black font-bold text-sm tracking-widest rounded transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {testState.isRunning ? 'ТЕСТИРОВАНИЕ...' : 'НАЧАТЬ_ТЕСТ'}
          </button>
          
          <div className={`grid gap-3 ${
            (testState.phase === 'complete' || testState.phase === 'error') 
              ? 'grid-cols-3' 
              : 'grid-cols-2'
          }`}>
            {(testState.phase === 'complete' || testState.phase === 'error') && (
              <button
                onClick={resetTest}
                className="py-3 px-4 rounded border border-white/20 bg-white/5 hover:bg-white/10 transition-all text-sm font-medium tracking-wider"
              >
                НОВЫЙ_ТЕСТ
              </button>
            )}
            
            <button
              onClick={loadHistory}
              className="py-3 px-4 rounded border border-white/20 bg-white/5 hover:bg-white/10 transition-all text-sm font-medium tracking-wider"
            >
              ИСТОРИЯ
            </button>
            
            <button
              onClick={loadComparison}
              className="py-3 px-4 rounded border border-white/20 bg-white/5 hover:bg-white/10 transition-all text-sm font-medium tracking-wider"
            >
              СРАВНЕНИЕ
            </button>
          </div>
        </motion.div>

        {/* Results */}
        {testState.results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded border border-primary/30 bg-primary/5"
          >
            <div className="text-xs text-muted-foreground tracking-wider uppercase mb-3">Результаты теста</div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {testState.results.download_speed.toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground tracking-wider">MBPS ↓</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {testState.results.upload_speed.toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground tracking-wider">MBPS ↑</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {testState.results.latency.average.toFixed(0)}
                </div>
                <div className="text-xs text-muted-foreground tracking-wider">MS PING</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Error */}
        {testState.error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded border border-red-500/30 bg-red-500/10"
          >
            <div className="text-xs text-red-400 tracking-wider uppercase mb-2">Ошибка</div>
            <div className="text-sm text-red-300">{testState.error}</div>
          </motion.div>
        )}

        {/* History */}
        {showHistory && history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground tracking-wider uppercase">
                История тестов ({history.length})
              </div>
              <Button
                onClick={() => setShowHistory(false)}
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-white"
              >
                Скрыть
              </Button>
            </div>
            <div className="space-y-2">
              {history.slice(0, 5).map((test) => (
                <div key={test.id} className="p-3 rounded border border-white/10 bg-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium">Сервер #{test.server_id}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(test.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex gap-3 text-xs">
                    <span className="text-primary">↓ {test.download_speed}</span>
                    <span className="text-primary">↑ {test.upload_speed}</span>
                    <span className="text-primary">{test.latency_avg}ms</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Comparison */}
        {showComparison && comparison.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground tracking-wider uppercase">
                Сравнение серверов
              </div>
              <Button
                onClick={() => setShowComparison(false)}
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-white"
              >
                Скрыть
              </Button>
            </div>
            <div className="space-y-2">
              {comparison.map((server) => (
                <div key={server.server_id} className="p-3 rounded border border-white/10 bg-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium">{server.server_name}</div>
                    <div className="text-xs text-muted-foreground">
                      {server.test_count} тестов
                    </div>
                  </div>
                  <div className="flex gap-3 text-xs">
                    <span className="text-primary">↓ {server.avg_download.toFixed(1)}</span>
                    <span className="text-primary">↑ {server.avg_upload.toFixed(1)}</span>
                    <span className="text-primary">{server.avg_latency.toFixed(0)}ms</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Bottom Spacer */}
        <div className="h-8" />
        
        {/* Footer with Version Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center py-6 border-t border-border/10 bg-background/50"
        >
          <div className="space-y-1 font-mono text-xs">
            <div className="text-muted-foreground">VERSION: 1.0.0-beta</div>
            <div className="text-muted-foreground">BUILD: 2025.01.25</div>
            <div className="text-primary font-semibold">3WG.RU © 2025</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}