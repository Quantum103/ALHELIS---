/* =========================================
   1. Cursor glow & Particles (Desktop only)
   ========================================= */
const cg = document.getElementById('cg');
let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY });
addEventListener('mouseleave', () => cg.style.opacity = 0);
addEventListener('mouseenter', () => cg.style.opacity = 1);
(function loop() {
  cx += (mx - cx) * 0.08;
  cy += (my - cy) * 0.08;
  cg.style.left = cx + 'px';
  cg.style.top = cy + 'px';
  requestAnimationFrame(loop);
})();

const mm = matchMedia('(min-width:1024px)');
function initParticles() {
  if (!mm.matches) return;
  const c = document.getElementById('ptc');
  if (c.childElementCount) return;
  for (let i = 0; i < 22; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.bottom = '-10px';
    p.style.animationDuration = (10 + Math.random() * 18) + 's';
    p.style.animationDelay = (Math.random() * 15) + 's';
    p.style.opacity = Math.random() * 0.6 + 0.2;
    c.appendChild(p);
  }
}
mm.addEventListener('change', initParticles);
initParticles();

/* =========================================
   2. UI Logic: Switch, Password, Strength
   ========================================= */
const sw = document.getElementById('sw');
const btns = [...sw.querySelectorAll('button')];
const loginF = document.getElementById('loginForm');
const regF = document.getElementById('regForm');
const fTitle = document.getElementById('fTitle');
const fSub = document.getElementById('fSub');

btns.forEach(b => b.addEventListener('click', () => {
  const m = b.dataset.m;
  btns.forEach(x => x.classList.toggle('on', x === b));
  sw.classList.toggle('right', m === 'register');
  if (m === 'register') {
    loginF.classList.add('hidden');
    regF.classList.remove('hidden');
    fTitle.innerHTML = 'Создать <em>аккаунт</em>';
    fSub.textContent = 'Начните работу со студией';
  } else {
    regF.classList.add('hidden');
    loginF.classList.remove('hidden');
    fTitle.innerHTML = 'Добро <em>пожаловать</em>';
    fSub.textContent = 'Войдите, чтобы продолжить';
  }
}));

document.querySelectorAll('.pwd-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const inp = document.getElementById(btn.dataset.for);
    const show = inp.type === 'password';
    inp.type = show ? 'text' : 'password';
    btn.textContent = show ? 'Скрыть' : 'Показать';
  });
});

const rPwd = document.getElementById('rPwd');
const str = document.getElementById('str');
const hint = document.getElementById('hint');

function score(v) {
  let s = 0;
  if (v.length >= 6) s++;
  if (v.length >= 10) s++;
  if (/[A-Z]/.test(v) && /[a-z]/.test(v)) s++;
  if (/\d/.test(v) && /[^A-Za-z0-9]/.test(v)) s++;
  return s;
}

rPwd.addEventListener('input', () => {
  const v = rPwd.value;
  const s = v ? score(v) : 0;
  str.className = 'strength' + (s ? ' w' + s : '');
  const msgs = ['Введите пароль', 'Слабый', 'Средний', 'Хороший', 'Отличный'];
  hint.textContent = msgs[s] || msgs[0];
  hint.style.color = ['var(--muted)', '#c74a4a', 'var(--bronze)', 'var(--gold)', '#8fa876'][s];
});

/* =========================================
   3. Validation & Real API Submit
   ========================================= */
function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function setErr(inp, on) { inp.closest('.field').classList.toggle('err', on); }

function pulseCard(card) {
  card.animate([
    { boxShadow: '0 0 0 0 rgba(214,184,138,.55)' },
    { boxShadow: '0 0 0 30px rgba(214,184,138,0)' }
  ], { duration: 800, easing: 'cubic-bezier(.2,.8,.2,1)' });
}

// Универсальная функция отправки с анимацией и реальным fetch
function handleRealSubmit(form, btn, validateFn, apiPath, successMsg) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // 1. Валидация
    const isOk = validateFn();
    if (!isOk) return;

    // 2. Анимация загрузки
    btn.classList.add('loading');
    btn.disabled = true;
    pulseCard(document.getElementById('card'));

    try {
      // 3. Реальный запрос к Nginx Gateway
      const response = await fetch(apiPath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validateFn.payload) // Данные берет из замыкания validateFn
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Ошибка сервера');

      // 4. Успех: сохраняем токен и показываем красивую анимацию
      if (apiPath.includes('/login')) {
        localStorage.setItem('token', data.token);
        if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
      }

      // Красивая подмена контента (из вашего оригинального скрипта)
      document.getElementById('card').innerHTML = `
        <div class="success">
          <div class="ic">✓</div>
          <h3>${successMsg}</h3>
          <p>Перенаправляем в кабинет…</p>
          <a class="submit" style="margin-top:26px;display:inline-block;max-width:260px;text-decoration:none" href="/dashboard">Перейти →</a>
        </div>`;
      
      // Реальный редирект через 1.5 секунды
      setTimeout(() => { window.location.href = '/dashboard'; }, 1500);

    } catch (err) {
      btn.classList.remove('loading');
      btn.disabled = false;
      alert(err.message);
    }
  });
}

// Настройка ВХОДА
handleRealSubmit(loginF, document.getElementById('lSub'), () => {
  const u = document.getElementById('lUsername'); // ИСПРАВЛЕНО: был lEmail
  const p = document.getElementById('lPwd');
  const uOk = u.value.trim().length >= 2;
  const pOk = p.value.length >= 6;
  
  setErr(u, !uOk); setErr(p, !pOk);
  if (!uOk) { u.focus(); return false; }
  if (!pOk) { p.focus(); return false; }
  
  // Сохраняем payload для fetch
  handleRealSubmit.payload = { username: u.value.trim(), password: p.value };
  return true;
}, '/api/auth/login', 'Вы <em>в системе</em>');

// Настройка РЕГИСТРАЦИИ
handleRealSubmit(regF, document.getElementById('rSub'), () => {
  const n = document.getElementById('rName');
  const e = document.getElementById('rEmail');
  const p = document.getElementById('rPwd');
  const p2 = document.getElementById('rPwd2');
  const ag = document.getElementById('agree');
  
  const nOk = n.value.trim().length >= 2;
  const eOk = validEmail(e.value.trim());
  const pOk = p.value.length >= 6;
  const p2Ok = p2.value && p2.value === p.value;
  
  setErr(n, !nOk); setErr(e, !eOk); setErr(p, !pOk); setErr(p2, !p2Ok);
  if (!nOk) { n.focus(); return false; }
  if (!eOk) { e.focus(); return false; }
  if (!pOk) { p.focus(); return false; }
  if (!p2Ok) { p2.focus(); return false; }
  if (!ag.checked) {
    ag.parentElement.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }], { duration: 300 });
    return false;
  }
  
  handleRealSubmit.payload = { name: n.value.trim(), email: e.value.trim(), password: p.value };
  return true;
}, '/api/auth/register', 'Аккаунт <em>создан</em>');

// Сброс ошибок при вводе
document.querySelectorAll('.field input').forEach(inp => {
  inp.addEventListener('input', () => setErr(inp, false));
});