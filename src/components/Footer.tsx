import { Link } from 'react-router-dom';
import { Cpu, ExternalLink, Send, Github } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

// Network nodes status
const networkNodes = [
  { name: 'AMZWG.RU', status: 'ONLINE', active: true },
  { name: 'WIRE3.RU', status: 'ONLINE', active: true },
  { name: 'NODE-1_PROD', status: 'ACTIVE', active: true },
];

// Navigation links
const accessPoints = [
  { label: 'Infrastructure', href: '/infrastructure' },
  { label: 'Hardware', href: '/hardware' },
  { label: 'Documentation', href: '/faq' },
  { label: 'Support', href: '/faq' },
];

// Social links
const secureChannels = [
  { name: 'Telegram', icon: Send, href: 'https://t.me/lab3pro' },
  { name: 'GitHub', icon: Github, href: 'https://github.com' },
  { name: 'X', icon: () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ), href: 'https://twitter.com' },
];

export const Footer = () => {
  return (
    <footer className="relative bg-[#050505] border-t border-border/50">
      {/* Running light top border */}
      <div className="absolute top-0 left-0 right-0 h-[1px] overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full w-[200px]"
          style={{
            background: 'linear-gradient(90deg, transparent, hsl(73, 100%, 50%), transparent)',
          }}
          animate={{
            x: ['-200px', 'calc(100vw + 200px)'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <div className="absolute inset-0 bg-primary/20" />
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Main 4-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
          
          {/* Column 1: System Branding */}
          <div className="lg:pr-8 lg:border-r lg:border-white/10">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Cpu className="h-6 w-6 text-primary drop-shadow-[0_0_10px_hsl(73_100%_50%/0.5)]" />
              <span className="text-lg font-bold font-['Montserrat']">
                <span className="text-primary">3LAB</span>
                <span className="text-muted-foreground">.PRO</span>
              </span>
            </Link>
            
            <p className="font-mono text-[10px] text-muted-foreground/60 mb-4 leading-relaxed">
              OPERATING SINCE 2024.<br />
              PROTECTING YOUR PACKETS.
            </p>
            
            <p className="font-mono text-[10px] text-muted-foreground/40">
              © 3LAB.PRO [ENCRYPTED]
            </p>
          </div>

          {/* Column 2: Domain Status */}
          <div className="lg:px-8 lg:border-r lg:border-white/10">
            <h4 className="font-mono text-xs text-primary mb-4 tracking-wider">
              NETWORK_NODES
            </h4>
            
            <ul className="space-y-3">
              {networkNodes.map((node) => (
                <li key={node.name} className="flex items-center justify-between">
                  <span className="font-mono text-xs text-muted-foreground">
                    {node.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-primary/80">
                      [ {node.status} ]
                    </span>
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full bg-primary"
                      animate={{
                        boxShadow: [
                          '0 0 2px hsl(73, 100%, 50%)',
                          '0 0 8px hsl(73, 100%, 50%)',
                          '0 0 2px hsl(73, 100%, 50%)',
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="lg:px-8 lg:border-r lg:border-white/10">
            <h4 className="font-mono text-xs text-primary mb-4 tracking-wider">
              ACCESS_POINTS
            </h4>
            
            <ul className="space-y-2">
              {accessPoints.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href}
                    className="group flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-primary transition-all duration-300"
                  >
                    <span className="text-primary/40 group-hover:text-primary transition-colors">&gt;</span>
                    <span className="group-hover:translate-x-2 transition-transform duration-300">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Secure Links */}
          <div className="lg:pl-8">
            <h4 className="font-mono text-xs text-primary mb-4 tracking-wider">
              SECURE_CHANNELS
            </h4>
            
            <div className="flex items-center gap-3 mb-6">
              {secureChannels.map((channel) => (
                <a
                  key={channel.name}
                  href={channel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-2 rounded-lg border border-white/10 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300"
                  title={channel.name}
                >
                  <channel.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>
              ))}
            </div>
            
            <a href="https://t.me/lab3pro" target="_blank" rel="noopener noreferrer">
              <Button
                variant="outline"
                size="sm"
                className="font-mono text-[10px] h-8 px-4 border-primary/30 text-primary/80 hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-all"
                style={{
                  boxShadow: '0 0 10px rgba(204, 255, 0, 0.1)',
                }}
              >
                <ExternalLink className="w-3 h-3 mr-2" />
                GET_INVITE
              </Button>
            </a>
          </div>
        </div>

        {/* Bottom Strip - Easter Egg */}
        <div className="mt-12 pt-4 border-t border-white/5">
          <p className="font-mono text-[8px] text-muted-foreground/20 text-center tracking-widest">
            MD5_HASH: d41d8cd98f00b204e9800998ecf8427e | LATENCY: 0.001ms | ALL SYSTEMS NOMINAL
          </p>
        </div>
      </div>
    </footer>
  );
};
