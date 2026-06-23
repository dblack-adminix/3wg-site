import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Ban,
  CheckCircle2,
  Edit3,
  KeyRound,
  Mail,
  Plus,
  RefreshCw,
  Save,
  Search,
  Shield,
  Trash2,
  User,
  X,
} from 'lucide-react';
import { api, AdminDashboard, User as UserType } from '@/lib/api';
import { Button } from '@/components/ui/button';

interface UsersTabProps {
  dashboardData: AdminDashboard | null;
}

type UserForm = {
  id?: number;
  email: string;
  password: string;
  full_name: string;
  phone: string;
  telegram_id: string;
  balance: string;
  tariff: string;
  is_admin: boolean;
  is_active: boolean;
};

const emptyForm: UserForm = {
  email: '',
  password: '',
  full_name: '',
  phone: '',
  telegram_id: '',
  balance: '0',
  tariff: 'free',
  is_admin: false,
  is_active: true,
};

export function UsersTab({ dashboardData }: UsersTabProps) {
  const [users, setUsers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [form, setForm] = useState<UserForm | null>(null);
  const [temporaryPassword, setTemporaryPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setError('');
    setIsLoading(true);
    try {
      setUsers(await api.getAdminUsers());
    } catch (err) {
      console.error('Failed to load users:', err);
      setError('Не удалось загрузить пользователей');
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return users;
    return users.filter((user) =>
      [user.email, user.full_name, user.phone, user.telegram_id, user.tariff]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q)),
    );
  }, [users, searchQuery]);

  const openCreate = () => {
    setTemporaryPassword('');
    setError('');
    setForm({ ...emptyForm });
  };

  const openEdit = (user: UserType) => {
    setTemporaryPassword('');
    setError('');
    setForm({
      id: user.id,
      email: user.email,
      password: '',
      full_name: user.full_name || '',
      phone: user.phone || '',
      telegram_id: user.telegram_id || '',
      balance: String(user.balance ?? 0),
      tariff: user.tariff || 'free',
      is_admin: Boolean(user.is_admin),
      is_active: user.is_active !== false,
    });
  };

  const saveUser = async () => {
    if (!form) return;
    setIsSaving(true);
    setError('');
    setTemporaryPassword('');
    try {
      const payload = {
        email: form.email.trim(),
        password: form.password || undefined,
        full_name: form.full_name.trim(),
        phone: form.phone.trim(),
        telegram_id: form.telegram_id.trim().replace(/^@/, ''),
        balance: Number(form.balance || 0),
        tariff: form.tariff.trim() || 'free',
        is_admin: form.is_admin,
        is_active: form.is_active,
      };

      if (form.id) {
        await api.updateAdminUser(form.id, payload);
      } else {
        const result = await api.createAdminUser(payload);
        if (result.temporary_pass) setTemporaryPassword(result.temporary_pass);
      }
      await loadUsers();
      if (form.id) setForm(null);
    } catch (err: any) {
      setError(err?.message || 'Не удалось сохранить пользователя');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleStatus = async (user: UserType) => {
    setError('');
    try {
      await api.setAdminUserStatus(user.id, user.is_active === false);
      await loadUsers();
    } catch (err: any) {
      setError(err?.message || 'Не удалось изменить статус');
    }
  };

  const resetPassword = async (user: UserType) => {
    setError('');
    try {
      const result = await api.resetAdminUserPassword(user.id);
      setTemporaryPassword(`${user.email}: ${result.temporary_pass}`);
      await loadUsers();
    } catch (err: any) {
      setError(err?.message || 'Не удалось сбросить пароль');
    }
  };

  const deleteUser = async (user: UserType) => {
    if (!window.confirm(`Удалить учетку ${user.email}?`)) return;
    setError('');
    try {
      await api.deleteAdminUser(user.id);
      await loadUsers();
    } catch (err: any) {
      setError(err?.message || 'Не удалось удалить пользователя');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="font-mono text-primary">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-mono text-2xl font-bold">Пользователи</h2>
          <p className="mt-1 font-mono text-sm text-muted-foreground">
            Всего: {users.length} пользователей
            {dashboardData?.stats?.active_users ? ` • активных: ${dashboardData.stats.active_users}` : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="font-mono" onClick={loadUsers}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Обновить
          </Button>
          <Button className="bg-primary font-mono text-black hover:bg-primary/90" onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Добавить пользователя
          </Button>
        </div>
      </div>

      {(error || temporaryPassword) && (
        <div className={`rounded-lg border px-4 py-3 font-mono text-sm ${error ? 'border-red-500/50 bg-red-500/10 text-red-200' : 'border-primary/40 bg-primary/10 text-primary'}`}>
          {error || `Временный пароль: ${temporaryPassword}`}
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск по email, имени, телефону, Telegram..."
          className="w-full rounded-lg border border-border bg-card py-3 pl-11 pr-4 font-mono text-sm transition-colors focus:border-primary"
        />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-background/50">
              <tr>
                {['ID', 'Контакт', 'Баланс', 'Тариф', 'Статус', 'Дата регистрации', 'Действия'].map((head) => (
                  <th key={head} className="px-5 py-4 text-left font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="hover:bg-primary/5"
                >
                  <td className="px-5 py-4 font-mono text-sm text-muted-foreground">#{user.id}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-start gap-3">
                      <Mail className="mt-1 h-4 w-4 text-primary" />
                      <div className="space-y-1 font-mono">
                        <div className="flex items-center gap-2 text-sm text-foreground">
                          {user.email}
                          {user.is_admin && <Shield className="h-4 w-4 text-accent" />}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {user.full_name || '-'} {user.phone ? `• ${user.phone}` : ''} {user.telegram_id ? `• @${user.telegram_id}` : ''}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono text-sm">₽{Number(user.balance || 0).toFixed(0)}</td>
                  <td className="px-5 py-4">
                    <span className="rounded bg-primary/15 px-2 py-1 font-mono text-xs text-primary">{user.tariff}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1 rounded px-2 py-1 font-mono text-xs ${user.is_active === false ? 'bg-red-500/15 text-red-300' : 'bg-emerald-500/15 text-emerald-300'}`}>
                      {user.is_active === false ? <Ban className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                      {user.is_active === false ? 'Заблокирован' : 'Активен'}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-mono text-sm text-muted-foreground">
                    {new Date(user.created_at).toLocaleDateString('ru-RU')}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      <IconButton title="Редактировать" onClick={() => openEdit(user)}>
                        <Edit3 className="h-4 w-4" />
                      </IconButton>
                      <IconButton title="Сбросить пароль" onClick={() => resetPassword(user)}>
                        <KeyRound className="h-4 w-4" />
                      </IconButton>
                      <IconButton title={user.is_active === false ? 'Разблокировать' : 'Заблокировать'} onClick={() => toggleStatus(user)}>
                        {user.is_active === false ? <CheckCircle2 className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                      </IconButton>
                      <IconButton title="Удалить" danger onClick={() => deleteUser(user)}>
                        <Trash2 className="h-4 w-4" />
                      </IconButton>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="py-12 text-center">
            <User className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
            <p className="font-mono text-muted-foreground">
              {searchQuery ? 'Пользователи не найдены' : 'Нет пользователей'}
            </p>
          </div>
        )}
      </motion.div>

      {form && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-3xl overflow-hidden rounded-lg border border-border bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h3 className="font-mono text-xl font-bold">{form.id ? 'Редактирование учетки' : 'Новая учетка'}</h3>
              <button className="rounded p-2 text-muted-foreground hover:bg-muted hover:text-foreground" onClick={() => setForm(null)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-4 p-6 md:grid-cols-2">
              <Field label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
              <Field label={form.id ? 'Новый пароль (если меняем)' : 'Пароль (можно пусто)'} value={form.password} onChange={(v) => setForm({ ...form, password: v })} type="password" />
              <Field label="Реальное имя" value={form.full_name} onChange={(v) => setForm({ ...form, full_name: v })} />
              <Field label="Телефон" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
              <Field label="Telegram" value={form.telegram_id} onChange={(v) => setForm({ ...form, telegram_id: v })} />
              <Field label="Баланс" value={form.balance} onChange={(v) => setForm({ ...form, balance: v })} />
              <Field label="Тариф" value={form.tariff} onChange={(v) => setForm({ ...form, tariff: v })} />
              <div className="flex items-end gap-5 pb-2">
                <label className="flex items-center gap-2 font-mono text-sm">
                  <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
                  Активен
                </label>
                <label className="flex items-center gap-2 font-mono text-sm">
                  <input type="checkbox" checked={form.is_admin} onChange={(e) => setForm({ ...form, is_admin: e.target.checked })} />
                  Админ
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
              <Button variant="outline" className="font-mono" onClick={() => setForm(null)}>Отмена</Button>
              <Button className="bg-primary font-mono text-black hover:bg-primary/90" disabled={isSaving} onClick={saveUser}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, type = 'text' }: { label: string; value: string; type?: string; onChange: (value: string) => void }) {
  return (
    <label className="space-y-2 font-mono text-sm">
      <span className="text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-primary"
      />
    </label>
  );
}

function IconButton({ title, danger, onClick, children }: { title: string; danger?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-md border transition-colors ${
        danger
          ? 'border-red-500/40 bg-red-500/10 text-red-300 hover:bg-red-500/20'
          : 'border-primary/30 bg-primary/10 text-primary hover:bg-primary/20'
      }`}
    >
      {children}
    </button>
  );
}
