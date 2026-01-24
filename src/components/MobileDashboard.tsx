import { useState } from 'react';
import { 
  Shield, Zap, Smartphone, Laptop, Tv, Router, Tablet,
  QrCode, Trash2, Plus, Settings, Activity, Users,
  Wifi, WifiOff, ChevronRight, Lock, Unlock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Device {
  id: string;
  name: string;
  type: 'smartphone' | 'laptop' | 'tv' | 'router' | 'tablet';
  lastSeen: string;
  status: 'online' | 'offline';
  ip: string;
}

const mockDevices: Device[] = [
  { id: '1', name: 'iPhone 15 Pro', type: 'smartphone', lastSeen: 'Сейчас', status: 'online', ip: '10.8.0.2' },
  { id: '2', name: 'MacBook Pro', type: 'laptop', lastSeen: '2 мин назад', status: 'online', ip: '10.8.0.3' },
  { id: '3', name: 'Samsung TV', type: 'tv', lastSeen: '1 час назад', status: 'offline', ip: '10.8.0.4' },
  { id: '4', name: 'iPad Air', type: 'tablet', lastSeen: 'Сейчас', status: 'online', ip: '10.8.0.5' },
  { id: '5', name: 'Home Router', type: 'router', lastSeen: 'Сейчас', status: 'online', ip: '10.8.0.1' },
];

const getDeviceIcon = (type: Device['type']) => {
  switch (type) {
    case 'smartphone': return Smartphone;
    case 'laptop': return Laptop;
    case 'tv': return Tv;
    case 'router': return Router;
    case 'tablet': return Tablet;
    default: return Smartphone;
  }
};

// Circular Progress Component
const CircularProgress = ({ value, size = 180, strokeWidth = 12 }: { value: number; size?: number; strokeWidth?: number }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;
  
  const getColor = (val: number) => {
    if (val < 50) return '#CCFF00'; // Acid Green
    if (val < 80) return '#FF9900'; // Orange
    return '#B10000'; // Cherry Red
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Background circle */}
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(0 0% 15%)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor(value)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            filter: `drop-shadow(0 0 8px ${getColor(value)}80)`,
            transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s ease',
          }}
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold font-mono-tech" style={{ color: getColor(value) }}>
          {value}%
        </span>
        <span className="text-xs text-muted-foreground font-mono-tech">CPU_LOAD</span>
      </div>
    </div>
  );
};

