import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Cpu, Shield, Server, Download, HelpCircle, Rocket, User, DollarSign, Building2, Box, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';

const navItems = [
  { label: 'Главная', href: '/', icon: null },
  { label: 'Тарифы', href: '/pricing', icon: DollarSign },
  { label: 'NODE-1', href: '/node-1', icon: Box },
  { label: 'Софт', href: '/software', icon: Download },
  { label: 'Инфраструктура', href: '/infrastructure', icon: Building2 },
  { label: 'Блог', href: '/blog', icon: BookOpen },
  { label: 'FAQ', href: '/faq', icon: HelpCircle },
];

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <Logo animated={false} />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-1.5 text-sm font-medium transition-all relative group ${
                  isActive(item.href)
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                {item.label}
                <span 
                  className={`absolute -bottom-1 left-0 h-px bg-primary transition-all duration-300 ${
                    isActive(item.href) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} 
                />
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Link to="/account">
              <Button 
                variant="outline" 
                className="border-muted-foreground/30 text-muted-foreground hover:text-foreground hover:bg-muted/50 font-medium group transition-all duration-300"
              >
                <User className="mr-2 h-4 w-4" />
                Личный кабинет
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold glow-primary transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_hsl(73_100%_50%/0.6)]">
                <Rocket className="mr-2 h-4 w-4" />
                Launch App
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <nav className="lg:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors px-3 py-3 rounded-lg ${
                    isActive(item.href)
                      ? 'text-primary bg-primary/5'
                      : 'text-muted-foreground hover:text-primary hover:bg-muted/50'
                  }`}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.label}
                </Link>
              ))}
              
              <div className="pt-2 space-y-2">
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-sm font-medium text-muted-foreground">Тема</span>
                  <ThemeToggle />
                </div>
                <Link to="/account" className="block" onClick={() => setIsOpen(false)}>
                  <Button 
                    variant="outline" 
                    className="w-full border-muted-foreground/30 text-muted-foreground hover:text-foreground font-medium"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Личный кабинет
                  </Button>
                </Link>
                <Link to="/dashboard" className="block" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold hover:shadow-[0_0_20px_hsl(73_100%_50%/0.5)]">
                    <Rocket className="mr-2 h-4 w-4" />
                    Launch App
                  </Button>
                </Link>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
