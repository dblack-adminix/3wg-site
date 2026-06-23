import { motion } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ThemeToggle() {
  const { theme, setTheme, actualTheme } = useTheme();

  const themes = [
    {
      value: 'light' as const,
      label: 'Светлая',
      icon: Sun,
      description: 'Светлая тема'
    },
    {
      value: 'dark' as const,
      label: 'Темная',
      icon: Moon,
      description: 'Темная тема'
    },
    {
      value: 'system' as const,
      label: 'Система',
      icon: Monitor,
      description: 'Следовать системной теме'
    }
  ];

  const currentTheme = themes.find(t => t.value === theme) || themes[1];
  const CurrentIcon = currentTheme.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative overflow-hidden group border-border hover:border-primary/50 transition-all duration-300"
        >
          <motion.div
            key={theme}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <CurrentIcon className="h-4 w-4 transition-colors group-hover:text-primary" />
          </motion.div>
          
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: actualTheme === 'dark' 
                ? 'radial-gradient(circle, rgba(204, 255, 0, 0.1) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(115, 180, 0, 0.1) 0%, transparent 70%)'
            }}
          />
          
          <span className="sr-only">Переключить тему</span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-48 bg-card/95 backdrop-blur-sm border-border"
      >
        {themes.map((themeOption) => {
          const Icon = themeOption.icon;
          const isActive = theme === themeOption.value;
          
          return (
            <DropdownMenuItem
              key={themeOption.value}
              onClick={() => setTheme(themeOption.value)}
              className={`cursor-pointer transition-all duration-200 ${
                isActive 
                  ? 'bg-primary/10 text-primary' 
                  : 'hover:bg-muted/50'
              }`}
            >
              <motion.div
                className="flex items-center gap-3 w-full"
                whileHover={{ x: 2 }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative">
                  <Icon className={`h-4 w-4 transition-colors ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`} />
                  
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: actualTheme === 'dark'
                          ? 'radial-gradient(circle, rgba(204, 255, 0, 0.2) 0%, transparent 70%)'
                          : 'radial-gradient(circle, rgba(115, 180, 0, 0.2) 0%, transparent 70%)'
                      }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className={`font-mono text-sm ${
                    isActive ? 'text-primary font-semibold' : 'text-foreground'
                  }`}>
                    {themeOption.label}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {themeOption.description}
                  </div>
                </div>
                
                {isActive && (
                  <motion.div
                    className="w-2 h-2 rounded-full bg-primary"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  />
                )}
              </motion.div>
            </DropdownMenuItem>
          );
        })}
        
        {/* Current theme indicator */}
        <div className="px-2 py-1 mt-1 border-t border-border">
          <div className="text-xs text-muted-foreground font-mono">
            Активная: {actualTheme === 'dark' ? 'Темная' : 'Светлая'}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}