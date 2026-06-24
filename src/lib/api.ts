// API Client для 3wg VPN Backend

const API_BASE_URL = '/api/v1';

// Типы данных
export interface User {
  id: number;
  email: string;
  full_name?: string;
  phone?: string;
  telegram_id?: string;
  balance: number;
  tariff: string;
  is_admin?: boolean;
  is_active?: boolean;
  email_verified?: boolean;
  last_login_at?: string;
  created_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name?: string;
  phone?: string;
  telegram_id?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Server {
  id: number;
  name: string;
  location: string;
  country: string;
  ip_address: string;
  status: string;
  load: number;
  protocols: string[];
  max_users: number;
  usage_type?: string; // shared (общие пиры) | dedicated (целиком клиенту)
  dedicated_user_id?: number | null; // Кому выдан сервер (для dedicated)
  panel_type?: string; // wgdashboard | 3wg-panel
  panel_user?: string;
  current_peers?: number; // Текущее количество пиров (из кэша)
  wg_dashboard_url?: string;
  wg_dashboard_key?: string;
  wg_config_name?: string;
  wg_dashboard_port?: number;
  wg_listen_port?: number;
  created_at: string;
  updated_at: string;
  systemStatus?: any; // Системный статус (CPU, Memory, Disk)
}

export interface VPNKey {
  id: number;
  user_id: number;
  server_id: number;
  name: string;
  public_key: string;
  private_key: string;
  ip_address: string;
  protocol: string;
  config: string;
  status: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
  server?: Server; // Full server object from backend
}

export interface Payment {
  id: number;
  user_id: number;
  amount: number;
  currency: string;
  status: string; // pending, paid, failed, cancelled, expired
  payment_method?: string;
  method: string; // crypto, card, online
  transaction_id?: string;
  order_id: string;
  payment_uuid?: string;
  payment_url?: string;
  payment_amount?: string;
  payer_currency?: string;
  network?: string;
  address?: string;
  expired_at?: string;
  plan?: string;
  provider?: string; // Название провайдера
  created_at: string;
  updated_at: string;
}

export interface Statistics {
  id: number;
  user_id: number;
  date: string;
  bytes_sent: number;
  bytes_received: number;
  connection_time: number;
  created_at: string;
}

export interface DashboardStats {
  total_users: number;
  active_users: number;
  total_servers: number;
  active_servers: number;
  total_keys: number;
  total_revenue: number;
  month_revenue: number;
}

export interface AdminDashboard {
  stats: DashboardStats;
  recent_users: User[];
  recent_payments: Payment[];
}

// Speed Test Types
export interface SpeedTestResult {
  id: number;
  user_id: number;
  server_id: number;
  download_speed: number;
  upload_speed: number;
  latency_avg: number;
  latency_min: number;
  latency_max: number;
  jitter?: number;
  test_duration: number;
  data_transferred: number;
  created_at: string;
  user?: User;
  server?: Server;
}

export interface LatencyStats {
  average: number;
  min: number;
  max: number;
  jitter?: number;
}

export interface InterfaceTraffic {
  ok: boolean;
  protocol: string;
  title: string;
  interface: string;
  days: number;
  current: { rx: number; tx: number; ts: number } | null;
  series: { day: number; rx: number; tx: number; total: number }[];
  month_total: number;
}

export interface ServerComparisonData {
  server_id: number;
  server_name: string;
  avg_download: number;
  avg_upload: number;
  avg_latency: number;
  test_count: number;
}

export interface SpeedTestStartResponse {
  message: string;
  server_id: number;
  server_name: string;
  test_id: number;
}

export interface SpeedTestMeasurementResponse {
  download_speed?: number;
  upload_speed?: number;
  unit: string;
}

export interface SpeedTestHistoryResponse {
  history: SpeedTestResult[];
  count: number;
}

export interface SpeedTestComparisonResponse {
  comparison: ServerComparisonData[];
  count: number;
}

export interface SpeedTestSaveRequest {
  server_id: number;
  download_speed: number;
  upload_speed: number;
  latency_avg: number;
  latency_min: number;
  latency_max: number;
  jitter?: number;
  test_duration?: number;
  data_transferred?: number;
}

export interface SpeedTestSaveResponse {
  message: string;
  result_id: number;
}

// Test State Management Types
export type TestPhase = 'idle' | 'starting' | 'download' | 'upload' | 'ping' | 'saving' | 'complete' | 'error';

export interface TestState {
  phase: TestPhase;
  isRunning: boolean;
  progress: number;
  currentSpeed?: number;
  error?: string;
  results?: {
    download_speed: number;
    upload_speed: number;
    latency: LatencyStats;
  };
}

// Класс для работы с API
class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('auth_token');
  }

  // Установить токен
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  // Удалить токен
  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  // Получить токен
  getToken(): string | null {
    return this.token;
  }

  // Базовый метод для запросов (публичный для использования в компонентах)
  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Добавляем токен если есть
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Если 401 - токен невалидный, очищаем
      if (response.status === 401) {
        this.clearToken();
        throw new Error('Unauthorized');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    this.setToken(response.token);
    return response;
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(response.token);
    return response;
  }

  async logout() {
    this.clearToken();
  }

  // User endpoints
  async getCurrentUser(): Promise<User> {
    return this.request<User>('/users/me');
  }

  async updateCurrentUser(data: Partial<User>): Promise<User> {
    return this.request<User>('/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getUserStats(): Promise<Statistics[]> {
    return this.request<Statistics[]>('/users/me/stats');
  }

  // Server endpoints
  async getServers(): Promise<Server[]> {
    const response = await this.request<{servers: Server[], total: number}>('/servers');
    return response.servers;
  }

  async getServer(id: number): Promise<Server> {
    return this.request<Server>(`/admin/servers/${id}`);
  }

  async createServer(data: {
    name: string;
    wg_dashboard_url: string;
    wg_dashboard_key: string;
    [key: string]: unknown;
  }): Promise<Server> {
    return this.request<Server>('/admin/servers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateServer(id: number, data: {
    name: string;
    wg_dashboard_url: string;
    wg_dashboard_key: string;
    [key: string]: unknown;
  }): Promise<Server> {
    return this.request<Server>(`/admin/servers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteServer(id: number): Promise<void> {
    return this.request<void>(`/admin/servers/${id}`, {
      method: 'DELETE',
    });
  }

  async testWGDashboard(id: number): Promise<{status: string, message?: string}> {
    return this.request<{status: string, message?: string}>(`/admin/servers/${id}/wg/test`);
  }

  async getMyTraffic(): Promise<{
    keys_total: number;
    keys_active: number;
    traffic: { rx_gb: number; tx_gb: number; total_gb: number };
    daily: { date: string; rx_gb: number; tx_gb: number }[];
  }> {
    return this.request('/users/me/traffic');
  }

  async getServerInterfaceTraffic(id: number, days = 30): Promise<{status: string, data: Record<string, InterfaceTraffic>}> {
    return this.request<{status: string, data: Record<string, InterfaceTraffic>}>(`/admin/servers/${id}/wg/traffic/interfaces?days=${days}`);
  }

  async getPeerVPNConfig(serverId: number, publicKey: string): Promise<{status: string, vpn_config?: string}> {
    return this.request<{status: string, vpn_config?: string}>(
      `/admin/servers/${serverId}/wg/peers/vpn-config?publicKey=${encodeURIComponent(publicKey)}`,
    );
  }

  async getServerCategories(serverId: number): Promise<{status: string, categories: {id: number, name: string}[]}> {
    return this.request<{status: string, categories: {id: number, name: string}[]}>(`/admin/servers/${serverId}/wg/categories`);
  }

  async updatePeerInfo(serverId: number, publicKey: string, data: {name?: string, category?: string}): Promise<{status: string}> {
    return this.request<{status: string}>(
      `/admin/servers/${serverId}/wg/peers/update?publicKey=${encodeURIComponent(publicKey)}`,
      { method: 'PATCH', body: JSON.stringify(data) },
    );
  }

  async togglePeer(serverId: number, publicKey: string, enable: boolean): Promise<{status: string, enabled: boolean}> {
    return this.request<{status: string, enabled: boolean}>(
      `/admin/servers/${serverId}/wg/peers/toggle?publicKey=${encodeURIComponent(publicKey)}&enable=${enable}`,
      { method: 'POST' },
    );
  }

  // WGDashboard Config endpoint
  async getServerConfig(serverId: number): Promise<{status: boolean, data: any[]}> {
    return this.request<{status: boolean, data: any[]}>(`/admin/servers/${serverId}/wg/config`);
  }

  // WGDashboard System Status endpoint
  async getSystemStatus(serverId: number): Promise<any> {
    return this.request(`/admin/servers/${serverId}/wg/status`);
  }

  // WGDashboard Peer endpoints
  async getServerPeers(serverId: number, config?: string): Promise<{peers: any[], total: number, config: string}> {
    const params = config ? `?config=${config}` : '';
    return this.request<{peers: any[], total: number, config: string}>(`/admin/servers/${serverId}/wg/peers${params}`);
  }

  async addPeerToServer(serverId: number, data: {
    public_key: string;
    private_key: string;
    allowed_ips: string[];
    name: string;
    config?: string;
  }): Promise<{status: boolean, message: string, data: {publicKey: string}}> {
    return this.request(`/admin/servers/${serverId}/wg/peers`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async removePeerFromServer(serverId: number, publicKey: string): Promise<{status: string, message: string}> {
    return this.request(`/admin/servers/${serverId}/wg/peers?publicKey=${encodeURIComponent(publicKey)}`, {
      method: 'DELETE',
    });
  }

  async getPeerGeolocation(serverId: number, publicKey: string): Promise<{
    status: string;
    data?: {
      ip: string;
      country: string;
      countryCode: string;
      region: string;
      city: string;
      lat: number;
      lon: number;
      isp: string;
    };
    message?: string;
  }> {
    return this.request(`/admin/servers/${serverId}/wg/peers/geolocation?publicKey=${encodeURIComponent(publicKey)}`);
  }

  async getPeerTrafficHistory(serverId: number, publicKey: string, days: number = 7): Promise<{
    status: string;
    data: Array<{
      date: string;
      bytes_received: number;
      bytes_sent: number;
      bytes_total: number;
      delta_received: number;
      delta_sent: number;
      delta_total: number;
      gb_received: number;
      gb_sent: number;
      gb_total: number;
    }>;
    count: number;
  }> {
    return this.request(`/admin/servers/${serverId}/wg/peers/traffic-history?publicKey=${encodeURIComponent(publicKey)}&days=${days}`);
  }

  async getPeerTrafficHourly(serverId: number, publicKey: string, hours: number = 24): Promise<{
    status: string;
    data: Array<{
      hour: string;
      timestamp: number;
      bytes_received: number;
      bytes_sent: number;
      bytes_total: number;
      delta_received: number;
      delta_sent: number;
      delta_total: number;
      gb_received: number;
      gb_sent: number;
      gb_total: number;
    }>;
    count: number;
  }> {
    return this.request(`/admin/servers/${serverId}/wg/peers/traffic-hourly?publicKey=${encodeURIComponent(publicKey)}&hours=${hours}`);
  }

  async getPeerConfig(serverId: number, publicKey: string): Promise<{
    status: string;
    config: string;
    peer_name: string;
  }> {
    return this.request(`/admin/servers/${serverId}/wg/peers/config?publicKey=${encodeURIComponent(publicKey)}`);
  }

  // VPN Key endpoints
  async getKeys(): Promise<VPNKey[]> {
    const response = await this.request<{keys: VPNKey[], total: number}>('/keys');
    return response.keys;
  }

  async createKey(serverId: number): Promise<VPNKey> {
    return this.request<VPNKey>('/keys', {
      method: 'POST',
      body: JSON.stringify({ server_id: serverId }),
    });
  }

  async getKey(id: number): Promise<VPNKey> {
    return this.request<VPNKey>(`/keys/${id}`);
  }

  async deleteKey(id: number): Promise<void> {
    return this.request<void>(`/keys/${id}`, {
      method: 'DELETE',
    });
  }

  // Payment endpoints
  async getPaymentHistory(): Promise<Payment[]> {
    return this.request<Payment[]>('/payments/history');
  }

  async createPayment(amount: number, currency: string, provider?: string): Promise<Payment> {
    const body: any = { amount, currency };
    if (provider) {
      body.provider = provider;
    }
    
    return this.request<Payment>('/payments/create', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async getPaymentStatus(paymentId: number): Promise<Payment> {
    return this.request<Payment>(`/payments/${paymentId}/status`);
  }

  // Admin endpoints
  async getAdminDashboard(): Promise<AdminDashboard> {
    return this.request<AdminDashboard>('/admin/dashboard');
  }

  async getAdminUsers(search = ''): Promise<User[]> {
    const params = search ? `?search=${encodeURIComponent(search)}&limit=100` : '?limit=100';
    const response = await this.request<User[] | {users: User[]; total: number}>(`/admin/users${params}`);
    return Array.isArray(response) ? response : response.users;
  }

  async createAdminUser(data: Partial<User> & { password?: string }): Promise<{user: User; temporary_pass?: string}> {
    return this.request<{user: User; temporary_pass?: string}>('/admin/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAdminUser(id: number, data: Partial<User> & { password?: string }): Promise<User> {
    return this.request<User>(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async setAdminUserStatus(id: number, isActive: boolean): Promise<User> {
    return this.request<User>(`/admin/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ is_active: isActive }),
    });
  }

  async resetAdminUserPassword(id: number, password?: string, sendEmail = true): Promise<{user: User; temporary_pass: string; email_sent: boolean}> {
    return this.request<{user: User; temporary_pass: string; email_sent: boolean}>(`/admin/users/${id}/reset-password`, {
      method: 'POST',
      body: JSON.stringify({ password, send_email: sendEmail }),
    });
  }

  async deleteAdminUser(id: number): Promise<void> {
    return this.request<void>(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  }

  async getAdminAnalytics(): Promise<any> {
    return this.request<any>('/admin/analytics');
  }

  // Settings endpoints
  async getHomePageSettings(): Promise<any> {
    // Временно используем localStorage вместо API
    const saved = localStorage.getItem('homepage_settings');
    if (saved) {
      return JSON.parse(saved);
    }
    
    // Дефолтные настройки
    return {
      hero_section: true,
      keenetic_section: true,
      vpn_section: true,
      services_section: true,
      pricing_section: true,
      hardware_section: true,
      infrastructure_section: true,
      faq_section: true,
      articles_section: true,
      telegram_section: true,
      status_widget: true,
      block_order: [
        'keenetic_section',
        'vpn_section',
        'pricing_section',
        'services_section',
        'hardware_section',
        'infrastructure_section',
        'faq_section',
        'articles_section',
        'telegram_section',
        'status_widget',
      ],
    };
  }

  async updateHomePageSettings(settings: any): Promise<any> {
    // Сохраняем в localStorage
    localStorage.setItem('homepage_settings', JSON.stringify(settings));
    console.log('Saving homepage settings:', settings);
    
    // Отправляем событие об обновлении настроек
    window.dispatchEvent(new CustomEvent('homepage-settings-updated'));
    
    return Promise.resolve({ success: true });
  }

  // User profile - update method
  async updateUserProfile(data: any): Promise<any> {
    return this.request<any>('/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // User keys - additional methods
  async createUserKey(data: { server_id: number; name?: string; protocol?: string }): Promise<VPNKey> {
    return this.request<VPNKey>('/keys', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteUserKey(id: number): Promise<void> {
    return this.request<void>(`/keys/${id}`, {
      method: 'DELETE',
    });
  }

  async downloadKeyConfig(id: number): Promise<string> {
    const url = `${this.baseUrl}/keys/${id}/config`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Добавляем токен если есть
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, { headers });

      // Если 401 - токен невалидный, очищаем
      if (response.status === 401) {
        this.clearToken();
        throw new Error('Unauthorized');
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Request failed');
      }

      // Возвращаем текст, не JSON
      return await response.text();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async downloadAmneziaJSON(id: number): Promise<string> {
    const url = `${this.baseUrl}/keys/${id}/amnezia-json`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Добавляем токен если есть
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, { headers });

      // Если 401 - токен невалидный, очищаем
      if (response.status === 401) {
        this.clearToken();
        throw new Error('Unauthorized');
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Request failed');
      }

      // Возвращаем текст (JSON строку)
      return await response.text();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // WGDashboard Cached endpoints (fast!)
  async getServerPeersCached(serverId: number, config?: string): Promise<{peers: any[], total: number, config: string, cached: boolean, last_sync: string, empty?: boolean}> {
    const params = config ? `?config=${config}` : '';
    return this.request<{peers: any[], total: number, config: string, cached: boolean, last_sync: string, empty?: boolean}>(`/admin/servers/${serverId}/wg/peers/cached${params}`);
  }

  async getServerConfigCached(serverId: number): Promise<{status: boolean, data: any[], cached: boolean, last_sync: string, empty?: boolean}> {
    return this.request<{status: boolean, data: any[], cached: boolean, last_sync: string, empty?: boolean}>(`/admin/servers/${serverId}/wg/config/cached`);
  }

  async getSystemStatusCached(serverId: number): Promise<{status: boolean, data: any, cached: boolean, last_sync: string, empty?: boolean}> {
    return this.request<{status: boolean, data: any, cached: boolean, last_sync: string, empty?: boolean}>(`/admin/servers/${serverId}/wg/status/cached`);
  }

  // Speed Test endpoints
  async startSpeedTest(serverId: number): Promise<SpeedTestStartResponse> {
    return this.request<SpeedTestStartResponse>(`/speed-test/start?server_id=${serverId}`, {
      method: 'POST',
    });
  }

  // Реальный тест загрузки: скачиваем поток случайных данных и меряем время в браузере.
  // onProgress(mbps, percent) — живой прогресс для UI.
  async downloadTest(
    serverId: number,
    onProgress?: (mbps: number, percent: number) => void,
    sizeMB = 30,
  ): Promise<SpeedTestMeasurementResponse> {
    const url = `${this.baseUrl}/speed-test/download?server_id=${serverId}&size_mb=${sizeMB}`;
    const start = performance.now();
    const response = await fetch(url, {
      headers: this.token ? { Authorization: `Bearer ${this.token}` } : {},
    });
    if (!response.ok || !response.body) {
      throw new Error('Ошибка теста загрузки');
    }
    const reader = response.body.getReader();
    const totalBytes = sizeMB * 1024 * 1024;
    let received = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      received += value.length;
      const seconds = (performance.now() - start) / 1000;
      if (seconds > 0 && onProgress) {
        onProgress((received * 8) / 1e6 / seconds, Math.min((received / totalBytes) * 100, 100));
      }
    }
    const seconds = (performance.now() - start) / 1000;
    return { download_speed: (received * 8) / 1e6 / seconds, unit: 'Mbps' };
  }

  // Реальный тест отдачи: заливаем случайные данные, прогресс через XHR.
  async uploadTest(
    serverId: number,
    onProgress?: (mbps: number, percent: number) => void,
    sizeMB = 15,
  ): Promise<SpeedTestMeasurementResponse> {
    const payload = new Uint8Array(sizeMB * 1024 * 1024);
    crypto.getRandomValues(payload.subarray(0, 65536));
    // Заполняем повторением случайного блока (быстро и несжимаемо для проксей)
    for (let offset = 65536; offset < payload.length; offset += 65536) {
      payload.copyWithin(offset, 0, Math.min(65536, payload.length - offset));
    }
    const url = `${this.baseUrl}/speed-test/upload?server_id=${serverId}`;
    const start = performance.now();
    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url);
      if (this.token) xhr.setRequestHeader('Authorization', `Bearer ${this.token}`);
      xhr.upload.onprogress = (e) => {
        const seconds = (performance.now() - start) / 1000;
        if (seconds > 0 && onProgress) {
          onProgress((e.loaded * 8) / 1e6 / seconds, e.total ? (e.loaded / e.total) * 100 : 0);
        }
      };
      xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error('Ошибка теста отдачи')));
      xhr.onerror = () => reject(new Error('Ошибка теста отдачи'));
      xhr.send(payload);
    });
    const seconds = (performance.now() - start) / 1000;
    return { upload_speed: (payload.length * 8) / 1e6 / seconds, unit: 'Mbps' };
  }

  // Реальный пинг: серия лёгких запросов, RTT в браузере (первый — прогрев, не учитывается)
  async pingTest(serverId: number): Promise<LatencyStats> {
    const url = `${this.baseUrl}/speed-test/ping?server_id=${serverId}`;
    const headers: HeadersInit = this.token ? { Authorization: `Bearer ${this.token}` } : {};
    const samples: number[] = [];
    for (let i = 0; i < 6; i++) {
      const t0 = performance.now();
      await fetch(`${url}&_=${Date.now()}`, { headers, cache: 'no-store' });
      const rtt = performance.now() - t0;
      if (i > 0) samples.push(rtt); // первый запрос — прогрев соединения
    }
    const average = samples.reduce((a, b) => a + b, 0) / samples.length;
    const min = Math.min(...samples);
    const max = Math.max(...samples);
    const jitter = samples.length > 1
      ? samples.slice(1).reduce((acc, v, i) => acc + Math.abs(v - samples[i]), 0) / (samples.length - 1)
      : 0;
    return {
      average: Math.round(average),
      min: Math.round(min),
      max: Math.round(max),
      jitter: Math.round(jitter * 10) / 10,
    } as LatencyStats;
  }

  async saveSpeedTestResult(data: SpeedTestSaveRequest): Promise<SpeedTestSaveResponse> {
    return this.request<SpeedTestSaveResponse>('/speed-test/result', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getSpeedTestHistory(limit?: number): Promise<SpeedTestHistoryResponse> {
    const params = limit ? `?limit=${limit}` : '';
    return this.request<SpeedTestHistoryResponse>(`/speed-test/history${params}`);
  }

  async getServerComparison(): Promise<SpeedTestComparisonResponse> {
    return this.request<SpeedTestComparisonResponse>('/speed-test/comparison');
  }
}

// Экспортируем единственный экземпляр
export const api = new ApiClient(API_BASE_URL);
