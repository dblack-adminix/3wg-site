import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, User, Mail, Lock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Login() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        await login({ email, password });
      } else {
        await register({ email, password });
      }
      navigate('/account');
    } catch (error: any) {
      setError(error.message || 'Ошибка авторизации');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 login-gradient">
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

      {/* Back button */}
      <Link 
        to="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-mono text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        На главную
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Login/Register Card */}
        <div className="backdrop-blur-xl bg-background/80 rounded-2xl border border-primary/30 shadow-2xl shadow-primary/10 overflow-hidden">
          {/* Header */}
          <div className="p-8 pb-6 text-center border-b border-border/50">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 mb-4">
              <User className="w-10 h-10 text-primary" />
            </div>
            
            <h1 className="text-3xl font-bold font-mono mb-2">
              <span className="text-primary">3WG</span> VPN
            </h1>
            <p className="text-muted-foreground font-mono text-sm">
              {isLogin ? 'Вход в личный кабинет' : 'Регистрация аккаунта'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
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
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
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
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 rounded-lg bg-background/50 border border-border focus:border-primary font-mono transition-colors text-sm"
                    required
                    minLength={6}
                  />
                </div>
                {!isLogin && (
                  <p className="mt-1 text-xs text-muted-foreground font-mono">
                    Минимум 6 символов
                  </p>
                )}
              </div>
            </div>
            
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-black font-bold py-3 rounded-lg transition-all hover:shadow-lg hover:shadow-primary/50 disabled:opacity-50"
            >
              {isLoading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
            </Button>

            {/* Toggle Login/Register */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="text-sm font-mono text-muted-foreground hover:text-primary transition-colors"
              >
                {isLogin ? (
                  <>
                    Нет аккаунта? <span className="text-primary">Зарегистрироваться</span>
                  </>
                ) : (
                  <>
                    Уже есть аккаунт? <span className="text-primary">Войти</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="px-8 pb-8 pt-4 border-t border-border/50">
            <p className="text-xs text-center text-muted-foreground font-mono">
              Регистрируясь, вы соглашаетесь с{' '}
              <a href="#" className="text-primary hover:underline">
                условиями использования
              </a>
            </p>
          </div>
        </div>

        {/* Admin link */}
        <div className="mt-6 text-center">
          <Link 
            to="/admin"
            className="text-sm font-mono text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2"
          >
            <Shield className="w-4 h-4" />
            Вход для администратора
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
