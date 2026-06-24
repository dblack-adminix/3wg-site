import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { api, AdminDashboard as AdminDashboardData } from '@/lib/api';
import { UsersTab } from '@/components/admin/UsersTab';
import { ServersTab } from '@/components/admin/ServersTab';
import { KeysTab } from '@/components/admin/KeysTab';
import { FinanceTab } from '@/components/admin/FinanceTab';
import { ContentTab } from '@/components/admin/ContentTab';
import { SettingsTab } from '@/components/admin/SettingsTab';

import { ThemeToggle } from '@/components/ThemeToggle';
import { 
  LayoutDashboard,
  Users,
  Server,
  Key,
  CreditCard,
  FileText,
  Settings,
  LogOut,
  Shield,
  Activity,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Menu,
  X,
  ChevronDown,
  Search,
  Bell,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type AdminTab = 'dashboard' | 'users' | 'servers' | 'keys' | 'finance' | 'content' | 'settings';

const Admin = () => {
  const navigate = useNavigate();
  const { user, login, logout, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);

  // Загружаем данные дашборда если авторизованы
  useEffect(() => {
    if (isAuthenticated && user && (user as any).is_admin) {
      loadDashboardData();
    }
  }, [isAuthenticated, user]);

  const loadDashboardData = async () => {
    try {
      const data = await api.getAdminDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    }
  };

  const menuItems = [
    { id: 'dashboard' as AdminTab, label: 'Панель управления', icon: LayoutDashboard },
    { id: 'users' as AdminTab, label: 'Пользователи', icon: Users },
    { id: 'servers' as AdminTab, label: 'Серверы', icon: Server },
    { id: 'keys' as AdminTab, label: 'Ключи', icon: Key },
    { id: 'finance' as AdminTab, label: 'Финансы', icon: CreditCard },
    { id: 'content' as AdminTab, label: 'Управление контентом', icon: FileText },
    { id: 'settings' as AdminTab, label: 'Настройки', icon: Settings },
  ];

  // Analytics data
  const analyticsData = [
    { date: '01 янв', users: 1200, traffic: 45000, revenue: 23000 },
    { date: '02 янв', users: 1350, traffic: 52000, revenue: 28000 },
    { date: '03 янв', users: 1180, traffic: 48000, revenue: 25000 },
    { date: '04 янв', users: 1420, traffic: 58000, revenue: 32000 },
    { date: '05 янв', users: 1580, traffic: 62000, revenue: 35000 },
    { date: '06 янв', users: 1650, traffic: 68000, revenue: 38000 },
    { date: '07 янв', users: 1720, traffic: 72000, revenue: 42000 },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      const submittedEmail = String(formData.get('email') || email).trim().toLowerCase();
      const submittedPassword = String(formData.get('password') || password);

      await login({ email: submittedEmail, password: submittedPassword });
      // Проверяем что пользователь админ
      const userData = await api.getCurrentUser();
      if (!(userData as any).is_admin) {
        setError('У вас нет прав администратора');
        logout();
        return;
      }
    } catch (error: any) {
      setError(error.message === 'Unauthorized' ? 'Неверный email или пароль' : (error.message || 'Ошибка входа'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Если не авторизован или не админ - показываем форму логина для админа
  if (!isAuthenticated || !user || !(user as any).is_admin) {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 admin-gradient">
          {/* Cyber grid */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(rgba(204, 255, 0, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(204, 255, 0, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }} />
          </div>
          
          {/* Glowing orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-md"
        >
          {/* Login Card */}
          <div className="backdrop-blur-xl bg-background/80 rounded-2xl border border-primary/30 shadow-2xl shadow-primary/10 overflow-hidden">
            {/* Header with logo */}
            <div className="p-8 pb-6 text-center border-b border-border/50 relative">
              {/* Theme Toggle - positioned in top right */}
              <div className="absolute top-4 right-4">
                <ThemeToggle />
              </div>
              
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 mb-4">
                <Shield className="w-10 h-10 text-primary" />
              </div>
              
              <h1 className="text-3xl font-bold font-mono mb-2">
                <span className="text-primary">3WG</span> Admin
              </h1>
              <p className="text-muted-foreground font-mono text-sm">
                Панель управления
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="p-8 space-y-6">
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-sm font-mono">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-mono text-muted-foreground mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="email"
                      name="email"
                      autoComplete="username"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@3wg.ru"
                      className="w-full pl-11 pr-4 py-3 rounded-lg bg-background/50 border border-border focus:border-primary font-mono transition-colors text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-mono text-muted-foreground mb-2">
                    Пароль
                  </label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="password"
                      name="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Введите пароль"
                      className="w-full pl-11 pr-4 py-3 rounded-lg bg-background/50 border border-border focus:border-primary font-mono transition-colors text-sm"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-black font-bold py-3 rounded-lg transition-all hover:shadow-lg hover:shadow-primary/50 disabled:opacity-50"
              >
                {isLoading ? 'Вход...' : 'Войти'}
              </Button>

              <div className="text-center">
                <p className="text-xs font-mono text-muted-foreground">
                  Защищено <span className="text-primary">3WG Security</span>
                </p>
              </div>
            </form>
          </div>

          {/* Footer hint */}
          <div className="mt-6 text-center">
            <p className="text-xs font-mono text-muted-foreground">
              Используйте учетные данные администратора для входа
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-card border-r border-border transition-all duration-300 flex flex-col`}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <span className="font-bold font-mono text-sm">3WG Admin</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-primary/10 rounded transition-colors"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                activeTab === item.id
                  ? 'bg-primary/10 text-primary border-r-2 border-primary'
                  : 'text-muted-foreground hover:bg-primary/5 hover:text-foreground'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="font-mono text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-red-500/10 hover:text-red-500 rounded transition-colors"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="font-mono text-sm">Выход</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold font-mono capitalize">{activeTab}</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            <button className="p-2 hover:bg-primary/10 rounded transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </button>
            
            <div className="flex items-center gap-2 px-3 py-2 bg-background/50 rounded-lg">
              <User className="w-4 h-4 text-primary" />
              <span className="font-mono text-sm">Admin</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid md:grid-cols-4 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="p-6 bg-card rounded-lg border border-border"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground font-mono">Всего пользователей</span>
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-3xl font-bold font-mono mb-1">
                    {dashboardData?.stats.total_users || 0}
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <Activity className="w-3 h-3 text-primary" />
                    <span className="text-primary font-mono">
                      {dashboardData?.stats.active_users || 0} активных
                    </span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-6 bg-card rounded-lg border border-border"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground font-mono">Активные серверы</span>
                    <Server className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-3xl font-bold font-mono mb-1">
                    {dashboardData?.stats.total_servers || 0}
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <Activity className="w-3 h-3 text-primary" />
                    <span className="text-primary font-mono">
                      {dashboardData?.stats.active_servers || 0} онлайн
                    </span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-6 bg-card rounded-lg border border-border"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground font-mono">Доход за месяц</span>
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-3xl font-bold font-mono mb-1">
                    ₽{(dashboardData?.stats.month_revenue || 0).toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <span className="text-muted-foreground font-mono">
                      Всего: ₽{(dashboardData?.stats.total_revenue || 0).toLocaleString()}
                    </span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="p-6 bg-card rounded-lg border border-border"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground font-mono">Аптайм</span>
                    <Activity className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-3xl font-bold font-mono mb-1">99.9%</div>
                  <div className="flex items-center gap-1 text-xs">
                    <span className="text-muted-foreground font-mono">За 30 дней</span>
                  </div>
                </motion.div>
              </div>

              {/* Analytics Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="p-6 bg-card rounded-lg border border-border"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold font-mono">Обзор аналитики</h3>
                  <select className="px-3 py-1 bg-background border border-border rounded font-mono text-sm">
                    <option>Последние 7 дней</option>
                    <option>Последние 30 дней</option>
                    <option>Последние 90 дней</option>
                  </select>
                </div>
                
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analyticsData}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#CCFF00" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#CCFF00" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00D9FF" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#00D9FF" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#666"
                      style={{ fontSize: '12px', fontFamily: 'monospace' }}
                    />
                    <YAxis 
                      stroke="#666"
                      style={{ fontSize: '12px', fontFamily: 'monospace' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#111', 
                        border: '1px solid #333',
                        borderRadius: '8px',
                        fontFamily: 'monospace'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="users" 
                      stroke="#CCFF00" 
                      fillOpacity={1} 
                      fill="url(#colorUsers)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#00D9FF" 
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>
              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="p-6 bg-card rounded-lg border border-border"
              >
                <h3 className="font-bold font-mono mb-4">Последняя активность</h3>
                <div className="space-y-3">
                  {[
                    { user: 'user@example.com', action: 'Создал новый ключ', time: '2 мин назад', type: 'success' },
                    { user: 'admin@3wg.ru', action: 'Добавил новый сервер', time: '15 мин назад', type: 'info' },
                    { user: 'test@test.com', action: 'Пополнил баланс на ₽500', time: '1 час назад', type: 'success' },
                    { user: 'user2@example.com', action: 'Превысил лимит трафика', time: '2 часа назад', type: 'warning' },
                  ].map((activity, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'success' ? 'bg-green-500' :
                          activity.type === 'warning' ? 'bg-yellow-500' :
                          'bg-blue-500'
                        }`} />
                        <div>
                          <p className="font-mono text-sm">{activity.user}</p>
                          <p className="text-xs text-muted-foreground">{activity.action}</p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground font-mono">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <UsersTab dashboardData={dashboardData} />
          )}

          {/* Servers Tab */}
          {activeTab === 'servers' && (
            <ServersTab />
          )}

          {/* Keys Tab */}
          {activeTab === 'keys' && (
            <KeysTab />
          )}

          {/* Finance Tab */}
          {activeTab === 'finance' && (
            <FinanceTab dashboardData={dashboardData} />
          )}

          {/* Content Tab */}
          {activeTab === 'content' && (
            <ContentTab />
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <SettingsTab />
          )}

          {/* Other tabs - placeholder */}
          {!['dashboard', 'users', 'servers', 'keys', 'payments', 'content', 'settings'].includes(activeTab) && (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold font-mono mb-2 capitalize">{menuItems.find(m => m.id === activeTab)?.label}</h3>
                <p className="text-muted-foreground font-mono text-sm">Раздел в разработке</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Admin;

