import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Server, MapPin, Activity, Users, Plus, Edit, Trash2, Eye, CheckCircle, XCircle, Loader2, Network, Download, Upload, Clock, ArrowLeft, QrCode, FileDown, Power, LayoutGrid, Table2 } from 'lucide-react';
import { api, Server as ServerType, InterfaceTraffic } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogPortal, DialogOverlay } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogPortal, AlertDialogOverlay } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import ReactCountryFlag from 'react-country-flag';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { QRCodeSVG } from 'qrcode.react';

// Функция для получения флага страны по коду
const getCountryFlag = (countryCode: string) => {
  if (!countryCode || countryCode === 'Unknown') {
    return <span className="text-base">🌍</span>;
  }
  
  return (
    <ReactCountryFlag
      countryCode={countryCode.toUpperCase()}
      svg
      style={{
        width: '1.2em',
        height: '1.2em',
      }}
      title={countryCode.toUpperCase()}
    />
  );
};

export function ServersTab() {
  const [servers, setServers] = useState<ServerType[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>(() =>
    localStorage.getItem('admin_servers_view') === 'table' ? 'table' : 'grid'
  );
  const [trafficMap, setTrafficMap] = useState<Record<number, Record<string, InterfaceTraffic>>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [editingServer, setEditingServer] = useState<ServerType | null>(null);
  const [deletingServer, setDeletingServer] = useState<ServerType | null>(null);
  const [viewingServer, setViewingServer] = useState<ServerType | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [peers, setPeers] = useState<any[]>([]);
  const [isLoadingPeers, setIsLoadingPeers] = useState(false);
  const [expandedPeer, setExpandedPeer] = useState<string | null>(null);
  const [selectedServerId, setSelectedServerId] = useState<number | null>(null);
  const [serverDetails, setServerDetails] = useState<ServerType | null>(null);
  const [serverPeers, setServerPeers] = useState<any[]>([]);
  const [serverConfigs, setServerConfigs] = useState<any[]>([]);
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [activeConfig, setActiveConfig] = useState<string>('');
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [isAddPeerDialogOpen, setIsAddPeerDialogOpen] = useState(false);
  const [viewingPeer, setViewingPeer] = useState<any | null>(null);
  const [isPeerDetailsDialogOpen, setIsPeerDetailsDialogOpen] = useState(false);
  const [deletingPeer, setDeletingPeer] = useState<any | null>(null);
  const [isDeletePeerDialogOpen, setIsDeletePeerDialogOpen] = useState(false);
  const [peerTrafficHistory, setPeerTrafficHistory] = useState<any[]>([]);
  const [isLoadingTrafficHistory, setIsLoadingTrafficHistory] = useState(false);
  const [peerTrafficHourly, setPeerTrafficHourly] = useState<any[]>([]);
  const [isLoadingTrafficHourly, setIsLoadingTrafficHourly] = useState(false);
  const [peerConfig, setPeerConfig] = useState<string>('');
  const [peerVpnConfig, setPeerVpnConfig] = useState<string>('');
  const [showVpnQR, setShowVpnQR] = useState(false);
  const [editingPeer, setEditingPeer] = useState<any | null>(null);
  const [peerEditName, setPeerEditName] = useState('');
  const [peerEditCategory, setPeerEditCategory] = useState('');
  const [isPeerEditSaving, setIsPeerEditSaving] = useState(false);
  const [serverCategories, setServerCategories] = useState<{id: number, name: string}[]>([]);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [isLoadingConfig, setIsLoadingConfig] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const changeViewMode = (mode: 'grid' | 'table') => {
    setViewMode(mode);
    localStorage.setItem('admin_servers_view', mode);
  };
  
  // Ref для хранения текущего activeConfig в интервале
  const activeConfigRef = useRef<string>('');
  
  // Обновляем ref при изменении activeConfig
  useEffect(() => {
    activeConfigRef.current = activeConfig;
  }, [activeConfig]);
  const [newPeerData, setNewPeerData] = useState({
    name: '',
    public_key: '',
    private_key: '',
    allowed_ips: '',
  });

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    country: '',
    protocols: ['wireguard'] as string[],
    wg_dashboard_url: '',
    wg_dashboard_key: '',
    max_users: 100, // По умолчанию 100
    usage_type: 'shared', // shared (общие пиры) | dedicated (целиком клиенту)
    dedicated_user_id: '' as string, // ID клиента для dedicated
    panel_type: 'wgdashboard', // wgdashboard | 3wg-panel
    panel_user: '',
    panel_password: '',
  });

  useEffect(() => {
    loadServers(); // Первая загрузка со спиннером
    
    // Автообновление списка серверов каждые 30 секунд (без спиннера)
    const interval = setInterval(() => {
      loadServers(true); // silent = true
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedServerId) {
      loadServerDetails(selectedServerId);
      
      // Автообновление деталей сервера каждые 15 секунд
      const interval = setInterval(() => {
        // Обновляем только данные из кэша (быстро!)
        if (selectedServerId) {
          // Обновляем конфигурации из кэша
          api.getServerConfigCached(selectedServerId)
            .then(configsData => {
              // Обновляем только если есть данные
              if (!configsData.empty && configsData.data && configsData.data.length > 0) {
                setServerConfigs(configsData.data);
              }
              
              // Обновляем пиры для активной конфигурации (используем ref)
              const currentConfig = activeConfigRef.current;
              if (currentConfig) {
                api.getServerPeersCached(selectedServerId, currentConfig)
                  .then(peersData => {
                    // Обновляем только если есть данные или явно пустой массив (не ошибка)
                    if (!peersData.empty) {
                      setServerPeers(peersData.peers || []);
                    }
                  })
                  .catch(() => {});
              }
            })
            .catch(() => {});
          
          // Обновляем системный статус из кэша
          api.getSystemStatusCached(selectedServerId)
            .then(statusData => {
              // Обновляем только если есть данные
              if (!statusData.empty && statusData.data) {
                setSystemStatus(statusData.data);
              }
            })
            .catch(() => {});
        }
      }, 15000);
      
      return () => clearInterval(interval);
    }
  }, [selectedServerId]); // Убрали activeConfig из зависимостей!

  // Загружаем историю трафика при открытии модалки деталей пира
  useEffect(() => {
    if (isPeerDetailsDialogOpen && viewingPeer && selectedServerId) {
      const publicKey = viewingPeer.publicKey || viewingPeer.public_key;
      if (publicKey) {
        // Загружаем дневную историю трафика (7 дней)
        setIsLoadingTrafficHistory(true);
        api.getPeerTrafficHistory(selectedServerId, publicKey, 7)
          .then(response => {
            if (response.status === 'success' && response.data) {
              setPeerTrafficHistory(response.data);
            } else {
              setPeerTrafficHistory([]);
            }
          })
          .catch(err => {
            console.error('[TrafficHistory] Error:', err);
            setPeerTrafficHistory([]);
          })
          .finally(() => setIsLoadingTrafficHistory(false));
        
        // Загружаем почасовую историю трафика (24 часа)
        setIsLoadingTrafficHourly(true);
        api.getPeerTrafficHourly(selectedServerId, publicKey, 24)
          .then(response => {
            if (response.status === 'success' && response.data) {
              setPeerTrafficHourly(response.data);
            } else {
              setPeerTrafficHourly([]);
            }
          })
          .catch(err => {
            console.error('[TrafficHourly] Error:', err);
            setPeerTrafficHourly([]);
          })
          .finally(() => setIsLoadingTrafficHourly(false));
        
        // Загружаем конфиг для QR кода
        setIsLoadingConfig(true);
        api.getPeerConfig(selectedServerId, publicKey)
          .then(response => {
            if (response.status === 'success' && response.config) {
              setPeerConfig(response.config);
            } else {
              setPeerConfig('');
            }
          })
          .catch(err => {
            console.error('[PeerConfig] Error:', err);
            setPeerConfig('');
          })
          .finally(() => setIsLoadingConfig(false));

        // AmneziaVPN-конфиг (vpn://...) — только для 3wg-panel + amneziawg
        setPeerVpnConfig('');
        api.getPeerVPNConfig(selectedServerId, publicKey)
          .then(response => {
            if (response.status === 'success' && response.vpn_config) {
              setPeerVpnConfig(response.vpn_config);
            }
          })
          .catch(() => {});
      }
    } else {
      setPeerTrafficHistory([]);
      setPeerTrafficHourly([]);
      setPeerConfig('');
      setPeerVpnConfig('');
      setShowQR(false);
      setShowVpnQR(false);
    }
  }, [isPeerDetailsDialogOpen, viewingPeer, selectedServerId]);

  const loadServerDetails = async (serverId: number) => {
    try {
      // Загружаем базовую информацию о сервере (быстро!)
      const details = await api.getServer(serverId);
      setServerDetails(details);
      setLoadingDetails(false); // Сразу убираем спиннер!
      
      // Загружаем данные в фоне (без блокировки UI)
      // Пробуем из кэша, если пустой - напрямую
      api.getServerConfigCached(serverId)
        .then(configsData => {
          // Если кэш пустой - загружаем напрямую
          if (configsData.empty) {
            console.log('[Cache] Config cache is empty, loading from WGDashboard...');
            api.getServerConfig(serverId)
              .then(directData => {
                setServerConfigs(directData.data || []);
                
                if (directData.data && directData.data.length > 0) {
                  setActiveConfig(directData.data[0].Name);
                  loadPeersForConfig(directData.data[0].Name);
                }
              })
              .catch(() => setServerConfigs([]));
          } else {
            // Кэш есть - используем его
            setServerConfigs(configsData.data || []);
            
            if (configsData.data && configsData.data.length > 0) {
              setActiveConfig(configsData.data[0].Name);
              
              // Загружаем пиры из кэша
              api.getServerPeersCached(serverId, configsData.data[0].Name)
                .then(peersData => {
                  if (peersData.empty) {
                    // Кэш пустой - загружаем напрямую
                    api.getServerPeers(serverId, configsData.data[0].Name)
                      .then(directData => setServerPeers(directData.peers || []))
                      .catch(() => setServerPeers([]));
                  } else {
                    setServerPeers(peersData.peers || []);
                  }
                })
                .catch(() => setServerPeers([]));
            }
          }
        })
        .catch(err => {
          console.error('[Cache] Failed to load config cache:', err);
          // Fallback на прямой запрос
          api.getServerConfig(serverId)
            .then(configsData => {
              setServerConfigs(configsData.data || []);
              
              if (configsData.data && configsData.data.length > 0) {
                setActiveConfig(configsData.data[0].Name);
                
                api.getServerPeers(serverId, configsData.data[0].Name)
                  .then(directData => setServerPeers(directData.peers || []))
                  .catch(() => setServerPeers([]));
              }
            })
            .catch(() => setServerConfigs([]));
        });
      
      // Загружаем системный статус в фоне
      api.getSystemStatusCached(serverId)
        .then(statusData => {
          if (statusData.empty) {
            // Кэш пустой - загружаем напрямую
            api.getSystemStatus(serverId)
              .then(directData => setSystemStatus(directData?.data || null))
              .catch(() => setSystemStatus(null));
          } else {
            setSystemStatus(statusData?.data || null);
          }
        })
        .catch(() => {
          // Fallback на прямой запрос
          api.getSystemStatus(serverId)
            .then(statusData => setSystemStatus(statusData?.data || null))
            .catch(() => setSystemStatus(null));
        });
    } catch (error) {
      console.error('Failed to load server details:', error);
      toast.error('Ошибка загрузки деталей сервера');
      setLoadingDetails(false);
    }
  };

  const loadPeersForConfig = async (configName: string) => {
    if (!selectedServerId) return;
    
    try {
      // Сразу меняем активную конфигурацию (без спиннера)
      setActiveConfig(configName);
      
      // Загружаем пиры из кэша (быстро!)
      api.getServerPeersCached(selectedServerId, configName)
        .then(peersData => {
          if (peersData.empty) {
            // Кэш пустой - загружаем напрямую
            console.log('[Cache] Peers cache is empty, loading from WGDashboard...');
            api.getServerPeers(selectedServerId, configName)
              .then(directData => setServerPeers(directData.peers || []))
              .catch(() => setServerPeers([]));
          } else {
            setServerPeers(peersData.peers || []);
          }
        })
        .catch(() => {
          // Ошибка кэша - загружаем напрямую
          api.getServerPeers(selectedServerId, configName)
            .then(directData => setServerPeers(directData.peers || []))
            .catch(() => setServerPeers([]));
        });
    } catch (error) {
      console.error('Failed to load peers:', error);
      toast.error('Ошибка загрузки пиров');
      setServerPeers([]);
    }
  };

  const loadServers = async (silent = false) => {
    try {
      if (!silent) {
        setIsLoading(true);
      }
      const data = await api.getServers();
      const serversArray = Array.isArray(data) ? data : [];
      
      // Сразу показываем серверы без статуса
      setServers(serversArray);
      if (!silent) {
        setIsLoading(false);
      }
      
      // Загружаем системный статус из кэша (быстро!)
      serversArray.forEach(async (server) => {
        if (server.wg_dashboard_url) {
          // Трафик интерфейсов (доступен для серверов на 3wg-panel)
          api.getServerInterfaceTraffic(server.id, 30)
            .then((r) => {
              if (r.status === 'success' && r.data && Object.keys(r.data).length > 0) {
                setTrafficMap(prev => ({ ...prev, [server.id]: r.data }));
              }
            })
            .catch(() => {});
          try {
            const status = await api.getSystemStatusCached(server.id);
            
            // Если кэш пустой - загружаем напрямую
            if (status.empty) {
              console.log(`[Cache] Status cache is empty for server ${server.id}, loading from WGDashboard...`);
              const directStatus = await api.getSystemStatus(server.id);
              setServers(prevServers => 
                prevServers.map(s => 
                  s.id === server.id 
                    ? { ...s, systemStatus: directStatus?.data || null }
                    : s
                )
              );
            } else {
              // Обновляем конкретный сервер со статусом из кэша
              setServers(prevServers => 
                prevServers.map(s => 
                  s.id === server.id 
                    ? { ...s, systemStatus: status?.data || null }
                    : s
                )
              );
            }
          } catch (error) {
            // Ошибка кэша - пробуем загрузить напрямую
            console.warn(`Failed to load cached status for server ${server.id}, trying direct:`, error);
            try {
              const directStatus = await api.getSystemStatus(server.id);
              setServers(prevServers => 
                prevServers.map(s => 
                  s.id === server.id 
                    ? { ...s, systemStatus: directStatus?.data || null }
                    : s
                )
              );
            } catch (directError) {
              console.warn(`Failed to load direct status for server ${server.id}:`, directError);
            }
          }
        }
      });
    } catch (error) {
      console.error('Failed to load servers:', error);
      if (!silent) {
        toast.error('Ошибка загрузки серверов');
      }
      setServers([]);
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (server?: ServerType) => {
    if (server) {
      setEditingServer(server);
      setFormData({
        name: server.name,
        location: server.location || '',
        country: server.country || '',
        protocols: server.protocols || ['wireguard'],
        wg_dashboard_url: server.wg_dashboard_url || '',
        wg_dashboard_key: server.wg_dashboard_key || '',
        max_users: server.max_users || 100,
        usage_type: server.usage_type || 'shared',
        dedicated_user_id: server.dedicated_user_id ? String(server.dedicated_user_id) : '',
        panel_type: server.panel_type || 'wgdashboard',
        panel_user: '',
        panel_password: '',
      });
    } else {
      setEditingServer(null);
      setFormData({
        name: '',
        location: '',
        country: '',
        protocols: ['wireguard'],
        wg_dashboard_url: '',
        wg_dashboard_key: '',
        max_users: 100,
        usage_type: 'shared',
        dedicated_user_id: '',
        panel_type: 'wgdashboard',
        panel_user: '',
        panel_password: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Добавляем http:// если не указан протокол
      const dataToSave = {
        ...formData,
        wg_dashboard_url: formData.wg_dashboard_url && !formData.wg_dashboard_url.startsWith('http')
          ? `http://${formData.wg_dashboard_url}`
          : formData.wg_dashboard_url,
        dedicated_user_id: formData.usage_type === 'dedicated' && formData.dedicated_user_id
          ? parseInt(formData.dedicated_user_id)
          : null,
      };
      
      if (editingServer) {
        await api.updateServer(editingServer.id, dataToSave);
        toast.success('Сервер обновлен');
      } else {
        await api.createServer(dataToSave);
        toast.success('Сервер создан');
      }
      
      setIsDialogOpen(false);
      loadServers();
    } catch (error: any) {
      console.error('Failed to save server:', error);
      toast.error(error.message || 'Ошибка сохранения сервера');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingServer) return;
    
    try {
      await api.deleteServer(deletingServer.id);
      toast.success('Сервер удален');
      setIsDeleteDialogOpen(false);
      setDeletingServer(null);
      loadServers();
    } catch (error: any) {
      console.error('Failed to delete server:', error);
      toast.error(error.message || 'Ошибка удаления сервера');
    }
  };

  // Найти следующий доступный IP адрес
  const findAvailableIP = () => {
    if (!activeConfig || serverPeers.length === 0) {
      // Если нет пиров, используем дефолтную подсеть
      return '10.0.0.2/32';
    }

    // Собираем все используемые IP адреса и определяем подсеть
    const usedIPs = new Map<string, Set<number>>(); // subnet -> Set of last octets
    
    serverPeers.forEach(peer => {
      if (peer.allowed_ip && Array.isArray(peer.allowed_ip)) {
        peer.allowed_ip.forEach((ip: string) => {
          // Парсим IP адрес (например, 10.16.10.2/32)
          const match = ip.match(/^(\d+\.\d+\.\d+)\.(\d+)\/(\d+)$/);
          if (match) {
            const subnet = match[1]; // 10.16.10
            const lastOctet = parseInt(match[2]); // 2
            const cidr = match[3]; // 32
            
            if (!usedIPs.has(subnet)) {
              usedIPs.set(subnet, new Set());
            }
            usedIPs.get(subnet)!.add(lastOctet);
          }
        });
      }
    });

    // Если нашли используемые подсети, берем первую и ищем свободный IP в ней
    if (usedIPs.size > 0) {
      // Берем самую популярную подсеть (где больше всего пиров)
      let maxSubnet = '';
      let maxCount = 0;
      
      usedIPs.forEach((ips, subnet) => {
        if (ips.size > maxCount) {
          maxCount = ips.size;
          maxSubnet = subnet;
        }
      });
      
      const usedInSubnet = usedIPs.get(maxSubnet)!;
      
      // Находим первый свободный IP в этой подсети (начиная с .2)
      for (let i = 2; i < 255; i++) {
        if (!usedInSubnet.has(i)) {
          return `${maxSubnet}.${i}/32`;
        }
      }
      
      // Если все заняты, возвращаем .254
      return `${maxSubnet}.254/32`;
    }

    // Фоллбэк на дефолтную подсеть
    return '10.0.0.2/32';
  };

  // Автоматический подбор IP при вводе имени
  const handleNameChange = (name: string) => {
    const updates: any = { name };
    
    // Если имя не пустое и IP еще не установлен, находим доступный
    if (name && !newPeerData.allowed_ips) {
      updates.allowed_ips = findAvailableIP();
    }
    
    setNewPeerData({...newPeerData, ...updates});
  };

  const handleAddPeer = async () => {
    if (!selectedServerId || !activeConfig) return;
    
    // Если IP не установлен, находим доступный
    let allowedIPs = newPeerData.allowed_ips;
    if (!allowedIPs) {
      allowedIPs = findAvailableIP();
      setNewPeerData({
        ...newPeerData,
        allowed_ips: allowedIPs
      });
    }
    
    try {
      setIsSaving(true);
      // Отправляем пустые ключи - сервер WGDashboard сгенерирует их сам
      await api.addPeerToServer(selectedServerId, {
        name: newPeerData.name,
        public_key: "",  // Пустой - сервер сгенерирует
        private_key: "", // Пустой - сервер сгенерирует
        allowed_ips: allowedIPs.split(',').map(ip => ip.trim()),
        config: activeConfig,
      });
      toast.success('Пир добавлен');
      setIsAddPeerDialogOpen(false);
      setNewPeerData({ name: '', public_key: '', private_key: '', allowed_ips: '' });
      loadPeersForConfig(activeConfig);
    } catch (error: any) {
      console.error('Failed to add peer:', error);
      toast.error(error.message || 'Ошибка добавления пира');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePeer = async () => {
    if (!deletingPeer || !selectedServerId) return;
    
    const publicKey = deletingPeer.publicKey || deletingPeer.public_key;
    
    if (!publicKey) {
      toast.error('Public key не найден');
      return;
    }
    
    try {
      await api.removePeerFromServer(selectedServerId, publicKey);
      toast.success('Пир удален');
      setIsDeletePeerDialogOpen(false);
      setDeletingPeer(null);
      loadPeersForConfig(activeConfig);
    } catch (error: any) {
      console.error('Failed to delete peer:', error);
      toast.error(error.message || 'Ошибка удаления пира');
    }
  };

  const handleTestConnection = async (server: ServerType) => {
    if (!server.wg_dashboard_url) {
      toast.error('WGDashboard не настроен для этого сервера');
      return;
    }

    try {
      setIsTestingConnection(true);
      const result = await api.testWGDashboard(server.id);
      
      if (result.status === 'success') {
        toast.success('Подключение к WGDashboard успешно!');
      } else {
        toast.error('Ошибка подключения к WGDashboard');
      }
    } catch (error: any) {
      console.error('Failed to test connection:', error);
      toast.error(error.message || 'Ошибка тестирования подключения');
    } finally {
      setIsTestingConnection(false);
    }
  };

  const loadPeers = async (serverId: number) => {
    try {
      setIsLoadingPeers(true);
      const result = await api.getServerPeers(serverId);
      setPeers(result.peers || []);
    } catch (error: any) {
      console.error('Failed to load peers:', error);
      toast.error('Ошибка загрузки пиров');
      setPeers([]);
    } finally {
      setIsLoadingPeers(false);
    }
  };

  const handleViewDetails = (server: ServerType) => {
    setViewingServer(server);
    setIsDetailsDialogOpen(true);
    if (server.wg_dashboard_url) {
      loadPeers(server.id);
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
      case 'active': return 'text-green-500 bg-green-500/20';
      case 'maintenance': return 'text-yellow-500 bg-yellow-500/20';
      case 'offline': return 'text-red-500 bg-red-500/20';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Активен';
      case 'maintenance': return 'Обслуживание';
      case 'offline': return 'Офлайн';
      default: return status;
    }
  };

  // Функция для рендера диалогов пиров (используется и в деталях сервера, и в списке)
  const renderPeerDialogs = () => (
    <>
      {/* Delete Peer Dialog */}
      <AlertDialog open={isDeletePeerDialogOpen} onOpenChange={setIsDeletePeerDialogOpen}>
        <AlertDialogPortal>
          <AlertDialogOverlay style={{ zIndex: 9998 }} />
          <AlertDialogContent className="bg-background border-border" style={{ zIndex: 9999 }}>
            <AlertDialogHeader>
              <AlertDialogTitle className="font-mono">Удалить пир?</AlertDialogTitle>
              <AlertDialogDescription className="font-mono text-sm">
                Вы уверены, что хотите удалить пир "{deletingPeer?.name || 'Без имени'}"? 
                Это действие нельзя отменить.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="font-mono">Отмена</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeletePeer}
                className="bg-red-500 hover:bg-red-600 text-white font-mono"
              >
                Удалить
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogPortal>
      </AlertDialog>

      {/* Peer Details Dialog */}
      <Dialog open={isPeerDetailsDialogOpen} onOpenChange={setIsPeerDetailsDialogOpen}>
        <DialogPortal>
          <DialogOverlay style={{ zIndex: 9998 }} />
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background border-border custom-scrollbar" style={{ zIndex: 9999 }}>
            <DialogHeader>
              <DialogTitle className="font-mono text-xl">
                {viewingPeer?.name || 'Пир без имени'}
              </DialogTitle>
              <DialogDescription className="font-mono text-sm">
                Подробная информация о пире
              </DialogDescription>
            </DialogHeader>

            {viewingPeer && (
              <div className="space-y-6 py-4">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="font-mono text-sm font-bold text-primary">Основная информация</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground font-mono">Имя:</span>
                        <p className="font-mono mt-1">{viewingPeer.name || 'Не указано'}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground font-mono">Статус:</span>
                        <p className="font-mono mt-1">
                          <span className={`px-2 py-1 rounded text-xs ${
                            viewingPeer.status === 'running' 
                              ? 'bg-green-500/20 text-green-500' 
                              : 'bg-gray-500/20 text-gray-500'
                          }`}>
                            {viewingPeer.status === 'running' ? 'Онлайн' : 'Офлайн'}
                          </span>
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground font-mono">Public Key:</span>
                        <code className="block mt-1 text-xs bg-background px-2 py-1 rounded break-all">
                          {viewingPeer.publicKey || viewingPeer.public_key || 'N/A'}
                        </code>
                      </div>
                      <div>
                        <span className="text-muted-foreground font-mono">Allowed IPs:</span>
                        <code className="block mt-1 text-xs bg-background px-2 py-1 rounded">
                          {viewingPeer.allowed_ip?.join(', ') || 'N/A'}
                        </code>
                      </div>
                      {viewingPeer.endpoint && viewingPeer.endpoint !== '0.0.0.0/0' && (
                        <div>
                          <span className="text-muted-foreground font-mono">Endpoint:</span>
                          <code className="block mt-1 text-xs bg-background px-2 py-1 rounded">
                            {viewingPeer.endpoint}
                          </code>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-mono text-sm font-bold text-primary">Статистика трафика</h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-card rounded-lg border border-border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground font-mono">Получено</span>
                          <Download className="w-5 h-5 text-blue-500" />
                        </div>
                        <div className="text-2xl font-bold font-mono text-blue-500">
                          {(viewingPeer.total_receive || 0).toFixed(4)} GB
                        </div>
                      </div>

                      <div className="p-4 bg-card rounded-lg border border-border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground font-mono">Отправлено</span>
                          <Upload className="w-5 h-5 text-green-500" />
                        </div>
                        <div className="text-2xl font-bold font-mono text-green-500">
                          {(viewingPeer.total_sent || 0).toFixed(4)} GB
                        </div>
                      </div>

                      <div className="p-4 bg-card rounded-lg border border-border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground font-mono">Всего</span>
                          <Activity className="w-5 h-5 text-primary" />
                        </div>
                        <div className="text-2xl font-bold font-mono text-primary">
                          {(viewingPeer.total_data || 0).toFixed(4)} GB
                        </div>
                      </div>

                      <div className="p-4 bg-card rounded-lg border border-border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground font-mono">Последний handshake</span>
                          <Clock className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="text-sm font-mono">
                          {viewingPeer.latest_handshake === 'No Handshake' 
                            ? 'Никогда' 
                            : viewingPeer.latest_handshake + ' ago'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* График трафика */}
                <div className="space-y-2">
                  <h3 className="font-mono text-sm font-bold text-primary">График трафика (последние 7 дней)</h3>
                  <div className="p-4 bg-card rounded-lg border border-border">
                    {isLoadingTrafficHistory ? (
                      <div className="flex items-center justify-center h-[250px]">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      </div>
                    ) : peerTrafficHistory.length > 0 ? (
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart
                          data={peerTrafficHistory.map(h => ({
                            day: new Date(h.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }),
                            download: h.gb_received,
                            upload: h.gb_sent,
                          }))}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                          <XAxis dataKey="day" stroke="#888" style={{ fontSize: '12px', fontFamily: 'JetBrains Mono' }} />
                          <YAxis stroke="#888" style={{ fontSize: '12px', fontFamily: 'JetBrains Mono' }} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#111', 
                              border: '1px solid #333', 
                              borderRadius: '8px',
                              fontFamily: 'JetBrains Mono',
                              fontSize: '12px'
                            }}
                            formatter={(value: number) => `${value.toFixed(4)} GB`}
                          />
                          <Legend 
                            wrapperStyle={{ 
                              fontFamily: 'JetBrains Mono',
                              fontSize: '12px'
                            }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="download" 
                            stroke="#3b82f6" 
                            strokeWidth={2}
                            name="Получено"
                            dot={{ fill: '#3b82f6', r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="upload" 
                            stroke="#22c55e" 
                            strokeWidth={2}
                            name="Отправлено"
                            dot={{ fill: '#22c55e', r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-[250px]">
                        <p className="text-muted-foreground font-mono text-sm">
                          Нет данных за последние 7 дней. История начнет собираться автоматически.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Трафик по часам за последние 24 часа */}
                <div className="space-y-2">
                  <h3 className="font-mono text-sm font-bold text-primary">Трафик по часам (последние 24 часа)</h3>
                  <div className="p-4 bg-card rounded-lg border border-border">
                    {isLoadingTrafficHourly ? (
                      <div className="flex items-center justify-center h-[300px]">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      </div>
                    ) : peerTrafficHourly.length > 0 ? (
                      <>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={peerTrafficHourly.map(h => ({
                              hour: new Date(h.timestamp * 1000).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
                              received: h.gb_received,
                              sent: h.gb_sent
                            }))}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                              <XAxis 
                                dataKey="hour" 
                                stroke="#888"
                                style={{ fontSize: '11px', fontFamily: 'monospace' }}
                                angle={-45}
                                textAnchor="end"
                                height={60}
                              />
                              <YAxis 
                                stroke="#888"
                                style={{ fontSize: '11px', fontFamily: 'monospace' }}
                                label={{ value: 'GB', angle: -90, position: 'insideLeft', style: { fill: '#888' } }}
                              />
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: '#0a0a0a', 
                                  border: '1px solid #333',
                                  borderRadius: '8px',
                                  fontFamily: 'monospace',
                                  fontSize: '12px'
                                }}
                                formatter={(value: number) => `${value.toFixed(3)} GB`}
                              />
                              <Legend 
                                wrapperStyle={{ fontFamily: 'monospace', fontSize: '12px' }}
                              />
                              <Line 
                                type="monotone" 
                                dataKey="received" 
                                stroke="#3b82f6" 
                                strokeWidth={2}
                                name="Получено"
                                dot={{ fill: '#3b82f6', r: 3 }}
                                activeDot={{ r: 5 }}
                              />
                              <Line 
                                type="monotone" 
                                dataKey="sent" 
                                stroke="#22c55e" 
                                strokeWidth={2}
                                name="Отправлено"
                                dot={{ fill: '#22c55e', r: 3 }}
                                activeDot={{ r: 5 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                          <div className="text-center">
                            <span className="text-muted-foreground font-mono block">Получено за 24ч</span>
                            <p className="font-mono mt-1 text-primary">
                              {peerTrafficHourly.reduce((sum, h) => sum + h.gb_received, 0).toFixed(3)} GB
                            </p>
                          </div>
                          <div className="text-center">
                            <span className="text-muted-foreground font-mono block">Отправлено за 24ч</span>
                            <p className="font-mono mt-1 text-green-500">
                              {peerTrafficHourly.reduce((sum, h) => sum + h.gb_sent, 0).toFixed(3)} GB
                            </p>
                          </div>
                          <div className="text-center">
                            <span className="text-muted-foreground font-mono block">Всего за 24ч</span>
                            <p className="font-mono mt-1 text-blue-500">
                              {peerTrafficHourly.reduce((sum, h) => sum + h.gb_total, 0).toFixed(3)} GB
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-green-500 font-mono mt-2 text-center">
                          ✓ Реальные данные из базы данных (обновляется каждый час)
                        </p>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-[300px]">
                        <p className="text-muted-foreground font-mono text-sm">
                          Нет данных за последние 24 часа. История начнет собираться автоматически.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* QR код и скачивание конфига */}
                <div className="space-y-2 pt-4 border-t border-border">
                  <h3 className="font-mono text-sm font-bold text-primary">Подключение</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {/* QR код */}
                    <div className="p-4 bg-card rounded-lg border border-border">
                      <div className="flex flex-col items-center gap-3">
                        {isLoadingConfig ? (
                          <div className="w-48 h-48 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                          </div>
                        ) : peerConfig ? (
                          <>
                            {showQR ? (
                              <div className="p-4 bg-white rounded-lg">
                                <QRCodeSVG 
                                  value={peerConfig} 
                                  size={192}
                                  level="M"
                                  includeMargin={true}
                                />
                              </div>
                            ) : (
                              <div className="w-48 h-48 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
                                <QrCode className="w-16 h-16 text-muted-foreground" />
                              </div>
                            )}
                            <Button
                              onClick={() => setShowQR(!showQR)}
                              variant="outline"
                              size="sm"
                              className="w-full font-mono"
                            >
                              <QrCode className="w-4 h-4 mr-2" />
                              {showQR ? 'Скрыть QR' : 'Показать QR'}
                            </Button>
                          </>
                        ) : (
                          <div className="w-48 h-48 flex items-center justify-center">
                            <p className="text-muted-foreground font-mono text-sm text-center">
                              Конфиг недоступен
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Скачивание */}
                    <div className="p-4 bg-card rounded-lg border border-border">
                      <div className="flex flex-col gap-3">
                        <div>
                          <h4 className="font-mono text-sm font-bold mb-2">Скачать конфигурацию</h4>
                          <p className="text-xs text-muted-foreground font-mono">
                            Импортируйте конфиг в WireGuard клиент или отсканируйте QR код
                          </p>
                        </div>
                        <Button
                          onClick={() => {
                            if (peerConfig) {
                              const blob = new Blob([peerConfig], { type: 'text/plain' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `${viewingPeer?.name || 'peer'}.conf`;
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                              URL.revokeObjectURL(url);
                              toast.success('Конфиг скачан');
                            }
                          }}
                          disabled={!peerConfig || isLoadingConfig}
                          variant="outline"
                          className="w-full font-mono"
                        >
                          {isLoadingConfig ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Загрузка...
                            </>
                          ) : (
                            <>
                              <FileDown className="w-4 h-4 mr-2" />
                              Скачать .conf
                            </>
                          )}
                        </Button>
                        <div className="text-xs text-muted-foreground font-mono space-y-1">
                          <p>📱 Мобильные: Сканируйте QR</p>
                          <p>💻 Десктоп: Скачайте .conf</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AmneziaVPN (vpn://) — второй QR и конфиг для AmneziaWG */}
                  {peerVpnConfig && (
                    <>
                      <h3 className="font-mono text-sm font-bold text-accent pt-2">AmneziaVPN</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-card rounded-lg border border-accent/30">
                          <div className="flex flex-col items-center gap-3">
                            {showVpnQR ? (
                              <div className="p-4 bg-white rounded-lg">
                                <QRCodeSVG
                                  value={peerVpnConfig}
                                  size={192}
                                  level="L"
                                  includeMargin={true}
                                />
                              </div>
                            ) : (
                              <div className="w-48 h-48 flex items-center justify-center border-2 border-dashed border-accent/30 rounded-lg">
                                <QrCode className="w-16 h-16 text-accent/60" />
                              </div>
                            )}
                            <Button
                              onClick={() => setShowVpnQR(!showVpnQR)}
                              variant="outline"
                              size="sm"
                              className="w-full font-mono text-accent hover:text-accent"
                            >
                              <QrCode className="w-4 h-4 mr-2" />
                              {showVpnQR ? 'Скрыть QR' : 'Показать QR (AmneziaVPN)'}
                            </Button>
                          </div>
                        </div>
                        <div className="p-4 bg-card rounded-lg border border-accent/30">
                          <div className="flex flex-col gap-3">
                            <div>
                              <h4 className="font-mono text-sm font-bold mb-2">Конфиг AmneziaVPN</h4>
                              <p className="text-xs text-muted-foreground font-mono">
                                Импортируйте .vpn файл в приложение AmneziaVPN или отсканируйте QR
                              </p>
                            </div>
                            <Button
                              onClick={() => {
                                const blob = new Blob([peerVpnConfig], { type: 'text/plain' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `${viewingPeer?.name || 'peer'}_amnezia.vpn`;
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                                URL.revokeObjectURL(url);
                                toast.success('AmneziaVPN конфиг скачан');
                              }}
                              variant="outline"
                              className="w-full font-mono text-accent hover:text-accent"
                            >
                              <FileDown className="w-4 h-4 mr-2" />
                              Скачать .vpn
                            </Button>
                            <div className="text-xs text-muted-foreground font-mono space-y-1">
                              <p>📱 AmneziaVPN: Сканируйте QR</p>
                              <p>💻 Десктоп: Импортируйте .vpn</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsPeerDetailsDialogOpen(false)}
                className="font-mono"
              >
                Закрыть
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPortal>
      </Dialog>
      {/* Edit Peer Dialog (3wg-panel) */}
      <Dialog open={!!editingPeer} onOpenChange={(open) => { if (!open) setEditingPeer(null); }}>
        <DialogPortal>
          <DialogOverlay style={{ zIndex: 9998 }} />
          <DialogContent className="bg-background border-border max-w-md" style={{ zIndex: 9999 }}>
            <DialogHeader>
              <DialogTitle className="font-mono">Редактировать пир</DialogTitle>
              <DialogDescription className="font-mono text-sm">
                {editingPeer?.publicKey?.substring(0, 32)}...
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label className="font-mono text-xs">Имя пира</Label>
                <Input
                  value={peerEditName}
                  onChange={(e) => setPeerEditName(e.target.value)}
                  className="font-mono"
                  placeholder="Имя клиента"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-mono text-xs">Категория</Label>
                {!isNewCategory ? (
                  <select
                    value={peerEditCategory}
                    onChange={(e) => {
                      if (e.target.value === '__new__') {
                        setIsNewCategory(true);
                        setPeerEditCategory('');
                      } else {
                        setPeerEditCategory(e.target.value);
                      }
                    }}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">— Без категории —</option>
                    {serverCategories.map((cat) => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                    {peerEditCategory && !serverCategories.some(c => c.name === peerEditCategory) && (
                      <option value={peerEditCategory}>{peerEditCategory}</option>
                    )}
                    <option value="__new__">+ Создать новую…</option>
                  </select>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      value={peerEditCategory}
                      onChange={(e) => setPeerEditCategory(e.target.value)}
                      className="font-mono"
                      placeholder="Название новой категории"
                      autoFocus
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="font-mono h-10"
                      onClick={() => { setIsNewCategory(false); setPeerEditCategory(editingPeer?.category || ''); }}
                    >
                      ↩
                    </Button>
                  </div>
                )}
                <p className="text-xs text-muted-foreground font-mono">
                  {isNewCategory ? 'Новая категория будет создана автоматически' : 'Выберите из существующих или создайте новую'}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" className="font-mono" onClick={() => setEditingPeer(null)}>
                Отмена
              </Button>
              <Button
                className="font-mono"
                disabled={isPeerEditSaving}
                onClick={async () => {
                  const publicKey = editingPeer.publicKey || editingPeer.public_key;
                  setIsPeerEditSaving(true);
                  try {
                    await api.updatePeerInfo(selectedServerId!, publicKey, {
                      name: peerEditName.trim(),
                      category: peerEditCategory.trim(),
                    });
                    toast.success('Пир обновлен');
                    setServerPeers(prev => prev.map(p =>
                      (p.publicKey || p.public_key) === publicKey
                        ? { ...p, name: peerEditName.trim() || p.name, category: peerEditCategory.trim() }
                        : p
                    ));
                    setEditingPeer(null);
                  } catch (e: any) {
                    toast.error(e?.message || 'Ошибка сохранения');
                  } finally {
                    setIsPeerEditSaving(false);
                  }
                }}
              >
                {isPeerEditSaving ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  );

  if (isLoading) {    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Если выбран сервер - показываем детали
  if (selectedServerId) {
    // Показываем скелетон только если нет базовой информации о сервере
    if (!serverDetails) {
      return (
        <>
          <div className="flex items-center justify-center h-96">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
          
          {/* Диалоги пиров - всегда рендерятся */}
          {renderPeerDialogs()}
        </>
      );
    }

    return (
      <>
      <div className="space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedServerId(null);
                setServerDetails(null);
                setServerPeers([]);
                setServerConfigs([]);
                setActiveConfig('');
              }}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Назад
            </Button>
            <div>
              <h2 className="text-2xl font-bold font-mono">{serverDetails.name}</h2>
              <p className="text-muted-foreground font-mono text-sm mt-1">
                {serverDetails.location}, {serverDetails.country}
              </p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-mono ${
            serverDetails.status === 'active' 
              ? 'bg-green-500/20 text-green-500' 
              : 'bg-red-500/20 text-red-500'
          }`}>
            {serverDetails.status === 'active' ? 'Активен' : 'Неактивен'}
          </span>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="p-4 bg-card rounded-lg border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground font-mono">Пиры</span>
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div className="text-2xl font-bold font-mono">
              {serverConfigs.reduce((sum, c) => sum + c.ConnectedPeers, 0)} / {serverConfigs.reduce((sum, c) => sum + c.TotalPeers, 0)}
            </div>
            <div className="text-xs text-muted-foreground font-mono mt-1">
              Онлайн / Всего
            </div>
          </div>

          <div className="p-4 bg-card rounded-lg border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground font-mono">Получено</span>
              <Download className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-2xl font-bold font-mono">
              {serverConfigs.reduce((sum, c) => sum + c.DataUsage.Receive, 0).toFixed(2)} GB
            </div>
          </div>

          <div className="p-4 bg-card rounded-lg border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground font-mono">Отправлено</span>
              <Upload className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold font-mono">
              {serverConfigs.reduce((sum, c) => sum + c.DataUsage.Sent, 0).toFixed(2)} GB
            </div>
          </div>

          <div className="p-4 bg-card rounded-lg border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground font-mono">Всего трафика</span>
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div className="text-2xl font-bold font-mono">
              {serverConfigs.reduce((sum, c) => sum + c.DataUsage.Total, 0).toFixed(2)} GB
            </div>
          </div>
        </div>

        {/* System Resources */}
        {systemStatus && systemStatus.data && (
          <div className="grid md:grid-cols-4 gap-4">
            <div className="p-4 bg-card rounded-lg border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground font-mono">CPU</span>
                <Activity className="w-5 h-5 text-orange-500" />
              </div>
              <div className="text-2xl font-bold font-mono">{systemStatus.data.CPU.cpu_percent.toFixed(1)}%</div>
              <div className="h-2 bg-background rounded-full overflow-hidden mt-2">
                <div
                  className="h-full bg-orange-500 transition-all"
                  style={{ width: `${systemStatus.data.CPU.cpu_percent}%` }}
                />
              </div>
            </div>

            <div className="p-4 bg-card rounded-lg border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground font-mono">Память</span>
                <Activity className="w-5 h-5 text-purple-500" />
              </div>
              <div className="text-2xl font-bold font-mono">{systemStatus.data.Memory.VirtualMemory.percent.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground font-mono mt-1">
                {(systemStatus.data.Memory.VirtualMemory.used / 1024 / 1024 / 1024).toFixed(1)} / {(systemStatus.data.Memory.VirtualMemory.total / 1024 / 1024 / 1024).toFixed(1)} GB
              </div>
              <div className="h-2 bg-background rounded-full overflow-hidden mt-2">
                <div
                  className="h-full bg-purple-500 transition-all"
                  style={{ width: `${systemStatus.data.Memory.VirtualMemory.percent}%` }}
                />
              </div>
            </div>

            <div className="p-4 bg-card rounded-lg border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground font-mono">Storage</span>
                <Activity className="w-5 h-5 text-cyan-500" />
              </div>
              <div className="text-2xl font-bold font-mono">{systemStatus.data.Disks[0].percent.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground font-mono mt-1">
                {(systemStatus.data.Disks[0].used / 1024 / 1024 / 1024).toFixed(1)} / {(systemStatus.data.Disks[0].total / 1024 / 1024 / 1024).toFixed(1)} GB
              </div>
              <div className="h-2 bg-background rounded-full overflow-hidden mt-2">
                <div
                  className="h-full bg-cyan-500 transition-all"
                  style={{ width: `${systemStatus.data.Disks[0].percent}%` }}
                />
              </div>
            </div>

            <div className="p-4 bg-card rounded-lg border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground font-mono">IP адрес</span>
                <Network className="w-5 h-5 text-primary" />
              </div>
              <div className="text-xl font-bold font-mono">{serverDetails.ip_address}</div>
              <div className="text-xs text-muted-foreground font-mono mt-1">
                {serverDetails.location}
              </div>
            </div>
          </div>
        )}

        {/* Configurations Tabs */}
        {serverConfigs.length > 0 && (
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="flex border-b border-border">
              {serverConfigs.map((config) => (
                <button
                  key={config.Name}
                  onClick={() => loadPeersForConfig(config.Name)}
                  className={`flex-1 px-6 py-4 font-mono text-sm transition-colors relative ${
                    activeConfig === config.Name
                      ? 'bg-primary/10 text-primary border-b-2 border-primary'
                      : 'text-muted-foreground hover:bg-background/50'
                  }`}
                >
                  <div className="space-y-2">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-bold">{config.Name}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          config.Status 
                            ? 'bg-green-500/20 text-green-500' 
                            : 'bg-red-500/20 text-red-500'
                        }`}>
                          {config.Status ? 'RUNNING' : 'STOPPED'}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {config.Address}
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{config.ConnectedPeers} / {config.TotalPeers}</span>
                      </div>
                      <div className="flex items-center gap-1 text-blue-500">
                        <Download className="w-3 h-3" />
                        <span>{config.DataUsage.Receive.toFixed(2)} GB</span>
                      </div>
                      <div className="flex items-center gap-1 text-green-500">
                        <Upload className="w-3 h-3" />
                        <span>{config.DataUsage.Sent.toFixed(2)} GB</span>
                      </div>
                      <div className="flex items-center gap-1 text-primary">
                        <Activity className="w-3 h-3" />
                        <span>{config.DataUsage.Total.toFixed(2)} GB</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Peers List */}
        <div className="bg-card rounded-lg border border-border">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="font-bold font-mono">Пиры ({serverPeers.length})</h3>
              {activeConfig && (
                <p className="text-xs text-muted-foreground font-mono mt-1">
                  Конфигурация: {activeConfig}
                </p>
              )}
            </div>
            <Button size="sm" className="gap-2" onClick={() => setIsAddPeerDialogOpen(true)}>
              <Plus className="w-4 h-4" />
              Добавить пир
            </Button>
          </div>

          {serverPeers.length === 0 ? (
            <div className="p-8 text-center">
              <Network className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground font-mono">Нет пиров</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {serverPeers.map((peer, index) => (
                <div key={peer.publicKey || peer.public_key || index} className="p-4 hover:bg-background/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Network className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono font-bold">
                            {peer.name || `Peer ${index + 1}`}
                          </span>
                          {peer.category && (
                            <span className="px-2 py-0.5 rounded bg-primary/15 text-primary text-xs font-mono">
                              📁 {peer.category}
                            </span>
                          )}
                          {peer.status === 'running' ? (
                            <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-500 text-xs font-mono">
                              Онлайн
                            </span>
                          ) : peer.status === 'disabled' ? (
                            <span className="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-500 text-xs font-mono">
                              Заблокирован
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-gray-500/20 text-gray-500 text-xs font-mono">
                              Офлайн
                            </span>
                          )}
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <span className="font-mono">PublicKey:</span>
                            <code className="text-xs bg-background px-2 py-0.5 rounded">
                              {(peer.publicKey || peer.public_key || '').substring(0, 32)}...
                            </code>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <span className="font-mono">AllowedIPs:</span>
                            <code className="text-xs bg-background px-2 py-0.5 rounded">
                              {peer.allowed_ip.join(', ')}
                            </code>
                          </div>
                          {peer.endpoint && peer.endpoint !== '0.0.0.0/0' && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <span className="font-mono">Endpoint:</span>
                              <code className="text-xs bg-background px-2 py-0.5 rounded">
                                {peer.endpoint}
                              </code>
                            </div>
                          )}
                          {/* Traffic and Handshake Info */}
                          <div className="flex items-center gap-4 mt-2 text-xs font-mono">
                            <div className="flex items-center gap-1 text-blue-500">
                              <Download className="w-3 h-3" />
                              <span>{(peer.total_receive || 0).toFixed(4)} GB</span>
                            </div>
                            <div className="flex items-center gap-1 text-green-500">
                              <Upload className="w-3 h-3" />
                              <span>{(peer.total_sent || 0).toFixed(4)} GB</span>
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              <span>{peer.latest_handshake === 'No Handshake' ? 'Никогда' : peer.latest_handshake + ' ago'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setViewingPeer(peer);
                          setIsPeerDetailsDialogOpen(true);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {serverDetails?.panel_type === '3wg-panel' && (
                        <Button
                          size="sm"
                          variant="outline"
                          title="Редактировать"
                          onClick={() => {
                            setEditingPeer(peer);
                            setPeerEditName(peer.name || '');
                            setPeerEditCategory(peer.category || '');
                            setIsNewCategory(false);
                            api.getServerCategories(selectedServerId!)
                              .then(r => setServerCategories(r.categories || []))
                              .catch(() => setServerCategories([]));
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        title={peer.status === 'disabled' ? 'Включить' : 'Отключить'}
                        className={peer.status === 'disabled' ? 'text-green-500 hover:text-green-400' : 'text-yellow-500 hover:text-yellow-400'}
                        onClick={async () => {
                          const publicKey = peer.publicKey || peer.public_key;
                          const enabling = peer.status === 'disabled';
                          try {
                            await api.togglePeer(selectedServerId!, publicKey, enabling);
                            toast.success(enabling ? 'Пир включен' : 'Пир заблокирован');
                            // Мгновенно обновляем статус локально (кэш догонит через ~30 сек)
                            setServerPeers(prev => prev.map(p =>
                              (p.publicKey || p.public_key) === publicKey
                                ? { ...p, status: enabling ? 'stopped' : 'disabled' }
                                : p
                            ));
                          } catch (e: any) {
                            toast.error(e?.message || 'Ошибка переключения пира');
                          }
                        }}
                      >
                        <Power className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-500 hover:text-red-400"
                        onClick={() => {
                          setDeletingPeer(peer);
                          setIsDeletePeerDialogOpen(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Peer Dialog */}
        <Dialog open={isAddPeerDialogOpen} onOpenChange={setIsAddPeerDialogOpen}>
          <DialogContent className="bg-background border-border max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-mono text-xl">Добавить клиентов</DialogTitle>
              <DialogDescription className="font-mono text-sm">
                Конфигурация: {activeConfig}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Bulk Add Toggle */}
              <div className="flex items-center justify-between p-4 bg-card rounded-lg border border-border">
                <div>
                  <Label className="font-mono font-bold">Массовое добавление</Label>
                  <p className="text-xs text-muted-foreground font-mono mt-1">
                    При массовом добавлении, имя каждого клиента будет сгенерировано автоматически, а разрешенный IP-адрес будет присвоен по порядку следования
                  </p>
                </div>
                <input type="checkbox" className="w-10 h-6" disabled />
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="peer-name" className="font-mono text-sm">Имя</Label>
                <Input
                  id="peer-name"
                  value={newPeerData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="my-device"
                  className="font-mono bg-card border-border"
                />
                <p className="text-xs text-muted-foreground font-mono">
                  Ключи будут сгенерированы автоматически сервером
                </p>
              </div>

              {/* Allowed IPs */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="peer-ips" className="font-mono text-sm">
                    Внутренний IP-адрес <span className="text-muted-foreground">(Обязательный)</span>
                  </Label>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4" checked readOnly />
                    <span className="text-xs font-mono text-primary">Allowed IPs Validation</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Input
                    id="peer-ips"
                    value={newPeerData.allowed_ips}
                    onChange={(e) => setNewPeerData({...newPeerData, allowed_ips: e.target.value})}
                    placeholder="Введите IP-адрес/CIDR"
                    className="font-mono bg-card border-border flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="font-mono"
                    disabled
                  >
                    + или
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="font-mono"
                    onClick={() => {
                      const availableIP = findAvailableIP();
                      setNewPeerData({...newPeerData, allowed_ips: availableIP});
                      toast.success(`Выбран IP: ${availableIP}`);
                    }}
                  >
                    📋 Выберите доступный IP-адрес
                  </Button>
                </div>
                {newPeerData.allowed_ips && (
                  <div className="flex items-center gap-2 p-2 bg-green-500/10 border border-green-500/20 rounded">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-xs font-mono text-green-500">{newPeerData.allowed_ips}</span>
                  </div>
                )}
              </div>

              {/* Advanced Options */}
              <details className="bg-card rounded-lg border border-border">
                <summary className="p-4 cursor-pointer font-mono font-bold flex items-center justify-between">
                  Advanced Options
                  <span className="text-muted-foreground">▼</span>
                </summary>
                <div className="p-4 pt-0 space-y-4 text-xs text-muted-foreground font-mono">
                  <p>Дополнительные настройки (Endpoint, DNS, MTU, Keep Alive, Preshared Key) будут доступны в следующей версии</p>
                </div>
              </details>
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddPeerDialogOpen(false);
                  setNewPeerData({ name: '', public_key: '', allowed_ips: '', private_key: '' });
                }}
                className="font-mono"
              >
                Отмена
              </Button>
              <Button
                onClick={handleAddPeer}
                disabled={isSaving || !newPeerData.name}
                className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white font-mono"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Добавление...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Диалоги пиров - всегда рендерятся */}
      {renderPeerDialogs()}
      </>
    );
  }

  // Список серверов
  return (
    <>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-mono">Серверы</h2>
          <p className="text-muted-foreground font-mono text-sm mt-1">
            Всего: {servers.length} серверов
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-md border border-border bg-card p-1">
            <button
              type="button"
              onClick={() => changeViewMode('grid')}
              className={`flex h-8 w-8 items-center justify-center rounded transition-colors ${
                viewMode === 'grid' ? 'bg-primary text-black' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
              title="Плитки"
              aria-label="Показать сервера плитками"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => changeViewMode('table')}
              className={`flex h-8 w-8 items-center justify-center rounded transition-colors ${
                viewMode === 'table' ? 'bg-primary text-black' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
              title="Таблица"
              aria-label="Показать сервера таблицей"
            >
              <Table2 className="h-4 w-4" />
            </button>
          </div>
          <Button
            onClick={() => handleOpenDialog()}
            className="bg-primary hover:bg-primary/90 text-black font-mono"
          >
            <Plus className="w-4 h-4 mr-2" />
            Добавить сервер
          </Button>
        </div>
      </div>

      {/* Servers Grid */}
      {servers.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-lg border border-border p-12 text-center"
        >
          <Server className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-bold font-mono mb-2">Нет серверов</h3>
          <p className="text-muted-foreground font-mono text-sm mb-6">
            Добавьте первый сервер для начала работы
          </p>
          <Button 
            onClick={() => handleOpenDialog()}
            className="bg-primary hover:bg-primary/90 text-black font-mono"
          >
            <Plus className="w-4 h-4 mr-2" />
            Добавить сервер
          </Button>
        </motion.div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servers.map((server, index) => (
            <motion.div
              key={server.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-lg border border-border p-6 hover:border-primary/50 transition-colors"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Server className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold font-mono">{server.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono mt-1">
                      {getCountryFlag(server.country)}
                      <span className="text-primary">{server.country}</span>
                      <MapPin className="w-3 h-3" />
                      {server.location}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`px-2 py-1 text-xs font-mono rounded ${getStatusColor(server.status)}`}>
                    {getStatusText(server.status)}
                  </span>
                  <span className={`px-2 py-1 text-xs font-mono rounded ${
                    server.usage_type === 'dedicated'
                      ? 'text-accent bg-accent/20'
                      : 'text-blue-400 bg-blue-500/20'
                  }`}>
                    {server.usage_type === 'dedicated'
                      ? `Выделенный${server.dedicated_user_id ? ` · ID ${server.dedicated_user_id}` : ''}`
                      : 'Общий'}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-mono">IP адрес:</span>
                  <span className="font-mono">{server.ip_address}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-mono">Протоколы:</span>
                  <span className="font-mono uppercase">{server.protocols?.join(', ') || 'N/A'}</span>
                </div>
                {server.wg_dashboard_url && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-mono">Панель:</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-mono ${
                      server.panel_type === '3wg-panel'
                        ? 'text-primary bg-primary/15'
                        : 'text-cyan-400 bg-cyan-500/15'
                    }`}>
                      {server.panel_type === '3wg-panel' ? '3WG Panel' : 'WGDashboard'} · подключен
                    </span>
                  </div>
                )}
              </div>

              {/* Peers Load Indicator */}
              <div className="space-y-2 mb-4 p-3 bg-card/30 rounded-lg border border-primary/10">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-mono flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    Пиры:
                  </span>
                  <span className={`font-mono font-bold ${
                    server.current_peers && server.max_users 
                      ? (server.current_peers / server.max_users * 100) > 80 
                        ? 'text-red-500' 
                        : (server.current_peers / server.max_users * 100) > 60
                          ? 'text-yellow-500'
                          : 'text-green-500'
                      : 'text-muted-foreground'
                  }`}>
                    {server.current_peers || 0} / {server.max_users}
                  </span>
                </div>
                <div className="h-2 bg-muted/50 rounded-full overflow-hidden relative">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      server.current_peers && server.max_users
                        ? (server.current_peers / server.max_users * 100) > 80
                          ? 'bg-gradient-to-r from-red-600 to-red-400'
                          : (server.current_peers / server.max_users * 100) > 60
                            ? 'bg-gradient-to-r from-yellow-600 to-yellow-400'
                            : 'bg-gradient-to-r from-green-600 to-green-400'
                        : 'bg-gradient-to-r from-gray-600 to-gray-400'
                    }`}
                    style={{ 
                      width: `${server.current_peers && server.max_users 
                        ? Math.min((server.current_peers / server.max_users * 100), 100) 
                        : 0}%` 
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                  </div>
                </div>
                {server.current_peers && server.max_users && (server.current_peers / server.max_users * 100) > 80 && (
                  <p className="text-xs text-red-500 font-mono flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    Сервер близок к лимиту!
                  </p>
                )}
              </div>

              {/* Resource Indicators */}
              <div className="space-y-3 mb-4 p-3 bg-card/30 rounded-lg border border-primary/10">
                {server.wg_dashboard_url && !server.systemStatus ? (
                  // Скелетон загрузки
                  <>
                    {['CPU', 'RAM', 'Disk'].map((label, idx) => (
                      <div key={label} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className={`flex items-center gap-1 ${
                            idx === 0 ? 'text-orange-500' : idx === 1 ? 'text-green-500' : 'text-cyan-500'
                          }`}>
                            <Activity className="w-3 h-3" />
                            {label}
                          </span>
                          <span className="text-muted-foreground">...</span>
                        </div>
                        <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden relative">
                          <div className="h-full w-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  // Реальные данные
                  <>
                    {/* CPU */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-orange-500 flex items-center gap-1">
                          <Activity className="w-3 h-3" />
                          CPU
                        </span>
                        <span className="text-orange-400 font-bold">
                          {server.systemStatus?.CPU?.cpu_percent?.toFixed(1) || 0}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden relative">
                        <div
                          className="h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full transition-all duration-500 relative"
                          style={{ width: `${server.systemStatus?.CPU?.cpu_percent || 0}%` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                        </div>
                      </div>
                    </div>

                    {/* Memory */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-green-500 flex items-center gap-1">
                          <Activity className="w-3 h-3" />
                          RAM
                        </span>
                        <span className="text-green-400 font-bold">
                          {server.systemStatus?.Memory?.VirtualMemory?.percent?.toFixed(1) || 0}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden relative">
                        <div
                          className="h-full bg-gradient-to-r from-green-600 to-green-400 rounded-full transition-all duration-500 relative"
                          style={{ width: `${server.systemStatus?.Memory?.VirtualMemory?.percent || 0}%` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                        </div>
                      </div>
                    </div>

                    {/* Disk */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-cyan-500 flex items-center gap-1">
                          <Activity className="w-3 h-3" />
                          Disk
                        </span>
                        <span className="text-cyan-400 font-bold">
                          {server.systemStatus?.Disks?.[0]?.percent?.toFixed(1) || 0}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden relative">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full transition-all duration-500 relative"
                          style={{ width: `${server.systemStatus?.Disks?.[0]?.percent || 0}%` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Interface Traffic (3wg-panel) */}
              {trafficMap[server.id] && (
                <div className="space-y-3 mb-4 p-3 bg-card/30 rounded-lg border border-primary/10">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Network className="w-3 h-3" />
                      Трафик за 30 дн.
                    </span>
                    <span className="text-primary font-bold">
                      {formatBytes(Object.values(trafficMap[server.id]).reduce((s, t) => s + (t.month_total || 0), 0))}
                    </span>
                  </div>
                  {Object.entries(trafficMap[server.id]).map(([protocol, t]) => {
                    const maxTotal = Math.max(...Object.values(trafficMap[server.id]).map(x => x.month_total || 0), 1);
                    return (
                      <div key={protocol} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className={protocol === 'amneziawg' ? 'text-primary' : 'text-accent'}>
                            {t.title || protocol} <span className="text-muted-foreground">({t.interface})</span>
                          </span>
                          <span className="text-muted-foreground">
                            {t.current ? <>↓{formatBytes(t.current.rx)} ↑{formatBytes(t.current.tx)}</> : formatBytes(t.month_total || 0)}
                          </span>
                        </div>
                        <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${protocol === 'amneziawg' ? 'bg-gradient-to-r from-primary/60 to-primary' : 'bg-gradient-to-r from-accent/60 to-accent'}`}
                            style={{ width: `${Math.max((t.month_total || 0) / maxTotal * 100, 2)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedServerId(server.id)}
                  className="flex-1 font-mono text-xs"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Подробнее
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenDialog(server)}
                  className="font-mono text-xs"
                >
                  <Edit className="w-3 h-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setDeletingServer(server);
                    setIsDeleteDialogOpen(true);
                  }}
                  className="text-red-500 hover:text-red-500 hover:bg-red-500/10 font-mono text-xs"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1180px] border-collapse">
              <thead className="border-b border-border bg-background/60">
                <tr className="text-left font-mono text-xs uppercase text-muted-foreground">
                  <th className="px-4 py-3">Сервер</th>
                  <th className="px-4 py-3">Статус</th>
                  <th className="px-4 py-3">IP / протоколы</th>
                  <th className="px-4 py-3">Панель</th>
                  <th className="px-4 py-3">Пиры</th>
                  <th className="px-4 py-3">Ресурсы</th>
                  <th className="px-4 py-3">Трафик 30 дней</th>
                  <th className="px-4 py-3 text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {servers.map((server, index) => {
                  const peersPercent = server.max_users
                    ? Math.min(((server.current_peers || 0) / server.max_users) * 100, 100)
                    : 0;
                  const cpu = server.systemStatus?.CPU?.cpu_percent;
                  const ram = server.systemStatus?.Memory?.VirtualMemory?.percent;
                  const disk = server.systemStatus?.Disks?.[0]?.percent;
                  const traffic = trafficMap[server.id]
                    ? Object.values(trafficMap[server.id]).reduce((sum, item) => sum + (item.month_total || 0), 0)
                    : null;

                  return (
                    <motion.tr
                      key={server.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.03 }}
                      className="transition-colors hover:bg-primary/[0.04]"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10">
                            <Server className="h-5 w-5 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <button
                              type="button"
                              onClick={() => setSelectedServerId(server.id)}
                              className="block max-w-[220px] truncate text-left font-mono text-sm font-bold hover:text-primary"
                              title={server.name}
                            >
                              {server.name}
                            </button>
                            <div className="mt-1 flex items-center gap-1 font-mono text-xs text-muted-foreground">
                              {getCountryFlag(server.country)}
                              <span>{server.country || '—'}</span>
                              <MapPin className="h-3 w-3" />
                              <span className="max-w-[110px] truncate">{server.location || '—'}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col items-start gap-1">
                          <span className={`rounded px-2 py-1 font-mono text-xs ${getStatusColor(server.status)}`}>
                            {getStatusText(server.status)}
                          </span>
                          <span className={`rounded px-2 py-0.5 font-mono text-[10px] ${
                            server.usage_type === 'dedicated'
                              ? 'bg-accent/20 text-accent'
                              : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {server.usage_type === 'dedicated' ? 'Выделенный' : 'Общий'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">
                        <div>{server.ip_address || '—'}</div>
                        <div className="mt-1 uppercase text-muted-foreground">
                          {server.protocols?.join(', ') || '—'}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {server.wg_dashboard_url ? (
                          <span className={`rounded px-2 py-1 font-mono text-xs ${
                            server.panel_type === '3wg-panel'
                              ? 'bg-primary/15 text-primary'
                              : 'bg-cyan-500/15 text-cyan-400'
                          }`}>
                            {server.panel_type === '3wg-panel' ? '3WG Panel' : 'WGDashboard'}
                          </span>
                        ) : (
                          <span className="font-mono text-xs text-muted-foreground">Не подключена</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="w-32">
                          <div className="mb-1 flex justify-between font-mono text-xs">
                            <span>{server.current_peers || 0} / {server.max_users || 0}</span>
                            <span className="text-muted-foreground">{peersPercent.toFixed(0)}%</span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-muted/50">
                            <div
                              className={`h-full rounded-full ${
                                peersPercent > 80 ? 'bg-red-500' : peersPercent > 60 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${peersPercent}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="grid min-w-32 grid-cols-3 gap-2 font-mono text-[11px]">
                          <span className="text-orange-400">CPU {typeof cpu === 'number' ? `${cpu.toFixed(1)}%` : '—'}</span>
                          <span className="text-green-400">RAM {typeof ram === 'number' ? `${ram.toFixed(1)}%` : '—'}</span>
                          <span className="text-cyan-400">SSD {typeof disk === 'number' ? `${disk.toFixed(1)}%` : '—'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">
                        {traffic === null ? '—' : formatBytes(traffic)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedServerId(server.id)}
                            className="flex h-8 w-8 items-center justify-center rounded border border-border text-muted-foreground hover:border-primary/50 hover:text-primary"
                            title="Подробнее"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenDialog(server)}
                            className="flex h-8 w-8 items-center justify-center rounded border border-border text-muted-foreground hover:border-primary/50 hover:text-primary"
                            title="Редактировать"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDeletingServer(server);
                              setIsDeleteDialogOpen(true);
                            }}
                            className="flex h-8 w-8 items-center justify-center rounded border border-red-500/30 text-red-400 hover:bg-red-500/10"
                            title="Удалить"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background border-border">
          <DialogHeader>
            <DialogTitle className="font-mono">
              {editingServer ? 'Редактировать сервер' : 'Добавить сервер'}
            </DialogTitle>
            <DialogDescription className="font-mono text-sm">
              {editingServer ? 'Обновите информацию о сервере' : 'Заполните данные нового сервера'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="font-mono text-sm font-bold text-primary">Основная информация</h3>
              
              <div className="space-y-2">
                <Label htmlFor="name" className="font-mono text-xs">Название сервера *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Amsterdam Server"
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground font-mono">
                  Отображаемое имя сервера в панели
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location" className="font-mono text-xs">Локация *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="Amsterdam"
                    className="font-mono"
                  />
                  <p className="text-xs text-muted-foreground font-mono">
                    Город или регион
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country" className="font-mono text-xs">Страна (код) *</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value.toUpperCase()})}
                    placeholder="NL"
                    maxLength={2}
                    className="font-mono uppercase"
                  />
                  <p className="text-xs text-muted-foreground font-mono">
                    Код страны (NL, RU, US)
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-mono text-xs">Протоколы *</Label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.protocols.includes('wireguard')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({...formData, protocols: [...formData.protocols, 'wireguard']});
                        } else {
                          setFormData({...formData, protocols: formData.protocols.filter(p => p !== 'wireguard')});
                        }
                      }}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-mono">WireGuard</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.protocols.includes('amneziawg')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({...formData, protocols: [...formData.protocols, 'amneziawg']});
                        } else {
                          setFormData({...formData, protocols: formData.protocols.filter(p => p !== 'amneziawg')});
                        }
                      }}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-mono">AmneziaWG</span>
                  </label>
                </div>
                <p className="text-xs text-muted-foreground font-mono">
                  Поддерживаемые протоколы VPN
                </p>
              </div>

              {/* Тип использования сервера */}
              <div className="space-y-2">
                <Label className="font-mono text-xs">Тип сервера *</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, usage_type: 'shared'})}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      formData.usage_type === 'shared'
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-card hover:border-primary/40'
                    }`}
                  >
                    <p className={`font-mono text-sm font-bold ${formData.usage_type === 'shared' ? 'text-primary' : ''}`}>
                      Общий
                    </p>
                    <p className="text-xs text-muted-foreground font-mono mt-1">
                      Клиентам выдаются отдельные пиры с этого сервера
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, usage_type: 'dedicated'})}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      formData.usage_type === 'dedicated'
                        ? 'border-accent bg-accent/10'
                        : 'border-border bg-card hover:border-accent/40'
                    }`}
                  >
                    <p className={`font-mono text-sm font-bold ${formData.usage_type === 'dedicated' ? 'text-accent' : ''}`}>
                      Выделенный
                    </p>
                    <p className="text-xs text-muted-foreground font-mono mt-1">
                      Сервер целиком выдаётся одному клиенту
                    </p>
                  </button>
                </div>
              </div>

              {formData.usage_type === 'dedicated' && (
                <div className="space-y-2">
                  <Label htmlFor="dedicated_user_id" className="font-mono text-xs">ID клиента (владельца)</Label>
                  <Input
                    id="dedicated_user_id"
                    type="number"
                    min="1"
                    value={formData.dedicated_user_id}
                    onChange={(e) => setFormData({...formData, dedicated_user_id: e.target.value})}
                    placeholder="Например: 42"
                    className="font-mono"
                  />
                  <p className="text-xs text-muted-foreground font-mono">
                    ID пользователя из вкладки «Пользователи». Можно оставить пустым и назначить позже
                  </p>
                </div>
              )}
            </div>

            {/* Panel Settings */}
            <div className="space-y-4 pt-4 border-t border-border">
              <h3 className="font-mono text-sm font-bold text-primary">Подключение к панели</h3>

              <div className="space-y-2">
                <Label className="font-mono text-xs">Тип панели *</Label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="panel_type"
                      checked={formData.panel_type === 'wgdashboard'}
                      onChange={() => setFormData({...formData, panel_type: 'wgdashboard'})}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-mono">WGDashboard</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="panel_type"
                      checked={formData.panel_type === '3wg-panel'}
                      onChange={() => setFormData({...formData, panel_type: '3wg-panel'})}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-mono">3WG Panel</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="wg_dashboard_url" className="font-mono text-xs">URL панели *</Label>
                <Input
                  id="wg_dashboard_url"
                  value={formData.wg_dashboard_url}
                  onChange={(e) => setFormData({...formData, wg_dashboard_url: e.target.value})}
                  placeholder={formData.panel_type === '3wg-panel' ? 'https://cz-prg-01.nodax.eu' : 'http://46.30.43.35:10086'}
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground font-mono">
                  Полный URL с протоколом и портом
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="wg_dashboard_key" className="font-mono text-xs">API ключ *</Label>
                <Input
                  id="wg_dashboard_key"
                  value={formData.wg_dashboard_key}
                  onChange={(e) => setFormData({...formData, wg_dashboard_key: e.target.value})}
                  placeholder={formData.panel_type === '3wg-panel' ? 'Ключ со страницы /apikeys панели' : 'DypsOounxjEnFk5TPuVdTlE7nGDs2dn5rPxKG3XGSTM'}
                  className="font-mono"
                  type="password"
                />
                <p className="text-xs text-muted-foreground font-mono">
                  {formData.panel_type === '3wg-panel'
                    ? 'Создайте ключ в панели: раздел «API-ключи»'
                    : 'API ключ из настроек WGDashboard'}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="max_users" className="font-mono text-xs">Максимум пиров *</Label>
                <Input
                  id="max_users"
                  type="number"
                  min="1"
                  max="10000"
                  value={formData.max_users}
                  onChange={(e) => setFormData({...formData, max_users: parseInt(e.target.value) || 100})}
                  placeholder="100"
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground font-mono">
                  Максимальное количество пиров (клиентов) на сервере
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="font-mono"
            >
              Отмена
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || !formData.name || !formData.location || !formData.country || formData.protocols.length === 0 || !formData.wg_dashboard_url || !formData.wg_dashboard_key || !formData.max_users || formData.max_users < 1}
              className="bg-primary hover:bg-primary/90 text-black font-mono"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Сохранение...
                </>
              ) : (
                editingServer ? 'Обновить' : 'Создать'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Dialog with Tabs */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background border-border">
          <DialogHeader>
            <DialogTitle className="font-mono">
              {viewingServer?.name}
            </DialogTitle>
            <DialogDescription className="font-mono text-xs">
              {viewingServer?.location}
            </DialogDescription>
          </DialogHeader>

          {viewingServer && (
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-card">
                <TabsTrigger value="info" className="font-mono text-xs">
                  Информация
                </TabsTrigger>
                <TabsTrigger value="peers" className="font-mono text-xs" disabled={!viewingServer.wg_dashboard_url}>
                  Пиры ({peers.length})
                </TabsTrigger>
              </TabsList>

              {/* Info Tab */}
              <TabsContent value="info" className="space-y-6 py-4">
                {/* Basic Info */}
                <div className="space-y-3">
                  <h3 className="font-mono text-sm font-bold text-primary">Основная информация</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground font-mono">Название:</span>
                      <p className="font-mono mt-1">{viewingServer.name}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground font-mono">Статус:</span>
                      <p className="font-mono mt-1">
                        <span className={`px-2 py-1 text-xs rounded ${getStatusColor(viewingServer.status)}`}>
                          {getStatusText(viewingServer.status)}
                        </span>
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground font-mono">Локация:</span>
                      <p className="font-mono mt-1">{viewingServer.location}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground font-mono">Страна:</span>
                      <p className="font-mono mt-1">{viewingServer.country}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground font-mono">IP адрес:</span>
                      <p className="font-mono mt-1">{viewingServer.ip_address}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground font-mono">Протоколы:</span>
                      <p className="font-mono mt-1 uppercase">{viewingServer.protocols?.join(', ') || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground font-mono">Макс. пользователей:</span>
                      <p className="font-mono mt-1">{viewingServer.max_users}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground font-mono">Загрузка:</span>
                      <p className="font-mono mt-1">{viewingServer.load}%</p>
                    </div>
                  </div>
                </div>

                {/* WGDashboard Info */}
                {viewingServer.wg_dashboard_url && (
                  <div className="space-y-3 pt-4 border-t border-border">
                    <h3 className="font-mono text-sm font-bold text-primary">WGDashboard</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground font-mono">URL:</span>
                        <p className="font-mono mt-1 text-xs break-all">{viewingServer.wg_dashboard_url}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground font-mono">Конфигурация:</span>
                        <p className="font-mono mt-1">{viewingServer.wg_config_name}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground font-mono">Порт панели:</span>
                        <p className="font-mono mt-1">{viewingServer.wg_dashboard_port}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground font-mono">Порт WireGuard:</span>
                        <p className="font-mono mt-1">{viewingServer.wg_listen_port}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleTestConnection(viewingServer)}
                      disabled={isTestingConnection}
                      variant="outline"
                      className="w-full font-mono text-xs mt-4"
                    >
                      {isTestingConnection ? (
                        <>
                          <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                          Тестирование...
                        </>
                      ) : (
                        <>
                          <Activity className="w-3 h-3 mr-2" />
                          Тест подключения
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {/* Timestamps */}
                <div className="space-y-3 pt-4 border-t border-border">
                  <h3 className="font-mono text-sm font-bold text-primary">Даты</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground font-mono">Создан:</span>
                      <p className="font-mono mt-1 text-xs">
                        {new Date(viewingServer.created_at).toLocaleString('ru-RU')}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground font-mono">Обновлен:</span>
                      <p className="font-mono mt-1 text-xs">
                        {new Date(viewingServer.updated_at).toLocaleString('ru-RU')}
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Peers Tab */}
              <TabsContent value="peers" className="space-y-4 py-4">
                {isLoadingPeers ? (
                  <div className="flex items-center justify-center h-48">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : peers.length === 0 ? (
                  <div className="text-center py-12">
                    <Network className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="font-mono text-sm text-muted-foreground">Пиров пока нет</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {peers.map((peer, index) => (
                      <motion.div
                        key={peer.publicKey || index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-card rounded-lg border border-border overflow-hidden"
                      >
                        {/* Peer Header */}
                        <div
                          className="p-4 cursor-pointer hover:bg-[#1a1a1a] transition-colors"
                          onClick={() => setExpandedPeer(expandedPeer === peer.publicKey ? null : peer.publicKey)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Network className="w-5 h-5 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="font-mono text-sm font-bold truncate">
                                    {peer.name || `Peer ${index + 1}`}
                                  </p>
                                  <Badge variant="outline" className="font-mono text-xs">
                                    {peer.allowed_ip?.[0] || 'N/A'}
                                  </Badge>
                                </div>
                                <p className="font-mono text-xs text-muted-foreground truncate mt-1">
                                  {peer.publicKey?.substring(0, 32)}...
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-xs font-mono">
                              <div className="text-right">
                                <div className="flex items-center gap-1 text-blue-500">
                                  <Download className="w-3 h-3" />
                                  <span>{formatBytes(peer.total_receive || 0)}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center gap-1 text-green-500">
                                  <Upload className="w-3 h-3" />
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
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-border"
                          >
                            <div className="p-4 space-y-4 bg-background">
                              {/* Public Key */}
                              <div>
                                <span className="text-muted-foreground font-mono text-xs">Публичный ключ:</span>
                                <p className="font-mono text-xs mt-1 break-all bg-card p-2 rounded">
                                  {peer.publicKey}
                                </p>
                              </div>

                              {/* Allowed IPs */}
                              <div>
                                <span className="text-muted-foreground font-mono text-xs">Разрешенные IP:</span>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {peer.allowed_ip?.map((ip: string, i: number) => (
                                    <Badge key={i} variant="secondary" className="font-mono text-xs">
                                      {ip}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              {/* Stats Grid */}
                              <div className="grid grid-cols-2 gap-4 text-xs">
                                <div>
                                  <span className="text-muted-foreground font-mono">Получено:</span>
                                  <p className="font-mono mt-1 text-blue-500">
                                    {formatBytes(peer.total_receive || 0)}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground font-mono">Отправлено:</span>
                                  <p className="font-mono mt-1 text-green-500">
                                    {formatBytes(peer.total_sent || 0)}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground font-mono">Всего:</span>
                                  <p className="font-mono mt-1 text-primary">
                                    {formatBytes((peer.total_receive || 0) + (peer.total_sent || 0))}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground font-mono">Последний handshake:</span>
                                  <p className="font-mono mt-1 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {formatDate(peer.latest_handshake)}
                                  </p>
                                </div>
                              </div>

                              {/* Endpoint */}
                              {peer.endpoint && (
                                <div>
                                  <span className="text-muted-foreground font-mono text-xs">Endpoint:</span>
                                  <p className="font-mono text-xs mt-1">{peer.endpoint}</p>
                                </div>
                              )}

                              {/* Preshared Key */}
                              {peer.preshared_key && (
                                <div>
                                  <span className="text-muted-foreground font-mono text-xs">Preshared Key:</span>
                                  <p className="font-mono text-xs mt-1 break-all bg-card p-2 rounded">
                                    {peer.preshared_key}
                                  </p>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDetailsDialogOpen(false)}
              className="font-mono"
            >
              Закрыть
            </Button>
            {viewingServer && (
              <Button
                onClick={() => {
                  setIsDetailsDialogOpen(false);
                  handleOpenDialog(viewingServer);
                }}
                className="bg-primary hover:bg-primary/90 text-black font-mono"
              >
                <Edit className="w-4 h-4 mr-2" />
                Редактировать
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-background border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-mono">Удалить сервер?</AlertDialogTitle>
            <AlertDialogDescription className="font-mono text-sm">
              Вы уверены, что хотите удалить сервер "{deletingServer?.name}"? 
              Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-mono">Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white font-mono"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Peer Dialog */}
      <AlertDialog open={isDeletePeerDialogOpen} onOpenChange={setIsDeletePeerDialogOpen}>
        <AlertDialogContent className="bg-background border-border z-[200]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-mono">Удалить пир?</AlertDialogTitle>
            <AlertDialogDescription className="font-mono text-sm">
              Вы уверены, что хотите удалить пир "{deletingPeer?.name || 'Без имени'}"? 
              Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-mono">Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePeer}
              className="bg-red-500 hover:bg-red-600 text-white font-mono"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Peer Details Dialog */}
      <Dialog open={isPeerDetailsDialogOpen} onOpenChange={setIsPeerDetailsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background border-border z-[200]">
          <DialogHeader>
            <DialogTitle className="font-mono text-xl">
              {viewingPeer?.name || 'Пир без имени'}
            </DialogTitle>
            <DialogDescription className="font-mono text-sm">
              Подробная информация о пире
            </DialogDescription>
          </DialogHeader>

          {viewingPeer && (
            <div className="space-y-6 py-4">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-mono text-sm font-bold text-primary">Основная информация</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground font-mono">Имя:</span>
                      <p className="font-mono mt-1">{viewingPeer.name || 'Не указано'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground font-mono">Статус:</span>
                      <p className="font-mono mt-1">
                        <span className={`px-2 py-1 rounded text-xs ${
                          viewingPeer.status === 'running' 
                            ? 'bg-green-500/20 text-green-500' 
                            : 'bg-gray-500/20 text-gray-500'
                        }`}>
                          {viewingPeer.status === 'running' ? 'Онлайн' : 'Офлайн'}
                        </span>
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground font-mono">Public Key:</span>
                      <code className="block mt-1 text-xs bg-background px-2 py-1 rounded break-all">
                        {viewingPeer.publicKey || viewingPeer.public_key || 'N/A'}
                      </code>
                    </div>
                    <div>
                      <span className="text-muted-foreground font-mono">Allowed IPs:</span>
                      <code className="block mt-1 text-xs bg-background px-2 py-1 rounded">
                        {viewingPeer.allowed_ip?.join(', ') || 'N/A'}
                      </code>
                    </div>
                    {viewingPeer.endpoint && viewingPeer.endpoint !== '0.0.0.0/0' && (
                      <div>
                        <span className="text-muted-foreground font-mono">Endpoint:</span>
                        <code className="block mt-1 text-xs bg-background px-2 py-1 rounded">
                          {viewingPeer.endpoint}
                        </code>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-mono text-sm font-bold text-primary">Статистика трафика</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-card rounded-lg border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground font-mono">Получено</span>
                        <Download className="w-5 h-5 text-blue-500" />
                      </div>
                      <div className="text-2xl font-bold font-mono text-blue-500">
                        {(viewingPeer.total_receive || 0).toFixed(4)} GB
                      </div>
                    </div>

                    <div className="p-4 bg-card rounded-lg border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground font-mono">Отправлено</span>
                        <Upload className="w-5 h-5 text-green-500" />
                      </div>
                      <div className="text-2xl font-bold font-mono text-green-500">
                        {(viewingPeer.total_sent || 0).toFixed(4)} GB
                      </div>
                    </div>

                    <div className="p-4 bg-card rounded-lg border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground font-mono">Всего</span>
                        <Activity className="w-5 h-5 text-primary" />
                      </div>
                      <div className="text-2xl font-bold font-mono text-primary">
                        {(viewingPeer.total_data || 0).toFixed(4)} GB
                      </div>
                    </div>

                    <div className="p-4 bg-card rounded-lg border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground font-mono">Последний handshake</span>
                        <Clock className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="text-sm font-mono">
                        {viewingPeer.latest_handshake === 'No Handshake' 
                          ? 'Никогда' 
                          : viewingPeer.latest_handshake + ' ago'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* График трафика */}
              <div className="space-y-2">
                <h3 className="font-mono text-sm font-bold text-primary">График трафика (последние 7 дней)</h3>
                <div className="p-4 bg-card rounded-lg border border-border">
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart
                      data={[
                        { day: '7д назад', download: (viewingPeer.total_receive || 0) * 0.1, upload: (viewingPeer.total_sent || 0) * 0.1 },
                        { day: '6д назад', download: (viewingPeer.total_receive || 0) * 0.2, upload: (viewingPeer.total_sent || 0) * 0.2 },
                        { day: '5д назад', download: (viewingPeer.total_receive || 0) * 0.35, upload: (viewingPeer.total_sent || 0) * 0.3 },
                        { day: '4д назад', download: (viewingPeer.total_receive || 0) * 0.5, upload: (viewingPeer.total_sent || 0) * 0.45 },
                        { day: '3д назад', download: (viewingPeer.total_receive || 0) * 0.65, upload: (viewingPeer.total_sent || 0) * 0.6 },
                        { day: '2д назад', download: (viewingPeer.total_receive || 0) * 0.8, upload: (viewingPeer.total_sent || 0) * 0.75 },
                        { day: 'Вчера', download: (viewingPeer.total_receive || 0) * 0.9, upload: (viewingPeer.total_sent || 0) * 0.85 },
                        { day: 'Сегодня', download: viewingPeer.total_receive || 0, upload: viewingPeer.total_sent || 0 },
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="day" stroke="#888" style={{ fontSize: '12px', fontFamily: 'JetBrains Mono' }} />
                      <YAxis stroke="#888" style={{ fontSize: '12px', fontFamily: 'JetBrains Mono' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#111', 
                          border: '1px solid #333', 
                          borderRadius: '8px',
                          fontFamily: 'JetBrains Mono',
                          fontSize: '12px'
                        }}
                        formatter={(value: number) => `${value.toFixed(4)} GB`}
                      />
                      <Legend 
                        wrapperStyle={{ 
                          fontFamily: 'JetBrains Mono',
                          fontSize: '12px'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="download" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        name="Получено"
                        dot={{ fill: '#3b82f6', r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="upload" 
                        stroke="#22c55e" 
                        strokeWidth={2}
                        name="Отправлено"
                        dot={{ fill: '#22c55e', r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  <p className="text-xs text-muted-foreground font-mono text-center mt-2">
                    * Демо данные. Для реальной истории нужно хранить метрики в БД
                  </p>
                </div>
              </div>

              {/* Карта геолокации */}
              <div className="space-y-2">
                <h3 className="font-mono text-sm font-bold text-primary">Геолокация подключения</h3>
                <div className="p-4 bg-card rounded-lg border border-border">
                  {viewingPeer.endpoint && viewingPeer.endpoint !== '0.0.0.0/0' ? (
                    <div className="space-y-4">
                      <div className="h-[300px] rounded-lg overflow-hidden border border-border">
                        <MapContainer
                          center={[55.7558, 37.6173]} // Москва по умолчанию
                          zoom={5}
                          style={{ height: '100%', width: '100%' }}
                        >
                          <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          />
                          <Marker position={[55.7558, 37.6173]}>
                            <Popup>
                              <div className="font-mono text-xs">
                                <p className="font-bold">{viewingPeer.name || 'Пир'}</p>
                                <p className="text-muted-foreground">{viewingPeer.endpoint}</p>
                                <p className="text-muted-foreground mt-1">Москва, Россия</p>
                              </div>
                            </Popup>
                          </Marker>
                        </MapContainer>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground font-mono">IP адрес:</span>
                          <p className="font-mono mt-1">{viewingPeer.endpoint.split(':')[0]}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground font-mono">Порт:</span>
                          <p className="font-mono mt-1">{viewingPeer.endpoint.split(':')[1] || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground font-mono">Страна:</span>
                          <p className="font-mono mt-1">🇷🇺 Россия</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground font-mono">Город:</span>
                          <p className="font-mono mt-1">Москва</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground font-mono text-center">
                        * Демо данные. Для реальной геолокации нужно интегрировать API (ip-api.com)
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground font-mono">
                        Endpoint не указан или пир еще не подключался
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPeerDetailsDialogOpen(false)}
              className="font-mono"
            >
              Закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>

      {/* Диалоги пиров - вынесены наружу для правильного z-index */}
      {/* Delete Peer Dialog */}
      <AlertDialog open={isDeletePeerDialogOpen} onOpenChange={setIsDeletePeerDialogOpen}>
        <AlertDialogPortal>
          <AlertDialogOverlay style={{ zIndex: 9998 }} />
          <AlertDialogContent className="bg-background border-border" style={{ zIndex: 9999 }}>
            <AlertDialogHeader>
              <AlertDialogTitle className="font-mono">Удалить пир?</AlertDialogTitle>
              <AlertDialogDescription className="font-mono text-sm">
                Вы уверены, что хотите удалить пир "{deletingPeer?.name || 'Без имени'}"? 
                Это действие нельзя отменить.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="font-mono">Отмена</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeletePeer}
                className="bg-red-500 hover:bg-red-600 text-white font-mono"
              >
                Удалить
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogPortal>
      </AlertDialog>

      {/* Peer Details Dialog */}
      <Dialog open={isPeerDetailsDialogOpen} onOpenChange={setIsPeerDetailsDialogOpen}>
        <DialogPortal>
          <DialogOverlay style={{ zIndex: 9998 }} />
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background border-border" style={{ zIndex: 9999 }}>
          <DialogHeader>
            <DialogTitle className="font-mono text-xl">
              {viewingPeer?.name || 'Пир без имени'}
            </DialogTitle>
            <DialogDescription className="font-mono text-sm">
              Подробная информация о пире
            </DialogDescription>
          </DialogHeader>

          {viewingPeer && (
            <div className="space-y-6 py-4">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-mono text-sm font-bold text-primary">Основная информация</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground font-mono">Имя:</span>
                      <p className="font-mono mt-1">{viewingPeer.name || 'Не указано'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground font-mono">Статус:</span>
                      <p className="font-mono mt-1">
                        <span className={`px-2 py-1 rounded text-xs ${
                          viewingPeer.status === 'running' 
                            ? 'bg-green-500/20 text-green-500' 
                            : 'bg-gray-500/20 text-gray-500'
                        }`}>
                          {viewingPeer.status === 'running' ? 'Онлайн' : 'Офлайн'}
                        </span>
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground font-mono">Public Key:</span>
                      <code className="block mt-1 text-xs bg-background px-2 py-1 rounded break-all">
                        {viewingPeer.publicKey || viewingPeer.public_key || 'N/A'}
                      </code>
                    </div>
                    <div>
                      <span className="text-muted-foreground font-mono">Allowed IPs:</span>
                      <code className="block mt-1 text-xs bg-background px-2 py-1 rounded">
                        {viewingPeer.allowed_ip?.join(', ') || 'N/A'}
                      </code>
                    </div>
                    {viewingPeer.endpoint && viewingPeer.endpoint !== '0.0.0.0/0' && (
                      <div>
                        <span className="text-muted-foreground font-mono">Endpoint:</span>
                        <code className="block mt-1 text-xs bg-background px-2 py-1 rounded">
                          {viewingPeer.endpoint}
                        </code>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-mono text-sm font-bold text-primary">Статистика трафика</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-card rounded-lg border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground font-mono">Получено</span>
                        <Download className="w-5 h-5 text-blue-500" />
                      </div>
                      <div className="text-2xl font-bold font-mono text-blue-500">
                        {(viewingPeer.total_receive || 0).toFixed(4)} GB
                      </div>
                    </div>

                    <div className="p-4 bg-card rounded-lg border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground font-mono">Отправлено</span>
                        <Upload className="w-5 h-5 text-green-500" />
                      </div>
                      <div className="text-2xl font-bold font-mono text-green-500">
                        {(viewingPeer.total_sent || 0).toFixed(4)} GB
                      </div>
                    </div>

                    <div className="p-4 bg-card rounded-lg border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground font-mono">Всего</span>
                        <Activity className="w-5 h-5 text-primary" />
                      </div>
                      <div className="text-2xl font-bold font-mono text-primary">
                        {(viewingPeer.total_data || 0).toFixed(4)} GB
                      </div>
                    </div>

                    <div className="p-4 bg-card rounded-lg border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground font-mono">Последний handshake</span>
                        <Clock className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="text-sm font-mono">
                        {viewingPeer.latest_handshake === 'No Handshake' 
                          ? 'Никогда' 
                          : viewingPeer.latest_handshake + ' ago'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* График трафика */}
              <div className="space-y-2">
                <h3 className="font-mono text-sm font-bold text-primary">График трафика (последние 7 дней)</h3>
                <div className="p-4 bg-card rounded-lg border border-border">
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart
                      data={[
                        { day: '7д назад', download: (viewingPeer.total_receive || 0) * 0.1, upload: (viewingPeer.total_sent || 0) * 0.1 },
                        { day: '6д назад', download: (viewingPeer.total_receive || 0) * 0.2, upload: (viewingPeer.total_sent || 0) * 0.2 },
                        { day: '5д назад', download: (viewingPeer.total_receive || 0) * 0.35, upload: (viewingPeer.total_sent || 0) * 0.3 },
                        { day: '4д назад', download: (viewingPeer.total_receive || 0) * 0.5, upload: (viewingPeer.total_sent || 0) * 0.45 },
                        { day: '3д назад', download: (viewingPeer.total_receive || 0) * 0.65, upload: (viewingPeer.total_sent || 0) * 0.6 },
                        { day: '2д назад', download: (viewingPeer.total_receive || 0) * 0.8, upload: (viewingPeer.total_sent || 0) * 0.75 },
                        { day: 'Вчера', download: (viewingPeer.total_receive || 0) * 0.9, upload: (viewingPeer.total_sent || 0) * 0.85 },
                        { day: 'Сегодня', download: viewingPeer.total_receive || 0, upload: viewingPeer.total_sent || 0 },
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="day" stroke="#888" style={{ fontSize: '12px', fontFamily: 'JetBrains Mono' }} />
                      <YAxis stroke="#888" style={{ fontSize: '12px', fontFamily: 'JetBrains Mono' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#111', 
                          border: '1px solid #333', 
                          borderRadius: '8px',
                          fontFamily: 'JetBrains Mono',
                          fontSize: '12px'
                        }}
                        formatter={(value: number) => `${value.toFixed(4)} GB`}
                      />
                      <Legend 
                        wrapperStyle={{ 
                          fontFamily: 'JetBrains Mono',
                          fontSize: '12px'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="download" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        name="Получено"
                        dot={{ fill: '#3b82f6', r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="upload" 
                        stroke="#22c55e" 
                        strokeWidth={2}
                        name="Отправлено"
                        dot={{ fill: '#22c55e', r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  <p className="text-xs text-muted-foreground font-mono text-center mt-2">
                    * Демо данные. Для реальной истории нужно хранить метрики в БД
                  </p>
                </div>
              </div>

              {/* Карта геолокации */}
              <div className="space-y-2">
                <h3 className="font-mono text-sm font-bold text-primary">Геолокация подключения</h3>
                <div className="p-4 bg-card rounded-lg border border-border">
                  {viewingPeer.endpoint && viewingPeer.endpoint !== '0.0.0.0/0' ? (
                    <div className="space-y-4">
                      <div className="h-[300px] rounded-lg overflow-hidden border border-border">
                        <MapContainer
                          center={[55.7558, 37.6173]} // Москва по умолчанию
                          zoom={5}
                          style={{ height: '100%', width: '100%' }}
                        >
                          <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          />
                          <Marker position={[55.7558, 37.6173]}>
                            <Popup>
                              <div className="font-mono text-xs">
                                <p className="font-bold">{viewingPeer.name || 'Пир'}</p>
                                <p className="text-muted-foreground">{viewingPeer.endpoint}</p>
                                <p className="text-muted-foreground mt-1">Москва, Россия</p>
                              </div>
                            </Popup>
                          </Marker>
                        </MapContainer>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground font-mono">IP адрес:</span>
                          <p className="font-mono mt-1">{viewingPeer.endpoint.split(':')[0]}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground font-mono">Порт:</span>
                          <p className="font-mono mt-1">{viewingPeer.endpoint.split(':')[1] || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground font-mono">Страна:</span>
                          <p className="font-mono mt-1">🇷🇺 Россия</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground font-mono">Город:</span>
                          <p className="font-mono mt-1">Москва</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground font-mono text-center">
                        * Демо данные. Для реальной геолокации нужно интегрировать API (ip-api.com)
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground font-mono">
                        Endpoint не указан или пир еще не подключался
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPeerDetailsDialogOpen(false)}
              className="font-mono"
            >
              Закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  );
}
