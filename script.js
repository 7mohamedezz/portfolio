/**
 * Mohamed Ezz — Developer Portfolio
 * script.js — Interactions, animations, terminal typewriter
 */

'use strict';

/* ============================================================
   CANVAS STARFIELD
   ============================================================ */
(function initStarfield() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];
  let W, H, raf;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function makeStars(n = 150) {
    stars = Array.from({ length: n }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      r:  Math.random() * 0.75 + 0.1,
      a:  Math.random() * 0.35 + 0.04,
      vx: (Math.random() - 0.5) * 0.04,
      vy: Math.random() * 0.06 + 0.008,
      ta: Math.random() * 0.005 + 0.002,
      td: Math.random() > 0.5 ? 1 : -1,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const s of stars) {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(210,210,205,${s.a})`;
      ctx.fill();

      s.x += s.vx;
      s.y += s.vy;
      s.a += s.ta * s.td;

      if (s.a > 0.4 || s.a < 0.04) s.td *= -1;
      if (s.y > H + 2) { s.y = -2; s.x = Math.random() * W; }
      if (s.x < -2)     { s.x = W + 2; }
      if (s.x > W + 2)  { s.x = -2; }
    }
    raf = requestAnimationFrame(draw);
  }

  resize();
  makeStars();
  draw();

  const onResize = () => { resize(); makeStars(); };
  window.addEventListener('resize', onResize, { passive: true });
})();

/* ============================================================
   NAVIGATION — scroll blur + mobile drawer
   ============================================================ */
(function initNav() {
  const nav    = document.getElementById('nav');
  const toggle = document.getElementById('nav-toggle');
  const links  = document.getElementById('nav-links');

  // Scroll class
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile toggle
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });

    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!nav.contains(e.target)) {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Active link on scroll
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const navAs    = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));

  const activeObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navAs.forEach(a =>
          a.classList.toggle('active', a.getAttribute('href') === `#${e.target.id}`)
        );
      }
    });
  }, { rootMargin: '-35% 0px -35% 0px' });

  sections.forEach(s => activeObs.observe(s));
})();

/* ============================================================
   HERO TERMINAL — animated sequence + live interactive input
   ============================================================ */
