import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Key, Search, Trash2, Download, Eye, EyeOff, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface VPNKey {
  id: number;
  user_id: number;
  server_id: number;
  name: string;
  public_key: string;
  private_key: string;
  ip_address: string;
  protocol: string;
  status: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

interface User {
  id: number;
  email: string;
}

export function KeysTab() {
  const [keys, setKeys] = useState<VPNKey[]>([]);
  const [users, setUsers] = useState<Record<number, User>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPrivateKeys, setShowPrivateKeys] = useState<Record<number, boolean>>({});
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Загружаем ключи и пользователей параллельно
      const [keysData, usersData] = await Promise.all([
        api.request<VPNKey[]>('/admin/keys'),
        api.getAdminUsers()
      ]);

      setKeys(Array.isArray(keysData) ? keysData : []);
      
      // Создаем мапу пользователей для быстрого доступа
      const usersMap: Record<number, User> = {};
      if (Array.isArray(usersData)) {
        usersData.forEach(user => {
          usersMap[user.id] = user;
        });
      }
      setUsers(usersMap);
    } catch (error) {
      console.error('Failed to load keys:', error);
      toast.error('Ошибка загрузки ключей');
      setKeys([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (keyId: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот ключ?')) return;

    try {
      setDeletingId(keyId);
      await api.request(`/admin/keys/${keyId}`, { method: 'DELETE' });
      toast.success('Ключ удален');
      loadData();
    } catch (error) {
      console.error('Failed to delete key:', error);
      toast.error('Ошибка удаления ключа');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownloadConfig = async (key: VPNKey) => {
    try {
      const config = await api.downloadKeyConfig(key.id);
      const blob = new Blob([config], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${key.name || `key_${key.id}`}.conf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Конфигурация загружена');
    } catch (error) {
      console.error('Failed to download config:', error);
      toast.error('Ошибка загрузки конфигурации');
    }
  };

  const togglePrivateKey = (keyId: number) => {
    setShowPrivateKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU');
  };

  const filteredKeys = keys.filter(key => {
    const user = users[key.user_id];
    const searchLower = searchQuery.toLowerCase();
    return (
      key.name?.toLowerCase().includes(searchLower) ||
      key.ip_address.includes(searchLower) ||
      user?.email.toLowerCase().includes(searchLower) ||
      key.protocol.toLowerCase().includes(searchLower)
    );
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-mono">Управление ключами</h2>
          <p className="text-muted-foreground font-mono text-sm mt-1">
            Всего ключей: {keys.length}
          </p>
        </div>
        <Button
          onClick={loadData}
          variant="outline"
          className="font-mono"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Обновить
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Поиск по имени, IP, email, протоколу..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 font-mono"
        />
      </div>

      {/* Keys Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-card border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-mono text-muted-foreground">ID</th>
                <th className="px-4 py-3 text-left text-xs font-mono text-muted-foreground">Пользователь</th>
                <th className="px-4 py-3 text-left text-xs font-mono text-muted-foreground">Имя</th>
                <th className="px-4 py-3 text-left text-xs font-mono text-muted-foreground">IP</th>
                <th className="px-4 py-3 text-left text-xs font-mono text-muted-foreground">Протокол</th>
                <th className="px-4 py-3 text-left text-xs font-mono text-muted-foreground">Статус</th>
                <th className="px-4 py-3 text-left text-xs font-mono text-muted-foreground">Истекает</th>
                <th className="px-4 py-3 text-left text-xs font-mono text-muted-foreground">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredKeys.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <Key className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground font-mono">
                      {searchQuery ? 'Ключи не найдены' : 'Нет ключей'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredKeys.map((key, index) => {
                  const user = users[key.user_id];
                  const isExpired = new Date(key.expires_at) < new Date();
                  
                  return (
                    <motion.tr
                      key={key.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border hover:bg-card transition-colors"
                    >
                      <td className="px-4 py-3 font-mono text-sm">{key.id}</td>
                      <td className="px-4 py-3 font-mono text-sm">
                        {user ? (
                          <div>
                            <div className="text-white">{user.email}</div>
                            <div className="text-xs text-muted-foreground">ID: {user.id}</div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Unknown</span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono text-sm">
                        {key.name || <span className="text-muted-foreground">—</span>}
                      </td>
                      <td className="px-4 py-3 font-mono text-sm text-primary">
                        {key.ip_address}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 rounded text-xs font-mono bg-primary/10 text-primary border border-primary/20">
                          {key.protocol}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-mono ${
                          key.status === 'active' && !isExpired
                            ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                            : 'bg-red-500/10 text-red-500 border border-red-500/20'
                        }`}>
                          {isExpired ? 'expired' : key.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        {formatDate(key.expires_at)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => handleDownloadConfig(key)}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            title="Скачать конфиг"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleDelete(key.id)}
                            disabled={deletingId === key.id}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                            title="Удалить"
                          >
                            {deletingId === key.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 rounded-lg border border-border bg-card">
          <div className="text-2xl font-bold text-primary font-mono">
            {keys.length}
          </div>
          <div className="text-xs text-muted-foreground font-mono mt-1">
            Всего ключей
          </div>
        </div>
        <div className="p-4 rounded-lg border border-border bg-card">
          <div className="text-2xl font-bold text-green-500 font-mono">
            {keys.filter(k => k.status === 'active' && new Date(k.expires_at) > new Date()).length}
          </div>
          <div className="text-xs text-muted-foreground font-mono mt-1">
            Активных
          </div>
        </div>
        <div className="p-4 rounded-lg border border-border bg-card">
          <div className="text-2xl font-bold text-red-500 font-mono">
            {keys.filter(k => new Date(k.expires_at) < new Date()).length}
          </div>
          <div className="text-xs text-muted-foreground font-mono mt-1">
            Истекших
          </div>
        </div>
        <div className="p-4 rounded-lg border border-border bg-card">
          <div className="text-2xl font-bold text-accent font-mono">
            {new Set(keys.map(k => k.user_id)).size}
          </div>
          <div className="text-xs text-muted-foreground font-mono mt-1">
            Пользователей
          </div>
        </div>
      </div>
    </div>
  );
}
