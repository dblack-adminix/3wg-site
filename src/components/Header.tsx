import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Cpu, Shield, Server, BookOpen, Bot, Rocket, Router, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { label: 'VPN', href: '#vpn', icon: Shield },
  { label: 'Тарифы', href: '#pricing', icon: null },
  { label: 'Hardware', href: '#hardware', icon: Router },
  { label: 'FAQ', href: '#faq', icon: HelpCircle },
];

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <div className="relative">
              <Cpu className="h-8 w-8 text-primary transition-all duration-300 group-hover:drop-shadow-[0_0_10px_hsl(73_100%_50%)]" />
              <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-xl font-bold tracking-tight font-['Montserrat']">
              <span className="text-primary">3LAB</span>
              <span className="text-muted-foreground">.PRO</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleSmoothScroll(e, item.href)}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors relative group ${
                  item.label === 'VPN' 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/dashboard">
              <Button 
                variant="outline" 
                className="border-primary text-primary hover:bg-primary/10 font-semibold group transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_hsl(73_100%_50%/0.5)] hover:border-primary/80"
              >
                <Rocket className="mr-2 h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
                Launch App
              </Button>
            </Link>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold glow-primary transition-all duration-300 hover:scale-105">
              <Shield className="mr-2 h-4 w-4" />
              Получить VPN
            </Button>
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
          <nav className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleSmoothScroll(e, item.href)}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors px-3 py-3 rounded-lg ${
                    item.label === 'VPN' 
                      ? 'text-primary bg-primary/5' 
                      : 'text-muted-foreground hover:text-primary hover:bg-muted/50'
                  }`}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.label}
                </a>
              ))}
              
              <div className="pt-2 space-y-2">
                <Link to="/dashboard" className="block">
                  <Button 
                    variant="outline" 
                    className="w-full border-primary text-primary hover:bg-primary/10 font-semibold hover:shadow-[0_0_20px_hsl(73_100%_50%/0.5)]"
                  >
                    <Rocket className="mr-2 h-4 w-4" />
                    Launch App
                  </Button>
                </Link>
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                  <Shield className="mr-2 h-4 w-4" />
                  Получить VPN
                </Button>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
