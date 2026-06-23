import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Copy, 
  Download, 
  QrCode, 
  Trash2, 
  RefreshCw,
  Shield,
  Check,
  Loader2,
  Activity,
  Clock,
  Server,
  Key,
  Lock,
  Globe,
  TrendingUp
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { api, VPNKey } from '@/lib/api';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';

const KeyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [key, setKey] = useState<VPNKey | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [qrConfig, setQrConfig] = useState<string>('');
  const [qrAmneziaJSON, setQrAmneziaJSON] = useState<string>('');

  useEffect(() => {
    loadKeyDetails();
  }, [id]);

  const loadKeyDetails = async () => {
    try {
      setIsLoading(true);
      const response = await api.getKeys();
      const foundKey = response.find((k: VPNKey) => k.id === Number(id));
      if (foundKey) {
        setKey(foundKey);
      } else {
        toast.error('Ключ не найден');
        navigate('/keys');
      }
    } catch (error) {
      console.error('Failed to load key details:', error);
      toast.error('Ошибка загрузки данных');
      navigate('/keys');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyConfig = async () => {
    if (!key) return;
    try {
      const config = await api.downloadKeyConfig(key.id);
      await navigator.clipboard.writeText(config);
      setCopiedId('config');
      toast.success('Конфигурация скопирована!');
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy config:', error);
      toast.error('Ошибка копирования конфигурации');
    }
  };

  const handleCopyPublicKey = async () => {
    if (!key) return;
    try {
      await navigator.clipboard.writeText(key.public_key);
      setCopiedId('public');
      toast.success('Публичный ключ скопирован!');
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy public key:', error);
      toast.error('Ошибка копирования');
    }
  };

  const handleDownloadConfig = async () => {
    if (!key) return;
    try {
      const config = await api.downloadKeyConfig(key.id);
      const blob = new Blob([config], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${key.name.toLowerCase()}_${key.protocol.toLowerCase()}.conf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Конфигурация загружена!');
    } catch (error) {
      console.error('Failed to download config:', error);
      toast.error('Ошибка загрузки конфигурации');
    }
  };

  const handleRegenerateKey = () => {
    toast.info('Функция в разработке');
  };

  const handleShowQR = async () => {
    if (!key) return;
    try {
      const config = await api.downloadKeyConfig(key.id);
      setQrConfig(config);
      
      // Если это AmneziaWG, загружаем также JSON конфиг
      if (key.protocol.toLowerCase().includes('amnezia')) {
        try {
          const amneziaJSON = await api.downloadAmneziaJSON(key.id);
          setQrAmneziaJSON(amneziaJSON);
        } catch (error) {
          console.log('AmneziaVPN JSON not available:', error);
          setQrAmneziaJSON('');
        }
      }
      
      setShowQR(true);
    } catch (error) {
      console.error('Failed to load config for QR:', error);
      toast.error('Ошибка загрузки конфигурации');
    }
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = 300;
    canvas.height = 300;

    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 10, 10, 280, 280);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${key?.name || `key_${key?.id}`}_qr.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            toast.success('QR-код сохранен!');
          }
        });
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handleDeleteKey = async () => {
    if (!key) return;
    try {
      setIsDeleting(true);
      await api.deleteUserKey(key.id);
      toast.success('Ключ удален!');
      navigate('/keys');
    } catch (error) {
      console.error('Failed to delete key:', error);
      toast.error('Ошибка удаления ключа');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatLastUsed = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'только что';
    if (minutes < 60) return `${minutes} мин назад`;
    if (hours < 24) return `${hours} ч назад`;
    return `${days} дн назад`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground font-mono flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[#CCFF00] animate-spin mx-auto mb-4" />
          <div className="text-sm text-gray-400">Загрузка данных...</div>
        </div>
      </div>
    );
  }

  if (!key) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-primary/20">
        <div className="container mx-auto px-4 py-4">
          <Button
            onClick={() => navigate('/keys')}
            variant="ghost"
            size="sm"
            className="text-primary hover:bg-primary/10 font-mono mb-3"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            [ НАЗАД ]
          </Button>
          
          <div className="flex items-start gap-3 mb-2">
            <Shield className="w-6 h-6 text-[#CCFF00] flex-shrink-0 mt-1" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold tracking-wider text-[#CCFF00] break-all">
                  {key.name || `KEY_${key.id}`}
                </h1>
                <div
                  className={`px-2 py-0.5 rounded text-xs font-bold whitespace-nowrap flex-shrink-0 ${
                    key.protocol.toLowerCase().includes('amnezia')
                      ? 'bg-primary/20 text-primary border border-primary/40'
                      : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                  }`}
                >
                  {key.protocol.toUpperCase()}
                </div>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-400">
            Подробная информация о ключе доступа
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-2xl pb-32">
        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-primary/30 rounded-lg bg-card/30 p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <motion.div
                className={`w-4 h-4 rounded-full ${
                  key.status === 'active' ? 'bg-primary' : 'bg-muted-foreground'
                }`}
                animate={key.status === 'active' ? {
                  boxShadow: [
                    '0 0 4px rgba(204, 255, 0, 0.4)',
                    '0 0 12px rgba(204, 255, 0, 0.8)',
                    '0 0 4px rgba(204, 255, 0, 0.4)',
                  ],
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className={`font-bold text-lg ${
                key.status === 'active' ? 'text-[#CCFF00]' : 'text-gray-500'
              }`}>
                {key.status.toUpperCase()}
              </span>
            </div>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-500 mb-1">Последняя активность</div>
              <div className="text-white font-bold">{formatLastUsed(key.updated_at)}</div>
            </div>
            <div>
              <div className="text-gray-500 mb-1">IP адрес</div>
              <div className="text-white font-bold font-mono">{key.ip_address}</div>
            </div>
          </div>
        </motion.div>

        {/* Info Cards */}
        <div className="space-y-4 mb-6">
          {/* Server Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="border border-border rounded-lg bg-card/30 p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <Server className="w-4 h-4 text-[#CCFF00]" />
              <h3 className="text-sm font-bold text-gray-400 tracking-wider">ИНФОРМАЦИЯ О СЕРВЕРЕ</h3>
            </div>
            <div className="space-y-2 text-sm">
              {key.server && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Название:</span>
                    <span className="text-white font-bold">{key.server.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Локация:</span>
                    <span className="text-white">{key.server.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">IP адрес:</span>
                    <span className="text-white font-mono">{key.server.ip_address}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Server ID:</span>
                <span className="text-white font-mono">#{key.server_id}</span>
              </div>
            </div>
          </motion.div>

          {/* Key Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="border border-border rounded-lg bg-card/30 p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <Key className="w-4 h-4 text-[#CCFF00]" />
              <h3 className="text-sm font-bold text-gray-400 tracking-wider">ПУБЛИЧНЫЙ КЛЮЧ</h3>
            </div>
            <div className="bg-background/40 rounded p-3 mb-2">
              <code className="text-xs text-gray-300 break-all font-mono">
                {key.public_key}
              </code>
            </div>
            <Button
              onClick={handleCopyPublicKey}
              variant="outline"
              size="sm"
              className="w-full border-border bg-card/50 hover:border-primary hover:bg-primary/10 text-foreground font-mono text-xs"
            >
              {copiedId === 'public' ? (
                <>
                  <Check className="w-3 h-3 mr-2" />
                  СКОПИРОВАНО
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 mr-2" />
                  КОПИРОВАТЬ КЛЮЧ
                </>
              )}
            </Button>
          </motion.div>

          {/* Timestamps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="border border-border rounded-lg bg-card/30 p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-[#CCFF00]" />
              <h3 className="text-sm font-bold text-gray-400 tracking-wider">ВРЕМЕННЫЕ МЕТКИ</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Создан:</span>
                <span className="text-white font-mono">{formatDate(key.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Обновлен:</span>
                <span className="text-white font-mono">{formatDate(key.updated_at)}</span>
              </div>
              {key.expires_at && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Истекает:</span>
                  <span className="text-white font-mono">{formatDate(key.expires_at)}</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3 mb-6"
        >
          <div className="grid grid-cols-3 gap-3">
            <Button
              onClick={handleCopyConfig}
              variant="outline"
              className="border-border bg-card/50 hover:border-primary hover:bg-primary/10 text-foreground font-mono text-xs"
            >
              {copiedId === 'config' ? (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  OK
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1" />
                  COPY
                </>
              )}
            </Button>

            <Button
              onClick={handleShowQR}
              variant="outline"
              className="border-border bg-card/50 hover:border-primary hover:bg-primary/10 text-foreground font-mono text-xs"
            >
              <QrCode className="w-4 h-4 mr-1" />
              QR
            </Button>

            <Button
              onClick={handleDownloadConfig}
              variant="outline"
              className="border-border bg-card/50 hover:border-primary hover:bg-primary/10 text-foreground font-mono text-xs"
            >
              <Download className="w-4 h-4 mr-1" />
              .CONF
            </Button>
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="border-2 border-red-900/30 rounded-lg bg-red-900/10 p-4"
        >
          <h3 className="text-sm font-bold text-red-400 tracking-wider mb-3">ОПАСНАЯ ЗОНА</h3>
          <div className="space-y-2">
            <Button
              onClick={handleRegenerateKey}
              variant="outline"
              className="w-full border-yellow-600/40 bg-yellow-900/20 hover:bg-yellow-900/40 text-yellow-400 font-mono text-sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              ПЕРЕГЕНЕРИРОВАТЬ КЛЮЧ
            </Button>

            <Button
              onClick={handleDeleteKey}
              disabled={isDeleting}
              variant="outline"
              className="w-full border-red-600/40 bg-red-900/20 hover:bg-red-900/40 text-red-400 font-mono text-sm disabled:opacity-50"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              УДАЛИТЬ КЛЮЧ
            </Button>
          </div>
        </motion.div>
      </div>

      {/* QR Code Modal */}
      {showQR && qrConfig && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm p-4"
          onClick={() => setShowQR(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-card border-2 border-primary rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#CCFF00] tracking-wider">
                  QR_CODES
                </h3>
                <button
                  onClick={() => setShowQR(false)}
                  className="text-gray-400 hover:text-white text-2xl leading-none"
                >
                  ✕
                </button>
              </div>

              {/* WireGuard/AmneziaWG Config QR */}
              <div className="mb-6">
                <p className="text-sm text-gray-400 text-center mb-3">
                  {key?.protocol.toLowerCase().includes('amnezia') 
                    ? 'Scan with AmneziaWG App' 
                    : 'Scan with WireGuard App'}
                </p>
                <div className="relative w-full bg-white rounded-lg p-6 mb-3 flex items-center justify-center">
                  <QRCodeSVG
                    id="qr-code-svg"
                    value={qrConfig}
                    size={280}
                    level="M"
                    includeMargin={false}
                    className="w-full h-auto"
                  />
                </div>
                <p className="text-xs text-[#CCFF00] text-center font-mono mb-3">
                  {key?.name || `KEY_${key?.id}`}
                </p>
                <Button
                  onClick={handleDownloadQR}
                  variant="outline"
                  size="sm"
                  className="w-full border-primary/40 bg-primary/10 hover:bg-primary/20 text-primary font-mono text-xs"
                >
                  <Download className="w-3 h-3 mr-2" />
                  СОХРАНИТЬ QR-КОД
                </Button>
              </div>

              {/* AmneziaVPN JSON QR (только для AmneziaWG) */}
              {qrAmneziaJSON && key?.protocol.toLowerCase().includes('amnezia') && (
                <div className="border-t border-gray-700 pt-6">
                  <p className="text-sm text-gray-400 text-center mb-3">
                    Scan with AmneziaVPN App
                  </p>
                  <div className="relative w-full bg-white rounded-lg p-6 mb-3 flex items-center justify-center">
                    <QRCodeSVG
                      id="qr-code-amnezia-svg"
                      value={qrAmneziaJSON}
                      size={280}
                      level="M"
                      includeMargin={false}
                      className="w-full h-auto"
                    />
                  </div>
                  <p className="text-xs text-orange-400 text-center font-mono mb-3">
                    AmneziaVPN Format (with container config)
                  </p>
                  <Button
                    onClick={() => {
                      const svg = document.getElementById('qr-code-amnezia-svg');
                      if (!svg) return;

                      const svgData = new XMLSerializer().serializeToString(svg);
                      const canvas = document.createElement('canvas');
                      const ctx = canvas.getContext('2d');
                      const img = new Image();

                      canvas.width = 300;
                      canvas.height = 300;

                      img.onload = () => {
                        if (ctx) {
                          ctx.fillStyle = 'white';
                          ctx.fillRect(0, 0, canvas.width, canvas.height);
                          ctx.drawImage(img, 10, 10, 280, 280);
                          
                          canvas.toBlob((blob) => {
                            if (blob) {
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `${key?.name || `key_${key?.id}`}_amneziavpn_qr.png`;
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                              URL.revokeObjectURL(url);
                              toast.success('AmneziaVPN QR-код сохранен!');
                            }
                          });
                        }
                      };

                      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
                    }}
                    variant="outline"
                    size="sm"
                    className="w-full border-orange-500/40 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 font-mono text-xs"
                  >
                    <Download className="w-3 h-3 mr-2" />
                    СОХРАНИТЬ AMNEZIAVPN QR
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Background grid effect */}
      <div className="fixed inset-0 pointer-events-none opacity-5 z-0">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(#CCFF00 1px, transparent 1px),
              linear-gradient(90deg, #CCFF00 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>
    </div>
  );
};

export default KeyDetails;
