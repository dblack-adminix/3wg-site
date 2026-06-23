import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export function MobileThemeToggle() {
  const { actualTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    
    setTheme(actualTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className="w-10 h-10 rounded-full border border-border/30 flex items-center justify-center transition-all duration-300 hover:border-primary/50"
      style={{
        backgroundColor: actualTheme === 'dark' ? 'hsl(0 0% 10%)' : 'hsl(0 0% 90%)',
      }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        key={actualTheme}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0, rotate: 180 }}
        transition={{ duration: 0.2 }}
      >
        {actualTheme === 'dark' ? (
          <Moon className="w-5 h-5 text-primary" />
        ) : (
          <Sun className="w-5 h-5 text-primary" />
        )}
      </motion.div>
    </motion.button>
  );
}