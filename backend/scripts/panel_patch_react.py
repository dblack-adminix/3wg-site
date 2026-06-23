#!/usr/bin/env python3
"""Патч React-фронта 3wg-panel: фирменный стиль 3WG + раздел API-ключей."""
import re
import sys

CSS = '/srv/3wg-panel/frontend/src/styles.css'
JSX = '/srv/3wg-panel/frontend/src/main.jsx'
APP = '/srv/3wg-panel/app/app.py'

# --- 1. styles.css: палитра основного проекта (чёрный / #c8ff00 / #ff8c00) ---
css = open(CSS, encoding='utf-8').read()
if '#c8ff00' not in css:
    colors = {
        # переменные
        '#070b12': '#000000', '#0b111a': '#0a0a0a', '#101923': '#0d0d0d',
        '#263546': '#262626', '#95a9c2': '#999999', '#f3f7ff': '#ffffff',
        '#24f0a0': '#c8ff00', '#14d9ff': '#ff8c00', '#ff9800': '#ff8c00',
        # фоны
        '#080d14': '#050505', '#0b121b': '#0d0d0d', '#0d151f': '#0f0f0f',
        '#101824': '#0d0d0d', '#0c141e': '#101010', '#050b12': '#070707',
        '#050a10': '#070707', '#07101a': '#0a0a0a', '#071019': '#0a0a0a',
        '#0d1721': '#111111', '#0d1a28': '#161616', '#0f1b29': '#1a1a1a',
        # границы
        '#233043': '#262626', '#223042': '#262626', '#26384d': '#2e2e2e',
        '#2e3d51': '#333333', '#314155': '#333333', '#2c3c50': '#333333',
        '#1f2e41': '#222222', '#40526a': '#3a3a3a',
        # текст
        '#d9e7f7': '#dddddd', '#dce9fb': '#dddddd', '#c9d9ee': '#cccccc',
        '#a7bbd6': '#aaaaaa', '#a9bad1': '#aaaaaa', '#92a6c0': '#999999',
        '#9fb3cd': '#999999', '#8fa3bd': '#8a8a8a', '#8191a8': '#808080',
        '#91a5bf': '#999999', '#b8c9dd': '#bbbbbb', '#c7d8ee': '#cccccc',
        '#e9f2ff': '#eeeeee', '#e7f1ff': '#eeeeee', '#b7c7db': '#bbbbbb',
        '#8796a9': '#8a8a8a', '#8194ac': '#8a8a8a',
        # бирюзово-зелёные акценты → кислотно-зелёные
        '#0b7656': '#5a7300', '#0a684e': '#5a7300', '#075c4c': '#4a5f00',
        '#078766': '#5a7300', '#0b8f6c': '#5a7300', '#0b5a45': '#3c4d00',
        '#102d22': '#1d2600', '#09251d': '#161d00', '#06251f': '#161d00',
        '#09261f': '#161d00', '#06261f': '#161d00', '#09271f': '#161d00',
        '#0b2a24': '#1d2600', '#09231d': '#161d00', '#9affdf': '#e4ff8a',
        '#b8ffe1': '#e4ff8a', '#00d39a': '#c8ff00', '#1f9d5f': '#8aa800',
        '#1f7f49': '#7a9600',
        # циан/синий → оранжевый/зелёный
        '#17eaff': '#ff8c00', '#2eeaff': '#ff8c00', '#48b8ff': '#c8ff00',
        '#073947': '#2a1d00', '#116174': '#7a4d00',
        '#0b3342': '#2a1d00', '#126378': '#7a4d00',
        # wireguard pink → оранжевый
        '#ff6b86': '#ff8c00', '#42131b': '#2a1d00', '#8f2b3f': '#7a4d00',
        '#ff8aa0': '#ffb35c', '#552335': '#2a1d00', '#ffb3c6': '#ffcf99',
        '#823144': '#7a4d00', '#32121b': '#2a1d00', '#9e3448': '#b86a00',
        '#f7a83d': '#ff8c00',
        # rgba
        'rgba(36, 240, 160': 'rgba(200, 255, 0', 'rgba(36,240,160': 'rgba(200,255,0',
        'rgba(0, 211, 154': 'rgba(200, 255, 0',
        'rgba(255, 107, 134': 'rgba(255, 140, 0',
    }
    for old, new in colors.items():
        css = css.replace(old, new)
    css = css.replace(
        'font-family: Inter, "Segoe UI", Arial, sans-serif;',
        "font-family: 'Montserrat', Inter, \"Segoe UI\", Arial, sans-serif;",
    )
    css = '@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;900&display=swap");\n' + css
    open(CSS, 'w', encoding='utf-8').write(css)
    print('styles.css recolored')
else:
    print('styles.css already recolored')