(function initHeroTerminal() {
  const body = document.getElementById('hero-terminal-body');
  if (!body) return;

  /* ---- timing ---- */
  const CHAR_SPEED    = 48;
  const CHAR_JITTER   = 18;
  const LINE_DELAY    = 45;
  const POST_CMD_WAIT = 260;
  const EXEC_WAIT     = 380;

  const PROMPT_HTML =
    `<span class="t-prompt">user@portfolio</span>` +
    `<span class="t-dim">:~$</span>&nbsp;`;

  function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

  function addLine(html, cls = '') {
    const div = document.createElement('div');
    div.className = 'terminal-line' + (cls ? ' ' + cls : '');
    div.innerHTML = html;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
    return div;
  }

  function typeCmd(cmdText) {
    return new Promise(resolve => {
      const div = document.createElement('div');
      div.className = 'terminal-line';
      div.innerHTML = PROMPT_HTML;
      body.appendChild(div);

      const span = document.createElement('span');
      span.className = 't-cmd';
      div.appendChild(span);

      let i = 0;
      function tick() {
        if (i >= cmdText.length) return resolve();
        span.textContent += cmdText[i++];
        body.scrollTop = body.scrollHeight;
        setTimeout(tick, CHAR_SPEED + Math.random() * CHAR_JITTER);
      }
      tick();
    });
  }

  /* ---- about card ---- */
  const BOX_LINES = [
    { html: `  <span class="t-green-b">Mohamed Ezz</span>`, cls: '' },
    { html: `  <span class="t-dim">Software Engineer</span>`, cls: '' },
    { html: ``, cls: '' },
    { html: `  <span class="t-cyan">Backend · .NET · Node.js · C++</span>`, cls: '' },
    { html: ``, cls: '' },
    { html: `  <span class="t-amber">✦</span> 3× ECPC Finalist`, cls: '' },
    { html: `  <span class="t-amber">✦</span> ICPC Mentor`, cls: '' },
    { html: ``, cls: '' },
    { html: `  <span class="t-dim">"I solve hard problems and turn them into</span>`, cls: '' },
    { html: `   <span class="t-dim">simple, reliable systems."</span>`, cls: '' },
  ];

  /* ---- ls output ---- */
  const LS_LINES = [
    `<span class="t-ls-dir">about/</span><span class="t-ls-dir">projects/</span><span class="t-ls-dir">experience/</span>`,
    `<span class="t-ls-dir">skills/</span><span class="t-ls-dir">achievements/</span><span class="t-ls-dir">contact/</span>`,
  ];

  /* ---- animation sequence ---- */
  async function animate() {
    await wait(500);

    /* whoami */
    await typeCmd('whoami');
    await wait(POST_CMD_WAIT);
    addLine(`<span class="t-output t-green-b">Mohamed Ezz</span>`);
    addLine('');

    await wait(420);

    /* ./about */
    await typeCmd('./about');
    await wait(EXEC_WAIT);
    addLine('');
    for (const {html, cls} of BOX_LINES) {
      addLine(html, cls);
      await wait(LINE_DELAY);
    }
    addLine('');

    await wait(480);

    /* ls */
    await typeCmd('ls');
    await wait(POST_CMD_WAIT);
    addLine('');
    for (const line of LS_LINES) {
      addLine(line);
      await wait(LINE_DELAY + 20);
    }
    addLine('');

    await wait(340);

    /* hand off to interactive shell */
    startInteractive();
  }

  /* ---- interactive shell ---- */
  function startInteractive() {
    /* Disable on touch-primary devices */
    const isTouch = window.matchMedia('(hover: none)').matches;

    const inputLine = document.createElement('div');
    inputLine.className = 'terminal-line terminal-input-line';
    inputLine.innerHTML = PROMPT_HTML;

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'terminal-input';
    input.setAttribute('aria-label', 'Terminal input');
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('spellcheck', 'false');
    input.setAttribute('autocorrect', 'off');

    if (isTouch) {
      /* read-only ghost cursor on mobile */
      const cur = document.createElement('span');
      cur.className = 'cursor-block';
      inputLine.appendChild(cur);
      body.appendChild(inputLine);
      body.scrollTop = body.scrollHeight;
      return;
    }

    inputLine.appendChild(input);
    body.appendChild(inputLine);
    body.scrollTop = body.scrollHeight;

    /* Click anywhere on terminal → focus input */
    body.addEventListener('click', () => input.focus({ preventScroll: true }));
    input.focus({ preventScroll: true });

    const history = [];
    let histIdx   = -1;

    input.addEventListener('keydown', e => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (histIdx < history.length - 1) {
          histIdx++;
          input.value = history[history.length - 1 - histIdx] || '';
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (histIdx > 0) {
          histIdx--;
          input.value = history[history.length - 1 - histIdx] || '';
        } else {
          histIdx = -1;
          input.value = '';
        }
      } else if (e.key === 'Enter') {
        const cmd = input.value.trim();
        input.value = '';
        histIdx = -1;
        if (!cmd) return;
        history.push(cmd);
        echoCmd(cmd);
        runCmd(cmd);
      }
    });
  }

  function echoCmd(cmd) {
    /* Print the typed command as a "submitted" line above the input */
    const echoDiv = document.createElement('div');
    echoDiv.className = 'terminal-line';
    echoDiv.innerHTML = PROMPT_HTML + `<span class="t-cmd">${escHtml(cmd)}</span>`;
    body.insertBefore(echoDiv, body.lastChild);
    body.scrollTop = body.scrollHeight;
  }

  function insertBeforeInput(html, cls) {
    const div = document.createElement('div');
    div.className = 'terminal-line' + (cls ? ' ' + cls : '');
    div.innerHTML = html;
    body.insertBefore(div, body.lastChild);
    body.scrollTop = body.scrollHeight;
  }

  function escHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function navTo(id, label) {
    insertBeforeInput(`<span class="t-dim">→ navigating to ${label}/</span>`);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 400);
  }

  function runCmd(cmd) {
    const c = cmd.toLowerCase().trim();

    /* support: cd <section> */
    if (c.startsWith('cd ')) {
      const target = c.slice(3).trim().replace(/\/$/, '');
      const navMap = { about: 'about', projects: 'projects', skills: 'skills',
        experience: 'experience', achievements: 'achievements', contact: 'contact' };
      if (navMap[target]) {
        insertBeforeInput('');
        navTo(navMap[target], target);
        insertBeforeInput('');
      } else {
        insertBeforeInput('');
        insertBeforeInput(`<span style="color:#ff5f57">cd: ${escHtml(target)}: No such directory</span>`);
        insertBeforeInput('');
      }
      body.scrollTop = body.scrollHeight;
      return;
    }

    if (c === 'clear') {
      body.querySelectorAll('.terminal-line:not(.terminal-input-line)').forEach(el => el.remove());
      return;
    }

    insertBeforeInput(''); /* blank line after echo */

    switch (c) {
      case 'help':
        [
          `<span class="t-amber">Available commands:</span>`,
          ``,
          `  <span class="t-green-b">about</span>        <span class="t-dim">→ Who I am</span>`,
          `  <span class="t-green-b">whoami</span>       <span class="t-dim">→ Quick identity</span>`,
          `  <span class="t-green-b">ls</span>           <span class="t-dim">→ List sections</span>`,
          `  <span class="t-green-b">projects</span>     <span class="t-dim">→ Things I've built</span>`,
          `  <span class="t-green-b">skills</span>       <span class="t-dim">→ Technologies I work with</span>`,
          `  <span class="t-green-b">experience</span>   <span class="t-dim">→ My journey</span>`,
          `  <span class="t-green-b">achievements</span> <span class="t-dim">→ Competitive programming & more</span>`,
          `  <span class="t-green-b">contact</span>      <span class="t-dim">→ Get in touch</span>`,
          `  <span class="t-green-b">resume</span>       <span class="t-dim">→ Open resume.pdf</span>`,
          `  <span class="t-green-b">clear</span>        <span class="t-dim">→ Clear terminal</span>`,
          ``,
        ].forEach(l => insertBeforeInput(l));
        break;

      case 'whoami':
        insertBeforeInput(`<span class="t-green-b">Mohamed Ezz</span> <span class="t-dim">— Software Engineer</span>`);
        insertBeforeInput(`<span class="t-dim">3× ECPC Finalist · ICPC Mentor · Backend Developer</span>`);
        insertBeforeInput('');
        break;

      case 'about':
        BOX_LINES.forEach(({html, cls}) => insertBeforeInput(html, cls));
        insertBeforeInput('');
        break;

      case 'ls':
        LS_LINES.forEach(l => insertBeforeInput(l));
        insertBeforeInput('');
        break;

      case 'projects':
        navTo('projects', 'projects');
        insertBeforeInput('');
        break;

      case 'skills':
        navTo('skills', 'skills');
        insertBeforeInput('');
        break;

      case 'experience':
        navTo('experience', 'experience');
        insertBeforeInput('');
        break;

      case 'achievements':
        navTo('achievements', 'achievements');
        insertBeforeInput('');
        break;

      case 'contact':
        navTo('contact', 'contact');
        insertBeforeInput('');
        break;

      case 'resume':
        insertBeforeInput(`<span class="t-dim">→ opening resume.pdf</span>`);
        insertBeforeInput('');
        setTimeout(() => window.open('resume.pdf', '_blank'), 400);
        break;

      default:
        insertBeforeInput(
          `<span style="color:#ff5f57">command not found:</span> <span class="t-dim">${escHtml(c)}</span>` +
          `  <span class="t-dim">— type</span> <span class="t-green-b">help</span> <span class="t-dim">for available commands</span>`
        );
        insertBeforeInput('');
    }

    body.scrollTop = body.scrollHeight;
  }

  animate();
})();


