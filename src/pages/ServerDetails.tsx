import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Server as ServerIcon, Activity, Network, Download, Upload, Clock, Users, HardDrive, Cpu, RefreshCw } from 'lucide-react';
import { api, InterfaceTraffic } from '@/lib/api';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';

interface Server {
  id: number;
  name: string;
  location: string;
  country: string;
  ip_address: string;
  status: string;
  load: number;
  protocols: string[];
  max_users: number;
  wg_dashboard_url?: string;
  wg_config_name?: string;
  wg_dashboard_port?: number;
  wg_listen_port?: number;
  created_at: string;
  updated_at: string;
}

interface Peer {
  publicKey: string;
  allowed_ip: string[];
  name?: string;
  endpoint?: string;
  preshared_key?: string;
  total_receive?: number;
  total_sent?: number;
  latest_handshake?: string;
}

export default function ServerDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [server, setServer] = useState<Server | null>(null);
  const [peers, setPeers] = useState<Peer[]>([]);
  const [expandedPeer, setExpandedPeer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPeers, setIsLoadingPeers] = useState(false);
  const [traffic, setTraffic] = useState<Record<string, InterfaceTraffic>>({});

  useEffect(() => {
    loadServer();
  }, [id]);

  const loadServer = async () => {
    try {
      setIsLoading(true);
      const data = await api.getServer(Number(id));
      setServer(data);
      if (data.wg_dashboard_url) {
        loadPeers();
        loadTraffic();
      }
    } catch (error: any) {
      console.error('Failed to load server:', error);
      toast.error('Ошибка загрузки сервера');
    } finally {
      setIsLoading(false);
    }
  };

  const loadPeers = async () => {
    try {
      setIsLoadingPeers(true);
      const result = await api.getServerPeers(Number(id));
      setPeers(result.peers || []);
    } catch (error: any) {
      console.error('Failed to load peers:', error);
      toast.error('Ошибка загрузки пиров');
      setPeers([]);
    } finally {
      setIsLoadingPeers(false);
    }
  };

  const loadTraffic = async () => {
    try {
      const result = await api.getServerInterfaceTraffic(Number(id), 30);
      if (result.status === 'success' && result.data) {
        setTraffic(result.data);
      }
    } catch {
      // Трафик интерфейсов доступен только для серверов на 3wg-panel
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === 'N/A') return 'Никогда';
    try {
      return new Date(dateString).toLocaleString('ru-RU');
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'maintenance': return 'bg-yellow-500';
      case 'offline': return 'bg-red-500';
      default: return 'bg-muted';
    }
  };

  const totalReceive = peers.reduce((sum, peer) => sum + (peer.total_receive || 0), 0);
  const totalSent = peers.reduce((sum, peer) => sum + (peer.total_sent || 0), 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!server) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <ServerIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="font-mono text-muted-foreground">Сервер не найден</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/admin')}
                className="font-mono"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Назад
              </Button>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold font-mono">{server.name}</h1>
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(server.status)}`} />
                </div>
                <p className="text-sm text-muted-foreground font-mono mt-1">
                  {server.location} • {server.ip_address}
                </p>
              </div>
            </div>
            <Button
              onClick={loadPeers}
              disabled={isLoadingPeers}
              variant="outline"
              className="font-mono"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingPeers ? 'animate-spin' : ''}`} />
              Обновить
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-mono">Пиры</p>
                <p className="text-3xl font-bold font-mono mt-2">{peers.length}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="bg-card border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-mono">Получено</p>
                <p className="text-3xl font-bold font-mono mt-2 text-blue-500">
                  {formatBytes(totalReceive)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Download className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </Card>

          <Card className="bg-card border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-mono">Отправлено</p>
                <p className="text-3xl font-bold font-mono mt-2 text-green-500">
                  {formatBytes(totalSent)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Upload className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </Card>

          <Card className="bg-card border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-mono">Загрузка</p>
                <p className="text-3xl font-bold font-mono mt-2">{server.load}%</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Cpu className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>
        </div>

        {/* Interface Traffic */}
        {Object.keys(traffic).length > 0 && (
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold font-mono">Трафик интерфейсов</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Object.entries(traffic).map(([protocol, t]) => (
                <Card key={protocol} className="bg-card border-border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className={`font-mono font-bold ${protocol === 'amneziawg' ? 'text-primary' : 'text-accent'}`}>
                        {t.title || protocol}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono mt-1">
                        {t.interface}
                        {t.current && (
                          <> · RX {formatBytes(t.current.rx)} · TX {formatBytes(t.current.tx)}</>
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground font-mono">за {t.days} дн.</p>
                      <p className="font-mono font-bold text-primary">{formatBytes(t.month_total)}</p>
                    </div>
                  </div>
                  <div className="h-36">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={t.series.map(s => ({
                        date: new Date(s.day * 1000).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }),
                        rx: s.rx,
                        tx: s.tx,
                      }))}>
                        <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} interval="preserveStartEnd" />
                        <YAxis tickFormatter={(v) => formatBytes(v)} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} width={70} />
                        <Tooltip
                          formatter={(value: number, name: string) => [formatBytes(value), name === 'rx' ? 'Получено' : 'Отправлено']}
                          contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', fontFamily: 'monospace', fontSize: 12 }}
                        />
                        <Area type="monotone" dataKey="rx" stackId="1" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.25)" />
                        <Area type="monotone" dataKey="tx" stackId="1" stroke="hsl(var(--accent))" fill="hsl(var(--accent) / 0.25)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Peers List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-mono">Пиры</h2>
            <Badge variant="outline" className="font-mono">
              {peers.length} / {server.max_users}
            </Badge>
          </div>

          {isLoadingPeers ? (
            <div className="flex items-center justify-center h-48">
              <RefreshCw className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : peers.length === 0 ? (
            <Card className="bg-card border-border p-12 text-center">
              <Network className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="font-mono text-muted-foreground">Пиров пока нет</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {peers.map((peer, index) => (
                <motion.div
                  key={peer.publicKey || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="bg-card border-border overflow-hidden">
                    {/* Peer Header */}
                    <div
                      className="p-4 cursor-pointer hover:bg-muted/20 transition-colors"
                      onClick={() => setExpandedPeer(expandedPeer === peer.publicKey ? null : peer.publicKey)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Network className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-mono text-sm font-bold">
                                {peer.name || `Peer ${index + 1}`}
                              </p>
                              <Badge variant="outline" className="font-mono text-xs">
                                {peer.allowed_ip?.[0] || 'N/A'}
                              </Badge>
                            </div>
                            <p className="font-mono text-xs text-muted-foreground truncate">
                              {peer.publicKey?.substring(0, 40)}...
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 text-sm font-mono">
                          <div className="text-right">
                            <div className="flex items-center gap-2 text-blue-500">
                              <Download className="w-4 h-4" />
                              <span>{formatBytes(peer.total_receive || 0)}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2 text-green-500">
                              <Upload className="w-4 h-4" />
                              <span>{formatBytes(peer.total_sent || 0)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Peer Details (Expanded) */}
                    {expandedPeer === peer.publicKey && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="border-t border-border bg-background"
                      >
                        <div className="p-6 space-y-6">
                          {/* Public Key */}
                          <div>
                            <p className="text-xs text-muted-foreground font-mono mb-2">Публичный ключ</p>
                            <div className="bg-card p-3 rounded font-mono text-xs break-all">
                              {peer.publicKey}
                            </div>
                          </div>

                          {/* Stats Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-xs text-muted-foreground font-mono mb-1">Получено</p>
                              <p className="font-mono text-sm text-blue-500">
                                {formatBytes(peer.total_receive || 0)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground font-mono mb-1">Отправлено</p>
                              <p className="font-mono text-sm text-green-500">
                                {formatBytes(peer.total_sent || 0)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground font-mono mb-1">Всего</p>
                              <p className="font-mono text-sm text-primary">
                                {formatBytes((peer.total_receive || 0) + (peer.total_sent || 0))}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground font-mono mb-1">Handshake</p>
                              <p className="font-mono text-sm flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatDate(peer.latest_handshake || '')}
                              </p>
                            </div>
                          </div>

                          {/* Additional Info */}
                          {(peer.endpoint || peer.preshared_key) && (
                            <div className="space-y-4 pt-4 border-t border-border">
                              {peer.endpoint && (
                                <div>
                                  <p className="text-xs text-muted-foreground font-mono mb-1">Endpoint</p>
                                  <p className="font-mono text-sm">{peer.endpoint}</p>
                                </div>
                              )}
                              {peer.preshared_key && (
                                <div>
                                  <p className="text-xs text-muted-foreground font-mono mb-2">Preshared Key</p>
                                  <div className="bg-card p-3 rounded font-mono text-xs break-all">
                                    {peer.preshared_key}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
