/* Sirimon Cheese, concept A: Editorial. Page-specific motion and content. */
(function () {
  var SC = window.SC, $ = SC.$, $$ = SC.$$, esc = SC.esc;
  var g = window.gsap;

  /* ---------- Hero: "SIRIMON" cut out of the paper, the melt playing behind it ---------- */
  var hero = { pin: $('.hero__pin'), svg: $('.hero__knock'), text: $('#knock-text'), meas: $('#knock-measure') };
  var focus = { x: 0, y: 0, scale: 40 };
  function layoutHero() {
    var w = hero.pin.clientWidth, h = hero.pin.clientHeight;
    var gutter = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--gutter')) || 40;
    hero.svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    var c = document.createElement('canvas').getContext('2d');
    c.font = '700 100px Oswald';
    var m = c.measureText('SIRIMON');
    var inkW = (m.actualBoundingBoxLeft || 0) + (m.actualBoundingBoxRight || m.width);
    var capH = m.actualBoundingBoxAscent || 72;
    var top = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hd')) + 70;
    var foot = $('.hero__foot');
    var bottom = h - (foot ? foot.offsetHeight : 120) - 70;
    var fs = 100 * (w - gutter * 2) / inkW;
    fs = Math.min(fs, 100 * (bottom - top) / capH);
    var x = (w - inkW * fs / 100) / 2 + (m.actualBoundingBoxLeft || 0) * fs / 100;
    var base = (top + bottom) / 2 + capH * fs / 100 / 2;
    [hero.text, hero.meas].forEach(function (t) { t.setAttribute('font-size', fs.toFixed(1)); t.setAttribute('x', x.toFixed(1)); t.setAttribute('y', base.toFixed(1)); });
    // fly into the first I: its stem is solid, so the screen ends up inside the hole
    var cell = null;
    try { cell = hero.meas.getExtentOfChar(1); } catch (e) { cell = null; }
    var iW = cell && cell.width ? cell.width : c.measureText('I').width * fs / 100;
    focus.x = cell && cell.width ? cell.x + cell.width / 2 : x + c.measureText('S').width * fs / 100 + iW / 2;
    focus.y = base - capH * fs / 100 / 2;
    focus.scale = Math.max(w / (iW * 0.42), h / (capH * fs / 100 * 0.62)) * 1.3;
  }

  function heroMotion() {
    if (!SC.fx.on) return;
    var tl = g.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: function () { return '+=' + Math.round(innerHeight * 1.5); }, scrub: 0.6, pin: '.hero__pin', anticipatePin: 1, invalidateOnRefresh: true } });
    tl.to('[data-hero-in]', { autoAlpha: 0, y: -24, duration: 0.18, ease: 'power1.in' }, 0)
      .to('[data-hero-hint]', { autoAlpha: 0, duration: 0.08 }, 0)
      .fromTo(hero.svg, { scale: 1 }, { scale: function () { return focus.scale; }, transformOrigin: function () { return focus.x + 'px ' + focus.y + 'px'; }, ease: 'power3.in', duration: 1 }, 0.04)
      .fromTo('[data-hero-cap]', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.16 }, 0.9);
    // the first view: letters rise in
    g.from(hero.svg, { yPercent: 6, autoAlpha: 0, duration: 1.4, ease: 'expo.out', delay: 0.1 });
    g.from('[data-hero-in]', { y: 30, autoAlpha: 0, duration: 1.2, ease: 'expo.out', stagger: 0.12, delay: 0.35 });
  }

  /* ---------- Band: a picture follows the pointer over each texture ---------- */
  function band() {
    var sec = $('.band'), peek = $('.band__peek'), img = $('img', peek);
    if (!sec || SC.reducedMotion() || matchMedia('(hover: none)').matches || !g) return;
    var xTo = g.quickTo(peek, 'x', { duration: 0.55, ease: 'power3' }), yTo = g.quickTo(peek, 'y', { duration: 0.55, ease: 'power3' });
    sec.addEventListener('pointermove', function (e) {
      var r = sec.getBoundingClientRect();
      xTo(e.clientX - r.left); yTo(e.clientY - r.top);
    });
    $$('.band__w', sec).forEach(function (w) {
      w.addEventListener('pointerenter', function () {
        img.src = SC.img(w.getAttribute('data-peek'));
        g.to(peek, { scale: 1, rotation: g.utils.random(-8, 8), duration: 0.5, ease: 'back.out(1.7)', overwrite: 'auto' });
      });
      w.addEventListener('pointerleave', function () { g.to(peek, { scale: 0, duration: 0.35, ease: 'power2.in', overwrite: 'auto' }); });
    });
  }

  /* ---------- The range list and its stage ---------- */
  function range() {
    var list = $('[data-range-list]'), items = SC.products.filter(function (p) { return p.id !== 'gifts'; });
    list.innerHTML = items.map(function (p, i) {
      var from = SC.fromPrice(p);
      return '<li><button class="range__row' + (i ? '' : ' is-on') + '" type="button" data-i="' + i + '" data-open-product="' + p.id + '" style="--c:' + p.color + '">' +
        '<span class="range__n mono">' + String(i + 1).padStart(2, '0') + '</span>' +
        '<span><span class="range__name">' + esc(p.name) + '</span><span class="range__line">' + esc(p.line) + '</span></span>' +
        '<span class="range__from">' + (from ? 'From<b>KES ' + from.toLocaleString('en-GB') + '</b>' : 'Back soon') + '</span>' +
        '<span class="range__go">' + SC.icon('up') + '</span></button></li>';
    }).join('');
    var img = $('[data-range-img]'), next = $('[data-range-next]'), tag = $('[data-range-tag]'), card = $('[data-range-card]'), pack = $('[data-range-pack]');
    var cur = -1, token = 0;
    function show(i) {
      if (i === cur) return;
      cur = i;
      var p = items[i], t = ++token;
      $$('.range__row', list).forEach(function (b) { b.classList.toggle('is-on', +b.getAttribute('data-i') === i); });
      tag.textContent = String(i + 1).padStart(2, '0') + ' / ' + p.name;
      card.style.setProperty('--c', p.color);
      card.innerHTML = '<h3>' + esc(p.short) + '</h3>' + SC.tasteHTML(p.taste);
      pack.hidden = !p.cut;
      if (p.cut) pack.src = SC.img(p.cut);
      if (!g || SC.reducedMotion()) { img.src = SC.img(p.img); return; }
      next.src = SC.img(p.img);
      g.fromTo(next, { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.12 }, { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 0.85, ease: 'expo.out', overwrite: true,
        onComplete: function () { if (t !== token) return; img.src = next.src; g.set(next, { clipPath: 'inset(100% 0% 0% 0%)' }); } });
      g.fromTo(card, { y: 14, autoAlpha: 0.4 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: 'power3.out', overwrite: true });
      if (p.cut) g.fromTo(pack, { rotation: -14, scale: 0.7 }, { rotation: 8, scale: 1, duration: 0.8, ease: 'back.out(1.8)', overwrite: true });
    }
    list.addEventListener('pointerover', function (e) { var b = e.target.closest('.range__row'); if (b) show(+b.getAttribute('data-i')); });
    list.addEventListener('focusin', function (e) { var b = e.target.closest('.range__row'); if (b) show(+b.getAttribute('data-i')); });
    show(0);
  }

  /* ---------- The melt test: a pinned reel ---------- */
  var MELT = [
    { video: 'raclette', shape: 'tall', color: '#E5157A', label: '01 · Raclette night', title: 'Everyday Cheese', quote: '“The everyday cheese is perfect for a Raclette and melts very nicely.”', cite: 'A Google review of Sirimon', add: 'everyday|500' },
    { video: 'quesadilla', shape: 'wide', color: '#E2231A', label: '02 · The quesadilla pull', title: 'Chilli Cheddar', quote: 'Your favourites with the volume turned up. Sharp, mellow heat that rises.', cite: 'Sirimon’s tasting notes', add: 'cheddar|chilli' },
    { video: 'skillet', shape: 'tall', color: '#D98E04', label: '03 · The skillet dip', title: 'Smoked Gouda', quote: 'Tastes like the smell of nyama choma. Soft smoke with a whiff of cream.', cite: 'Sirimon’s tasting notes', add: 'gouda|smoked' },
    { video: 'periperi', shape: 'tall', color: '#F28C00', label: '04 · Squeak and char', title: 'Peri Peri Halloumi', quote: 'That squeak. That char. That perfect salty-savoury-fiery bite.', cite: 'Sirimon on Facebook', add: 'halloumi|periperi' },
    { video: 'pizza', shape: 'wide', color: '#F2B705', label: '05 · Pizza night', title: 'Mozzarella', quote: 'Stretched and kneaded by hand at the studio, for that soft and springy pull.', cite: 'Sirimon’s cheese notes', add: 'mozzarella|500' }
  ];
  function melt() {
    var track = $('[data-melt-track]');
    track.innerHTML = MELT.map(function (m) {
      var parts = m.add.split('|'), p = SC.product(parts[0]), k = p.packs.find(function (x) { return x.id === parts[1]; });
      return '<article class="mc mc--' + m.shape + '" style="--c:' + m.color + '">' +
        '<video src="../shared/video/' + m.video + '.mp4" poster="../shared/video/' + m.video + '.webp" muted loop playsinline data-autoplay preload="none" aria-hidden="true"></video>' +
        '<span class="mc__label mono">' + esc(m.label) + '</span>' +
        '<div class="mc__body"><h3 class="mc__title">' + esc(m.title) + '</h3><p class="mc__quote">' + esc(m.quote) + '<cite>' + esc(m.cite) + '</cite></p>' +
        '<button class="btn" type="button" data-add="' + m.add + '">' + SC.icon('plus') + '<span>Add ' + esc(k.label) + ' · ' + SC.money(k.price) + '</span></button></div></article>';
    }).join('') + '<div class="mc__end"><p>Hungry yet?</p><a class="btn btn--primary" href="#dinner">Find tonight&rsquo;s dinner <span class="arr" aria-hidden="true">&#8599;</span></a></div>';
    SC.autoVideos(track);
    if (!SC.fx.on) return;
    var bar = $('[data-melt-bar]');
    var dist = function () { return Math.max(0, track.scrollWidth - (innerWidth - track.offsetLeft)); };
    g.to(track, { x: function () { return -dist(); }, ease: 'none',
      scrollTrigger: { trigger: '.melt', start: 'top top', end: function () { return '+=' + dist(); }, scrub: 0.8, pin: '.melt__pin', anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: function (self) { g.set(bar, { scaleX: self.progress }); } } });
  }

  /* ---------- What's for dinner tonight? ---------- */
  function dinner() {
    var tags = $('[data-dinner-tags]'), dish = $('[data-dish]'), strip = $('[data-dinner-strip]');
    var tag = 'all', current = 'chapati-pizzas';
    tags.innerHTML = SC.recipeTags.map(function (t) { return '<button type="button" data-tag="' + t.id + '" aria-pressed="' + (t.id === 'all') + '">' + esc(t.name) + '</button>'; }).join('');
    function pool() { return SC.recipes.filter(function (r) { return tag === 'all' || r.tags.indexOf(tag) > -1; }); }
    function render(id, flip) {
      var r = SC.recipe(id);
      current = id;
      var add = r.cheese.map(function (c) { var p = SC.product(c[0]); return { p: p, k: p.packs.find(function (x) { return x.id === c[1]; }), n: c[2] }; });
      var total = add.reduce(function (t, a) { return t + (a.k.price || 0) * a.n; }, 0);
      var locked = r.crew && !SC.member.isIn();
      dish.innerHTML = '<div class="dish__media"><img src="' + SC.img(r.img) + '" alt="' + esc(r.name) + '" width="900" height="900"><span class="dish__by mono">Recipe by ' + esc(r.by) + '</span>' +
        (r.crew ? '<span class="dish__lock mono">' + SC.icon(locked ? 'lock' : 'crown') + 'Kitchen Crew</span>' : '') + '</div>' +
        '<div class="dish__body"><p class="dish__meta mono">' + (r.mins ? '<span>' + SC.icon('clock') + r.mins + ' min</span>' : '') + (r.serves ? '<span>' + SC.icon('users') + 'Serves ' + esc(r.serves) + '</span>' : '') + '</p>' +
        '<h3 class="dish__title">' + esc(r.name) + '</h3><p class="dish__intro">' + esc(r.intro) + '</p>' +
        '<div class="dish__chips">' + add.map(function (a) { return '<button type="button" class="sc-chip" data-open-product="' + a.p.id + '" style="--c:' + a.p.color + '"><i></i>' + esc(a.p.short) + ' ' + esc(a.k.label) + '</button>'; }).join('') + '</div>' +
        '<div class="dish__acts"><button class="btn btn--ink" type="button" data-open-recipe="' + r.id + '">' + SC.icon(locked ? 'lock' : 'chef') + '<span>' + (locked ? 'Join the Crew to cook it' : 'Cook it') + '</span></button>' +
        '<button class="btn btn--primary" type="button" data-dish-add>' + SC.icon('plus') + '<span>Add the cheese · ' + SC.money(total) + '</span></button></div></div>';
      if (flip && !SC.reducedMotion()) { dish.classList.remove('is-flip'); void dish.offsetWidth; dish.classList.add('is-flip'); }
    }
    function shuffle() {
      var p = pool().filter(function (r) { return r.id !== current; });
      if (!p.length) p = pool();
      render(p[Math.floor(Math.random() * p.length)].id, true);
      var b = $('[data-shuffle]');
      b.classList.remove('is-rolling'); void b.offsetWidth; b.classList.add('is-rolling');
    }
    tags.addEventListener('click', function (e) {
      var b = e.target.closest('[data-tag]');
      if (!b) return;
      tag = b.getAttribute('data-tag');
      $$('[data-tag]', tags).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      shuffle();
    });
    $('[data-shuffle]').addEventListener('click', shuffle);
    dish.addEventListener('click', function (e) {
      if (!e.target.closest('[data-dish-add]')) return;
      var r = SC.recipe(current), ok = 0;
      r.cheese.forEach(function (c) { if (SC.addToList(c[0], c[1], c[2], true)) ok++; });
      if (ok) SC.toast('The cheese for ' + r.name + ' is on your list', { label: 'View list', icon: 'basket', run: function () { SC.go('#order'); } });
    });
    document.addEventListener('sc:member', function () { render(current, false); paintStrip(); });
    render(current, false);
    function paintStrip() {
      strip.innerHTML = ['cheese-balls', 'githeri', 'halloumi-buns', 'christmas-tree', 'peach-caprese', 'feta-shakshuka'].map(function (id) {
        var r = SC.recipe(id);
        return '<button type="button" class="tile" data-open-recipe="' + r.id + '"><span class="tile__img"><img src="' + SC.img(r.img) + '" alt="" width="900" height="900" loading="lazy">' +
          (r.crew ? '<i class="tile__lock">' + SC.icon(SC.member.isIn() ? 'crown' : 'lock') + '</i>' : '') + '</span><strong>' + esc(r.name) + '</strong><span class="mono">' + (r.mins ? r.mins + ' min · ' : '') + 'by ' + esc(r.by) + '</span></button>';
      }).join('');
    }
    paintStrip();
  }

  /* ---------- Meet the makers: a draggable rail ---------- */
  function makers() {
    var rail = $('[data-makers]');
    rail.innerHTML = SC.team.map(function (t) {
      return '<article class="maker"><img src="' + SC.img('team/' + t.id + '.webp') + '" alt="' + esc(t.name) + ', ' + esc(t.role) + ' at Sirimon" width="720" height="900" loading="lazy">' +
        '<div><strong>' + esc(t.name) + '</strong><span class="mono">' + esc(t.role) + (t.since ? ' · since ' + t.since : '') + '</span><span>' + esc(t.fact) + '</span></div></article>';
    }).join('');
    var down = false, sx = 0, sl = 0, moved = false;
    rail.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = rail.scrollLeft; rail.classList.add('is-drag'); });
    addEventListener('pointermove', function (e) { if (!down) return; var dx = e.clientX - sx; if (Math.abs(dx) > 4) moved = true; rail.scrollLeft = sl - dx; });
    addEventListener('pointerup', function () { if (!down) return; down = false; rail.classList.remove('is-drag'); });
    rail.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
  }

  /* ---------- Cheese for Trees: a forest that grows with the scroll ---------- */
  function forest() {
    var svg = $('[data-forest]');
    var NS = 'http://www.w3.org/2000/svg';
    var html = '<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF7D6"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient></defs>' +
      '<circle class="sun" cx="560" cy="120" r="54" fill="#FFC529"/>' +
      '<path d="M120 300 L250 120 L282 158 L300 132 L330 168 L460 300 Z" fill="#7FA3B8"/><path d="M250 120 L282 158 L268 162 L258 146 L242 160 L232 150 Z" fill="#FFFFFF"/>' +
      '<path d="M0 300 C120 250 220 262 330 282 C450 304 560 250 720 268 L720 420 L0 420 Z" fill="#5FAE3E"/>' +
      '<path d="M0 340 C140 300 260 330 380 330 C520 330 600 300 720 320 L720 420 L0 420 Z" fill="#2E8B46"/>';
    var spots = [[40, 330, 1], [92, 318, 0.8], [150, 325, 1.15], [210, 338, 0.9], [262, 330, 1.05], [318, 336, 0.85], [372, 331, 1.2], [430, 332, 0.95], [486, 326, 1.1], [540, 318, 0.8], [596, 312, 1], [652, 316, 1.15], [700, 320, 0.85],
      [70, 372, 1.3], [180, 380, 1.1], [300, 384, 1.35], [420, 386, 1.15], [540, 378, 1.3], [660, 372, 1.2]];
    spots.forEach(function (s, i) {
      var pine = i % 3 !== 1, fill = ['#1F6B3A', '#2C8A45', '#3FA34D'][i % 3];
      html += '<g class="tree" transform="translate(' + s[0] + ' ' + s[1] + ') scale(' + s[2] + ')">' +
        '<rect x="-3" y="-14" width="6" height="16" rx="2" fill="#6B4A2B"/>' +
        (pine ? '<path d="M0 -70 L18 -34 L9 -34 L22 -12 L-22 -12 L-9 -34 L-18 -34 Z" fill="' + fill + '"/>'
          : '<circle cx="0" cy="-32" r="17" fill="' + fill + '"/><circle cx="-13" cy="-22" r="12" fill="' + fill + '"/><circle cx="13" cy="-22" r="12" fill="' + fill + '"/>') + '</g>';
    });
    svg.innerHTML = html;
    if (!SC.fx.on) return;
    g.from($$('.tree', svg), { scale: 0, transformOrigin: '50% 100%', ease: 'back.out(2)', stagger: 0.06, duration: 0.6,
      scrollTrigger: { trigger: '.trees', start: 'top 75%', end: 'center 45%', scrub: 1 } });
    g.from($('.sun', svg), { y: 90, ease: 'none', scrollTrigger: { trigger: '.trees', start: 'top 85%', end: 'center 40%', scrub: 1 } });
  }
  function treesLive() {
    var el = $('[data-trees-live]');
    var paint = function () {
      var grams = SC.list.grams();
      el.innerHTML = grams ? SC.icon('tree') + '<span>Your cheese list so far: ' + SC.weight(grams) + ', which plants <strong>' + SC.money(SC.trees(grams)) + '</strong> of forest.</span>' : '';
    };
    paint();
    document.addEventListener('sc:list', paint);
  }

  /* ---------- The Kitchen Crew section ---------- */
  function crew() {
    var title = $('[data-crew-title]'), lead = $('[data-crew-lead]'), cta = $('[data-crew-cta]'), deals = $('[data-deals]');
    var first = true;
    function paint() {
      var me = SC.member.current();
      if (!first) title.textContent = me ? 'Welcome back, ' + me.name + '.' : 'Join our kitchen crew.';
      lead.textContent = me ? (SC.member.birthdayMonth(me) ? 'Happy birthday month! A free 250 g Halloumi is waiting on your next order, and your Crew prices are on across the site.' : 'Your Crew prices are on across the whole site: in the cheese list, the recipes and the chat.')
        : 'Simple, crowd-pleasing recipes, exclusive specials and serious cheese-loving perks. Free to join, and your members’ prices switch on across the whole site.';
      cta.innerHTML = me ? SC.crew.cardHTML(me) + '<button class="btn btn--light" type="button" data-crew>' + SC.icon('crown') + '<span>Open my Kitchen Crew</span></button>'
        : '<button class="btn btn--light" type="button" data-crew="join">' + SC.icon('sparkle') + '<span>Join free</span></button><button class="link-arrow link-arrow--light" type="button" data-crew="login">Log in</button>' +
          '<p class="mono crew__demo">Try it: crew@sirimon.co.ke &middot; cheese</p>';
      deals.innerHTML = SC.crew.dealsHTML();
      first = false;
    }
    paint();
    if (SC.member.isIn()) title.textContent = 'Welcome back, ' + SC.member.current().name + '.';
    document.addEventListener('sc:member', paint);
  }

  /* ---------- Markets, the studio, reviews ---------- */
  function markets() {
    var list = $('[data-markets]'), next = $('[data-next-market]');
    var evs = SC.upcomingEvents();
    var nx = evs[0];
    list.innerHTML = evs.map(function (e, i) {
      var a = new Date(e.start + 'T12:00:00'), b = new Date(e.end + 'T12:00:00');
      var days = e.start === e.end ? a.getDate() : a.getDate() + '–' + b.getDate();
      var d = SC.daysUntil(e.start);
      return '<li class="mk"><div class="mk__date"><strong>' + days + ' ' + b.toLocaleDateString('en-GB', { month: 'short' }) + '</strong><span class="mono">' + esc(SC.eventDates(e)) + '</span></div>' +
        '<div class="mk__name">' + esc(e.name) + (i === 0 && d <= 7 ? '<span class="mk__soon mono">' + (d <= 0 ? 'On now' : 'In ' + d + (d === 1 ? ' day' : ' days')) + '</span>' : '') + '<em>' + esc(e.note) + '</em></div>' +
        '<div class="mk__where"><b>' + esc(e.place) + '</b>' + esc(e.city) + (e.hours ? ' · ' + esc(e.hours) : '') + '</div>' +
        (e.collect ? '<button class="btn btn--ink" type="button" data-pick="' + e.id + '">Order ahead</button>' : '<a class="btn btn--ghost" href="https://www.instagram.com/sirimoncheese/" target="_blank" rel="noopener">Tanzania</a>') +
        '<img class="mk__poster" src="' + SC.img(e.poster) + '" alt="" width="640" height="800" loading="lazy"></li>';
    }).join('');
    if (nx) {
      var d = SC.daysUntil(nx.start);
      next.innerHTML = '<b>' + (d <= 0 ? '0' : d) + '</b><span><em>' + (d <= 0 ? 'On now' : d === 1 ? 'Day to go' : 'Days to go') + '</em>' + esc(nx.name) + '<br>' + esc(nx.place) + '</span>';
    } else next.hidden = true;
    list.addEventListener('click', function (e) {
      var b = e.target.closest('[data-pick]');
      if (!b) return;
      if (SC.desk) SC.desk.market(b.getAttribute('data-pick'));
      SC.go('#order');
      SC.toast('Pick-up at ' + SC.events.find(function (x) { return x.id === b.getAttribute('data-pick'); }).name + ' is set. Fill your list.', { icon: 'tent' });
    });
    var st = SC.openState(), os = $('[data-open-state]');
    os.className = 'visit__open' + (st.open ? ' is-open' : '');
    os.innerHTML = '<i></i><span><strong>' + st.label + '</strong> · ' + esc(st.sub) + '</span>';
    $('[data-reviews]').innerHTML = SC.reviews.map(function (r) {
      return '<blockquote class="review" data-reveal="up"><p>' + esc(r.text) + '</p><footer><strong>' + esc(r.name) + '</strong><span class="mono">' + esc(r.meta) + '</span></footer></blockquote>';
    }).join('');
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-chat-open]')) { e.preventDefault(); SC.chat.open(); }
    var way = e.target.closest('[data-way]');
    if (way && SC.desk) {
      SC.desk.goTo(1);
      SC.desk.filter(way.getAttribute('data-way'));
      SC.go('#order');
    }
  });

  /* ---------- Start ---------- */
  function start() {
    SC.smoothScroll();
    SC.headerScroll($('#hd'));
    SC.bindListCount();
    range();
    dinner();
    makers();
    crew();
    markets();
    treesLive();
    SC.desk = SC.orderDesk($('[data-desk]'), { viz: 'bar' });
    SC.chat.init({ teaser: 'Habari! 👋 What’s for dinner tonight? Ask me about cheese, prices or delivery.' });
    layoutHero();
    SC.fx.init();
    heroMotion();
    melt();
    forest();
    band();
    if (window.ScrollTrigger) { window.ScrollTrigger.sort(); window.ScrollTrigger.refresh(); }
    SC.autoVideos(document);
    var t;
    addEventListener('resize', function () { clearTimeout(t); t = setTimeout(function () { layoutHero(); if (window.ScrollTrigger) window.ScrollTrigger.refresh(); }, 150); });
  }
  var go = function () { if (document.fonts && document.fonts.load) document.fonts.load('700 100px Oswald').then(start, start); else start(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
})();
