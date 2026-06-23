#!/usr/bin/env python3
"""Патч 3wg-panel: API-ключи + авторизация по X-API-Key. Запускается на сервере."""
import sys

P = '/srv/3wg-panel/app/app.py'
s = open(P, encoding='utf-8').read()

if 'API KEYS START' in s:
    print('already patched')
    sys.exit(0)

old_auth = """def api_is_authenticated(request: Request) -> bool:
    cookie_token = request.cookies.get(SESSION_COOKIE)
    return bool(cookie_token and secrets.compare_digest(cookie_token, make_session_token()))"""
new_auth = """def api_is_authenticated(request: Request) -> bool:
    header_key = request.headers.get('x-api-key', '')
    if header_key and api_key_valid(header_key):
        return True
    cookie_token = request.cookies.get(SESSION_COOKIE)
    return bool(cookie_token and secrets.compare_digest(cookie_token, make_session_token()))"""
assert old_auth in s, 'auth block not found'
s = s.replace(old_auth, new_auth, 1)

s += r'''

# === 3WG API KEYS START ===
def _apikeys_init():
    with db() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS api_keys (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                token TEXT NOT NULL UNIQUE,
                created_at INTEGER NOT NULL,
                last_used_at INTEGER
            )
        """)
        conn.commit()
_apikeys_init()


def api_key_valid(token: str) -> bool:
    with db() as conn:
        rows = conn.execute('SELECT id, token FROM api_keys').fetchall()
        for row in rows:
            if secrets.compare_digest(str(row['token']), token):
                conn.execute('UPDATE api_keys SET last_used_at = ? WHERE id = ?', (int(time.time()), row['id']))
                conn.commit()
                return True
    return False


def _apikey_session_only(request: Request):
    """Управление ключами — только через cookie-сессию (не по самому ключу)."""
    cookie_token = request.cookies.get(SESSION_COOKIE)
    if cookie_token and secrets.compare_digest(cookie_token, make_session_token()):
        return PANEL_USER
    raise HTTPException(status_code=401, detail='Unauthorized')


@app.get('/api/apikeys')
def api_apikeys_list(user=Depends(_apikey_session_only)):
    with db() as conn:
        rows = conn.execute('SELECT id, name, token, created_at, last_used_at FROM api_keys ORDER BY id DESC').fetchall()
    return {'ok': True, 'keys': [{
        'id': int(r['id']),
        'name': r['name'],
        'token_masked': str(r['token'])[:6] + '...' + str(r['token'])[-4:],
        'created_at': int(r['created_at']),
        'last_used_at': int(r['last_used_at']) if r['last_used_at'] else None,
    } for r in rows]}


@app.post('/api/apikeys')
async def api_apikeys_create(request: Request, user=Depends(_apikey_session_only)):
    data = await api_read_payload(request)
    name = str(data.get('name', '')).strip() or 'integration'
    token = secrets.token_urlsafe(32)
    with db() as conn:
        cur = conn.execute('INSERT INTO api_keys(name, token, created_at) VALUES (?, ?, ?)', (name, token, int(time.time())))
        conn.commit()
        key_id = int(cur.lastrowid)
    # Токен показывается один раз — при создании
    return {'ok': True, 'id': key_id, 'name': name, 'token': token}


@app.delete('/api/apikeys/{key_id}')
def api_apikeys_delete(key_id: int, user=Depends(_apikey_session_only)):
    with db() as conn:
        cur = conn.execute('DELETE FROM api_keys WHERE id = ?', (key_id,))
        conn.commit()
        if cur.rowcount == 0:
            return api_error('Ключ не найден', status_code=404)
    return {'ok': True, 'deleted_id': key_id}


@app.get('/apikeys', response_class=HTMLResponse)
def apikeys_page():
    return HTMLResponse("""<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><title>API-ключи — 3WG Panel</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="/theme.css">
<style>
.ak-wrap{max-width:880px;margin:40px auto;padding:0 20px;font-family:system-ui,sans-serif}
.ak-card{background:var(--neo-card);border:1px solid var(--neo-border);border-radius:14px;padding:22px;margin-bottom:18px}
.ak-title{font-size:22px;font-weight:900;margin-bottom:4px;color:var(--neo-text)}
.ak-sub{color:var(--neo-muted);font-size:13px;margin-bottom:18px}
.ak-row{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--neo-border)}
.ak-row:last-child{border-bottom:none}
.ak-name{font-weight:700;color:var(--neo-text);flex:1}
.ak-token{font-family:monospace;color:var(--neo-green);font-size:13px}
.ak-meta{color:var(--neo-muted2);font-size:12px}
.ak-btn{background:rgba(200,255,0,.1);border:1px solid rgba(200,255,0,.35);color:var(--neo-green);border-radius:9px;padding:8px 16px;font-weight:700;cursor:pointer}
.ak-btn.danger{background:rgba(255,91,115,.08);border-color:rgba(255,91,115,.3);color:var(--neo-red)}
.ak-input{background:var(--neo-card2);border:1px solid var(--neo-border2);color:var(--neo-text);border-radius:9px;padding:9px 12px;flex:1}
.ak-new{background:rgba(200,255,0,.06);border:1px dashed rgba(200,255,0,.4);border-radius:11px;padding:14px;margin-top:14px;display:none}
.ak-new code{color:var(--neo-green);font-size:14px;word-break:break-all}
a.ak-back{color:var(--neo-muted);text-decoration:none;font-size:13px}
</style></head><body>
<div class="ak-wrap">
<a class="ak-back" href="/">← Назад в панель</a>
<div class="ak-card">
  <div class="ak-title">API-ключи</div>
  <div class="ak-sub">Для интеграции внешних систем (заголовок <code>X-API-Key</code>). Токен показывается только при создании.</div>
  <div style="display:flex;gap:10px">
    <input class="ak-input" id="keyName" placeholder="Название (например: 3wg.ru backend)">
    <button class="ak-btn" onclick="createKey()">Создать ключ</button>
  </div>
  <div class="ak-new" id="newKey"></div>
</div>
<div class="ak-card"><div id="list">Загрузка…</div></div>
</div>
<script>
function fmt(ts){return ts?new Date(ts*1000).toLocaleString('ru-RU'):'—'}
async function load(){
  const r=await fetch('/api/apikeys');
  if(r.status===401){document.getElementById('list').innerHTML='Нужна авторизация. <a href="/login" style="color:var(--neo-green)">Войти</a>';return}
  const d=await r.json();
  document.getElementById('list').innerHTML=d.keys.length?d.keys.map(k=>
    `<div class="ak-row"><div class="ak-name">${k.name}<div class="ak-meta">создан ${fmt(k.created_at)} · использован ${fmt(k.last_used_at)}</div></div>`+
    `<span class="ak-token">${k.token_masked}</span>`+
    `<button class="ak-btn danger" onclick="delKey(${k.id})">Удалить</button></div>`).join('')
    :'<div class="ak-meta">Ключей пока нет</div>';
}
async function createKey(){
  const name=document.getElementById('keyName').value;
  const r=await fetch('/api/apikeys',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name})});
  const d=await r.json();
  if(d.ok){
    const el=document.getElementById('newKey');
    el.style.display='block';
    el.innerHTML='Новый ключ (скопируйте сейчас — больше не покажем):<br><code>'+d.token+'</code>';
    document.getElementById('keyName').value='';
    load();
  }
}
async function delKey(id){
  if(!confirm('Удалить ключ?'))return;
  await fetch('/api/apikeys/'+id,{method:'DELETE'});
  load();
}
load();
</script>
</body></html>""")
# === 3WG API KEYS END ===
'''

open(P, 'w', encoding='utf-8').write(s)
print('patched OK')
