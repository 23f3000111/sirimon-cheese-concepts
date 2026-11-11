/* Sirimon Cheese, concept B: Lively. Page-specific motion and content. */
(function () {
  var SC = window.SC, $ = SC.$, $$ = SC.$$, esc = SC.esc;
  var g = window.gsap;

  function lum(hex) {
    var c = hex.replace('#', ''), rgb = [0, 2, 4].map(function (i) { var v = parseInt(c.substr(i, 2), 16) / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  }
  function fgFor(hex) { return lum(hex) > 0.28 ? '#1E1020' : '#FFF5E6'; }

  /* ---------- Hero: Sirim(skillet)n, packs that float and follow the pointer ---------- */
  function hero() {
    if (!SC.fx.on) return;
    var ROT = [-12, 7, -8, 11, 9, -10];
    $$('.hero__pk').forEach(function (p, i) { g.set(p, { rotation: ROT[i] }); });
    var tl = g.timeline({ delay: 0.15 });
    tl.from('[data-hero-l]', { yPercent: 70, autoAlpha: 0, duration: 1.2, ease: 'expo.out', stagger: 0.12 })
      .from('[data-hero-o]', { scale: 0, rotation: -140, duration: 1.4, ease: 'back.out(1.5)' }, 0.1)
      .from('.hero__pk', { y: function () { return g.utils.random(-260, -140); }, rotation: function (i) { return ROT[i] + g.utils.random(-50, 50); }, autoAlpha: 0, duration: 1.3, ease: 'back.out(1.3)', stagger: 0.07 }, 0.25)
      .from('[data-hero-in]', { y: 30, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: 0.1 }, 0.55)
      .from('.hero__sticker', { scale: 0, rotation: 90, duration: 1, ease: 'back.out(2)' }, 0.8);
    $$('.hero__pk').forEach(function (p, i) {
      g.to(p, { y: '+=' + (12 + i * 3), rotation: '+=' + (i % 2 ? 4 : -4), duration: 2.6 + i * 0.3, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.6 });
    });
    if (!matchMedia('(hover: none)').matches) {
      var packs = $$('.hero__pk').map(function (p) { return { el: p, d: +p.getAttribute('data-depth'), x: g.quickTo(p, 'x', { duration: 1, ease: 'power3' }) }; });
      $('.hero').addEventListener('pointermove', function (e) {
        var cx = (e.clientX / innerWidth - 0.5) * 2;
        packs.forEach(function (p) { p.x(cx * 26 * p.d); });
      });
    }
    g.to('.hero__word', { yPercent: 18, scale: 0.92, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    g.to('.hero__packs', { yPercent: -22, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    g.to('[data-hero-o] video', { rotation: 360, duration: 40, ease: 'none', repeat: -1 });
  }

  /* ---------- The flavour dial ---------- */
  var DIAL = ['everyday', 'mozzarella', 'cheddar', 'paneer', 'halloumi', 'feta', 'gouda', 'labneh'];
  function dial() {
    var sec = $('[data-dial-sec]'), wheel = $('[data-dial]'), face = $('[data-dial-face]'), knob = $('[data-dial-knob]'), card = $('[data-dial-card]');
    var n = DIAL.length, STEP = 360 / n, angle = 0, current = -1;
    var svg = '<g class="face-rot">' + '<circle class="rim" cx="200" cy="200" r="190"/>';
    for (var t = 0; t < 72; t++) {
      var big = t % 9 === 0, r1 = big ? 168 : 176;
      svg += '<line class="tick' + (big ? ' is-big' : '') + '" x1="200" y1="' + (200 - r1) + '" x2="200" y2="' + (200 - 188) + '" transform="rotate(' + (t * 5) + ' 200 200)"/>';
    }
    DIAL.forEach(function (id, i) {
      var p = SC.product(id);
      svg += '<g class="lblg" data-i="' + i + '" transform="rotate(' + (i * STEP) + ' 200 200)"><circle class="dot" cx="200" cy="34" r="7" fill="' + p.color + '"/>' +
        '<text class="lbl" x="200" y="66" text-anchor="middle">' + esc(p.short) + '</text></g>';
    });
    face.innerHTML = svg + '</g>';
    var rot = $('.face-rot', face);
    function idx() { return ((Math.round(-angle / STEP) % n) + n) % n; }
    function setAngle(a) {
      angle = a;
      rot.setAttribute('transform', 'rotate(' + angle.toFixed(2) + ' 200 200)');
      knob.style.transform = 'rotate(' + angle.toFixed(2) + 'deg)';
      var i = idx();
      if (i !== current) show(i);
    }
    function show(i) {
      current = i;
      var p = SC.product(DIAL[i]);
      sec.style.setProperty('--dial-bg', p.color);
      sec.style.setProperty('--dial-fg', fgFor(p.color));
      wheel.setAttribute('aria-valuenow', i);
      wheel.setAttribute('aria-valuetext', p.name);
      $$('.lbl', face).forEach(function (l, k) { l.classList.toggle('is-on', k === i); });
      var packs = p.packs.filter(function (k) { return !k.out; }).slice(0, 4);
      card.style.setProperty('--c', p.color);
      card.innerHTML = '<div class="dial__photo"><img src="' + SC.img(p.img) + '" alt="' + esc(p.name) + '" width="1000" height="1250">' +
        (p.cut ? '<img class="dial__pack" src="' + SC.img(p.cut) + '" alt="The ' + esc(p.name) + ' pack" width="532" height="458">' : '') + '</div>' +
        '<div class="dial__body"><span class="dial__kind">' + esc(p.kind) + '</span><h3 class="dial__name">' + esc(p.name) + '</h3>' + SC.tasteHTML(p.taste) +
        '<div class="dial__packs">' + packs.map(function (k) { return '<button type="button" data-add="' + p.id + '|' + k.id + '">' + SC.icon('plus') + esc(k.label) + ' <em>' + SC.money(k.price) + '</em></button>'; }).join('') + '</div>' +
        '<div class="dial__acts"><button class="btn btn--pink" type="button" data-open-product="' + p.id + '">' + SC.icon('basket') + '<span>All packs and prices</span></button>' +
        '<button class="btn btn--outline" type="button" data-open-recipes>' + SC.icon('chef') + '<span>Recipes</span></button></div></div>';
      if (g && !SC.reducedMotion()) {
        g.fromTo($('.dial__photo > img', card), { rotation: -30, scale: 0.85 }, { rotation: 0, scale: 1, duration: 0.8, ease: 'back.out(1.6)' });
        g.fromTo($('.dial__body', card).children, { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: 'power3.out', stagger: 0.04 });
        var pk = $('.dial__pack', card);
        if (pk) g.fromTo(pk, { y: 40, rotation: -20, autoAlpha: 0 }, { y: 0, rotation: 9, autoAlpha: 1, duration: 0.8, ease: 'back.out(1.8)', delay: 0.1 });
      }
    }
    function snapTo(a) {
      if (!g || SC.reducedMotion()) { setAngle(a); return; }
      var o = { a: angle };
      g.to(o, { a: a, duration: 0.7, ease: 'back.out(1.6)', onUpdate: function () { setAngle(o.a); } });
    }
    function center() { var r = wheel.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }
    function ang(e, c) { return Math.atan2(e.clientY - c.y, e.clientX - c.x) * 180 / Math.PI; }
    var drag = null;
    wheel.addEventListener('pointerdown', function (e) {
      var lbl = e.target.closest('.lblg');
      var c = center();
      drag = { c: c, start: ang(e, c), from: angle, moved: false, lbl: lbl };
      wheel.setPointerCapture(e.pointerId);
      wheel.classList.add('is-drag');
    });
    wheel.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var d = ang(e, drag.c) - drag.start;
      if (d > 180) d -= 360; if (d < -180) d += 360;
      if (Math.abs(d) > 2) drag.moved = true;
      if (drag.moved) { setAngle(drag.from + d); drag.from = angle; drag.start = ang(e, drag.c); }
    });
    function end() {
      if (!drag) return;
      wheel.classList.remove('is-drag');
      if (!drag.moved && drag.lbl) {
        var i = +drag.lbl.getAttribute('data-i'), target = -i * STEP;
        while (target - angle > 180) target -= 360;
        while (target - angle < -180) target += 360;
        snapTo(target);
      } else snapTo(Math.round(angle / STEP) * STEP);
      drag = null;
    }
    wheel.addEventListener('pointerup', end);
    wheel.addEventListener('pointercancel', end);
    wheel.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); snapTo(Math.round(angle / STEP) * STEP - STEP); }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); snapTo(Math.round(angle / STEP) * STEP + STEP); }
    });
    setAngle(0);
    // a little turn when it first comes into view, so it reads as a dial
    if (SC.fx.on) window.ScrollTrigger.create({ trigger: sec, start: 'top 55%', once: true, onEnter: function () { snapTo(-STEP); } });
    SC.dialTo = function (id) { var i = DIAL.indexOf(id); if (i > -1) snapTo(-i * STEP); };
  }

  /* ---------- Pull it apart: drag scrubs the melt ---------- */
  function pull() {
    var v = $('.pull__video'), range = $('[data-pull-range]'), thumb = $('[data-pull-thumb]'), bar = $('[data-pull-bar]'), stage = $('[data-pull-stage]'), track = $('.pull__track');
    var target = 0, cur = 0, raf = 0, touched = false;
    track.classList.add('is-hint');
    function paint(p) {
      var w = track.clientWidth - thumb.offsetWidth - 12;
      thumb.style.transform = 'translateX(' + Math.round(p * w) + 'px)';
      bar.style.width = Math.round(p * 100) + '%';
      stage.textContent = p < 0.3 ? 'Warm' : p < 0.68 ? 'Gooey' : 'Stretchy!';
    }
    function tick() {
      cur += (target - cur) * 0.2;
      if (Math.abs(target - cur) < 0.002) cur = target;
      if (v.readyState >= 1 && v.duration) { try { v.currentTime = cur * (v.duration - 0.1); } catch (e) { /* seeking not ready */ } }
      paint(cur);
      raf = cur !== target ? requestAnimationFrame(tick) : 0;
    }
    function set(p) { target = Math.max(0, Math.min(1, p)); range.value = Math.round(target * 1000); if (!raf) raf = requestAnimationFrame(tick); }
    range.addEventListener('input', function () { touched = true; track.classList.remove('is-hint'); set(range.value / 1000); });
    paint(0);
    if (SC.reducedMotion()) { v.setAttribute('controls', ''); return; }
    var io = new IntersectionObserver(function (en) {
      if (!en[0].isIntersecting || touched) return;
      io.disconnect();
      var o = { p: 0 };
      if (g) g.timeline({ delay: 0.4 }).to(o, { p: 0.72, duration: 1.8, ease: 'power2.inOut', onUpdate: function () { if (!touched) set(o.p); } })
        .to(o, { p: 0.08, duration: 1.2, ease: 'power2.inOut', onUpdate: function () { if (!touched) set(o.p); } }, '+=0.5');
    }, { threshold: 0.6 });
    io.observe($('[data-pull]'));
  }

  /* ---------- Weekly munchies ---------- */
  function munchies() {
    var tabs = $('[data-munch-tabs]'), board = $('[data-munch-board]');
    var state = { id: 'halloumi', off: {}, weeks: 1 };
    tabs.innerHTML = SC.munchies.map(function (m) {
      var p = SC.product(m.product);
      return '<button type="button" role="tab" data-m="' + m.id + '" aria-selected="' + (m.id === state.id) + '" style="--c:' + p.color + '"><i></i>' + esc(m.title) + '</button>';
    }).join('');
    function render(fresh) {
      var m = SC.munchies.find(function (x) { return x.id === state.id; }), p = SC.product(m.product);
      var on = m.days.filter(function (d, i) { return !state.off[m.id + i]; });
      var used = on.reduce(function (t, d) { return t + d[2]; }, 0);
      var buy = m.buy.map(function (b) { var k = p.packs.find(function (x) { return x.id === b[0]; }); return { k: k, n: b[1] * state.weeks }; });
      var cost = buy.reduce(function (t, b) { return t + b.k.price * b.n; }, 0);
      var meals = on.length * state.weeks;
      var C = 2 * Math.PI * 70;
      board.style.setProperty('--c', p.color);
      board.innerHTML = '<div class="week' + (fresh ? ' is-new' : '') + '">' + m.days.map(function (d, i) {
        return '<label class="day' + (i === 6 ? ' day--sun' : '') + '" style="--c:' + p.color + ';--d:' + i + ';--r:' + (i % 2 ? 3 : -3) + 'deg"><input type="checkbox" data-day="' + i + '"' + (state.off[m.id + i] ? '' : ' checked') + '>' +
          '<span class="day__d">' + d[0] + '</span><span class="day__meal">' + esc(d[1]) + '</span><span class="day__g">' + d[2] + ' g</span><span class="day__sw" aria-hidden="true"></span></label>';
      }).join('') + '</div>' +
        '<aside class="plan"><div class="plan__top"><img src="' + SC.img(buy[0].k.img) + '" alt="" width="240" height="240"><div><strong>' + esc(m.title) + '</strong><span>' + buy.map(function (b) { return b.n + ' × ' + esc(p.short + ' ' + b.k.label); }).join(' + ') + '</span></div></div>' +
        '<div class="plan__gauge"><svg viewBox="0 0 180 180" aria-hidden="true"><circle class="bg" cx="90" cy="90" r="70"/><circle class="fg" cx="90" cy="90" r="70" stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + (C * (1 - Math.min(1, used / m.grams))).toFixed(1) + '"/></svg>' +
        '<p><b>' + used + ' g</b><em>of ' + m.grams + ' g a week</em></p></div>' +
        '<dl class="plan__rows"><div><dt>Dinners</dt><dd>' + meals + '</dd></div><div><dt>Cheese cost</dt><dd>' + SC.money(cost) + '</dd></div><div><dt>Per dinner</dt><dd>' + (meals ? SC.money(cost / meals) : '–') + '</dd></div></dl>' +
        '<div class="plan__weeks"><span>Weeks to stock up</span>' + SC.stepperHTML('weeks', state.weeks, 'Weeks') + '</div>' +
        '<p class="plan__note">' + (used < m.grams ? (m.grams - used) + ' g spare. Grate it over eggs or a salad.' : 'Every gram used. Enjoy every gram.') + '</p>' +
        '<button class="btn btn--yellow" type="button" data-munch-add>' + SC.icon('basket') + '<span>Add to my cheese list</span></button></aside>';
    }
    tabs.addEventListener('click', function (e) {
      var b = e.target.closest('[data-m]');
      if (!b) return;
      state.id = b.getAttribute('data-m');
      $$('[data-m]', tabs).forEach(function (x) { x.setAttribute('aria-selected', x === b ? 'true' : 'false'); });
      render(true);
    });
    board.addEventListener('change', function (e) {
      var i = e.target.getAttribute('data-day');
      if (i === null) return;
      state.off[state.id + i] = !e.target.checked;
      render();
    });
    board.addEventListener('click', function (e) {
      var st = e.target.closest('[data-step]');
      if (st) { state.weeks = Math.max(1, Math.min(4, state.weeks + +st.getAttribute('data-step'))); render(); return; }
      if (e.target.closest('[data-munch-add]')) {
        var m = SC.munchies.find(function (x) { return x.id === state.id; }), ok = 0;
        m.buy.forEach(function (b) { if (SC.addToList(m.product, b[0], b[1] * state.weeks, true)) ok++; });
        if (ok) SC.toast(m.title + ' for ' + (state.weeks === 1 ? 'the week' : state.weeks + ' weeks') + ' is on your list', { label: 'View list', icon: 'basket', run: function () { SC.go('#order'); } });
      }
    });
    board.addEventListener('input', function (e) {
      if (!e.target.closest('.qty')) return;
      state.weeks = Math.max(1, Math.min(4, Math.round(+e.target.value || 1)));
      render();
    });
    render();
  }

  /* ---------- Stacked recipe cards ---------- */
  var STACK = [['chapati-pizzas', '#FFD23F'], ['halloumi-buns', '#FF8A1F'], ['paneer-chaat', '#19B5EA'], ['cheese-balls', '#FF6FAE'], ['feta-shakshuka', '#8ED13B']];
  function stack() {
    var box = $('[data-stack]');
    function paint() {
      box.innerHTML = STACK.map(function (s, i) {
        var r = SC.recipe(s[0]), locked = r.crew && !SC.member.isIn();
        var add = r.cheese.map(function (c) { var p = SC.product(c[0]); return { p: p, k: p.packs.find(function (x) { return x.id === c[1]; }) }; });
        var total = r.cheese.reduce(function (t, c, j) { return t + (add[j].k.price || 0) * c[2]; }, 0);
        return '<article class="scard" style="--c:' + s[1] + ';--fg:' + fgFor(s[1]) + ';--i:' + i + '">' +
          '<div class="scard__img"><img src="' + SC.img(r.img) + '" alt="' + esc(r.name) + '" width="900" height="900" loading="lazy">' + (r.crew ? '<span class="scard__lock">' + SC.icon(locked ? 'lock' : 'crown') + 'Kitchen Crew</span>' : '') + '</div>' +
          '<div class="scard__body"><span class="scard__no">N&deg; ' + (i + 1) + ' &middot; by ' + esc(r.by) + '</span><h3 class="scard__title">' + esc(r.name) + '</h3><p class="scard__intro">' + esc(r.intro) + '</p>' +
          '<div class="scard__chips">' + add.map(function (a) { return '<button type="button" class="sc-chip" data-open-product="' + a.p.id + '" style="--c:' + a.p.color + '"><i></i>' + esc(a.p.short) + ' ' + esc(a.k.label) + '</button>'; }).join('') + '</div>' +
          '<div class="scard__acts"><button class="btn btn--ink" type="button" data-open-recipe="' + r.id + '">' + SC.icon(locked ? 'lock' : 'chef') + '<span>' + (locked ? 'Join the Crew to cook it' : 'Cook it') + '</span></button>' +
          '<button class="btn btn--cream" type="button" data-recipe-add="' + r.id + '">' + SC.icon('plus') + '<span>Add the cheese · ' + SC.money(total) + '</span></button></div></div>' +
          (r.mins ? '<p class="scard__mins">' + r.mins + '<span>minutes</span></p>' : '') + '</article>';
      }).join('');
    }
    paint();
    box.addEventListener('click', function (e) {
      var b = e.target.closest('[data-recipe-add]');
      if (!b) return;
      var r = SC.recipe(b.getAttribute('data-recipe-add')), ok = 0;
      r.cheese.forEach(function (c) { if (SC.addToList(c[0], c[1], c[2], true)) ok++; });
      if (ok) SC.toast('The cheese for ' + r.name + ' is on your list', { label: 'View list', icon: 'basket', run: function () { SC.go('#order'); } });
    });
    document.addEventListener('sc:member', paint);
  }

  /* ---------- Jars and gifts ---------- */
  function jars() {
    var j = SC.product('jars'), gifts = SC.product('gifts');
    $('[data-jars]').innerHTML = j.packs.slice(0, 7).map(function (k) {
      var parts = k.label.match(/^(.*?)(\s[\d.]+\s?(g|ml))$/);
      return '<li><span><strong>' + esc(parts ? parts[1] : k.label) + '</strong><em>' + esc(parts ? parts[2].trim() : '') + '</em></span><b>' + k.price.toLocaleString('en-GB') + '</b>' +
        '<button type="button" data-add="jars|' + k.id + '" aria-label="Add ' + esc(k.label) + '">' + SC.icon('plus') + '</button></li>';
    }).join('');
    $('[data-gifts]').innerHTML = gifts.packs.slice(0, 2).map(function (k) {
      return '<div class="gift"><img src="' + SC.img(k.img) + '" alt="" width="480" height="480" loading="lazy"><div><strong>' + esc(k.label) + '</strong><span>' + SC.money(k.price) + ' · new in</span></div>' +
        '<button type="button" data-add="gifts|' + k.id + '" aria-label="Add ' + esc(k.label) + '">' + SC.icon('plus') + '</button></div>';
    }).join('');
  }

  /* ---------- The Kitchen Crew ---------- */
  function crew() {
    var title = $('[data-crew-title]'), lead = $('[data-crew-lead]'), btns = $('[data-crew-btns]'), wrap = $('[data-crew-cardwrap]'), deals = $('[data-deals]');
    var first = true;
    function paint() {
      var me = SC.member.current();
      if (!first) title.textContent = me ? 'Hi ' + me.name + ', you’re in.' : 'Join our kitchen crew.';
      lead.textContent = me ? (SC.member.birthdayMonth(me) ? 'Happy birthday month! A free 250 g Halloumi is waiting on your next order, and your Crew prices are on everywhere.' : 'Your Crew prices are on everywhere: the cheese list, the recipes and the chat.')
        : 'Simple, crowd-pleasing recipes, exclusive specials and serious cheese-loving perks. Free to join.';
      btns.innerHTML = me ? '<button class="btn btn--yellow" type="button" data-crew>' + SC.icon('crown') + '<span>Open my Kitchen Crew</span></button><a class="btn btn--outline" href="#order">Shop with Crew prices</a>'
        : '<button class="btn btn--yellow" type="button" data-crew="join">' + SC.icon('sparkle') + '<span>Join free</span></button><button class="btn btn--outline" type="button" data-crew="login">Log in</button><p class="crew__demo">Try the demo member: crew@sirimon.co.ke · cheese</p>';
      var acc = me || { name: 'Your name here', points: 50, no: 0, joined: new Date().toISOString().slice(0, 10), demo: true };
      wrap.innerHTML = SC.crew.cardHTML(acc);
      SC.tilt($$('.crew-card', wrap), 14);
      deals.innerHTML = SC.crew.dealsHTML();
      first = false;
    }
    paint();
    if (SC.member.isIn()) title.textContent = 'Hi ' + SC.member.current().name + ', you’re in.';
    document.addEventListener('sc:member', paint);
  }

  /* ---------- Pop-ups, the studio, reviews, newsletter ---------- */
  var STAMPS = { '#8FB39B': '#A9CDB4', '#F7D4B0': '#F9DCBF', '#C9A3A3': '#E3BFBF' };
  function popups() {
    var evs = SC.upcomingEvents(), rail = $('[data-pops]'), next = $('[data-next-pop]');
    rail.innerHTML = evs.map(function (e, i) {
      var a = new Date(e.start + 'T12:00:00'), b = new Date(e.end + 'T12:00:00'), d = SC.daysUntil(e.start);
      var days = e.start === e.end ? a.getDate() : a.getDate() + '–' + b.getDate();
      return '<article class="stamp" style="--c:' + (STAMPS[e.color] || e.color) + '">' + (i === 0 ? '<span class="stamp__soon">' + (d <= 0 ? 'On now' : 'In ' + d + (d === 1 ? ' day' : ' days')) + '</span>' : '') +
        '<p class="stamp__date">' + days + ' ' + b.toLocaleDateString('en-GB', { month: 'short' }) + '</p><h3 class="stamp__name">' + esc(e.name) + '</h3><p class="stamp__note">' + esc(e.note) + '</p>' +
        '<p class="stamp__where">' + esc(e.place) + '<span>' + esc(e.city) + (e.hours ? ' · ' + esc(e.hours) : '') + '</span></p>' +
        (e.collect ? '<button class="btn btn--ink" type="button" data-pick="' + e.id + '">Pick up here</button>' : '<a class="btn btn--ink" href="https://www.instagram.com/sirimoncheese/" target="_blank" rel="noopener">See you in Arusha</a>') +
        '<img class="stamp__badge" src="' + SC.img('logo/badge-sm.webp') + '" alt="" width="200" height="163"></article>';
    }).join('');
    var nx = evs[0];
    if (nx) {
      var d = SC.daysUntil(nx.start);
      next.innerHTML = '<span>Next pop-up</span><b>' + (d <= 0 ? 'Now' : d) + '</b><span>' + (d <= 0 ? esc(nx.name) : (d === 1 ? 'day' : 'days') + ' to go') + '</span>';
    } else next.hidden = true;
    rail.addEventListener('click', function (e) {
      var b = e.target.closest('[data-pick]');
      if (!b) return;
      if (SC.desk) SC.desk.market(b.getAttribute('data-pick'));
      SC.go('#order');
      SC.toast('Pick-up at ' + SC.events.find(function (x) { return x.id === b.getAttribute('data-pick'); }).name + ' is set. Fill your list.', { icon: 'tent' });
    });
    var st = SC.openState(), os = $('[data-open-state]');
    os.className = 'studio__open' + (st.open ? ' is-open' : '');
    os.innerHTML = '<i></i><span>' + st.label + ' · ' + esc(st.sub) + '</span>';
    $('[data-reviews]').innerHTML = SC.reviews.map(function (r, i) {
      return '<blockquote class="quote" data-reveal="up" data-delay="' + (i * 0.08) + '"><p>“' + esc(r.text) + '”</p><strong>' + esc(r.name) + '</strong><span>' + esc(r.meta) + '</span></blockquote>';
    }).join('');
    var news = $('[data-news]');
    news.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = SC.rules.emailReq(news.elements.email.value);
      SC.setError(news.elements.email, ok === true ? '' : ok);
      if (ok !== true) { news.elements.email.focus(); return; }
      var all = SC.store.get('sc-news', []);
      all.push({ email: news.elements.email.value.trim(), at: new Date().toISOString() });
      SC.store.set('sc-news', all);
      news.reset();
      SC.toast('You’re on The Cheese Spread. Welcome to the kitchen crew!', { icon: 'mail' });
    });
  }

  /* ---------- Start ---------- */
  function start() {
    SC.smoothScroll();
    SC.headerScroll($('#hd'));
    SC.bindListCount();
    munchies();
    stack();
    jars();
    crew();
    popups();
    SC.desk = SC.orderDesk($('[data-desk]'), { viz: 'fridge' });
    SC.chat.init({ teaser: 'Habari! 👋 Want the price of halloumi, or delivery to your area? Just ask.' });
    SC.fx.init();
    hero();
    dial();
    pull();
    SC.autoVideos(document);
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  }
  var go = function () { if (document.fonts && document.fonts.load) Promise.all([document.fonts.load('700 100px "Clash Display"'), document.fonts.load('500 16px Satoshi')]).then(start, start); else start(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
})();
