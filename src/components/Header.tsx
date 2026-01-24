import { useState } from 'react';
import { Menu, X, Cpu, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { label: 'VPN', href: '#vpn' },
  { label: 'Сервисы', href: '#services' },
  { label: 'Инфраструктура', href: '#infrastructure' },
  { label: 'Цены', href: '#pricing' },
  { label: 'Поддержка', href: '#support' },
];

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

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
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors relative group ${
                  item.label === 'VPN' 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                {item.label === 'VPN' && <Shield className="inline h-4 w-4 mr-1" />}
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold glow-primary">
              <Shield className="mr-2 h-4 w-4" />
              Подключить VPN
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
          <nav className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-sm font-medium transition-colors px-2 py-2 ${
                    item.label === 'VPN' 
                      ? 'text-primary' 
                      : 'text-muted-foreground hover:text-primary'
                  }`}
                >
                  {item.label === 'VPN' && <Shield className="inline h-4 w-4 mr-1" />}
                  {item.label}
                </a>
              ))}
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold mt-2">
                <Shield className="mr-2 h-4 w-4" />
                Подключить VPN
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