# --- 2. main.jsx: раздел API-ключей ---
jsx = open(JSX, encoding='utf-8').read()
if 'ApiKeysPage' not in jsx:
    assert '\n  Home,\n' in jsx
    jsx = jsx.replace('\n  Home,\n', '\n  Home,\n  Key,\n', 1)

    nav_old = '<div className="nav-title">УПРАВЛЕНИЕ</div>'
    nav_new = (nav_old +
        '\n      <a className={`nav ${path === \'/apikeys\' ? \'active\' : \'\'}`} href="/apikeys">'
        '<Key size={14} /> <span>API-ключи</span></a>')
    assert nav_old in jsx
    jsx = jsx.replace(nav_old, nav_new, 1)

    component = '''
function ApiKeysPage({ onLogout }) {
  const [keys, setKeys] = useState([]);
  const [name, setName] = useState('');
  const [newToken, setNewToken] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const load = async () => {
    try { const d = await api('/api/apikeys'); setKeys(d.keys || []); setError(''); }
    catch (e) { setError(String(e.message || e)); }
  };
  useEffect(() => { load(); }, []);
  const create = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const d = await api('/api/apikeys', { method: 'POST', body: JSON.stringify({ name }) });
      setNewToken(d.token);
      setName('');
      await load();
    } catch (e2) { setError(String(e2.message || e2)); }
    finally { setBusy(false); }
  };
  const remove = async (id) => {
    if (!window.confirm('Удалить ключ? Интеграции, использующие его, перестанут работать.')) return;
    try { await api(`/api/apikeys/${id}`, { method: 'DELETE' }); await load(); }
    catch (e) { setError(String(e.message || e)); }
  };
  const fmt = (ts) => (ts ? new Date(ts * 1000).toLocaleString('ru-RU') : '—');
  return (
    <Shell title="API-ключи" subtitle="Доступ внешних систем по заголовку X-API-Key" onLogout={onLogout}>
      <div className="card create-card compact-create">
        <h2>Создать ключ</h2>
        <form onSubmit={create}>
          <input className="name-input" placeholder="Название (например: 3wg.ru backend)" value={name} onChange={(e) => setName(e.target.value)} />
          <button className="orange-btn" type="submit" disabled={busy}><Plus size={15} /> Создать ключ</button>
        </form>
        {newToken && (
          <div className="success" style={{ wordBreak: 'break-all' }}>
            Новый ключ (скопируйте сейчас — он больше не будет показан):<br />
            <code>{newToken}</code>
            <button className="copy-button" type="button" style={{ marginLeft: 8 }} onClick={() => navigator.clipboard?.writeText(newToken)}><Copy size={13} /> Copy</button>
          </div>
        )}
        {error && <div className="warning">{error}</div>}
      </div>
      <div className="card">
        <h2>Активные ключи</h2>
        <div className="table-wrap">
          <table className="clients-table" style={{ width: '100%', minWidth: 640 }}>
            <thead><tr><th>ID</th><th>Название</th><th>Ключ</th><th>Создан</th><th>Использован</th><th></th></tr></thead>
            <tbody>
              {keys.length === 0 && <tr><td className="empty-table" colSpan={6}>Ключей пока нет</td></tr>}
              {keys.map((k) => (
                <tr key={k.id}>
                  <td>{k.id}</td>
                  <td>{k.name}</td>
                  <td><code>{k.token_masked}</code></td>
                  <td>{fmt(k.created_at)}</td>
                  <td>{fmt(k.last_used_at)}</td>
                  <td className="actions-cell"><div className="actions">
                    <button className="icon-button danger" title="Удалить" onClick={() => remove(k.id)}><Trash2 size={14} /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Shell>
  );
}

'''
    assert '\nfunction App() {' in jsx
    jsx = jsx.replace('\nfunction App() {', component + '\nfunction App() {', 1)

    route_old = "  if (trafficMatch) return <TrafficPage protocol={trafficMatch[1]} onLogout={logout} />;"
    route_new = route_old + "\n  if (window.location.pathname === '/apikeys') return <ApiKeysPage onLogout={logout} />;"
    assert route_old in jsx
    jsx = jsx.replace(route_old, route_new, 1)
    open(JSX, 'w', encoding='utf-8').write(jsx)
    print('main.jsx patched')
else:
    print('main.jsx already patched')

# --- 3. app.py: /apikeys обслуживает React, убираем standalone-страницу ---
app = open(APP, encoding='utf-8').read()
old_paths = "if (path in ('/', '/login', '/ui') or"
new_paths = "if (path in ('/', '/login', '/ui', '/apikeys') or"
if old_paths in app:
    app = app.replace(old_paths, new_paths, 1)
    print('middleware path added')
# вырезаем standalone HTML-страницу /apikeys (роуты API остаются)
app = re.sub(
    r"@app\.get\('/apikeys', response_class=HTMLResponse\)\ndef apikeys_page\(\):.*?# === 3WG API KEYS END ===",
    "# === 3WG API KEYS END ===",
    app,
    flags=re.S,
)
open(APP, 'w', encoding='utf-8').write(app)
print('app.py updated')
