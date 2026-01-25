import { Link } from 'react-router-dom';
import { Cpu, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer id="support" className="py-16 border-t border-border relative">
      <div className="absolute inset-0 cyber-grid opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Cpu className="h-8 w-8 text-primary drop-shadow-[0_0_10px_hsl(73_100%_50%/0.5)]" />
              <span className="text-xl font-bold font-['Montserrat']">
                <span className="text-primary">3LAB</span>
                <span className="text-muted-foreground">.PRO</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Профессиональная IT-инфраструктура для бизнеса любого масштаба.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-foreground mb-4 font-['Montserrat']">Сервисы</h4>
            <ul className="space-y-2">
              {[
                { label: 'VPN-серверы', href: '/pricing' },
                { label: 'Hardware', href: '/hardware' },
                { label: 'Colocation', href: '/infrastructure' },
                { label: 'Dedicated', href: '/infrastructure' },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-foreground mb-4 font-['Montserrat']">Компания</h4>
            <ul className="space-y-2">
              {[
                { label: 'О нас', href: '/' },
                { label: 'FAQ', href: '/faq' },
                { label: 'Инфраструктура', href: '/infrastructure' },
                { label: 'SLA', href: '/faq' },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-foreground mb-4 font-['Montserrat']">Контакты</h4>
            <ul className="space-y-3">
              <li>
                <a href="tel:+78001234567" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Phone className="h-4 w-4" />
                  8 800 123-45-67
                </a>
              </li>
              <li>
                <a href="mailto:info@3lab.pro" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Mail className="h-4 w-4" />
                  info@3lab.pro
                </a>
              </li>
              <li>
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  Москва, Россия
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 3LAB.PRO. Свобода, подкрепленная железом.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Политика конфиденциальности
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Условия использования
            </a>
          </div>
        </div>
        
        {/* Network Status */}
        <div className="pt-6 text-center">
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-card/50 border border-primary/20">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary pulse-indicator" />
              <span className="text-sm text-muted-foreground font-mono-tech">Network Status: <span className="text-primary">Online</span></span>
            </div>
            <span className="text-sm text-muted-foreground font-mono-tech">|</span>
            <span className="text-sm text-muted-foreground font-mono-tech">Nodes active: <span className="text-primary">14</span></span>
            <span className="text-sm text-muted-foreground font-mono-tech">|</span>
            <span className="text-sm text-muted-foreground font-mono-tech">Uptime: <span className="text-primary">99.98%</span></span>
          </div>
        </div>
      </div>
    </footer>
  );
};