export const MobileDashboard = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [serverLoad] = useState(42);
  const [devices, setDevices] = useState<Device[]>(mockDevices);
  const [showQR, setShowQR] = useState(false);
  const [selectedProtocol, setSelectedProtocol] = useState<'wireguard' | 'amnezia'>('wireguard');

  const handleRevokeDevice = (deviceId: string) => {
    setDevices(devices.filter(d => d.id !== deviceId));
  };

  const onlineDevices = devices.filter(d => d.status === 'online').length;

  return (
    <div className="min-h-screen bg-background text-foreground p-4 pb-24">
      {/* Cyber Grid Background */}
      <div className="fixed inset-0 cyber-grid opacity-20 pointer-events-none" />
      
      {/* Header */}
      <div className="relative z-10 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold font-['Montserrat'] text-primary">3LAB.PRO</h1>
            <p className="text-xs text-muted-foreground font-mono-tech">ADMIN_CONSOLE v2.0</p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-primary pulse-indicator' : 'bg-[#B10000]'}`} />
            <span className="text-xs font-mono-tech text-muted-foreground">
              {isConnected ? 'SECURE' : 'OFFLINE'}
            </span>
          </div>
        </div>
      </div>

      {/* Connection Status Card */}
      <div className="relative z-10 mb-6">
        <div className="relative group">
          <div className={`absolute -inset-[1px] rounded-2xl transition-opacity duration-500 ${
            isConnected 
              ? 'bg-gradient-to-r from-primary to-primary/50 opacity-60' 
              : 'bg-gradient-to-r from-[#B10000] to-[#B10000]/50 opacity-60'
          }`} />
          
          <div className="relative p-6 rounded-2xl backdrop-blur-xl bg-background/90 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {isConnected ? (
                  <Wifi className="h-6 w-6 text-primary" />
                ) : (
                  <WifiOff className="h-6 w-6 text-[#B10000]" />
                )}
                <div>
                  <h2 className="text-lg font-bold font-['Montserrat']">CONNECTION STATUS</h2>
                  <p className="text-xs text-muted-foreground font-mono-tech">
                    {isConnected ? 'vpn.3lab.pro:51820' : 'disconnected'}
                  </p>
                </div>
              </div>
              <Switch 
                checked={isConnected} 
                onCheckedChange={setIsConnected}
                className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-[#B10000]"
              />
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
              <div className="text-center">
                <div className="text-lg font-bold text-primary font-mono-tech">{onlineDevices}</div>
                <div className="text-[10px] text-muted-foreground font-mono-tech">DEVICES</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-accent font-mono-tech">256</div>
                <div className="text-[10px] text-muted-foreground font-mono-tech">BIT_ENC</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-[#FF3333] font-mono-tech">5ms</div>
                <div className="text-[10px] text-muted-foreground font-mono-tech">LATENCY</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Server Load */}
      <div className="relative z-10 mb-6">
        <div className="relative">
          <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-primary/30 to-[#B10000]/30 opacity-40" />
          
          <div className="relative p-6 rounded-2xl backdrop-blur-xl bg-background/90 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold font-['Montserrat'] text-muted-foreground">SERVER LOAD</h3>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </div>
            
            <div className="flex justify-center">
              <CircularProgress value={serverLoad} />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="p-3 rounded-xl bg-background/50 border border-white/5">
                <div className="text-xs text-muted-foreground font-mono-tech mb-1">RAM</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '35%' }} />
                  </div>
                  <span className="text-xs font-mono-tech text-primary">35%</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-background/50 border border-white/5">
                <div className="text-xs text-muted-foreground font-mono-tech mb-1">BANDWIDTH</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: '62%' }} />
                  </div>
                  <span className="text-xs font-mono-tech text-accent">62%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="devices" className="relative z-10">
        <TabsList className="w-full bg-background/50 border border-white/10 rounded-xl p-1 mb-4">
          <TabsTrigger 
            value="devices" 
            className="flex-1 font-mono-tech text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg"
          >
            <Users className="h-4 w-4 mr-2" />
            DEVICES
          </TabsTrigger>
          <TabsTrigger 
            value="protocol" 
            className="flex-1 font-mono-tech text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg"
          >
            <Settings className="h-4 w-4 mr-2" />
            PROTOCOL
          </TabsTrigger>
        </TabsList>

        {/* Devices Tab */}
        <TabsContent value="devices" className="mt-0">
          {/* Add New Device Button */}
          <Button 
            onClick={() => setShowQR(!showQR)}
            className="w-full mb-4 bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 text-primary hover:bg-primary/30 font-mono-tech"
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-2" />
            ADD_NEW_MEMBER
          </Button>

          {/* QR Code Modal */}
          {showQR && (
            <div className="mb-4 p-6 rounded-2xl bg-background/90 border border-primary/30 text-center">
              <div className="w-48 h-48 mx-auto mb-4 bg-white rounded-xl p-4 flex items-center justify-center">
                <QrCode className="w-full h-full text-background" />
              </div>
              <p className="text-xs text-muted-foreground font-mono-tech mb-2">
                SCAN_TO_CONNECT
              </p>
              <p className="text-xs text-primary font-mono-tech">
                config://3lab.pro/invite/xK9mN2...
              </p>
            </div>
          )}

          {/* Device List */}
          <div className="space-y-3">
            {devices.map((device) => {
              const DeviceIcon = getDeviceIcon(device.type);
              return (
                <div 
                  key={device.id}
                  className="relative group"
                >
                  <div className={`absolute -inset-[1px] rounded-xl transition-opacity duration-300 ${
                    device.status === 'online' 
                      ? 'bg-gradient-to-r from-primary/40 to-primary/20 opacity-0 group-hover:opacity-100' 
                      : 'bg-gradient-to-r from-[#B10000]/40 to-[#B10000]/20 opacity-0 group-hover:opacity-100'
                  }`} />
                  
                  <div className="relative p-4 rounded-xl bg-background/80 border border-white/10 flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      device.status === 'online' ? 'bg-primary/20' : 'bg-[#B10000]/20'
                    }`}>
                      <DeviceIcon className={`h-5 w-5 ${
                        device.status === 'online' ? 'text-primary' : 'text-[#B10000]'
                      }`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm truncate">{device.name}</span>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          device.status === 'online' ? 'bg-primary' : 'bg-[#B10000]'
                        }`} />
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono-tech">
                        <span>{device.ip}</span>
                        <span>•</span>
                        <span>{device.lastSeen}</span>
                      </div>
                    </div>
                    
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => handleRevokeDevice(device.id)}
                      className="text-[#B10000] hover:text-[#B10000] hover:bg-[#B10000]/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* Protocol Tab */}
        <TabsContent value="protocol" className="mt-0">
          <div className="space-y-4">
            {/* Protocol Selection */}
            <div className="p-4 rounded-xl bg-background/80 border border-white/10">
              <h4 className="text-xs text-muted-foreground font-mono-tech mb-3">SELECT_PROTOCOL</h4>
              
              <div className="space-y-3">
                {/* WireGuard */}
                <button
                  onClick={() => setSelectedProtocol('wireguard')}
                  className={`w-full p-4 rounded-xl border transition-all duration-300 text-left ${
                    selectedProtocol === 'wireguard'
                      ? 'border-[#B10000] bg-[#B10000]/10'
                      : 'border-white/10 bg-background/50 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        selectedProtocol === 'wireguard' ? 'bg-[#B10000]/20' : 'bg-muted'
                      }`}>
                        <Zap className={`h-5 w-5 ${
                          selectedProtocol === 'wireguard' ? 'text-[#FF3333]' : 'text-muted-foreground'
                        }`} />
                      </div>
                      <div>
                        <div className="font-bold text-sm">WireGuard</div>
                        <div className="text-xs text-muted-foreground font-mono-tech">max_speed</div>
                      </div>
                    </div>
                    {selectedProtocol === 'wireguard' && (
                      <div className="w-2 h-2 rounded-full bg-[#FF3333]" />
                    )}
                  </div>
                </button>

                {/* Amnezia */}
                <button
                  onClick={() => setSelectedProtocol('amnezia')}
                  className={`w-full p-4 rounded-xl border transition-all duration-300 text-left ${
                    selectedProtocol === 'amnezia'
                      ? 'border-accent bg-accent/10'
                      : 'border-white/10 bg-background/50 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        selectedProtocol === 'amnezia' ? 'bg-accent/20' : 'bg-muted'
                      }`}>
                        <Shield className={`h-5 w-5 ${
                          selectedProtocol === 'amnezia' ? 'text-accent' : 'text-muted-foreground'
                        }`} />
                      </div>
                      <div>
                        <div className="font-bold text-sm">AmneziaWG</div>
                        <div className="text-xs text-muted-foreground font-mono-tech">dpi_bypass</div>
                      </div>
                    </div>
                    {selectedProtocol === 'amnezia' && (
                      <div className="w-2 h-2 rounded-full bg-accent" />
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* Protocol Settings */}
            <div className="p-4 rounded-xl bg-background/80 border border-white/10">
              <h4 className="text-xs text-muted-foreground font-mono-tech mb-3">SECURITY_SETTINGS</h4>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Lock className="h-4 w-4 text-primary" />
                    <span className="text-sm">Kill Switch</span>
                  </div>
                  <Switch defaultChecked className="data-[state=checked]:bg-primary" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-accent" />
                    <span className="text-sm">DNS Leak Protection</span>
                  </div>
                  <Switch defaultChecked className="data-[state=checked]:bg-accent" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Auto-reconnect</span>
                  </div>
                  <Switch defaultChecked className="data-[state=checked]:bg-primary" />
                </div>
              </div>
            </div>

            {/* Server Info */}
            <div className="p-4 rounded-xl bg-background/80 border border-white/10">
              <h4 className="text-xs text-muted-foreground font-mono-tech mb-3">SERVER_INFO</h4>
              
              <div className="space-y-2 font-mono-tech text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">endpoint:</span>
                  <span className="text-primary">vpn.3lab.pro</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">port:</span>
                  <span className="text-foreground">51820</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">public_key:</span>
                  <span className="text-foreground truncate max-w-[150px]">xK9mN2pL8...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">cipher:</span>
                  <span className="text-accent">ChaCha20-Poly1305</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-xl border-t border-white/10 z-50">
        <div className="flex items-center justify-around">
          <button className="flex flex-col items-center gap-1 text-primary">
            <Activity className="h-5 w-5" />
            <span className="text-[10px] font-mono-tech">DASHBOARD</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
            <Users className="h-5 w-5" />
            <span className="text-[10px] font-mono-tech">DEVICES</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
            <Settings className="h-5 w-5" />
            <span className="text-[10px] font-mono-tech">SETTINGS</span>
          </button>
        </div>
      </div>
    </div>
  );
};