/* ============================================================
   INTERSECTION OBSERVER — section / element reveals
   ============================================================ */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  els.forEach(el => obs.observe(el));

  // Achievements — staggered, slide in from left
  const achvLines   = document.querySelectorAll('.achv-line');
  const achvSection = document.getElementById('achievements');

  if (achvSection && achvLines.length) {
    const achvObs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        achvLines.forEach((line, i) =>
          setTimeout(() => line.classList.add('visible'), i * 90)
        );
        achvObs.disconnect();
      }
    }, { threshold: 0.15 });
    achvObs.observe(achvSection);
  }
})();

/* ============================================================
   CONTACT FORM — validation + submission
   ============================================================ */
(function initForm() {
  const form   = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form) return;

  const fields = {
    name:    { el: form.querySelector('#form-name'),    err: form.querySelector('#err-name') },
    email:   { el: form.querySelector('#form-email'),   err: form.querySelector('#err-email') },
    message: { el: form.querySelector('#form-message'), err: form.querySelector('#err-message') },
  };

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  /* --- helpers --- */
  function setError(key, msg) {
    fields[key].el.classList.add('error');
    fields[key].err.textContent = msg;
  }

  function clearError(key) {
    fields[key].el.classList.remove('error');
    fields[key].err.textContent = '';
  }

  function clearStatus() {
    if (status) { status.textContent = ''; status.style.color = ''; }
  }

  /* --- real-time: clear error as user types --- */
  Object.keys(fields).forEach(key => {
    fields[key].el.addEventListener('input', () => {
      clearError(key);
      clearStatus();
    });
  });

  /* --- validate all fields, return true if clean --- */
  function validate() {
    let ok = true;

    // Name
    const name = fields.name.el.value.trim();
    if (!name) {
      setError('name', 'error: name is required');
      ok = false;
    } else if (name.length < 2) {
      setError('name', 'error: name must be at least 2 characters');
      ok = false;
    }

    // Email
    const email = fields.email.el.value.trim();
    if (!email) {
      setError('email', 'error: email is required');
      ok = false;
    } else if (!EMAIL_RE.test(email)) {
      setError('email', 'error: invalid email address');
      ok = false;
    }

    // Message
    const msg = fields.message.el.value.trim();
    if (!msg) {
      setError('message', 'error: message is required');
      ok = false;
    } else if (msg.length < 10) {
      setError('message', `error: message too short (${msg.length}/10 chars)`);
      ok = false;
    }

    return ok;
  }

  /* --- submit --- */
  form.addEventListener('submit', async e => {
    e.preventDefault();
    clearStatus();

    if (!validate()) {
      // Focus the first field with an error
      const firstErr = Object.values(fields).find(f => f.el.classList.contains('error'));
      if (firstErr) firstErr.el.focus();
      return;
    }

    const btn  = form.querySelector('[type="submit"]');
    const orig = btn.innerHTML;
    btn.innerHTML = '<span>$ sending...</span>';
    btn.disabled  = true;

    try {
      const res = await fetch('https://formspree.io/f/xdeodojd', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form),
      });
      if (!res.ok) throw new Error('send failed');

      if (status) status.textContent = '✓ Message sent — I will respond shortly.';
      form.reset();
      Object.keys(fields).forEach(k => clearError(k));
    } catch(err) {
      if (status) {
        status.style.color = '#ff5f57';
        status.textContent = err.message || 'error: send failed — email me directly at 7mohamedezz@gmail.com';
      }
    } finally {
      btn.innerHTML = orig;
      btn.disabled  = false;
    }
  });
})();

