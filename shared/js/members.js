/* The Kitchen Crew: Sirimon's members' club. Sign up, log in, member deals that price the cheese list,
   points and tiers, a birthday treat, members-only recipes and a market pass.
   GitHub Pages has no server, so accounts live in this browser (localStorage). A demo account is ready:
   crew@sirimon.co.ke / cheese. Passwords are hashed before they are stored, but this is a mockup, not security. */
(function () {
  var SC = window.SC, $ = SC.$, $$ = SC.$$, esc = SC.esc;
  var KEY_ACC = 'sc-crew-accounts', KEY_ME = 'sc-crew';
  var DEMO = { email: 'crew@sirimon.co.ke', pass: 'cheese' };
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  function hash(s) { var h = 5381; for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0; return 'h' + h.toString(36); }
  function accounts() {
    var a = SC.store.get(KEY_ACC, {});
    if (!a[DEMO.email]) {
      a[DEMO.email] = { name: 'Wanjiru', last: 'Demo', email: DEMO.email, phone: '0712 345 678', pass: hash(DEMO.pass), birthMonth: new Date().getMonth() + 1,
        fav: 'halloumi', joined: '2025-03-14', points: 1180, no: 42, news: true, demo: true };
      SC.store.set(KEY_ACC, a);
    }
    return a;
  }
  function saveAcc(acc) { var a = accounts(); a[acc.email] = acc; SC.store.set(KEY_ACC, a); }
  function emit() { document.dispatchEvent(new CustomEvent('sc:member', { detail: SC.member.current() })); document.dispatchEvent(new CustomEvent('sc:list')); }

  SC.member = {
    current: function () {
      var me = SC.store.get(KEY_ME, null);
      if (!me) return null;
      return accounts()[me.email] || null;
    },
    isIn: function () { return !!this.current(); },
    login: function (email, pass) {
      var acc = accounts()[String(email).trim().toLowerCase()];
      if (!acc || acc.pass !== hash(pass)) return false;
      SC.store.set(KEY_ME, { email: acc.email });
      emit();
      return acc;
    },
    join: function (d) {
      var a = accounts(), email = d.email.trim().toLowerCase();
      if (a[email]) return { error: 'That email is already in the Crew. Log in instead.' };
      var no = Object.keys(a).reduce(function (m, k) { return Math.max(m, a[k].no || 0); }, 100) + 1;
      var acc = { name: d.name.trim().split(' ')[0], last: d.name.trim().split(' ').slice(1).join(' '), email: email, phone: d.phone || '', pass: hash(d.pass),
        birthMonth: +d.birthMonth || 0, fav: d.fav || '', joined: new Date().toISOString().slice(0, 10), points: 50, no: no, news: !!d.news };
      saveAcc(acc);
      SC.store.set(KEY_ME, { email: email });
      emit();
      return { acc: acc };
    },
    logout: function () { SC.store.set(KEY_ME, null); emit(); },
    tier: function (points) {
      var t = SC.tiers[0];
      SC.tiers.forEach(function (x) { if (points >= x.from) t = x; });
      var next = SC.tiers[SC.tiers.indexOf(t) + 1] || null;
      return { tier: t, next: next, toNext: next ? next.from - points : 0, pct: next ? (points - t.from) / (next.from - t.from) : 1 };
    },
    birthdayMonth: function (acc) { acc = acc || this.current(); return !!acc && acc.birthMonth === new Date().getMonth() + 1; },
    /* members get free delivery from KES 2,500 in zones A to C */
    dropFor: function (zone) {
      if (!this.isIn()) return null;
      var d = SC.deals.find(function (x) { return x.kind === 'delivery'; });
      return d && d.zones.indexOf(zone) > -1 ? d.min : null;
    },
    earn: function (amount) {
      var acc = this.current();
      if (!acc) return 0;
      var pts = Math.floor(amount / 100);
      acc.points = (acc.points || 0) + pts;
      if (this.birthdayMonth(acc)) acc.birthdayUsed = new Date().getFullYear();
      saveAcc(acc);
      emit();
      return pts;
    }
  };

  /* Best member saving on one line (deals do not stack on the same pack) */
  function lineDeal(l) {
    var best = null;
    SC.deals.forEach(function (d) {
      var ok = false;
      if (d.kind === 'pct') ok = (d.keys && d.keys.indexOf(l.key) > -1) || (d.products && d.products.indexOf(l.product.id) > -1);
      if (d.kind === 'bundle') ok = d.products.indexOf(l.product.id) > -1 && l.qty >= d.min;
      if (ok && (!best || d.pct > best.pct)) best = d;
    });
    return best;
  }

  /* Price the list. Guests see what the Crew would save; members get it. */
  SC.pricing = function (lines) {
    lines = lines || SC.list.lines();
    var member = SC.member.current();
    var subtotal = 0, saving = 0, items = [], gifts = [];
    lines.forEach(function (l) {
      subtotal += l.sum;
      var d = lineDeal(l), cut = d ? Math.round(l.sum * d.pct / 100) : 0;
      items.push({ key: l.key, deal: d, cut: cut });
      saving += cut;
    });
    var giftDeals = SC.deals.filter(function (d) { return d.kind === 'gift'; });
    giftDeals.forEach(function (d) {
      var pk = SC.packOf(d.gift), p = SC.product(d.gift.split('|')[0]);
      var on = d.when === 'birthday' ? (member ? SC.member.birthdayMonth(member) && member.birthdayUsed !== new Date().getFullYear() : false)
        : lines.some(function (l) { return l.product.id === 'gifts'; });
      if (on && pk) gifts.push({ deal: d, key: d.gift, label: p.name + ', ' + pk.label, value: pk.price });
    });
    return {
      member: member, subtotal: subtotal,
      saving: member ? saving : 0, could: member ? 0 : saving,
      items: items, gifts: member ? gifts : [], couldGifts: member ? [] : gifts,
      basket: subtotal - (member ? saving : 0)
    };
  };
  SC.lineDeal = lineDeal;

  /* ---------- The Crew pop-ups ---------- */
  var BENEFITS = [
    ['percent', 'Members’ prices', '10% off Everyday, Mozzarella and every cheddar, applied to your list'],
    ['truck', 'Free delivery sooner', 'From KES 2,500 in Nairobi zones A to C'],
    ['cake', 'A birthday Halloumi', 'Free 250 g Halloumi in your birthday month'],
    ['chef', 'Members’ recipes', 'Kitchen Crew favourites, unlocked'],
    ['ticket', 'Double points at markets', 'Show your card at the Sirimon stand'],
    ['tree', 'Your forest', 'See how much of Kabage Forest your cheese has planted']
  ];

  function authHTML(tab) {
    return '<div class="crew-auth">' +
      '<aside class="crew-auth__side"><img class="crew-auth__img" src="' + SC.img('food/grazing.webp') + '" alt="">' +
      '<div class="crew-auth__copy"><p class="crew-kicker">' + SC.icon('chef') + 'The Kitchen Crew</p>' +
      '<h2>Join our kitchen crew.</h2><p>Simple, crowd-pleasing recipes, exclusive specials and serious cheese-loving perks. Free to join.</p>' +
      '<ul class="crew-auth__perks">' + BENEFITS.slice(0, 4).map(function (b) { return '<li>' + SC.icon(b[0]) + '<span><strong>' + b[1] + '</strong>' + b[2] + '</span></li>'; }).join('') + '</ul></div></aside>' +
      '<div class="crew-auth__main">' +
      '<div class="crew-tabs" role="tablist"><button type="button" role="tab" data-tab="login" aria-selected="' + (tab === 'login') + '">Log in</button>' +
      '<button type="button" role="tab" data-tab="join" aria-selected="' + (tab !== 'login') + '">Join free</button></div>' +
      '<form class="crew-form" data-form="login" novalidate' + (tab === 'login' ? '' : ' hidden') + '>' +
      '<h3>Welcome back</h3>' +
      '<div class="field"><label for="cr-email">Email</label><input id="cr-email" name="email" type="email" autocomplete="email" placeholder="you@example.com"></div>' +
      '<div class="field"><label for="cr-pass">Password</label><input id="cr-pass" name="pass" type="password" autocomplete="current-password"></div>' +
      '<p class="crew-form__err" role="alert"></p>' +
      '<button class="btn btn--primary crew-form__go" type="submit">' + SC.icon('unlock') + '<span>Log in</span></button>' +
      '<button class="crew-demo" type="button" data-demo>' + SC.icon('sparkle') + '<span>Try the demo member: <strong>crew@sirimon.co.ke</strong> · cheese</span></button>' +
      '</form>' +
      '<form class="crew-form" data-form="join" novalidate' + (tab === 'login' ? ' hidden' : '') + '>' +
      '<h3>Join the Crew</h3>' +
      '<div class="crew-form__grid">' +
      '<div class="field"><label for="cj-name">Your name *</label><input id="cj-name" name="name" autocomplete="name"></div>' +
      '<div class="field"><label for="cj-email">Email *</label><input id="cj-email" name="email" type="email" autocomplete="email"></div>' +
      '<div class="field"><label for="cj-phone">Phone (WhatsApp)</label><input id="cj-phone" name="phone" type="tel" autocomplete="tel" placeholder="0712 345 678"></div>' +
      '<div class="field"><label for="cj-pass">Password *</label><input id="cj-pass" name="pass" type="password" autocomplete="new-password" placeholder="6 characters or more"></div>' +
      '<div class="field"><label for="cj-bm">Birthday month</label><select id="cj-bm" name="birthMonth">' + SC.optionsHTML(MONTHS.map(function (m, i) { return { value: i + 1, label: m }; }), 'For your birthday Halloumi') + '</select></div>' +
      '<div class="field"><label for="cj-fav">Favourite cheese</label><select id="cj-fav" name="fav">' + SC.optionsHTML(SC.products.filter(function (p) { return p.cheese; }).map(function (p) { return { value: p.id, label: p.name }; }), 'Pick one') + '</select></div>' +
      '<div class="field field--full"><label class="check"><input type="checkbox" name="news" checked><span>Send me The Cheese Spread, Sirimon’s newsletter</span></label></div>' +
      '</div>' +
      '<button class="btn btn--primary crew-form__go" type="submit">' + SC.icon('sparkle') + '<span>Join the Kitchen Crew</span></button>' +
      '<p class="crew-form__note">' + SC.icon('info') + '<span>This preview keeps accounts in your browser only.</span></p>' +
      '</form></div></div>';
  }

  SC.crew = {
    open: function (tab, after) {
      if (SC.member.isIn()) { SC.crew.dashboard(); return; }
      SC.modal.open(authHTML(tab || 'join'), { className: 'sc-dialog--crew', label: 'The Kitchen Crew', onOpen: function (d) {
        $$('[data-tab]', d).forEach(function (b) {
          b.addEventListener('click', function () {
            var t = b.getAttribute('data-tab');
            $$('[data-tab]', d).forEach(function (x) { x.setAttribute('aria-selected', x === b ? 'true' : 'false'); });
            $$('[data-form]', d).forEach(function (f) { f.hidden = f.getAttribute('data-form') !== t; });
            var first = $('[data-form="' + t + '"] input', d);
            if (first) first.focus();
          });
        });
        var login = $('[data-form="login"]', d), join = $('[data-form="join"]', d);
        $('[data-demo]', d).addEventListener('click', function () {
          login.elements.email.value = DEMO.email;
          login.elements.pass.value = DEMO.pass;
          login.requestSubmit ? login.requestSubmit() : login.dispatchEvent(new Event('submit', { cancelable: true }));
        });
        login.addEventListener('submit', function (e) {
          e.preventDefault();
          var acc = SC.member.login(login.elements.email.value, login.elements.pass.value);
          if (!acc) { $('.crew-form__err', login).textContent = 'That email and password don’t match. Try the demo member below.'; return; }
          SC.modal.close(d);
          SC.toast('Welcome back, ' + acc.name + '. Your Crew prices are on.', { label: 'My Crew', icon: 'crown', run: SC.crew.dashboard });
          if (after) after(acc);
        });
        var rules = { name: SC.rules.name, email: SC.rules.emailReq, pass: function (v) { return v.length >= 6 || 'Use 6 characters or more.'; }, phone: function (v) { return !v.trim() || SC.rules.phone(v); } };
        var tried = false;
        SC.liveValidate(join, rules, function () { return tried; });
        join.addEventListener('submit', function (e) {
          e.preventDefault();
          tried = true;
          var bad = SC.validateForm(join, rules);
          if (bad) { bad.focus(); return; }
          var res = SC.member.join({ name: join.elements.name.value, email: join.elements.email.value, phone: join.elements.phone.value, pass: join.elements.pass.value,
            birthMonth: join.elements.birthMonth.value, fav: join.elements.fav.value, news: join.elements.news.checked });
          if (res.error) { SC.setError(join.elements.email, res.error); join.elements.email.focus(); return; }
          SC.modal.close(d);
          SC.toast('You’re in the Kitchen Crew, ' + res.acc.name + '! 50 welcome points added.', { label: 'My Crew', icon: 'crown', run: SC.crew.dashboard });
          if (after) after(res.acc);
        });
      } });
    },

    /* deal cards for any section: opts.locked shows padlocks to guests */
    dealsHTML: function (opts) {
      opts = opts || {};
      var me = SC.member.current();
      return SC.deals.map(function (d, i) {
        var live = !!me, bday = d.when === 'birthday' && me && SC.member.birthdayMonth(me);
        return '<article class="deal' + (live ? ' is-live' : ' is-locked') + (bday ? ' is-bday' : '') + '" style="--c:' + d.color + ';--i:' + i + '">' +
          '<span class="deal__icon">' + SC.icon(d.kind === 'pct' || d.kind === 'bundle' ? 'percent' : d.kind === 'delivery' ? 'truck' : d.kind === 'gift' ? (d.when === 'birthday' ? 'cake' : 'gift') : d.id === 'early' ? 'sparkle' : 'ticket') + '</span>' +
          '<h4 class="deal__title">' + esc(d.title) + '</h4><p class="deal__sub">' + esc(d.sub) + '</p>' +
          (bday ? '<p class="deal__flag">' + SC.icon('cake') + 'It’s your birthday month!</p>' : '') +
          '<footer class="deal__foot">' + (live
            ? (d.code ? '<span class="deal__code">' + SC.icon('tag') + d.code + '</span>' : '<span class="deal__code deal__code--perk">' + SC.icon('check') + 'Active</span>') +
              (d.kind === 'pct' || d.kind === 'bundle' ? '<span class="deal__auto">Applied to your list</span>' : '')
            : '<span class="deal__lock">' + SC.icon('lock') + 'Crew only</span>') + '</footer></article>';
      }).join('');
    },

    cardHTML: function (acc) {
      var t = SC.member.tier(acc.points || 0);
      return '<div class="crew-card" style="--tier:' + t.tier.color + '">' +
        '<div class="crew-card__top"><img src="' + SC.img('logo/badge-sm.webp') + '" alt="" width="200" height="163"><span>Kitchen Crew</span></div>' +
        '<p class="crew-card__name">' + esc(acc.name + (acc.last && !acc.demo ? ' ' + acc.last : '')) + '</p>' +
        '<p class="crew-card__no">No. ' + String(acc.no || 1).padStart(4, '0') + ' · since ' + new Date(acc.joined + 'T12:00:00').toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) + '</p>' +
        '<div class="crew-card__tier"><strong>' + t.tier.name + '</strong><span>' + (acc.points || 0).toLocaleString('en-GB') + ' points</span></div>' +
        '<div class="crew-card__bar"><i style="width:' + Math.round(t.pct * 100) + '%"></i></div>' +
        '<p class="crew-card__next">' + (t.next ? t.toNext.toLocaleString('en-GB') + ' points to ' + t.next.name : 'Top tier. Thank you!') + '</p></div>';
    },

    dashboard: function () {
      var acc = SC.member.current();
      if (!acc) { SC.crew.open('login'); return; }
      var orders = SC.list.history();
      var grams = orders.reduce(function (t, o) { return t + (o.grams || 0); }, 0);
      var next = SC.upcomingEvents()[0];
      var recipes = SC.recipes.filter(function (r) { return r.crew; });
      var html = '<div class="crew-dash">' +
        '<header class="crew-dash__head"><div><p class="crew-kicker">' + SC.icon('crown') + 'Your Kitchen Crew</p><h2>Hi, ' + esc(acc.name) + '.</h2>' +
        '<p>' + (SC.member.birthdayMonth(acc) ? 'Happy birthday month! A free 250 g Halloumi is waiting on your next order.' : 'Your members’ prices are switched on across the site.') + '</p></div>' +
        SC.crew.cardHTML(acc) + '</header>' +
        '<section><h3>Your deals</h3><div class="deals deals--dash">' + SC.crew.dealsHTML() + '</div></section>' +
        '<div class="crew-dash__cols">' +
        '<section class="crew-box"><h3>' + SC.icon('tree') + 'Your forest</h3><p class="crew-box__big">' + SC.money(SC.trees(grams)) + '</p><p>to Kabage Forest in the Aberdares from ' + SC.weight(grams) + ' of cheese you bought direct. KES 25 from every kilo goes to Friends of Environment Conservation Trust.</p></section>' +
        '<section class="crew-box"><h3>' + SC.icon('ticket') + 'Market pass</h3>' + (next ? '<p class="crew-box__big">' + esc(next.name) + '</p><p>' + esc(SC.eventDates(next)) + ' · ' + esc(next.place) + '. Show this pass at the Sirimon stand for double points.</p><p class="crew-pass">' + SC.icon('qr') + '<span>SC-' + String(acc.no).padStart(4, '0') + '-' + next.id.toUpperCase() + '</span></p>' : '<p>New markets are announced on Instagram.</p>') + '</section>' +
        '<section class="crew-box"><h3>' + SC.icon('repeat') + 'Your orders</h3>' + (orders.length ? '<ul class="crew-orders">' + orders.slice(-3).reverse().map(function (o) {
          return '<li><span><strong>' + o.ref + '</strong>' + new Date(o.sent).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ' · ' + SC.packs(o.total) + (o.amount ? ' · ' + SC.money(o.amount) : '') + '</span><button type="button" class="btn btn--sm btn--ghost" data-reorder="' + o.ref + '">Repeat</button></li>';
        }).join('') + '</ul>' : '<p>No orders yet. Your first one earns points straight away.</p>') + '</section>' +
        '</div>' +
        (recipes.length ? '<section><h3>Members’ recipes</h3><div class="crew-recipes">' + recipes.map(function (r) {
          return '<button type="button" class="crew-recipe" data-open-recipe="' + r.id + '"><img src="' + SC.img(r.img) + '" alt="" width="300" height="300" loading="lazy"><span>' + esc(r.name) + '<em>by ' + esc(r.by) + '</em></span></button>';
        }).join('') + '</div></section>' : '') +
        '<footer class="crew-dash__foot"><button type="button" class="btn btn--primary" data-go-order>' + SC.icon('basket') + '<span>Shop with Crew prices</span></button>' +
        '<button type="button" class="btn btn--ghost" data-logout>' + SC.icon('logout') + '<span>Log out</span></button></footer></div>';
      SC.modal.open(html, { className: 'sc-dialog--dash', label: 'Your Kitchen Crew', onOpen: function (d) {
        d.addEventListener('click', function (e) {
          if (e.target.closest('[data-logout]')) { SC.member.logout(); SC.modal.close(d); SC.toast('Logged out. See you at the table.'); }
          else if (e.target.closest('[data-go-order]')) { SC.go('#order'); }
          var re = e.target.closest('[data-reorder]');
          if (re) {
            var o = SC.list.history().find(function (x) { return x.ref === re.getAttribute('data-reorder'); });
            if (o) { var list = {}; o.lines.forEach(function (l) { list[l.key] = +l.qty || 0; }); SC.list.save(list); SC.modal.close(d); SC.toast('Order ' + o.ref + ' is back on your list', { label: 'View list', icon: 'basket', run: function () { SC.go('#order'); } }); }
          }
        });
      } });
    }
  };

  /* Any [data-crew] opens the Crew (login, join or the dashboard); [data-crew-name] shows who is in */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-crew]');
    if (!t) return;
    e.preventDefault();
    SC.crew.open(t.getAttribute('data-crew') || 'join');
  });
  function paint() {
    var me = SC.member.current();
    $$('[data-crew-label]').forEach(function (el) { el.textContent = me ? 'Hi, ' + me.name : el.getAttribute('data-crew-label'); });
    document.documentElement.classList.toggle('is-crew', !!me);
  }
  document.addEventListener('sc:member', paint);
  document.addEventListener('DOMContentLoaded', function () { accounts(); paint(); });
})();
