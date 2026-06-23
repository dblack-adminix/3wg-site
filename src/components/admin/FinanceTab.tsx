import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock,
  TrendingUp,
  BarChart3,
  PieChart,
  Receipt,
  Wallet,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { AdminDashboard } from '@/lib/api';
import { Button } from '@/components/ui/button';

interface FinanceTabProps {
  dashboardData: AdminDashboard | null;
}

type FinanceSubTab = 'overview' | 'payments' | 'analytics' | 'reports';

export function FinanceTab({ dashboardData }: FinanceTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<FinanceSubTab>('overview');
  const payments = dashboardData?.recent_payments || [];

  const subTabs = [
    { id: 'overview' as FinanceSubTab, label: 'Обзор', icon: BarChart3 },
    { id: 'payments' as FinanceSubTab, label: 'Платежи', icon: CreditCard },
    { id: 'analytics' as FinanceSubTab, label: 'Аналитика', icon: PieChart },
    { id: 'reports' as FinanceSubTab, label: 'Отчеты', icon: Receipt },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Завершен';
      case 'pending': return 'В обработке';
      case 'failed': return 'Отклонен';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-500 bg-green-500/20';
      case 'pending': return 'text-yellow-500 bg-yellow-500/20';
      case 'failed': return 'text-red-500 bg-red-500/20';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold font-mono">Финансы</h2>
        <p className="text-muted-foreground font-mono text-sm mt-1">
          Управление финансами и платежами
        </p>
      </div>

      {/* Sub Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-1 overflow-x-auto">
          {subTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-mono text-sm transition-all border-b-2 whitespace-nowrap ${
                activeSubTab === tab.id
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-card rounded-lg border border-border"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground font-mono">Всего доход</span>
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <div className="text-2xl font-bold font-mono">
                ₽{(dashboardData?.stats.total_revenue || 0).toLocaleString()}
              </div>
              <div className="flex items-center gap-1 mt-2 text-xs text-green-500">
                <ArrowUpRight className="w-3 h-3" />
                <span>+12.5%</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 bg-card rounded-lg border border-border"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground font-mono">За месяц</span>
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div className="text-2xl font-bold font-mono">
                ₽{(dashboardData?.stats.month_revenue || 0).toLocaleString()}
              </div>
              <div className="flex items-center gap-1 mt-2 text-xs text-green-500">
                <ArrowUpRight className="w-3 h-3" />
                <span>+8.2%</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 bg-card rounded-lg border border-border"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground font-mono">Транзакций</span>
                <CreditCard className="w-5 h-5 text-primary" />
              </div>
              <div className="text-2xl font-bold font-mono">{payments.length}</div>
              <div className="flex items-center gap-1 mt-2 text-xs text-green-500">
                <ArrowUpRight className="w-3 h-3" />
                <span>+15.3%</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 bg-card rounded-lg border border-border"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground font-mono">Средний чек</span>
                <Wallet className="w-5 h-5 text-primary" />
              </div>
              <div className="text-2xl font-bold font-mono">
                ₽{payments.length > 0 ? Math.round((dashboardData?.stats.month_revenue || 0) / payments.length) : 0}
              </div>
              <div className="flex items-center gap-1 mt-2 text-xs text-red-500">
                <ArrowDownRight className="w-3 h-3" />
                <span>-2.1%</span>
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 justify-start">
              <div className="text-left">
                <div className="font-semibold">Экспорт отчета</div>
                <div className="text-sm text-muted-foreground">Скачать финансовый отчет</div>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4 justify-start">
              <div className="text-left">
                <div className="font-semibold">Настройки платежей</div>
                <div className="text-sm text-muted-foreground">Управление провайдерами</div>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4 justify-start">
              <div className="text-left">
                <div className="font-semibold">Налоговая отчетность</div>
                <div className="text-sm text-muted-foreground">Подготовка документов</div>
              </div>
            </Button>
          </div>
        </div>
      )}

      {/* Payments Tab */}
      {activeSubTab === 'payments' && (
        <div className="space-y-6">
          {/* Payments Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-lg border border-border overflow-hidden"
          >
            <div className="p-4 border-b border-border">
              <h3 className="font-bold font-mono">История платежей</h3>
            </div>
            
            {payments.length === 0 ? (
              <div className="text-center py-12">
                <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground font-mono">Нет платежей</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-background/50 border-b border-border">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-mono text-muted-foreground uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-mono text-muted-foreground uppercase tracking-wider">
                        Пользователь
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-mono text-muted-foreground uppercase tracking-wider">
                        Сумма
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-mono text-muted-foreground uppercase tracking-wider">
                        Метод
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-mono text-muted-foreground uppercase tracking-wider">
                        Статус
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-mono text-muted-foreground uppercase tracking-wider">
                        Дата
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {payments.map((payment, index) => (
                      <motion.tr
                        key={payment.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-primary/5 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-mono text-muted-foreground">#{payment.id}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-mono">User #{payment.user_id}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4 text-primary" />
                            <span className="text-sm font-mono font-bold">
                              {payment.amount} {payment.currency}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-mono">{payment.payment_method}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(payment.status)}
                            <span className={`px-2 py-1 text-xs font-mono rounded ${getStatusColor(payment.status)}`}>
                              {getStatusText(payment.status)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-mono text-muted-foreground">
                            {new Date(payment.created_at).toLocaleDateString('ru-RU')}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-6">
          <div className="text-center py-12">
            <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground font-mono">Аналитика в разработке</p>
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeSubTab === 'reports' && (
        <div className="space-y-6">
          <div className="text-center py-12">
            <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground font-mono">Отчеты в разработке</p>
          </div>
        </div>
      )}
    </div>
  );
}
