import { useState, useEffect } from 'react';
import { api, Payment } from '@/lib/api';

export interface PaymentStats {
  total_payments: number;
  total_amount: number;
  success_rate: number;
  monthly_spending: Array<{
    month: string;
    amount: number;
    percent: number;
  }>;
  payment_methods: Array<{
    method: string;
    count: number;
    icon: string;
    color: string;
  }>;
}

export const usePayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPayments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const paymentsData = await api.getPaymentHistory();
      setPayments(paymentsData);
      
      // Вычисляем статистику
      const totalAmount = paymentsData.reduce((sum, p) => sum + p.amount, 0);
      const successfulPayments = paymentsData.filter(p => p.status === 'completed' || p.status === 'paid');
      
      // Группируем по месяцам
      const monthlyData = paymentsData.reduce((acc, payment) => {
        const date = new Date(payment.created_at);
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
        const monthName = date.toLocaleDateString('ru-RU', { year: 'numeric', month: 'long' });
        
        if (!acc[monthKey]) {
          acc[monthKey] = { month: monthName, amount: 0 };
        }
        acc[monthKey].amount += payment.amount;
        return acc;
      }, {} as Record<string, { month: string; amount: number }>);

      const monthlySpending = Object.values(monthlyData)
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 3)
        .map((item, index, arr) => ({
          ...item,
          percent: arr.length > 0 ? Math.round((item.amount / arr[0].amount) * 100) : 0
        }));

      // Группируем по методам оплаты
      const methodsData = paymentsData.reduce((acc, payment) => {
        const method = payment.payment_method || 'Unknown';
        if (!acc[method]) {
          acc[method] = 0;
        }
        acc[method]++;
        return acc;
      }, {} as Record<string, number>);

      const paymentMethods = [
        { 
          method: 'USDT TRC20', 
          count: methodsData['USDT TRC20'] || 0, 
          icon: '₮', 
          color: 'text-green-400' 
        },
        { 
          method: 'TON', 
          count: methodsData['TON'] || 0, 
          icon: '💎', 
          color: 'text-blue-400' 
        },
        { 
          method: 'BTC', 
          count: methodsData['BTC'] || 0, 
          icon: '₿', 
          color: 'text-orange-400' 
        },
      ];

      setStats({
        total_payments: paymentsData.length,
        total_amount: totalAmount,
        success_rate: paymentsData.length > 0 ? (successfulPayments.length / paymentsData.length) * 100 : 0,
        monthly_spending: monthlySpending,
        payment_methods: paymentMethods,
      });

    } catch (err: any) {
      console.error('Failed to load payments:', err);
      setError(err.message || 'Failed to load payments');
      
      // Fallback данные для демонстрации
      setPayments([
        {
          id: 1,
          user_id: 1,
          amount: 500,
          currency: 'RUB',
          status: 'completed',
          payment_method: 'USDT TRC20',
          method: 'crypto',
          order_id: 'order_1_1737890400',
          plan: 'Pro',
          transaction_id: 'tx_123456',
          created_at: '2026-01-25T10:00:00Z',
          updated_at: '2026-01-25T10:05:00Z',
        },
        {
          id: 2,
          user_id: 1,
          amount: 500,
          currency: 'RUB',
          status: 'completed',
          payment_method: 'TON',
          method: 'crypto',
          order_id: 'order_1_1735142400',
          plan: 'Pro',
          transaction_id: 'tx_789012',
          created_at: '2025-12-25T15:30:00Z',
          updated_at: '2025-12-25T15:35:00Z',
        },
        {
          id: 3,
          user_id: 1,
          amount: 500,
          currency: 'RUB',
          status: 'completed',
          payment_method: 'BTC',
          method: 'crypto',
          order_id: 'order_1_1732550400',
          plan: 'Pro',
          transaction_id: 'tx_345678',
          created_at: '2025-11-25T09:15:00Z',
          updated_at: '2025-11-25T09:45:00Z',
        },
      ]);

      setStats({
        total_payments: 3,
        total_amount: 1500,
        success_rate: 100,
        monthly_spending: [
          { month: 'Январь 2026', amount: 500, percent: 100 },
          { month: 'Декабрь 2025', amount: 500, percent: 100 },
          { month: 'Ноябрь 2025', amount: 500, percent: 100 },
        ],
        payment_methods: [
          { method: 'USDT TRC20', count: 1, icon: '₮', color: 'text-green-400' },
          { method: 'TON', count: 1, icon: '💎', color: 'text-blue-400' },
          { method: 'BTC', count: 1, icon: '₿', color: 'text-orange-400' },
        ],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createPayment = async (amount: number, currency: string = 'RUB', provider?: string) => {
    try {
      const payment = await api.createPayment(amount, currency, provider);
      await loadPayments(); // Перезагружаем список
      return payment;
    } catch (err: any) {
      console.error('Failed to create payment:', err);
      throw err;
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  return {
    payments,
    stats,
    isLoading,
    error,
    loadPayments,
    createPayment,
  };
};