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
   HERO TERMINAL TYPEWRITER
   ============================================================ */
(function initHeroTerminal() {
  const body = document.getElementById('hero-terminal-body');
  if (!body) return;

  // Delays (ms)
  const CHAR_SPEED    = 52;   // typing speed per character
  const CHAR_JITTER   = 22;   // random jitter added
  const LINE_DELAY    = 55;   // delay between instant lines
  const POST_CMD_WAIT = 280;  // pause after typing a command
  const EXEC_WAIT     = 440;  // pause before showing script output

  function wait(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  // Append a line instantly with HTML content
  function addLine(html) {
    const div = document.createElement('div');
    div.className = 'terminal-line';
    div.innerHTML = html;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
  }

  // Type a command character by character after the prompt HTML
  function typeCmd(promptHtml, cmdText) {
    return new Promise(resolve => {
      const div = document.createElement('div');
      div.className = 'terminal-line';
      div.innerHTML = promptHtml;
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

  const PROMPT_HTML =
    `<span class="t-prompt">user@portfolio</span>` +
    `<span class="t-dim">:</span>` +
    `<span class="t-path">~/portfolio</span>` +
    `<span class="t-dim">$</span>&nbsp;`;

  async function run() {
    await wait(550);

    // > cat intro.sh
    await typeCmd(PROMPT_HTML, 'cat intro.sh');
    await wait(POST_CMD_WAIT);

    // File contents appear line by line
    const fileLines = [
      `<span class="t-comment">#!/bin/bash</span>`,
      `<span class="t-comment"># Portfolio — Mohamed Ezz</span>`,
      ``,
      `<span class="t-builtin">NAME</span><span class="t-dim">="</span><span class="t-string">Mohamed Ezz</span><span class="t-dim">"</span>`,
      `<span class="t-builtin">ROLE</span><span class="t-dim">="</span><span class="t-string">Software Engineer</span><span class="t-dim">"</span>`,
      `<span class="t-builtin">STACK</span><span class="t-dim">="</span><span class="t-string">.NET · Node.js · Backend</span><span class="t-dim">"</span>`,
      ``,
      `<span class="t-builtin">echo</span> <span class="t-dim">"</span><span class="t-string">Hi, I'm <span class="t-var">$NAME</span></span><span class="t-dim">"</span>`,
      `<span class="t-builtin">echo</span> <span class="t-dim">"</span><span class="t-string"><span class="t-var">$ROLE</span> | <span class="t-var">$STACK</span></span><span class="t-dim">"</span>`,
    ];

    for (const line of fileLines) {
      addLine(line);
      await wait(LINE_DELAY);
    }

    await wait(320);

    // > ./intro.sh
    addLine('');
    await typeCmd(PROMPT_HTML, './intro.sh');
    await wait(EXEC_WAIT);

    // Script output
    addLine('');
    addLine(
      `<span class="t-output" style="color:var(--green);font-size:14px;letter-spacing:-0.01em">Hi, I'm Mohamed Ezz</span>`
    );
    await wait(80);
    addLine(
      `<span class="t-output" style="color:var(--text)">Software Engineer | .NET · Node.js · Backend</span>`
    );
    await wait(80);
    addLine('');

    await wait(480);

    // Final prompt with blinking cursor
    const finalLine = document.createElement('div');
    finalLine.className = 'terminal-line';
    finalLine.innerHTML = PROMPT_HTML;
    const cur = document.createElement('span');
    cur.className = 'cursor-block';
    finalLine.appendChild(cur);
    body.appendChild(finalLine);
    body.scrollTop = body.scrollHeight;
  }

  run();
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

