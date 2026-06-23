import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, DollarSign, Shield, Search, Filter } from 'lucide-react';
import { api, User as UserType, AdminDashboard } from '@/lib/api';
import { Button } from '@/components/ui/button';

interface UsersTabProps {
  dashboardData: AdminDashboard | null;
}

export function UsersTab({ dashboardData }: UsersTabProps) {
  const [users, setUsers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const data = await api.getAdminUsers();
      // Проверяем что data это массив
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load users:', error);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-primary font-mono">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-mono">Пользователи</h2>
          <p className="text-muted-foreground font-mono text-sm mt-1">
            Всего: {users.length} пользователей
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-black font-mono">
          <User className="w-4 h-4 mr-2" />
          Добавить пользователя
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск по email..."
          className="w-full pl-11 pr-4 py-3 rounded-lg bg-card border border-border focus:border-primary font-mono transition-colors text-sm"
        />
      </div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-lg border border-border overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  Баланс
                </th>
                <th className="px-6 py-4 text-left text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  Тариф
                </th>
                <th className="px-6 py-4 text-left text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  Дата регистрации
                </th>
                <th className="px-6 py-4 text-left text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-primary/5 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-mono text-muted-foreground">#{user.id}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-primary" />
                      <span className="text-sm font-mono">{user.email}</span>
                      {(user as any).is_admin && (
                        <div className="relative group">
                          <Shield className="w-4 h-4 text-accent" />
                          <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 text-xs bg-background border border-border rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Администратор
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-primary" />
                      <span className="text-sm font-mono">₽{user.balance}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-mono rounded ${
                      user.tariff === 'admin' ? 'bg-accent/20 text-accent' :
                      user.tariff === 'free' ? 'bg-muted text-muted-foreground' :
                      'bg-primary/20 text-primary'
                    }`}>
                      {user.tariff}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-mono text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="font-mono text-xs"
                      >
                        Редактировать
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground font-mono">
              {searchQuery ? 'Пользователи не найдены' : 'Нет пользователей'}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
