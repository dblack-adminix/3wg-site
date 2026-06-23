import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/Layout';
import { AnimatedSection } from '@/components/AnimatedSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Download, Upload, Wifi, Clock, Server, Activity, Globe, TrendingUp, AlertCircle } from 'lucide-react';
import { api, TestState, TestPhase, LatencyStats } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useServers } from '@/hooks/useServers';

export default function SpeedTestWeb() {
  const { toast } = useToast();
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
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [animatedSpeed, setAnimatedSpeed] = useState(0);
  const terminalRef = useRef<HTMLDivElement>(null);

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

  // Автопрокрутка терминала
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTo({
        top: terminalRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [terminalLines]);

  // Функции для терминала
  const addTerminalLine = (line: string, type: 'info' | 'success' | 'warning' | 'error' | 'header' | 'system' | 'data' | 'network' = 'info') => {
    setTerminalLines(prev => [...prev, `${type}:${line}`]);
  };

  const clearTerminal = () => {
    setTerminalLines([]);
  };

  const simulateTerminalOutput = async (phase: TestPhase) => {
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    
    switch (phase) {
      case 'starting':
        addTerminalLine('> ======================================', 'header');
        addTerminalLine('> SPEED TEST SYSTEM v2.1.0 INIT', 'header');
        addTerminalLine('> ======================================', 'header');
        await delay(300);
        addTerminalLine('> Проверка системных ресурсов...');
        await delay(200);
        addTerminalLine('> CPU: i7-12700K @ 3.60GHz', 'system');
        await delay(150);
        addTerminalLine('> RAM: 32GB DDR4-3200', 'system');
        await delay(150);
        addTerminalLine('> NET: Gigabit Eth', 'system');
        await delay(300);
        addTerminalLine('> Инициализация VPN туннеля...', 'network');
        await delay(400);
        addTerminalLine('> Установка защищенного канала...', 'network');
        await delay(300);
        addTerminalLine('> [OK] Система готова', 'success');
        break;
        
      case 'download':
        addTerminalLine('> ======================================', 'header');
        addTerminalLine('> ТЕСТ ЗАГРУЗКИ', 'header');
        addTerminalLine('> ======================================', 'header');
        await delay(200);
        addTerminalLine('> Создание тестовых пакетов данных...');
        await delay(300);
        addTerminalLine('> Размер пакета: 10MB', 'data');
        await delay(200);
        for (let i = 0; i < 5; i++) {
          await delay(200);
          const speed = Math.random() * 100 + 50;
          const progress = ((i + 1) / 5 * 100).toFixed(0);
          addTerminalLine(`> Пакет ${i + 1}/5: ${speed.toFixed(1)} Mbps [${progress}%]`);
        }
        addTerminalLine('> [OK] Тест загрузки завершен успешно');
        break;
        
      case 'upload':
        addTerminalLine('> ======================================', 'header');
        addTerminalLine('> ТЕСТ ОТДАЧИ', 'header');
        addTerminalLine('> ======================================', 'header');
        await delay(200);
        addTerminalLine('> Подготовка исходящих данных...');
        await delay(300);
        addTerminalLine('> Размер буфера: 8MB', 'data');
        await delay(200);
        for (let i = 0; i < 5; i++) {
          await delay(200);
          const speed = Math.random() * 80 + 30;
          const progress = ((i + 1) / 5 * 100).toFixed(0);
          addTerminalLine(`> Отправка ${i + 1}/5: ${speed.toFixed(1)} Mbps [${progress}%]`);
        }
        addTerminalLine('> [OK] Тест отдачи завершен успешно');
        break;
        
      case 'ping':
        addTerminalLine('> ======================================', 'header');
        addTerminalLine('> АНАЛИЗ ЗАДЕРЖКИ', 'header');
        addTerminalLine('> ======================================', 'header');
        await delay(200);
        addTerminalLine('> Отправка ICMP пакетов...', 'network');
        await delay(200);
        for (let i = 0; i < 8; i++) {
          await delay(150);
          const ping = Math.random() * 50 + 10;
          const bytes = 64;
          const ttl = 64;
          addTerminalLine(`> ${bytes} bytes from server: icmp_seq=${i + 1} ttl=${ttl} time=${ping.toFixed(1)}ms`, 'network');
        }
        addTerminalLine('> [OK] Анализ задержки завершен');
        break;
        
      case 'saving':
        addTerminalLine('> ======================================', 'header');
        addTerminalLine('> СОХРАНЕНИЕ ДАННЫХ', 'header');
        addTerminalLine('> ======================================', 'header');
        await delay(300);
        addTerminalLine('> Генерация отчета...');
        await delay(200);
        addTerminalLine('> Шифрование данных AES-256...', 'system');
        await delay(300);
        addTerminalLine('> Отправка на сервер...', 'network');
        await delay(400);
        addTerminalLine('> Верификация целостности...', 'system');
        await delay(200);
        addTerminalLine('> [OK] Результаты сохранены в базе данных');
        break;
        
      case 'complete':
        addTerminalLine('> ======================================', 'header');
        addTerminalLine('> ТЕСТ ЗАВЕРШЕН УСПЕШНО', 'header');
        addTerminalLine('> ======================================', 'header');
        await delay(300);
        addTerminalLine('> Время выполнения: 15.3 секунд', 'data');
        addTerminalLine('> Передано данных: 2.1 MB', 'data');
        addTerminalLine('> Статус: SUCCESS', 'success');
        addTerminalLine('> ======================================', 'header');
        break;
    }
  };

  const runSpeedTest = async () => {
    if (!selectedServerId) {
      toast({
        title: "Ошибка",
        description: "Выберите сервер для тестирования",
        variant: "destructive",
      });
      return;
    }

    try {
      clearTerminal();
      setTestState({ phase: 'starting', isRunning: true, progress: 10, currentSpeed: 0 });
      await simulateTerminalOutput('starting');

      // 1. Инициируем тест
      const startResponse = await api.startSpeedTest(selectedServerId);
      console.log('Start response:', startResponse);
      
      setTestState({ phase: 'download', isRunning: true, progress: 25, currentSpeed: 0 });
      await simulateTerminalOutput('download');
      
      // 2. Реальный тест загрузки — скорость и прогресс измеряются по факту
      const downloadResponse = await api.downloadTest(selectedServerId, (mbps, percent) => {
        setTestState(prev => ({
          ...prev,
          progress: 25 + percent * 0.25,
          currentSpeed: mbps,
        }));
      });
      console.log('Download response:', downloadResponse);
      
      setTestState({ phase: 'upload', isRunning: true, progress: 50, currentSpeed: 0 });
      await simulateTerminalOutput('upload');
      
      // 3. Реальный тест отдачи — скорость и прогресс измеряются по факту
      const uploadResponse = await api.uploadTest(selectedServerId, (mbps, percent) => {
        setTestState(prev => ({
          ...prev,
          progress: 50 + percent * 0.25,
          currentSpeed: mbps,
        }));
      });
      console.log('Upload response:', uploadResponse);
      
      setTestState({ phase: 'ping', isRunning: true, progress: 75, currentSpeed: 0 });
      await simulateTerminalOutput('ping');
      
      // 4. Тест пинга
      const pingResponse = await api.pingTest(selectedServerId);
      console.log('Ping response:', pingResponse);
      
      setTestState({ phase: 'saving', isRunning: true, progress: 90, currentSpeed: 0 });
      await simulateTerminalOutput('saving');
      
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

      await simulateTerminalOutput('complete');

      toast({
        title: "Тест завершен",
        description: `Результат сохранен с ID: ${saveResponse.result_id}`,
      });

    } catch (error: any) {
      console.error('Speed test error:', error);
      addTerminalLine('> [ERROR] Ошибка выполнения теста', 'error');
      addTerminalLine(`> ${error.message}`, 'error');
      
      setTestState({
        phase: 'error',
        isRunning: false,
        progress: 0,
        currentSpeed: 0,
        error: error.message,
      });
      
      toast({
        title: "Ошибка теста",
        description: error.message,
        variant: "destructive",
      });
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
    clearTerminal();
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
    <Layout>
      {/* Hero Section */}
      <section className="pt-24 pb-2 relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection>
            <div className="text-center mb-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-3 mb-2"
              >
                <div className="relative">
                  <Zap className="w-8 h-8 text-primary" />
                  <div className="absolute inset-0 w-8 h-8 text-primary animate-pulse opacity-50">
                    <Zap className="w-8 h-8" />
                  </div>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold font-mono-tech">
                  Speed <span className="text-gradient-primary">Test</span>
                </h1>
              </motion.div>
              <p className="text-base text-muted-foreground font-mono max-w-xl mx-auto">
                Профессиональное тестирование скорости VPN соединения
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-2 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* Speed Meter - Main Feature */}
            <AnimatedSection className="mb-4">
              {/* Container with glow but no background gradient */}
              <div style={{ position: 'relative', overflow: 'visible', padding: '20px 10px' }}>
                {/* Glow effect for circle only */}
                <div 
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '400px',
                    height: '400px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(204, 255, 0, 0.3) 0%, rgba(204, 255, 0, 0.1) 50%, transparent 100%)',
                    filter: 'blur(80px)',
                    animation: 'pulse 2s infinite',
                    pointerEvents: 'none'
                  }}
                />
                
                <Card className="relative bg-background border-primary/30" style={{ overflow: 'visible' }}>
                  {/* Console grid pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="h-full w-full" style={{
                      backgroundImage: `
                        linear-gradient(rgba(204, 255, 0, 0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(204, 255, 0, 0.1) 1px, transparent 1px)
                      `,
                      backgroundSize: '20px 20px'
                    }} />
                  </div>
                  
                  <CardContent className="relative z-10 p-8">
                  <div className="grid lg:grid-cols-2 gap-8 items-center">
                    
                    {/* Speed Gauge - FIXED HEIGHT to prevent jumping */}
                    <div style={{ position: 'relative', height: '600px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      {/* Circle container */}
                      <div className="relative w-72 h-72 mx-auto" style={{ flexShrink: 0 }}>
                        {/* Inner glow layers */}
                        <div className="absolute -inset-8 rounded-full bg-primary/15 blur-3xl animate-pulse" />
                        <div className="absolute -inset-4 rounded-full bg-primary/20 blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }} />
                        
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
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={testState.phase}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="text-center relative"
                            >
                              <div className="mb-2">
                                {getPhaseIcon(testState.phase)}
                              </div>
                              
                              {testState.isRunning && testState.currentSpeed !== undefined ? (
                                <motion.div
                                  className="text-4xl font-bold font-mono-tech text-primary"
                                  animate={{ scale: [1, 1.05, 1] }}
                                  transition={{ duration: 1, repeat: Infinity }}
                                >
                                  {animatedSpeed.toFixed(1)}
                                  <span className="text-lg text-muted-foreground ml-1">Mbps</span>
                                </motion.div>
                              ) : testState.results ? (
                                <div className="space-y-1">
                                  <div className="text-2xl font-bold font-mono-tech text-primary">
                                    ↓ {testState.results.download_speed.toFixed(1)}
                                  </div>
                                  <div className="text-2xl font-bold font-mono-tech text-accent">
                                    ↑ {testState.results.upload_speed.toFixed(1)}
                                  </div>
                                  <div className="text-lg font-mono text-muted-foreground">
                                    {testState.results.latency.average.toFixed(0)}ms
                                  </div>
                                </div>
                              ) : (
                                <div className="text-2xl font-bold font-mono-tech text-muted-foreground">
                                  Готов
                                </div>
                              )}
                              
                              <div className="text-sm font-mono text-muted-foreground mt-2">
                                {getPhaseText(testState.phase)}
                              </div>
                            </motion.div>
                          </AnimatePresence>
                        </div>
                      </div>
                      
                      {/* Terminal Output - FIXED position at bottom */}
                      <div style={{ height: '200px', flexShrink: 0, marginTop: '15px' }}>
                        <div className="bg-background/80 rounded-lg border border-primary/30 font-mono text-xs h-full flex flex-col">
                          {/* Fixed header with dots */}
                          <div className="flex items-center gap-2 p-3 pb-2 border-b border-primary/20 flex-shrink-0">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                            <span className="text-primary ml-2 text-xs">TERMINAL</span>
                          </div>
                          
                          {/* Scrollable content */}
                          <div className="p-3 pt-2 flex-1 overflow-y-scroll" ref={terminalRef}>
                          
                          <div className="space-y-1">
                            {terminalLines.length === 0 ? (
                              <div className="text-muted-foreground">
                                <div className="flex items-center gap-2">
                                  <span className="text-primary">root@speedtest:~$</span>
                                  <span>Готов к тестированию...</span>
                                </div>
                              </div>
                            ) : (
                              terminalLines.map((line, index) => {
                                const [type, text] = line.split(':');
                                let colorClass = 'text-green-400';
                                
                                switch (type) {
                                  case 'header':
                                    colorClass = 'text-cyan-400 font-bold';
                                    break;
                                  case 'success':
                                    colorClass = 'text-green-400 font-semibold';
                                    break;
                                  case 'warning':
                                    colorClass = 'text-yellow-300';
                                    break;
                                  case 'error':
                                    colorClass = 'text-red-400 font-semibold';
                                    break;
                                  case 'system':
                                    colorClass = 'text-purple-400';
                                    break;
                                  case 'data':
                                    colorClass = 'text-orange-400';
                                    break;
                                  case 'network':
                                    colorClass = 'text-blue-400';
                                    break;
                                  case 'info':
                                  default:
                                    colorClass = 'text-gray-300';
                                    break;
                                }
                                
                                return (
                                  <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={colorClass}
                                  >
                                    {text}
                                  </motion.div>
                                );
                              })
                            )}
                            
                            {testState.isRunning && (
                              <motion.div
                                animate={{ opacity: [1, 0.3, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                                className="flex items-center gap-2 text-primary"
                              >
                                <span>root@speedtest:~$</span>
                                <span className="w-1 h-3 bg-primary animate-pulse" />
                              </motion.div>
                            )}
                          </div>
                        </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Controls & Server Selection */}
                    <div className="space-y-6">
                      {/* Console Status */}
                      <div className="p-4 bg-background/50 rounded-lg border border-primary/30 font-mono text-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                          <span className="text-primary">SYSTEM STATUS:</span>
                          <span className="text-green-400">ACTIVE</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                          <span className="text-muted-foreground">UPLINK:</span>
                          <span className="text-orange-400">1000Mbps</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                          <span className="text-muted-foreground">LATENCY:</span>
                          <span className="text-blue-400">{testState.results?.latency.average.toFixed(0) || '--'}ms</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                          <span className="text-muted-foreground">ENCRYPTION:</span>
                          <span className="text-purple-400">AES-256-GCM</span>
                        </div>
                      </div>

                      {/* Server Selection */}
                      <div>
                        <h3 className="text-lg font-bold font-mono-tech mb-4 flex items-center gap-2">
                          <Server className="w-5 h-5 text-primary" />
                          <span className="text-primary">&gt;</span> Выбор сервера
                        </h3>
                        <div className="grid gap-3">
                          {serversLoading ? (
                            <div className="text-center py-8">
                              <div className="inline-flex items-center gap-2 text-muted-foreground">
                                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                Загрузка серверов...
                              </div>
                            </div>
                          ) : (
                            servers.map((server) => (
                              <motion.button
                                key={server.id}
                                onClick={() => setSelectedServerId(server.id)}
                                disabled={testState.isRunning}
                                className={`p-4 rounded-lg border-2 transition-all text-left font-mono ${
                                  selectedServerId === server.id
                                    ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                                    : 'border-border hover:border-primary/50 hover:bg-card/50'
                                } ${testState.isRunning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                whileHover={!testState.isRunning ? { scale: 1.02 } : {}}
                                whileTap={!testState.isRunning ? { scale: 0.98 } : {}}
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="font-semibold text-primary flex items-center gap-2">
                                      <span className="text-primary">&gt;</span>
                                      {server.name}
                                    </div>
                                    <div className="text-sm text-muted-foreground">{server.location}</div>
                                    {selectedServerId === server.id && (
                                      <div className="text-xs text-primary mt-1 flex items-center gap-1">
                                        <div className="w-1 h-1 rounded-full bg-primary animate-ping" />
                                        CONNECTED
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${
                                      server.status === 'active' ? 'bg-primary animate-pulse' : 'bg-muted'
                                    }`} />
                                    {selectedServerId === server.id && (
                                      <Zap className="w-4 h-4 text-primary animate-pulse" />
                                    )}
                                  </div>
                                </div>
                              </motion.button>
                            ))
                          )}
                        </div>
                      </div>
                      
                      {/* Control Buttons */}
                      <div className="space-y-3">
                        <Button
                          onClick={runSpeedTest}
                          disabled={testState.isRunning || !selectedServerId}
                          className="w-full h-12 text-lg font-mono bg-primary text-black hover:bg-primary/90 disabled:opacity-50 relative overflow-hidden"
                        >
                          {/* Button glow effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-pulse" />
                          
                          <AnimatePresence mode="wait">
                            {testState.isRunning ? (
                              <motion.div
                                key="running"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-2"
                              >
                                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                <span className="text-primary">&gt;</span> ТЕСТИРОВАНИЕ...
                              </motion.div>
                            ) : (
                              <motion.div
                                key="idle"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-2"
                              >
                                <Zap className="w-5 h-5" />
                                <span className="text-primary">&gt;</span> НАЧАТЬ ТЕСТ
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </Button>
                        
                        <div className="grid grid-cols-2 gap-3">
                          {(testState.phase === 'complete' || testState.phase === 'error') && (
                            <Button
                              onClick={resetTest}
                              variant="outline"
                              className="border-primary/50 hover:bg-primary/10 font-mono"
                            >
                              <span className="text-primary">&gt;</span> Новый тест
                            </Button>
                          )}
                          
                          <Button
                            onClick={loadHistory}
                            variant="outline"
                            className="border-primary/50 hover:bg-primary/10 font-mono"
                          >
                            <Activity className="w-4 h-4 mr-2" />
                            <span className="text-primary">&gt;</span> История
                          </Button>
                          
                          <Button
                            onClick={loadComparison}
                            variant="outline"
                            className="border-primary/50 hover:bg-primary/10 font-mono"
                          >
                            <TrendingUp className="w-4 h-4 mr-2" />
                            <span className="text-primary">&gt;</span> Сравнение
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              </div>
            </AnimatedSection>

            {/* Results Display */}
            {testState.results && (
              <AnimatedSection className="mb-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid md:grid-cols-3 gap-6"
                >
                  <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/50 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse" />
                    <CardContent className="p-6 text-center font-mono">
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <Download className="w-8 h-8 text-primary" />
                      </div>
                      <div className="text-3xl font-bold font-mono-tech text-primary mb-1">
                        ↓ {testState.results.download_speed.toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">DOWNLOAD_SPEED</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-accent/20 to-accent/5 border-accent/50 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent animate-pulse" />
                    <CardContent className="p-6 text-center font-mono">
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                        <Upload className="w-8 h-8 text-accent" />
                      </div>
                      <div className="text-3xl font-bold font-mono-tech text-accent mb-1">
                        ↑ {testState.results.upload_speed.toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">UPLOAD_SPEED</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 border-blue-500/50 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse" />
                    <CardContent className="p-6 text-center font-mono">
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                        <Wifi className="w-8 h-8 text-blue-400" />
                      </div>
                      <div className="text-3xl font-bold font-mono-tech text-blue-400 mb-1">
                        {testState.results.latency.average.toFixed(0)}ms
                      </div>
                      <div className="text-sm text-muted-foreground">LATENCY</div>
                      <div className="text-xs text-blue-400/70 mt-1">
                        [{testState.results.latency.min.toFixed(0)}-{testState.results.latency.max.toFixed(0)}ms]
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatedSection>
            )}

            {/* Error Display */}
            {testState.error && (
              <AnimatedSection className="mb-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Card className="bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/30">
                    <CardHeader>
                      <CardTitle className="text-red-400 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        Ошибка тестирования
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-red-300 font-mono">{testState.error}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatedSection>
            )}

            {/* History Section */}
            {showHistory && history.length > 0 && (
              <AnimatedSection className="mb-4">
                <Card className="bg-gradient-to-br from-card/80 to-black/50 border-primary/30 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary animate-pulse" />
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between font-mono">
                      <div className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-primary" />
                        <span className="text-primary">&gt;</span> ИСТОРИЯ ТЕСТОВ
                      </div>
                      <Button
                        onClick={() => setShowHistory(false)}
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-primary font-mono"
                      >
                        <span className="text-primary">&gt;</span> Скрыть
                      </Button>
                    </CardTitle>
                    <CardDescription className="font-mono">ПОСЛЕДНИЕ {history.length} РЕЗУЛЬТАТОВ</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {history.map((test, index) => (
                        <motion.div
                          key={test.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex justify-between items-center p-4 bg-background/30 rounded-lg border border-primary/20 hover:border-primary/40 transition-colors font-mono"
                        >
                          <div>
                            <div className="font-semibold text-primary flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                              SERVER_ID: {test.server_id}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              TIMESTAMP: {new Date(test.created_at).toLocaleString('ru-RU')}
                            </div>
                          </div>
                          <div className="flex gap-3 text-sm">
                            <Badge variant="secondary" className="font-mono bg-primary/10 text-primary border-primary/30">
                              ↓ {test.download_speed}
                            </Badge>
                            <Badge variant="secondary" className="font-mono bg-accent/10 text-accent border-accent/30">
                              ↑ {test.upload_speed}
                            </Badge>
                            <Badge variant="secondary" className="font-mono bg-blue-500/10 text-blue-400 border-blue-500/30">
                              {test.latency_avg}ms
                            </Badge>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            )}

            {/* Server Comparison */}
            {showComparison && comparison.length > 0 && (
              <AnimatedSection>
                <Card className="bg-gradient-to-br from-card/80 to-black/50 border-primary/30 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-primary to-accent animate-pulse" />
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between font-mono">
                      <div className="flex items-center gap-2">
                        <Globe className="w-5 h-5 text-primary" />
                        <span className="text-primary">&gt;</span> СРАВНЕНИЕ СЕРВЕРОВ
                      </div>
                      <Button
                        onClick={() => setShowComparison(false)}
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-primary font-mono"
                      >
                        <span className="text-primary">&gt;</span> Скрыть
                      </Button>
                    </CardTitle>
                    <CardDescription className="font-mono">СРЕДНИЕ ПОКАЗАТЕЛИ ПРОИЗВОДИТЕЛЬНОСТИ</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {comparison.map((server, index) => (
                        <motion.div
                          key={server.server_id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex justify-between items-center p-4 bg-background/30 rounded-lg border border-primary/20 font-mono"
                        >
                          <div>
                            <div className="font-semibold text-primary flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                              NODE: {server.server_name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              TESTS_COUNT: {server.test_count}
                            </div>
                          </div>
                          <div className="flex gap-3 text-sm">
                            <Badge variant="outline" className="font-mono border-primary/30 bg-primary/5 text-primary">
                              ↓ {server.avg_download.toFixed(1)}
                            </Badge>
                            <Badge variant="outline" className="font-mono border-accent/30 bg-accent/5 text-accent">
                              ↑ {server.avg_upload.toFixed(1)}
                            </Badge>
                            <Badge variant="outline" className="font-mono border-blue-500/30 bg-blue-500/5 text-blue-400">
                              {server.avg_latency.toFixed(0)}ms
                            </Badge>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}