/* ============================================================
   SMOOTH SCROLL (anchor links)
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ============================================================
   HERO "next" BUTTON
   ============================================================ */
const heroNext = document.getElementById('hero-next');
if (heroNext) {
  const handler = () => {
    const about = document.getElementById('about');
    if (about) about.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  heroNext.addEventListener('click', handler);
  heroNext.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') handler(); });
}

/* ============================================================
   LIGHT MODE EASTER EGG
   ============================================================ */
(function initLightModeEgg() {
  const btn      = document.getElementById('lm-btn');
  const toast    = document.getElementById('lm-toast');
  const toastMsg = document.getElementById('lm-toast-msg');
  const closeBtn = document.getElementById('lm-toast-close');
  if (!btn || !toast || !toastMsg) return;

  const MESSAGES = [
    "You're a developer. You'll adapt.",
    "Works on my machine. My machine is dark.",
    "I closed that issue as 'wontfix'.",
    "The sun is a single point of failure.",
    "That's a v2 problem. There is no v2.",
    "Add it yourself. PRs welcome. (They're not.)",
    "Dark mode is the default. The default is correct.",
    "Bold of you to assume I take feature requests.",
    "Ask again at 3am. That's when I ship.",
    "TODO: Implement Light Mode. (Last modified: 4 years ago)",
    "That's out of scope for this sprint. And all future sprints.",
    "Your request has been added to the backlog. It's at the absolute bottom.",
    "Blocked by Jira ticket NEVER-DO-101.",
    "I'll build light mode right after I finish writing the unit tests.",
    "It's not a bug. It's an undocumented lifestyle choice.",
    "Feature deprecated. Reason: My eyes hurt.",
    "Error 404: Developer motivation not found.",
    "Light mode requires a premium subscription. I haven't built the billing system yet.",
  ];

  let currentIndex = 0;
  let hideTimer    = null;

  function pick() {
    const msg = MESSAGES[currentIndex];
    currentIndex = (currentIndex + 1) % MESSAGES.length;
    return msg;
  }

  function show() {
    toastMsg.textContent = pick();
    toast.classList.add('show');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hide, 4000);
  }

  function hide() {
    toast.classList.remove('show');
    clearTimeout(hideTimer);
  }

  btn.addEventListener('click', show);
  if (closeBtn) closeBtn.addEventListener('click', hide);
})();

