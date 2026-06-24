import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { AnimatedSection } from '@/components/AnimatedSection';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Server, 
  Key, 
  CreditCard, 
  BarChart3, 
  LogOut,
  Download,
  Copy,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  Zap,
  Loader2,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ComposableMap, Geographies, Geography, Marker, Line as MapLine, ZoomableGroup } from 'react-simple-maps';
import * as Flags from 'country-flag-icons/react/3x2';
// @ts-ignore
import worldCountries from '@/assets/world-countries.json';
import { usePayments } from '@/hooks/usePayments';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useUserKeys } from '@/hooks/useUserKeys';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

type Tab = 'profile' | 'servers' | 'keys' | 'payments' | 'stats' | 'speedtest';

const Account = () => {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [showApiKey, setShowApiKey] = useState(false);
  const [hoveredServer, setHoveredServer] = useState<number | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('yookassa'); // По умолчанию ЮKassa
  const [isCreatingPayment, setIsCreatingPayment] = useState(false);
  
  // Загружаем данные
  const { payments, stats, isLoading: paymentsLoading, createPayment } = usePayments();
  const { profile, refreshProfile } = useUserProfile();
  const { keys: userKeys, refreshKeys } = useUserKeys();
  const profileData = profile;
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Вы вышли из аккаунта');
    navigate('/login', { replace: true });
  };

  // Редактирование профиля
  const [editEmail, setEditEmail] = useState('');
  const [editTelegram, setEditTelegram] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  useEffect(() => {
    if (profileData) {
      setEditEmail(profileData.email || '');
      setEditTelegram(profileData.telegram_id || '');
    }
  }, [profileData]);

  const emailChanged = profileData && editEmail.trim().toLowerCase() !== (profileData.email || '').toLowerCase();
  const telegramChanged = profileData && editTelegram.trim().replace(/^@/, '') !== (profileData.telegram_id || '');

  const handleSaveProfile = async () => {
    if (!profileData) return;
    if ((emailChanged || newPassword) && !currentPassword) {
      toast.error('Для смены email или пароля введите текущий пароль');
      return;
    }
    setIsSavingProfile(true);
    try {
      const payload: any = {};
      if (emailChanged) payload.email = editEmail.trim();
      if (telegramChanged) payload.telegram_id = editTelegram.trim();
      if (newPassword) payload.new_password = newPassword;
      if (currentPassword) payload.current_password = currentPassword;
      await api.updateUserProfile(payload);
      toast.success('Профиль обновлён');
      setCurrentPassword('');
      setNewPassword('');
      refreshProfile();
    } catch (e: any) {
      toast.error(e?.message || 'Ошибка сохранения профиля');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Реальная статистика трафика и список серверов
  const [myTraffic, setMyTraffic] = useState<Awaited<ReturnType<typeof api.getMyTraffic>> | null>(null);
  const [realServers, setRealServers] = useState<any[]>([]);
  const [speedHistory, setSpeedHistory] = useState<any[]>([]);
  useEffect(() => {
    api.getMyTraffic().then(setMyTraffic).catch(() => {});
    api.getServers().then((s) => setRealServers(Array.isArray(s) ? s : [])).catch(() => {});
    api.getSpeedTestHistory(14).then((r) => setSpeedHistory(r.history || [])).catch(() => {});
  }, []);

  // Серверы с координатами
  const servers = [
    { 
      id: 1, 
      name: 'Москва', 
      coords: [37.6173, 55.7558], 
      status: 'active', 
      ping: '[YOU]', 
      isYou: true,
      country: 'Россия',
      countryCode: 'RU',
      info: 'Основной сервер • 1 Гбит/с • 99.9% uptime'
    },
    { 
      id: 2, 
      name: 'Amsterdam', 
      coords: [4.9041, 52.3676], 
      status: 'active', 
      ping: '23ms', 
      isYou: false,
      country: 'Нидерланды',
      countryCode: 'NL',
      info: 'EU West • 10 Гбит/с • AmneziaWG'
    },
    { 
      id: 3, 
      name: 'Frankfurt', 
      coords: [8.6821, 50.1109], 
      status: 'active', 
      ping: '18ms', 
      isYou: false,
      country: 'Германия',
      countryCode: 'DE',
      info: 'EU Central • 10 Гбит/с • WireGuard'
    },
    { 
      id: 4, 
      name: 'Singapore', 
      coords: [103.8198, 1.3521], 
      status: 'available', 
      ping: '85ms', 
      isYou: false,
      country: 'Сингапур',
      countryCode: 'SG',
      info: 'Asia Pacific • 1 Гбит/с • Скоро'
    },
    { 
      id: 5, 
      name: 'Tokyo', 
      coords: [139.6917, 35.6895], 
      status: 'available', 
      ping: '120ms', 
      isYou: false,
      country: 'Япония',
      countryCode: 'JP',
      info: 'Asia East • 1 Гбит/с • Скоро'
    },
  ];

  const tabs = [
    { id: 'profile' as Tab, label: 'Профиль', icon: User },
    { id: 'servers' as Tab, label: 'Серверы', icon: Server },
    { id: 'keys' as Tab, label: 'Ключи', icon: Key },
    { id: 'payments' as Tab, label: 'Платежи', icon: CreditCard },
    { id: 'stats' as Tab, label: 'Статистика', icon: BarChart3 },
    { id: 'speedtest' as Tab, label: 'Speed Test', icon: Zap },
  ];

  // Реальные серверы
  const serversList = realServers.map((s) => ({
    id: s.id,
    name: s.name,
    location: s.location || s.country || '',
    status: s.status,
    ip: s.ip_address,
    load: s.current_peers && s.max_users ? Math.round((s.current_peers / s.max_users) * 100) : 0,
    protocols: s.protocols || [],
  }));

  // Реальные ключи пользователя
  const keys = userKeys.map((k) => ({
    id: k.id,
    name: k.name,
    protocol: k.protocol === 'amneziawg' ? 'AmneziaWG' : 'WireGuard',
    server: k.server?.name || `Сервер #${k.server_id}`,
    created: k.created_at,
    status: k.status,
    config: k.config,
  }));

  // Данные для графиков — реальная история трафика ключей пользователя
  const trafficData = (myTraffic?.daily || []).map((d) => ({
    day: new Date(d.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }),
    traffic: +(d.rx_gb + d.tx_gb).toFixed(3),
    rx: +d.rx_gb.toFixed(3),
    tx: +d.tx_gb.toFixed(3),
  }));

  // Пинг — из реальной истории спидтестов пользователя
  const pingData = [...speedHistory]
    .reverse()
    .map((h: any) => ({
      day: new Date(h.created_at).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }),
      ping: Math.round(h.latency_avg || 0),
    }));

  const handleCreatePayment = async () => {
    const amount = parseFloat(paymentAmount);
    if (!amount || amount < 100) {
      toast.error('Минимальная сумма пополнения: 100₽');
      return;
    }

    try {
      setIsCreatingPayment(true);
      // Всегда используем ЮKassa, так как Cryptomus временно недоступен
      const payment = await createPayment(amount, 'RUB', 'yookassa');
      
      if (payment.payment_url) {
        // Открываем страницу оплаты в новом окне
        window.open(payment.payment_url, '_blank');
        toast.success(`Платеж создан через ЮKassa! Перенаправляем на страницу оплаты...`);
      } else {
        toast.success('Платеж создан успешно!');
      }
      
      setShowPaymentModal(false);
      setPaymentAmount('');
    } catch (error: any) {
      console.error('Payment creation failed:', error);
      toast.error(`Ошибка создания платежа: ${error.message}`);
    } finally {
      setIsCreatingPayment(false);
    }
  };

  const handleShowPaymentDetails = (payment: any) => {
    setSelectedPayment(payment);
    setShowPaymentDetails(true);
  };

  const handleDownloadReceipt = (payment: any) => {
    // Генерируем HTML чек
    const receiptDate = new Date(payment.created_at);
    const receiptHtml = `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Чек об оплате №${payment.id}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Courier New', monospace; 
            background: #000; 
            color: #CCFF00; 
            padding: 20px;
            line-height: 1.4;
        }
        .receipt { 
            max-width: 400px; 
            margin: 0 auto; 
            background: #111; 
            border: 2px solid #CCFF00; 
            padding: 20px;
            box-shadow: 0 0 20px rgba(204, 255, 0, 0.3);
        }
        .header { 
            text-align: center; 
            border-bottom: 1px dashed #CCFF00; 
            padding-bottom: 15px; 
            margin-bottom: 15px; 
        }
        .company-name { 
            font-size: 24px; 
            font-weight: bold; 
            margin-bottom: 5px;
            text-shadow: 0 0 10px #CCFF00;
        }
        .company-info { 
            font-size: 12px; 
            color: #888; 
            margin-bottom: 10px; 
        }
        .receipt-title { 
            font-size: 16px; 
            font-weight: bold; 
            margin-bottom: 5px; 
        }
        .receipt-number { 
            font-size: 14px; 
            color: #888; 
        }
        .section { 
            margin: 15px 0; 
            padding: 10px 0; 
        }
        .row { 
            display: flex; 
            justify-content: space-between; 
            margin: 5px 0; 
        }
        .label { 
            color: #888; 
            text-transform: uppercase; 
        }
        .value { 
            color: #CCFF00; 
            font-weight: bold; 
        }
        .amount { 
            font-size: 20px; 
            text-align: center; 
            padding: 15px; 
            border: 1px solid #CCFF00; 
            margin: 15px 0; 
            background: rgba(204, 255, 0, 0.1);
            text-shadow: 0 0 10px #CCFF00;
        }
        .footer { 
            border-top: 1px dashed #CCFF00; 
            padding-top: 15px; 
            margin-top: 15px; 
            text-align: center; 
            font-size: 12px; 
            color: #888; 
        }
        .status { 
            display: inline-block; 
            padding: 5px 10px; 
            border-radius: 3px; 
            font-size: 12px; 
            font-weight: bold; 
        }
        .status.paid { 
            background: rgba(204, 255, 0, 0.2); 
            color: #CCFF00; 
            border: 1px solid #CCFF00; 
        }
        .status.pending { 
            background: rgba(255, 165, 0, 0.2); 
            color: #FFA500; 
            border: 1px solid #FFA500; 
        }
        .status.failed { 
            background: rgba(255, 0, 0, 0.2); 
            color: #FF0000; 
            border: 1px solid #FF0000; 
        }
        .qr-placeholder { 
            width: 80px; 
            height: 80px; 
            border: 1px solid #CCFF00; 
            margin: 10px auto; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            font-size: 10px; 
            color: #888; 
        }
        .print-button {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #CCFF00;
            color: #000;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-family: 'Courier New', monospace;
            font-weight: bold;
            box-shadow: 0 0 10px rgba(204, 255, 0, 0.5);
        }
        .print-button:hover {
            background: #B8E600;
        }
        @media print {
            body { background: white; color: black; }
            .receipt { border-color: black; box-shadow: none; }
            .company-name, .value, .amount { color: black; text-shadow: none; }
            .status.paid { background: #f0f0f0; color: black; border-color: black; }
            .print-button { display: none; }
        }
    </style>
</head>
<body>
    <button class="print-button" onclick="window.print()">🖨️ ПЕЧАТЬ</button>
    
    <div class="receipt">
        <div class="header">
            <div class="company-name">3WG.RU</div>
            <div class="company-info">
                VPN Services & Infrastructure<br>
                support@3wg.ru
            </div>
            <div class="receipt-title">ЧЕК ОБ ОПЛАТЕ</div>
            <div class="receipt-number">№${payment.id.toString().padStart(6, '0')}</div>
        </div>

        <div class="section">
            <div class="row">
                <span class="label">Дата и время:</span>
                <span class="value">${receiptDate.toLocaleDateString('ru-RU')} ${receiptDate.toLocaleTimeString('ru-RU')}</span>
            </div>
            <div class="row">
                <span class="label">Способ оплаты:</span>
                <span class="value">${payment.method || payment.payment_method || 'ЮKassa'}</span>
            </div>
            <div class="row">
                <span class="label">Статус:</span>
                <span class="status ${payment.status === 'paid' || payment.status === 'completed' ? 'paid' : payment.status === 'pending' ? 'pending' : 'failed'}">
                    ${payment.status === 'paid' || payment.status === 'completed' ? 'ОПЛАЧЕНО' : payment.status === 'pending' ? 'ОЖИДАНИЕ' : 'ОШИБКА'}
                </span>
            </div>
            ${payment.order_id ? `
            <div class="row">
                <span class="label">Order ID:</span>
                <span class="value">${payment.order_id}</span>
            </div>
            ` : ''}
        </div>

        <div class="amount">
            СУММА: ${payment.amount} ₽
            <div style="font-size: 12px; margin-top: 5px; color: #888;">
                ≈ ${(payment.amount * 0.011).toFixed(2)} USD
            </div>
        </div>

        <div class="section">
            <div class="row">
                <span class="label">Услуга:</span>
                <span class="value">Пополнение баланса</span>
            </div>
            <div class="row">
                <span class="label">Описание:</span>
                <span class="value">VPN сервис 3WG.RU</span>
            </div>
            ${payment.transaction_id ? `
            <div class="row">
                <span class="label">Transaction ID:</span>
                <span class="value" style="font-size: 10px; word-break: break-all;">${payment.transaction_id}</span>
            </div>
            ` : ''}
        </div>

        <div class="qr-placeholder">
            QR CODE
        </div>

        <div class="footer">
            <div>Спасибо за использование наших услуг!</div>
            <div style="margin-top: 10px;">
                Этот чек является подтверждением оплаты<br>
                и может быть использован для отчетности
            </div>
            <div style="margin-top: 10px; font-size: 10px;">
                Сгенерировано: ${new Date().toLocaleString('ru-RU')}<br>
                3WG.RU © ${new Date().getFullYear()}
            </div>
        </div>
    </div>
</body>
</html>`;

    // Открываем чек в новой вкладке
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(receiptHtml);
      newWindow.document.close();
      newWindow.document.title = `Чек №${payment.id.toString().padStart(6, '0')} - 3WG.RU`;
      toast.success('Чек открыт в новой вкладке! Используйте кнопку "ПЕЧАТЬ" для печати или сохранения в PDF.');
    } else {
      toast.error('Не удалось открыть чек. Проверьте настройки блокировки всплывающих окон.');
    }
  };

  const quickAmounts = [500, 1000, 2500, 5000];

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-8 relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-20" />
        
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold font-mono-tech mb-2">
                  Личный <span className="text-gradient-primary">кабинет</span>
                </h1>
                <p className="text-muted-foreground font-mono">{profile?.email || '...'}</p>
              </div>
              <Button variant="outline" className="group" onClick={handleLogout}>
                <LogOut className="mr-2 w-4 h-4" />
                Выйти
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Tabs */}
      <section className="border-b border-border sticky top-16 bg-background/95 backdrop-blur-sm z-40">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-mono text-sm transition-all border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 relative min-h-screen">
        <div className="container mx-auto px-4">
          
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <AnimatedSection>
              <div className="max-w-2xl">
                <h2 className="text-2xl font-bold font-mono-tech mb-6">Информация о профиле</h2>
                
                <div className="space-y-6">
                  {/* Сводка по аккаунту */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-card rounded-lg border border-border">
                      <span className="text-xs text-muted-foreground font-mono block mb-1">ID аккаунта</span>
                      <span className="text-xl font-bold font-mono">#{profile?.id ?? '—'}</span>
                    </div>
                    <div className="p-4 bg-card rounded-lg border border-border">
                      <span className="text-xs text-muted-foreground font-mono block mb-1">Баланс</span>
                      <span className="text-xl font-bold font-mono text-primary">{(profile?.balance ?? 0).toFixed(2)} ₽</span>
                    </div>
                    <div className="p-4 bg-card rounded-lg border border-border">
                      <span className="text-xs text-muted-foreground font-mono block mb-1">Активных ключей</span>
                      <span className="text-xl font-bold font-mono">{myTraffic?.keys_active ?? 0} / {myTraffic?.keys_total ?? userKeys.length}</span>
                    </div>
                    <div className="p-4 bg-card rounded-lg border border-border">
                      <span className="text-xs text-muted-foreground font-mono block mb-1">Трафик всего</span>
                      <span className="text-xl font-bold font-mono">{(myTraffic?.traffic?.total_gb ?? 0).toFixed(1)} GB</span>
                    </div>
                  </div>

                  {/* Редактирование данных */}
                  <div className="p-6 bg-card rounded-lg border border-border">
                    <h3 className="font-bold font-mono-tech mb-4">Данные аккаунта</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm text-muted-foreground font-mono mb-2 block">Email</label>
                        <input
                          type="email"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          className="w-full px-4 py-2 rounded-lg bg-background border border-border font-mono text-sm focus:border-primary outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground font-mono mb-2 block">Telegram</label>
                        <input
                          type="text"
                          value={editTelegram}
                          onChange={(e) => setEditTelegram(e.target.value)}
                          placeholder="@username или ID"
                          className="w-full px-4 py-2 rounded-lg bg-background border border-border font-mono text-sm focus:border-primary outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground font-mono mb-2 block">Тариф</label>
                        <div className="flex items-center gap-2 h-[42px]">
                          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-mono text-sm font-bold uppercase">
                            {(profile as any)?.tariff || 'FREE'}
                          </span>
                          {(profile as any)?.is_admin && (
                            <span className="px-3 py-1 rounded-full bg-accent/10 text-accent font-mono text-sm font-bold">ADMIN</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground font-mono mb-2 block">Дата регистрации</label>
                        <span className="font-mono text-sm flex items-center h-[42px]">
                          {profile?.created_at ? new Date(profile.created_at).toLocaleString('ru-RU') : '—'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Смена пароля */}
                  <div className="p-6 bg-card rounded-lg border border-border">
                    <h3 className="font-bold font-mono-tech mb-2">Безопасность</h3>
                    <p className="text-xs text-muted-foreground font-mono mb-4">
                      Текущий пароль нужен для смены email или установки нового пароля
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm text-muted-foreground font-mono mb-2 block">Текущий пароль</label>
                        <input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-4 py-2 rounded-lg bg-background border border-border font-mono text-sm focus:border-primary outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground font-mono mb-2 block">Новый пароль</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Минимум 8 символов"
                          className="w-full px-4 py-2 rounded-lg bg-background border border-border font-mono text-sm focus:border-primary outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Кнопка сохранения */}
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={handleSaveProfile}
                      disabled={isSavingProfile || (!emailChanged && !telegramChanged && !newPassword)}
                    >
                      {isSavingProfile ? 'Сохранение...' : 'Сохранить изменения'}
                    </Button>
                    {(emailChanged || telegramChanged || newPassword) && (
                      <span className="text-xs text-accent font-mono">Есть несохранённые изменения</span>
                    )}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          )}

          {/* Servers Tab */}
          {activeTab === 'servers' && (
            <AnimatedSection>
              <div className="max-w-4xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold font-mono-tech">Мои серверы</h2>
                  <Button className="group">
                    <Plus className="mr-2 w-4 h-4" />
                    Добавить сервер
                  </Button>
                </div>

                <div className="grid gap-4">
                  {serversList.map((server) => (
                    <motion.div
                      key={server.id}
                      className="p-6 bg-card rounded-lg border border-border"
                      whileHover={{ borderColor: 'hsl(73 100% 50% / 0.5)' }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold font-mono-tech mb-1">{server.name}</h3>
                          <p className="text-sm text-muted-foreground font-mono">{server.location}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                          <span className="text-sm text-primary font-mono">ACTIVE</span>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <span className="text-xs text-muted-foreground font-mono block mb-1">IP адрес</span>
                          <span className="font-mono text-sm">{server.ip}</span>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground font-mono block mb-1">Нагрузка</span>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary transition-all"
                                style={{ width: `${server.load}%` }}
                              />
                            </div>
                            <span className="font-mono text-sm">{server.load}%</span>
                          </div>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground font-mono block mb-1">Протоколы</span>
                          <div className="flex gap-1">
                            {(server.protocols || []).map((p: string) => (
                              <span
                                key={p}
                                className={`px-2 py-0.5 rounded text-xs font-mono ${
                                  p === 'amneziawg' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'
                                }`}
                              >
                                {p === 'amneziawg' ? 'AWG' : 'WG'}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => navigate('/keys')}>
                          <Plus className="mr-2 w-3 h-3" />
                          Получить ключ
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          )}

          {/* Keys Tab */}
          {activeTab === 'keys' && (
            <AnimatedSection>
              <div className="max-w-4xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold font-mono-tech">Ключи доступа</h2>
                  <Button className="group" onClick={() => navigate('/keys')}>
                    <Plus className="mr-2 w-4 h-4" />
                    Создать ключ
                  </Button>
                </div>

                <div className="grid gap-4">
                  {keys.length === 0 && (
                    <div className="p-10 bg-card rounded-lg border border-border text-center">
                      <p className="font-mono text-muted-foreground mb-4">У вас пока нет ключей</p>
                      <Button onClick={() => navigate('/keys')}>
                        <Plus className="mr-2 w-4 h-4" />
                        Создать первый ключ
                      </Button>
                    </div>
                  )}
                  {keys.map((key) => (
                    <motion.div
                      key={key.id}
                      className="p-6 bg-card rounded-lg border border-border"
                      whileHover={{ borderColor: 'hsl(73 100% 50% / 0.5)' }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold font-mono-tech mb-1">{key.name}</h3>
                          <p className="text-sm text-muted-foreground font-mono">{key.server}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {key.status === 'active' ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-primary" />
                              <span className="text-sm text-primary font-mono">Активен</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground font-mono">Неактивен</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <span className="text-xs text-muted-foreground font-mono block mb-1">Протокол</span>
                          <span className="px-2 py-1 rounded bg-primary/10 text-primary text-xs font-mono font-bold">
                            {key.protocol}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground font-mono block mb-1">Создан</span>
                          <span className="font-mono text-sm">{new Date(key.created).toLocaleDateString('ru-RU')}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={!key.config}
                          onClick={() => {
                            const blob = new Blob([key.config], { type: 'text/plain' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `${key.name}.conf`;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                            toast.success('Конфиг скачан');
                          }}
                        >
                          <Download className="mr-2 w-3 h-3" />
                          Скачать .conf
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => navigate(`/keys/${key.id}`)}>
                          <Copy className="mr-2 w-3 h-3" />
                          QR-код
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={async () => {
                            if (!window.confirm(`Удалить ключ "${key.name}"?`)) return;
                            try {
                              await api.deleteKey(key.id);
                              toast.success('Ключ удален');
                              refreshKeys();
                            } catch (e: any) {
                              toast.error(e?.message || 'Ошибка удаления');
                            }
                          }}
                        >
                          <Trash2 className="mr-2 w-3 h-3" />
                          Удалить
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <AnimatedSection>
              <div className="max-w-4xl">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold font-mono-tech">История платежей</h2>
                </div>

                {/* Balance Card */}
                <div className="p-6 bg-card rounded-lg border border-border mb-6 relative overflow-hidden">
                  {/* Cyber grid background */}
                  <div 
                    className="absolute inset-0 opacity-5"
                    style={{
                      backgroundImage: `
                        linear-gradient(rgba(204,255,0,0.3) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(204,255,0,0.3) 1px, transparent 1px)
                      `,
                      backgroundSize: '20px 20px',
                    }}
                  />
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-sm text-muted-foreground font-mono block mb-1">ТЕКУЩИЙ_БАЛАНС</span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-bold font-mono-tech text-primary">
                            {profile?.balance?.toFixed(2) || '0.00'}
                          </span>
                          <span className="text-lg text-muted-foreground font-mono">RUB</span>
                        </div>
                        <div className="text-xs text-muted-foreground font-mono mt-1">
                          ≈ ${((profile?.balance || 0) * 0.011).toFixed(2)} USD • Обновлено: {new Date().toLocaleTimeString('ru-RU')}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-2">
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
                          <span className="text-xs text-primary font-mono font-bold">[ АКТИВЕН ]</span>
                        </div>
                        <Button 
                          className="bg-primary text-black hover:bg-primary/90 font-mono-tech"
                          onClick={() => setShowPaymentModal(true)}
                        >
                          <DollarSign className="mr-2 w-4 h-4" />
                          ПОПОЛНИТЬ
                        </Button>
                      </div>
                    </div>

                    {/* Quick stats */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                      <div className="text-center">
                        <div className="text-lg font-bold font-mono text-primary">
                          {paymentsLoading ? '...' : stats?.total_payments || 0}
                        </div>
                        <div className="text-xs text-muted-foreground font-mono">ПЛАТЕЖЕЙ</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold font-mono text-primary">
                          {paymentsLoading ? '...' : stats?.total_amount?.toFixed(0) || 0}
                        </div>
                        <div className="text-xs text-muted-foreground font-mono">ВСЕГО_RUB</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold font-mono text-primary">
                          {paymentsLoading ? '...' : `${stats?.success_rate?.toFixed(0) || 0}%`}
                        </div>
                        <div className="text-xs text-muted-foreground font-mono">УСПЕШНЫХ</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <motion.div
                    className="p-4 bg-card rounded-lg border border-border hover:border-primary/50 transition-all cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setShowPaymentModal(true)}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-bold text-lg">₽</span>
                      </div>
                      <div>
                        <div className="font-bold font-mono-tech">ЮKassa</div>
                        <div className="text-xs text-muted-foreground font-mono">Карты, СБП</div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground font-mono">
                      Банковские карты • Мгновенно • 0% комиссия
                    </div>
                  </motion.div>

                  <motion.div
                    className="p-4 bg-card rounded-lg border border-border opacity-60 cursor-not-allowed relative"
                  >
                    {/* Coming Soon Badge */}
                    <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                      СКОРО
                    </div>
                    
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded bg-muted/30 flex items-center justify-center">
                        <span className="text-muted-foreground font-bold text-lg">₮</span>
                      </div>
                      <div>
                        <div className="font-bold font-mono-tech text-muted-foreground">USDT</div>
                        <div className="text-xs text-muted-foreground font-mono">TRC20</div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground font-mono">
                      Быстрые переводы • В разработке
                    </div>
                  </motion.div>

                  <motion.div
                    className="p-4 bg-card rounded-lg border border-border opacity-60 cursor-not-allowed relative"
                  >
                    {/* Coming Soon Badge */}
                    <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                      СКОРО
                    </div>
                    
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded bg-muted/30 flex items-center justify-center">
                        <span className="text-muted-foreground font-bold text-lg">₿</span>
                      </div>
                      <div>
                        <div className="font-bold font-mono-tech text-muted-foreground">BTC</div>
                        <div className="text-xs text-muted-foreground font-mono">Bitcoin</div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground font-mono">
                      Классическая криптовалюта • В разработке
                    </div>
                  </motion.div>
                </div>

                {/* Payments table */}
                <div className="bg-card rounded-lg border border-border overflow-hidden">
                  <div className="p-4 border-b border-border bg-muted/20">
                    <h3 className="font-bold font-mono-tech flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-primary" />
                      Последние транзакции
                    </h3>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-mono text-muted-foreground">ДАТА</th>
                          <th className="px-6 py-3 text-left text-xs font-mono text-muted-foreground">СУММА</th>
                          <th className="px-6 py-3 text-left text-xs font-mono text-muted-foreground">МЕТОД</th>
                          <th className="px-6 py-3 text-left text-xs font-mono text-muted-foreground">ТАРИФ</th>
                          <th className="px-6 py-3 text-left text-xs font-mono text-muted-foreground">СТАТУС</th>
                          <th className="px-6 py-3 text-left text-xs font-mono text-muted-foreground">ДЕЙСТВИЯ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paymentsLoading ? (
                          <tr>
                            <td colSpan={6} className="px-6 py-12 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                <span className="font-mono text-sm text-muted-foreground">Загрузка платежей...</span>
                              </div>
                            </td>
                          </tr>
                        ) : payments.length > 0 ? (
                          payments.map((payment, index) => (
                            <motion.tr 
                              key={payment.id} 
                              className="border-t border-border hover:bg-muted/20 transition-colors"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <td className="px-6 py-4 font-mono text-sm">
                                <div>
                                  {new Date(payment.created_at).toLocaleDateString('ru-RU')}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {new Date(payment.created_at).toLocaleTimeString('ru-RU')}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="font-mono text-sm font-bold text-primary">
                                  {payment.amount} ₽
                                </div>
                                <div className="text-xs text-muted-foreground font-mono">
                                  ≈ ${(payment.amount * 0.011).toFixed(2)} USD
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
                                    <span className="text-xs font-bold text-primary">
                                      {payment.payment_method === 'USDT TRC20' || payment.payer_currency === 'USDT' ? '₮' : 
                                       payment.payment_method === 'TON' || payment.payer_currency === 'TON' ? '💎' : '₿'}
                                    </span>
                                  </div>
                                  <div>
                                    <div className="font-mono text-sm">
                                      {payment.payment_method || payment.payer_currency || payment.method}
                                    </div>
                                    {payment.network && (
                                      <div className="text-xs text-muted-foreground">{payment.network}</div>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="px-2 py-1 rounded bg-primary/10 text-primary text-xs font-mono font-bold">
                                  {payment.plan || 'PRO'}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  {payment.status === 'paid' || payment.status === 'completed' ? (
                                    <>
                                      <CheckCircle className="w-4 h-4 text-primary" />
                                      <span className="font-mono text-primary text-sm font-bold">ЗАВЕРШЁН</span>
                                    </>
                                  ) : payment.status === 'pending' ? (
                                    <>
                                      <motion.div
                                        className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                      />
                                      <span className="font-mono text-yellow-500 text-sm font-bold">ОЖИДАНИЕ</span>
                                    </>
                                  ) : (
                                    <>
                                      <AlertCircle className="w-4 h-4 text-red-500" />
                                      <span className="font-mono text-red-500 text-sm font-bold">ОШИБКА</span>
                                    </>
                                  )}
                                </div>
                                <div className="text-xs text-muted-foreground font-mono">
                                  ID: {payment.id.toString().padStart(6, '0')}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="font-mono-tech"
                                    onClick={() => handleShowPaymentDetails(payment)}
                                  >
                                    <Eye className="w-3 h-3 mr-1" />
                                    ДЕТАЛИ
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="font-mono-tech"
                                    onClick={() => handleDownloadReceipt(payment)}
                                  >
                                    <Download className="w-3 h-3 mr-1" />
                                    ЧЕК
                                  </Button>
                                </div>
                              </td>
                            </motion.tr>
                          ))
                        ) : null}
                      </tbody>
                    </table>
                  </div>

                  {/* Empty state */}
                  {!paymentsLoading && payments.length === 0 && (
                    <div className="p-12 text-center">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-4"
                      >
                        <CreditCard className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-bold font-mono-tech text-muted-foreground mb-2">
                          НЕТ_ПЛАТЕЖЕЙ
                        </h3>
                        <p className="text-sm text-muted-foreground font-mono mb-6">
                          История транзакций пуста. Пополните баланс для начала работы.
                        </p>
                        <Button 
                          className="bg-primary text-black hover:bg-primary/90 font-mono-tech"
                          onClick={() => window.open('/deposit', '_blank')}
                        >
                          <Plus className="mr-2 w-4 h-4" />
                          ПЕРВОЕ_ПОПОЛНЕНИЕ
                        </Button>
                      </motion.div>
                    </div>
                  )}
                </div>

                {/* Payment Stats */}
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  {/* Monthly spending */}
                  <div className="p-6 bg-card rounded-lg border border-border">
                    <h3 className="font-bold font-mono-tech mb-4 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-primary" />
                      Расходы по месяцам
                    </h3>
                    <div className="space-y-3">
                      {stats?.monthly_spending?.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div>
                            <div className="font-mono text-sm">{item.month}</div>
                            <div className="text-xs text-muted-foreground">{item.amount} ₽</div>
                          </div>
                          <div className="flex items-center gap-2 flex-1 max-w-[120px]">
                            <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
                              <motion.div 
                                className="h-full bg-primary"
                                initial={{ width: 0 }}
                                animate={{ width: `${item.percent}%` }}
                                transition={{ duration: 1, delay: index * 0.2 }}
                              />
                            </div>
                            <span className="text-xs font-mono text-primary">{item.percent}%</span>
                          </div>
                        </div>
                      )) || (
                        <div className="text-center py-4">
                          <span className="text-sm text-muted-foreground font-mono">Нет данных</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payment methods stats */}
                  <div className="p-6 bg-card rounded-lg border border-border">
                    <h3 className="font-bold font-mono-tech mb-4 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-primary" />
                      Методы оплаты
                    </h3>
                    <div className="space-y-3">
                      {stats?.payment_methods?.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded bg-background border border-border">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                              <span className="text-primary">{item.icon}</span>
                            </div>
                            <div>
                              <div className="font-mono text-sm">{item.method}</div>
                              <div className="text-xs text-muted-foreground">{item.count} транзакций</div>
                            </div>
                          </div>
                          <div className={`font-mono text-sm font-bold ${item.color}`}>
                            {item.count > 0 ? `${item.count}x` : 'Не использовался'}
                          </div>
                        </div>
                      )) || (
                        <div className="text-center py-4">
                          <span className="text-sm text-muted-foreground font-mono">Нет данных</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          )}

          {/* Stats Tab */}
          {activeTab === 'stats' && (
            <AnimatedSection>
              <div className="max-w-6xl">
                <h2 className="text-2xl font-bold font-mono-tech mb-6">Статистика использования</h2>

                {/* Stats cards */}
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  <div className="p-6 bg-card rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground font-mono">Трафик всего</span>
                      <TrendingUp className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-3xl font-bold font-mono-tech">
                      {(myTraffic?.traffic?.total_gb ?? 0).toFixed(2)} GB
                    </span>
                    <p className="text-xs text-muted-foreground font-mono mt-1">
                      ↓ {(myTraffic?.traffic?.rx_gb ?? 0).toFixed(2)} GB · ↑ {(myTraffic?.traffic?.tx_gb ?? 0).toFixed(2)} GB
                    </p>
                  </div>

                  <div className="p-6 bg-card rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground font-mono">Ключи</span>
                      <Calendar className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-3xl font-bold font-mono-tech">
                      {myTraffic?.keys_active ?? 0} / {myTraffic?.keys_total ?? 0}
                    </span>
                    <p className="text-xs text-muted-foreground font-mono mt-1">активных из всех</p>
                  </div>

                  <div className="p-6 bg-card rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground font-mono">Средний пинг</span>
                      <TrendingDown className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-3xl font-bold font-mono-tech">
                      {pingData.length > 0
                        ? Math.round(pingData.reduce((s, p) => s + p.ping, 0) / pingData.length) + ' ms'
                        : '—'}
                    </span>
                    <p className="text-xs text-muted-foreground font-mono mt-1">
                      {pingData.length > 0 ? `по ${pingData.length} спидтестам` : 'запустите Speed Test'}
                    </p>
                  </div>
                </div>

                {/* World Map */}
                <div className="p-6 bg-card rounded-lg border border-border mb-6">
                  <h3 className="font-bold font-mono-tech mb-4 flex items-center gap-2">
                    <Server className="w-5 h-5 text-primary" />
                    География подключений
                  </h3>
                  <div className="relative w-full h-[500px] bg-background rounded-lg overflow-hidden border border-border/50">
                    <ComposableMap
                      projection="geoMercator"
                      projectionConfig={{
                        scale: 150,
                        center: [30, 50]
                      }}
                      style={{ width: '100%', height: '100%' }}
                    >
                      <defs>
                        <filter id="dataGlow" x="-50%" y="-50%" width="200%" height="200%">
                          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                          <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                        </filter>
                      </defs>
                      
                      <ZoomableGroup
                        zoom={1}
                        minZoom={1}
                        maxZoom={8}
                        center={[30, 50]}
                      >
                        {/* Graticule lines */}
                        <Geographies geography={worldCountries}>
                          {({ geographies }) =>
                            geographies.map((geo) => (
                              <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                fill="#0a0a0a"
                                stroke="hsl(73 100% 50% / 0.6)"
                                strokeWidth={0.3}
                                style={{
                                  default: { outline: 'none' },
                                  hover: { outline: 'none', fill: '#0a0a0a' },
                                  pressed: { outline: 'none' },
                                }}
                              />
                            ))
                          }
                        </Geographies>

                        {/* Connection lines */}
                        {servers.slice(1).map((server, i) => {
                          const moscowCoords = servers[0].coords;
                          return (
                            <g key={`connection-${i}`}>
                              <MapLine
                                from={moscowCoords}
                                to={server.coords}
                                stroke={server.status === 'active' ? '#CCFF00' : '#666666'}
                                strokeWidth={server.status === 'active' ? 1 : 0.5}
                                strokeLinecap="round"
                                strokeDasharray={server.status === 'active' ? '5,5' : '3,3'}
                                opacity={server.status === 'active' ? 0.8 : 0.3}
                              />
                              
                              {/* Animated data packets - cyan with strong glow */}
                              {server.status === 'active' && (
                                <>
                                  {/* Glow layer */}
                                  <MapLine
                                    from={moscowCoords}
                                    to={server.coords}
                                    stroke="#00D9FF"
                                    strokeWidth={3}
                                    strokeLinecap="round"
                                    strokeDasharray="0.5,20"
                                    opacity={0.6}
                                    style={{ filter: 'url(#dataGlow)' }}
                                  >
                                    <animate
                                      attributeName="stroke-dashoffset"
                                      from="0"
                                      to="20.5"
                                      dur={`${2 + i * 0.5}s`}
                                      repeatCount="indefinite"
                                    />
                                  </MapLine>
                                  
                                  {/* Core bright dot */}
                                  <MapLine
                                    from={moscowCoords}
                                    to={server.coords}
                                    stroke="#FFFFFF"
                                    strokeWidth={1}
                                    strokeLinecap="round"
                                    strokeDasharray="0.5,20"
                                    opacity={1}
                                  >
                                    <animate
                                      attributeName="stroke-dashoffset"
                                      from="0"
                                      to="20.5"
                                      dur={`${2 + i * 0.5}s`}
                                      repeatCount="indefinite"
                                    />
                                  </MapLine>
                                </>
                              )}
                            </g>
                          );
                        })}

                        {/* Server markers */}
                        {servers.map((server) => (
                          <Marker 
                            key={server.id} 
                            coordinates={server.coords}
                            onMouseEnter={() => setHoveredServer(server.id)}
                            onMouseLeave={() => setHoveredServer(null)}
                            style={{ cursor: 'pointer' }}
                          >
                            <g>
                              {/* Glow effect */}
                              {server.status === 'active' && (
                                <circle
                                  r={server.isYou ? 12 : 8}
                                  fill="#FF6B00"
                                  opacity={hoveredServer === server.id ? 0.5 : 0.3}
                                >
                                  <animate
                                    attributeName="r"
                                    values={server.isYou ? "12;16;12" : "8;12;8"}
                                    dur="2s"
                                    repeatCount="indefinite"
                                  />
                                </circle>
                              )}
                              
                              {/* Main dot */}
                              <circle
                                r={hoveredServer === server.id ? (server.isYou ? 7 : 6) : (server.isYou ? 5 : 4)}
                                fill={server.status === 'active' ? '#FF6B00' : '#666666'}
                                style={{ transition: 'all 0.2s' }}
                              >
                                {server.isYou && (
                                  <animate
                                    attributeName="r"
                                    values="5;6;5"
                                    dur="2s"
                                    repeatCount="indefinite"
                                  />
                                )}
                              </circle>

                              {/* Server name */}
                              <text
                                textAnchor="middle"
                                y={-12}
                                style={{
                                  fontFamily: 'monospace',
                                  fontSize: server.isYou ? '10px' : '8px',
                                  fontWeight: server.isYou ? 'bold' : 'normal',
                                  fill: server.status === 'active' ? '#FF6B00' : '#666666',
                                  pointerEvents: 'none'
                                }}
                              >
                                {server.name}
                              </text>

                              {/* Ping/Status */}
                              <text
                                textAnchor="middle"
                                y={server.isYou ? 18 : 15}
                                style={{
                                  fontFamily: 'monospace',
                                  fontSize: '7px',
                                  fill: server.status === 'active' ? '#FF6B00' : '#666666',
                                  pointerEvents: 'none'
                                }}
                              >
                                {server.ping}
                              </text>
                            </g>
                          </Marker>
                        ))}
                      </ZoomableGroup>
                    </ComposableMap>

                    {/* Legend */}
                    <div className="absolute bottom-4 left-4 flex gap-6 text-xs font-mono bg-background/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-border">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#FF6B00] animate-pulse" />
                        <span className="text-[#FF6B00]">Активные</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#666666]" />
                        <span className="text-muted-foreground">Доступные</span>
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className="absolute top-4 right-4 text-xs font-mono bg-background/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-border text-muted-foreground">
                      <div>🖱️ Колесо мыши - зум</div>
                      <div>👆 Перетаскивание - перемещение</div>
                    </div>

                    {/* Server tooltip */}
                    {hoveredServer && (
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-4 shadow-2xl min-w-[280px]"
                        >
                          {(() => {
                            const server = servers.find(s => s.id === hoveredServer);
                            if (!server) return null;
                            
                            // Получаем компонент флага
                            const FlagComponent = Flags[server.countryCode as keyof typeof Flags];
                            
                            return (
                              <>
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="relative w-12 h-8 rounded overflow-hidden border-2 border-primary shadow-lg shadow-primary/50">
                                    {FlagComponent && (
                                      <div className="relative w-full h-full">
                                        <FlagComponent className="w-full h-full object-cover" />
                                        {/* Strong cyber overlay */}
                                        <div 
                                          className="absolute inset-0 pointer-events-none"
                                          style={{
                                            background: 'linear-gradient(135deg, rgba(204, 255, 0, 0.3) 0%, transparent 50%, rgba(255, 0, 60, 0.2) 100%)',
                                            mixBlendMode: 'screen'
                                          }}
                                        />
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <h4 className="font-bold font-mono-tech text-lg">{server.name}</h4>
                                    <p className="text-sm text-muted-foreground font-mono">{server.country}</p>
                                  </div>
                                </div>
                                
                                <div className="space-y-2 text-sm font-mono">
                                  <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Статус:</span>
                                    <span className={`font-bold ${server.status === 'active' ? 'text-[#FF6B00]' : 'text-muted-foreground'}`}>
                                      {server.status === 'active' ? 'Активен' : 'Доступен'}
                                    </span>
                                  </div>
                                  
                                  <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Пинг:</span>
                                    <span className="font-bold text-primary">{server.ping}</span>
                                  </div>
                                  
                                  <div className="pt-2 border-t border-border">
                                    <p className="text-xs text-muted-foreground">{server.info}</p>
                                  </div>
                                </div>
                              </>
                            );
                          })()}
                        </motion.div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Charts */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {/* Traffic Chart */}
                  <div className="p-6 bg-card rounded-lg border border-border">
                    <h3 className="font-bold font-mono-tech mb-4 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-primary" />
                      Трафик по дням (GB)
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={trafficData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis 
                          dataKey="day" 
                          stroke="hsl(var(--muted-foreground))"
                          style={{ fontSize: '12px', fontFamily: 'monospace' }}
                        />
                        <YAxis 
                          stroke="hsl(var(--muted-foreground))"
                          style={{ fontSize: '12px', fontFamily: 'monospace' }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            fontFamily: 'monospace'
                          }}
                          labelStyle={{ color: 'hsl(var(--foreground))' }}
                        />
                        <Bar 
                          dataKey="traffic" 
                          fill="hsl(73 100% 50%)" 
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* RX/TX Chart */}
                  <div className="p-6 bg-card rounded-lg border border-border">
                    <h3 className="font-bold font-mono-tech mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      Получено / Отправлено (GB)
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={trafficData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis
                          dataKey="day"
                          stroke="hsl(var(--muted-foreground))"
                          style={{ fontSize: '12px', fontFamily: 'monospace' }}
                        />
                        <YAxis
                          stroke="hsl(var(--muted-foreground))"
                          style={{ fontSize: '12px', fontFamily: 'monospace' }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            fontFamily: 'monospace'
                          }}
                          labelStyle={{ color: 'hsl(var(--foreground))' }}
                        />
                        <Line
                          type="monotone"
                          dataKey="rx"
                          name="Получено"
                          stroke="hsl(73 100% 50%)"
                          strokeWidth={2}
                          dot={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="tx"
                          name="Отправлено"
                          stroke="hsl(33 100% 50%)"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Ping Chart - Full Width */}
                <div className="p-6 bg-card rounded-lg border border-border">
                  <h3 className="font-bold font-mono-tech mb-4 flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-primary" />
                    Средний пинг (ms)
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={pingData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="day" 
                        stroke="hsl(var(--muted-foreground))"
                        style={{ fontSize: '12px', fontFamily: 'monospace' }}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))"
                        style={{ fontSize: '12px', fontFamily: 'monospace' }}
                        domain={[0, 20]}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontFamily: 'monospace'
                        }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="ping" 
                        stroke="hsl(73 100% 50%)" 
                        strokeWidth={3}
                        dot={{ fill: 'hsl(73 100% 50%)', r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </AnimatedSection>
          )}

          {/* Speed Test Tab */}
          {activeTab === 'speedtest' && (
            <AnimatedSection>
              <div className="max-w-4xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold font-mono-tech">Speed Test</h2>
                  <Button 
                    asChild
                    className="bg-primary text-black hover:bg-primary/90"
                  >
                    <a href="/speed-test-web" target="_blank" rel="noopener noreferrer">
                      <Zap className="w-4 h-4 mr-2" />
                      Открыть Speed Test
                    </a>
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Description */}
                  <div className="p-6 bg-card rounded-lg border border-border">
                    <h3 className="font-bold font-mono-tech mb-3 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-primary" />
                      Тестирование скорости VPN
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Проверьте скорость вашего VPN соединения. Тест измеряет скорость загрузки, 
                      отдачи и задержку (ping) для выбранного сервера.
                    </p>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-background rounded border">
                        <Download className="w-6 h-6 text-primary mx-auto mb-2" />
                        <div className="font-mono text-sm">Скорость загрузки</div>
                        <div className="text-xs text-muted-foreground">Download Speed</div>
                      </div>
                      <div className="text-center p-4 bg-background rounded border">
                        <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
                        <div className="font-mono text-sm">Скорость отдачи</div>
                        <div className="text-xs text-muted-foreground">Upload Speed</div>
                      </div>
                      <div className="text-center p-4 bg-background rounded border">
                        <Server className="w-6 h-6 text-primary mx-auto mb-2" />
                        <div className="font-mono text-sm">Задержка</div>
                        <div className="text-xs text-muted-foreground">Ping/Latency</div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Access */}
                  <div className="p-6 bg-card rounded-lg border border-border">
                    <h3 className="font-bold font-mono-tech mb-3">Быстрый доступ</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Button 
                        asChild
                        variant="outline" 
                        className="h-auto p-4 justify-start"
                      >
                        <a href="/speed-test-web" target="_blank" rel="noopener noreferrer">
                          <div className="text-left">
                            <div className="font-semibold">Полный тест</div>
                            <div className="text-sm text-muted-foreground">
                              Комплексное тестирование всех параметров
                            </div>
                          </div>
                        </a>
                      </Button>
                      <Button 
                        asChild
                        variant="outline" 
                        className="h-auto p-4 justify-start"
                      >
                        <a href="/speed-test" target="_blank" rel="noopener noreferrer">
                          <div className="text-left">
                            <div className="font-semibold">Мобильная версия</div>
                            <div className="text-sm text-muted-foreground">
                              Упрощенный интерфейс для мобильных устройств
                            </div>
                          </div>
                        </a>
                      </Button>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="p-6 bg-card rounded-lg border border-border">
                    <h3 className="font-bold font-mono-tech mb-3">Возможности</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-primary" />
                        <span className="font-mono text-sm">Тестирование скорости загрузки и отдачи</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-primary" />
                        <span className="font-mono text-sm">Измерение задержки (ping) и джиттера</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-primary" />
                        <span className="font-mono text-sm">История тестов и сравнение серверов</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-primary" />
                        <span className="font-mono text-sm">Автоматическое сохранение результатов</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          )}

        </div>
      </section>

      {/* Payment Details Modal */}
      <AnimatePresence>
        {showPaymentDetails && selectedPayment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPaymentDetails(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-card rounded-lg border border-border p-6 w-full max-w-lg relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setShowPaymentDetails(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="mb-6">
                <h3 className="text-xl font-bold font-mono-tech mb-2 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary" />
                  Детали платежа
                </h3>
                <p className="text-sm text-muted-foreground font-mono">
                  ID: {selectedPayment.id.toString().padStart(6, '0')}
                </p>
              </div>

              {/* Payment Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground font-mono block mb-1">ДАТА_СОЗДАНИЯ</label>
                    <div className="font-mono text-sm">
                      {new Date(selectedPayment.created_at).toLocaleDateString('ru-RU')}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(selectedPayment.created_at).toLocaleTimeString('ru-RU')}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground font-mono block mb-1">СТАТУС</label>
                    <div className="flex items-center gap-2">
                      {selectedPayment.status === 'paid' || selectedPayment.status === 'completed' ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-primary" />
                          <span className="font-mono text-primary text-sm font-bold">ЗАВЕРШЁН</span>
                        </>
                      ) : selectedPayment.status === 'pending' ? (
                        <>
                          <motion.div
                            className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          <span className="font-mono text-yellow-500 text-sm font-bold">ОЖИДАНИЕ</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 text-red-500" />
                          <span className="font-mono text-red-500 text-sm font-bold">ОШИБКА</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground font-mono block mb-1">СУММА</label>
                    <div className="font-mono text-lg font-bold text-primary">
                      {selectedPayment.amount} ₽
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ≈ ${(selectedPayment.amount * 0.011).toFixed(2)} USD
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground font-mono block mb-1">МЕТОД_ОПЛАТЫ</label>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">
                          {selectedPayment.payment_method === 'USDT TRC20' || selectedPayment.payer_currency === 'USDT' ? '₮' : 
                           selectedPayment.payment_method === 'TON' || selectedPayment.payer_currency === 'TON' ? '💎' : 
                           selectedPayment.method === 'YooKassa' ? '₽' : '₿'}
                        </span>
                      </div>
                      <div>
                        <div className="font-mono text-sm">
                          {selectedPayment.payment_method || selectedPayment.payer_currency || selectedPayment.method || 'ЮKassa'}
                        </div>
                        {selectedPayment.network && (
                          <div className="text-xs text-muted-foreground">{selectedPayment.network}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {selectedPayment.order_id && (
                  <div>
                    <label className="text-xs text-muted-foreground font-mono block mb-1">ORDER_ID</label>
                    <code className="font-mono text-sm bg-background px-2 py-1 rounded border">
                      {selectedPayment.order_id}
                    </code>
                  </div>
                )}

                {selectedPayment.payment_uuid && (
                  <div>
                    <label className="text-xs text-muted-foreground font-mono block mb-1">PAYMENT_UUID</label>
                    <code className="font-mono text-sm bg-background px-2 py-1 rounded border break-all">
                      {selectedPayment.payment_uuid}
                    </code>
                  </div>
                )}

                {selectedPayment.transaction_id && (
                  <div>
                    <label className="text-xs text-muted-foreground font-mono block mb-1">TRANSACTION_ID</label>
                    <code className="font-mono text-sm bg-background px-2 py-1 rounded border break-all">
                      {selectedPayment.transaction_id}
                    </code>
                  </div>
                )}

                {selectedPayment.address && (
                  <div>
                    <label className="text-xs text-muted-foreground font-mono block mb-1">АДРЕС_КОШЕЛЬКА</label>
                    <code className="font-mono text-sm bg-background px-2 py-1 rounded border break-all">
                      {selectedPayment.address}
                    </code>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowPaymentDetails(false)}
                  className="flex-1 font-mono-tech"
                >
                  ЗАКРЫТЬ
                </Button>
                <Button
                  onClick={() => handleDownloadReceipt(selectedPayment)}
                  className="flex-1 bg-primary text-black hover:bg-primary/90 font-mono-tech"
                >
                  <Download className="w-4 h-4 mr-2" />
                  СКАЧАТЬ_ЧЕК
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPaymentModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-card rounded-lg border border-border p-6 w-full max-w-md relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setShowPaymentModal(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="mb-6">
                <h3 className="text-xl font-bold font-mono-tech mb-2 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Пополнение баланса
                </h3>
                <p className="text-sm text-muted-foreground font-mono">
                  Создание платежа через ЮKassa
                </p>
              </div>

              {/* Provider selection */}
              <div className="mb-6">
                <label className="text-sm text-muted-foreground font-mono mb-2 block">
                  СПОСОБ_ОПЛАТЫ
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    onClick={() => setSelectedProvider('yookassa')}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedProvider === 'yookassa'
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-background hover:border-primary/50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-bold text-sm">₽</span>
                      </div>
                      <div>
                        <div className="font-bold font-mono-tech text-sm">ЮKassa</div>
                        <div className="text-xs text-muted-foreground">Карты, СБП</div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Банковские карты, Сбербанк Онлайн, СБП
                    </div>
                  </motion.button>

                  <motion.div
                    className={`p-4 rounded-lg border-2 transition-all text-left relative opacity-60 cursor-not-allowed ${
                      'border-border bg-muted/20'
                    }`}
                  >
                    {/* Coming Soon Badge */}
                    <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                      СКОРО
                    </div>
                    
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded bg-muted/30 flex items-center justify-center">
                        <span className="text-muted-foreground font-bold text-sm">₿</span>
                      </div>
                      <div>
                        <div className="font-bold font-mono-tech text-sm text-muted-foreground">Crypto</div>
                        <div className="text-xs text-muted-foreground">USDT, BTC</div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Криптовалютные платежи (в разработке)
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Amount input */}
              <div className="mb-6">
                <label className="text-sm text-muted-foreground font-mono mb-2 block">
                  СУММА_ПОПОЛНЕНИЯ
                </label>
                <div className="relative mb-4">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary text-lg">
                    ₽
                  </div>
                  <input
                    type="text"
                    value={paymentAmount}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*\.?\d*$/.test(value)) {
                        setPaymentAmount(value);
                      }
                    }}
                    placeholder="0.00"
                    className="w-full bg-background border-2 border-border rounded-lg px-12 py-3 text-xl font-bold text-primary focus:border-primary focus:outline-none transition-colors placeholder:text-muted-foreground"
                  />
                  <motion.div
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-1 h-4 bg-primary"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </div>

                {/* Quick amounts */}
                <div className="grid grid-cols-4 gap-2">
                  {quickAmounts.map((amount) => (
                    <Button
                      key={amount}
                      onClick={() => setPaymentAmount(amount.toString())}
                      variant="outline"
                      size="sm"
                      className="font-mono-tech"
                    >
                      {amount}₽
                    </Button>
                  ))}
                </div>
              </div>

              {/* Info */}
              <div className="mb-6 p-3 bg-muted/20 rounded border border-border">
                <div className="text-xs text-muted-foreground font-mono space-y-1">
                  <div>• Минимальная сумма: 100₽</div>
                  <div>• Комиссия: 0% (включена в стоимость)</div>
                  <div>• Зачисление: мгновенно</div>
                  <div>• Способы: карты, СБП, Сбербанк</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 font-mono-tech"
                  disabled={isCreatingPayment}
                >
                  ОТМЕНА
                </Button>
                <Button
                  onClick={handleCreatePayment}
                  disabled={isCreatingPayment || !paymentAmount || parseFloat(paymentAmount) < 100}
                  className="flex-1 bg-primary text-black hover:bg-primary/90 font-mono-tech"
                >
                  {isCreatingPayment ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      СОЗДАНИЕ...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      СОЗДАТЬ_ПЛАТЕЖ
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default Account;
