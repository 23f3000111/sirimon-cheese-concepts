/* The cheese list: pick cheese at the shop's prices, say who it is for, choose delivery or a market,
   review and send. Kitchen Crew prices, the Nairobi delivery zones and Cheese for Trees are worked in.
   Both concepts use this markup and skin it in their own CSS. opts.viz: 'bar' (weight bar) or 'fridge'. */
(function () {
  var SC = window.SC, $ = SC.$, $$ = SC.$$, esc = SC.esc;
  var C = SC.company;
  var STEPS = ['Pick your cheese', 'About you', 'Delivery', 'Review and send'];
  var SLOTS = 12;

  function longDay(d) { return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }); }
  function shortDay(d) { return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' }); }

  function radio(name, value, label, sub, icon, checked) {
    return '<label class="od-choice"><input type="radio" name="' + name + '" value="' + esc(value) + '"' + (checked ? ' checked' : '') + '>' +
      '<span class="od-choice__box">' + (icon ? '<span class="od-choice__icon">' + SC.icon(icon) + '</span>' : '') +
      '<span class="od-choice__text"><strong>' + esc(label) + '</strong>' + (sub ? '<span>' + esc(sub) + '</span>' : '') + '</span>' +
      SC.icon('check', 'od-choice__tick') + '</span></label>';
  }

  SC.orderDesk = function (root, opts) {
    opts = opts || {};
    var viz = opts.viz || 'bar';
    var step = 1, reached = 1, tried = {}, sent = null;
    var markets = SC.upcomingEvents().filter(function (e) { return e.collect; });

    var items = SC.products.map(function (p) {
      var def = p.packs[p.def || 0].out ? p.packs.findIndex(function (k) { return !k.out; }) : (p.def || 0);
      return '<li class="od-item" data-id="' + p.id + '" data-moods="' + p.moods.join(' ') + '" style="--c:' + p.color + ';--tint:' + p.tint + '">' +
        '<button class="od-item__img" type="button" data-open-product="' + p.id + '" aria-label="About ' + esc(p.name) + '">' +
        '<img src="' + SC.img(p.packs[Math.max(def, 0)].img || p.pack) + '" alt="" width="240" height="240" loading="lazy"></button>' +
        '<div class="od-item__info"><strong>' + esc(p.name) + '</strong><span>' + esc(p.kind) + '</span></div>' +
        '<div class="od-item__packs" role="radiogroup" aria-label="' + esc(p.name) + ' packs">' + p.packs.map(function (k, i) {
          return '<label' + (k.out ? ' class="is-out" title="Sold out"' : '') + '><input type="radio" name="pk-' + p.id + '" value="' + k.id + '"' + (i === def ? ' checked' : '') + (k.out ? ' disabled' : '') + '>' +
            '<span>' + esc(k.label) + '<em>' + (k.out ? 'Sold out' : SC.money(k.price)) + '</em></span></label>';
        }).join('') + '</div>' +
        '<button class="od-item__add" type="button" aria-label="Add ' + esc(p.name) + ' to my list">' + SC.icon('plus') + '<span>Add</span></button>' +
        '<span class="od-item__in" aria-hidden="true"></span></li>';
    }).join('');

    var areaOpts = SC.zones.map(function (z) {
      return '<optgroup label="Zone ' + z.id + ' · ' + SC.money(z.fee) + (z.freeFrom ? ', free from ' + SC.money(z.freeFrom) : '') + '">' +
        z.areas.map(function (a) { return '<option value="' + esc(a) + '">' + esc(a) + '</option>'; }).join('') + '</optgroup>';
    }).join('');

    root.classList.add('od', 'od--' + viz);
    root.innerHTML =
      '<ol class="od-steps">' + STEPS.map(function (t, i) {
        return '<li><button type="button" data-goto="' + (i + 1) + '"' + (i ? ' disabled' : ' aria-current="step"') + '>' +
          '<span class="od-steps__n">' + (i + 1) + '</span><span class="od-steps__t">' + t + '</span></button></li>';
      }).join('') + '</ol>' +
      '<div class="od-grid"><form class="od-main" novalidate>' +

      // 1. cheese
      '<section class="od-panel" data-panel="1">' +
      '<div class="od-panel__head"><h3 class="od-panel__title" tabindex="-1">Pick your cheese</h3>' +
      '<div class="od-filter" role="group" aria-label="Show">' +
      '<button type="button" data-filter="all" aria-pressed="true">Everything</button>' +
      SC.moods.map(function (m) { return '<button type="button" data-filter="' + m.id + '" aria-pressed="false">' + m.name + '</button>'; }).join('') +
      '</div></div>' +
      '<div class="od-repeat" hidden></div>' +
      '<ul class="od-items">' + items + '</ul>' +
      '<p class="od-hint">' + SC.icon('info') + 'Prices are the shop’s prices today. Sold-out packs can tell you when they’re back.</p></section>' +

      // 2. about you
      '<section class="od-panel" data-panel="2" hidden>' +
      '<div class="od-panel__head"><h3 class="od-panel__title" tabindex="-1">About you</h3><p class="od-panel__sub">So we know who to message and where the cheese is going.</p></div>' +
      '<div class="od-fields">' +
      '<fieldset class="field field--full"><legend>Who is the cheese for?</legend><div class="od-choices od-choices--two">' +
      radio('who', 'Home', 'My home', 'Family, friends, a party', 'home', true) +
      radio('who', 'Business', 'My business', 'Restaurant, café, hotel, shop, caterer', 'briefcase', false) + '</div></fieldset>' +
      '<div class="field"><label for="od-name">Your name *</label><input id="od-name" name="name" autocomplete="name"></div>' +
      '<div class="field"><label for="od-phone">Phone (WhatsApp) *</label><input id="od-phone" name="phone" type="tel" autocomplete="tel" placeholder="0712 345 678"></div>' +
      '<div class="field"><label for="od-email">Email</label><input id="od-email" name="email" type="email" autocomplete="email" placeholder="you@example.com"></div>' +
      '<div class="od-biz field--full" hidden><div class="od-fields">' +
      '<div class="field"><label for="od-business">Business name *</label><input id="od-business" name="business" autocomplete="organization"></div>' +
      '<div class="field"><label for="od-type">Type of business *</label><select id="od-type" name="type">' + SC.optionsHTML(['Restaurant', 'Café or bakery', 'Hotel or lodge', 'Caterer', 'Shop or deli', 'School or office', 'Other'], 'Select one') + '</select></div>' +
      '<div class="field field--full"><label class="check"><input type="checkbox" name="regular" value="yes"><span>I’d like a standing weekly order and trade prices</span></label></div>' +
      '</div></div>' +
      '<div class="od-crewnote field--full" data-crewnote></div>' +
      '</div></section>' +

      // 3. delivery
      '<section class="od-panel" data-panel="3" hidden>' +
      '<div class="od-panel__head"><h3 class="od-panel__title" tabindex="-1">Delivery</h3><p class="od-panel__sub">Order by 2pm for next-day delivery in Nairobi. Out of town and Zone F need two working days.</p></div>' +
      '<div class="od-fields">' +
      '<fieldset class="field field--full"><legend>How should it reach you? *</legend><div class="od-choices od-choices--four">' +
      radio('method', 'deliver', 'Deliver in Nairobi', 'From KES 250 by zone', 'truck', true) +
      radio('method', 'town', 'Out of town', 'Courier, KES 600', 'snow', false) +
      radio('method', 'market', 'Pick up at a market', markets.length ? 'Next: ' + markets[0].name : 'This season’s pop-ups', 'tent', false) +
      radio('method', 'studio', 'Collect at the studio', 'Kalalu, Laikipia East', 'store', false) + '</div></fieldset>' +
      '<div class="field od-area"><label for="od-area">Your area *</label><select id="od-area" name="area"><option value="">Select your area</option>' + areaOpts + '</select></div>' +
      '<div class="field od-town" hidden><label for="od-town">Town *</label><input id="od-town" name="town" placeholder="Nanyuki, Nakuru, Mombasa…"></div>' +
      '<div class="field od-address"><label for="od-address">Address or landmark *</label><input id="od-address" name="address" placeholder="Estate, street, building, a landmark"></div>' +
      '<div class="field field--full od-market" hidden><label for="od-market">Which market? *</label><select id="od-market" name="market">' +
      SC.optionsHTML(markets.map(function (e) { return { value: e.id, label: e.name + ' · ' + SC.eventDates(e) + ' · ' + e.place }; }), 'Choose a market') + '</select></div>' +
      '<p class="od-feeline field--full" data-feeline></p>' +
      '<fieldset class="field field--full"><legend class="od-day-legend">Delivery day *</legend><div class="od-days" data-days></div></fieldset>' +
      '<fieldset class="field field--full od-time"><legend>Time of day</legend><div class="od-choices od-choices--row">' +
      radio('time', 'Morning, 9am to 1pm', 'Morning', '9am to 1pm', 'sun', true) + radio('time', 'Afternoon, 1pm to 5pm', 'Afternoon', '1pm to 5pm', 'clock', false) + '</div></fieldset>' +
      '<fieldset class="field field--full"><legend>How would you like to pay?</legend><div class="od-choices od-choices--row" data-pay>' +
      ['M-Pesa', 'Card online', 'Cash on delivery'].map(function (p, i) { return radio('pay', p, p, '', i === 0 ? 'wallet' : '', i === 0); }).join('') +
      '</div><p class="od-small">Nothing is charged here. The team confirms your order and sends payment details.</p></fieldset>' +
      '<div class="field field--full"><label for="od-notes">Anything else?</label><textarea id="od-notes" name="notes" rows="2" placeholder="Gate code, a second number, a party date"></textarea></div>' +
      '</div></section>' +

      // 4. review
      '<section class="od-panel" data-panel="4" hidden>' +
      '<div class="od-panel__head"><h3 class="od-panel__title" tabindex="-1">Review and send</h3><p class="od-panel__sub">Check it over, then send it on WhatsApp or as a request.</p></div>' +
      '<div class="od-review"></div>' +
      '<div class="field field--full"><label class="check"><input type="checkbox" name="consent"><span>Sirimon Cheese may contact me about this order on WhatsApp or by phone. *</span></label></div>' +
      '<div class="od-send"><button type="button" class="btn btn--wa od-send__wa">' + SC.icon('whatsapp') + '<span>Send on WhatsApp</span></button>' +
      '<button type="button" class="btn btn--ghost od-send__req">' + SC.icon('send') + '<span>Send as a request</span></button></div>' +
      '</section>' +

      '<section class="od-panel od-done" data-panel="done" tabindex="-1" hidden></section>' +
      '</form>' +

      '<aside class="od-summary" aria-label="Your cheese list">' +
      '<div class="od-summary__head"><h3>Your cheese list</h3><span class="od-summary__count" aria-live="polite"></span></div>' +
      '<div class="od-viz" aria-hidden="true"></div>' +
      '<p class="od-viz__note"></p>' +
      '<ul class="od-lines"></ul>' +
      '<p class="od-empty">Your list is empty. Add a cheese to start.</p>' +
      '<dl class="od-totals"></dl>' +
      '<div class="od-crew" data-sumcrew></div>' +
      '<p class="od-trees" data-trees></p>' +
      '<div class="od-actions"><button class="btn btn--primary od-next" type="button"></button>' +
      '<button class="od-back" type="button" hidden>' + SC.icon('left') + 'Back</button></div>' +
      '<button class="od-share" type="button">' + SC.icon('whatsapp') + 'Just send my list on WhatsApp</button>' +
      '<p class="od-error" role="alert"></p>' +
      '</aside></div>';

    var form = $('.od-main', root), summary = $('.od-summary', root);
    var nextBtn = $('.od-next', root), backBtn = $('.od-back', root), errBox = $('.od-error', root);
    var vizBox = $('.od-viz', root), vizNote = $('.od-viz__note', root);

    if (viz === 'fridge') {
      vizBox.innerHTML = '<div class="od-fridge"><div class="od-fridge__shelves">' + Array.apply(null, Array(SLOTS)).map(function () { return '<i></i>'; }).join('') + '</div><span class="od-fridge__handle"></span></div>';
    } else {
      vizBox.innerHTML = '<div class="od-big"><strong>0</strong><span>g</span></div><div class="od-bar"></div>';
    }

    /* ---------- Rules per step ---------- */
    var R = SC.rules;
    function m() { return form.elements.method.value; }
    var RULES = {
      2: {
        name: R.name, phone: R.phone, email: R.email,
        business: function (v, f) { return f.elements.who.value !== 'Business' || v.trim().length > 1 || 'Add the business name.'; },
        type: function (v, f) { return f.elements.who.value !== 'Business' || !!v || 'Choose the type of business.'; }
      },
      3: {
        method: function (v) { return !!v || 'Choose how the cheese reaches you.'; },
        area: function (v) { return m() !== 'deliver' || !!v || 'Select your area.'; },
        town: function (v) { return m() !== 'town' || v.trim().length > 1 || 'Which town?'; },
        address: function (v) { return (m() !== 'deliver' && m() !== 'town') || v.trim().length > 3 || 'Add an address or a landmark.'; },
        market: function (v) { return m() !== 'market' || !!v || 'Choose a market.'; },
        date: function (v) { return !!v || 'Pick a day.'; }
      },
      4: { consent: R.consent }
    };
    [2, 3, 4].forEach(function (n) { SC.liveValidate(form, RULES[n], function () { return tried[n]; }); });

    /* ---------- Totals ---------- */
    function totals() {
      var lines = SC.list.lines(), pr = SC.pricing(lines);
      var method = form.elements.method.value, del = null;
      if (step >= 3 || reached >= 3) del = SC.deliveryFee(method, form.elements.area.value, pr.basket);
      var fee = del && del.fee ? del.fee : 0;
      return { lines: lines, pr: pr, del: del, fee: fee, total: pr.basket + fee, grams: SC.list.grams() };
    }

    /* ---------- Paint ---------- */
    function paint() {
      var t = totals(), lines = t.lines, pr = t.pr, count = SC.list.total();
      $$('.od-item', root).forEach(function (li) {
        var id = li.getAttribute('data-id');
        var n = lines.filter(function (l) { return l.product.id === id; }).reduce(function (a, l) { return a + l.qty; }, 0);
        li.classList.toggle('is-in', n > 0);
        $('.od-item__in', li).textContent = n ? n + ' in list' : '';
      });
      $('.od-summary__count', root).textContent = count ? SC.packs(count) + (t.grams ? ' · ' + SC.weight(t.grams) : '') : 'Empty';
      $('.od-empty', root).hidden = count > 0;
      summary.classList.toggle('is-empty', !count);
      $('.od-share', root).hidden = !count || step === 'done';
      $('.od-lines', root).innerHTML = lines.map(function (l) {
        var it = pr.items.find(function (x) { return x.key === l.key; });
        var crew = it && it.deal ? (pr.member ? '<i class="od-lines__deal">−' + SC.money(it.cut) + '</i>' : '') : '';
        return '<li style="--c:' + l.product.color + '"><span class="od-lines__dot"></span>' +
          '<span class="od-lines__name"><strong>' + esc(l.product.short) + '</strong><em>' + esc(l.pack.label) + ' · ' + SC.money(l.sum) + '</em>' + crew + '</span>' +
          '<span class="od-lines__qty"><button type="button" data-line="' + l.key + '" data-d="-1" aria-label="One less ' + esc(l.product.name + ' ' + l.pack.label) + '">' + SC.icon('minus') + '</button>' +
          '<b>' + l.qty + '</b><button type="button" data-line="' + l.key + '" data-d="1" aria-label="One more ' + esc(l.product.name + ' ' + l.pack.label) + '">' + SC.icon('plus') + '</button></span>' +
          '<button class="od-lines__x" type="button" data-line="' + l.key + '" data-d="x" aria-label="Remove ' + esc(l.product.name + ' ' + l.pack.label) + '">' + SC.icon('close') + '</button></li>';
      }).join('') + pr.gifts.map(function (g) {
        return '<li class="od-lines__gift" style="--c:' + g.deal.color + '"><span class="od-lines__dot"></span><span class="od-lines__name"><strong>' + esc(g.label) + '</strong><em>' + esc(g.deal.title) + ' · free</em></span><span class="od-lines__free">' + SC.icon('gift') + '</span></li>';
      }).join('');

      var rows = [['Cheese and jars', SC.money(pr.subtotal)]];
      if (pr.saving) rows.push(['Kitchen Crew savings', '−' + SC.money(pr.saving), 'is-save']);
      if (t.del) rows.push(['Delivery', t.del.fee === null ? 'Choose an area' : t.del.fee === 0 ? 'Free' : SC.money(t.del.fee), t.del.fee === 0 ? 'is-save' : '']);
      else if (count) rows.push(['Delivery', 'From KES 250 in Nairobi', 'is-muted']);
      rows.push(['Total', SC.money(t.total), 'is-total']);
      $('.od-totals', root).innerHTML = count ? rows.map(function (r) { return '<div class="' + (r[2] || '') + '"><dt>' + r[0] + '</dt><dd>' + r[1] + '</dd></div>'; }).join('') : '';

      var crewBox = $('[data-sumcrew]', root);
      if (!count) crewBox.innerHTML = '';
      else if (pr.member) crewBox.innerHTML = '<p class="od-crew__on">' + SC.icon('crown') + '<span><strong>Crew prices on, ' + esc(pr.member.name) + '.</strong> ' + (pr.saving ? 'You save ' + SC.money(pr.saving) + ' on this list.' : 'Add Everyday, Mozzarella or cheddar for 10% off.') + '</span></p>';
      else if (pr.could) crewBox.innerHTML = '<p class="od-crew__off">' + SC.icon('lock') + '<span>Kitchen Crew members save <strong>' + SC.money(pr.could) + '</strong> on this list.</span><button type="button" class="btn btn--sm" data-crew="join">Join free</button></p>';
      else crewBox.innerHTML = '<p class="od-crew__off">' + SC.icon('crown') + '<span>Members get Crew prices, a birthday Halloumi and free delivery sooner.</span><button type="button" class="btn btn--sm" data-crew="join">Join free</button></p>';

      // free delivery meter
      if (t.del && t.del.freeFrom && t.del.fee) {
        var left = t.del.freeFrom - t.pr.basket;
        $('[data-feeline]', root).innerHTML = SC.icon('truck') + '<span>' + esc(t.del.note) + '. Add <strong>' + SC.money(left) + '</strong> more for free delivery.</span><i class="od-meter"><b style="width:' + Math.min(100, Math.round(t.pr.basket / t.del.freeFrom * 100)) + '%"></b></i>';
      } else if (t.del) {
        $('[data-feeline]', root).innerHTML = t.del.fee === null ? '' : SC.icon(t.del.fee ? 'truck' : 'check') + '<span>' + esc(t.del.note) + (t.del.crew ? ' (Crew)' : '') + '.</span>';
      }

      var kes = SC.trees(t.grams);
      $('[data-trees]', root).innerHTML = t.grams ? SC.icon('tree') + '<span>This list plants <strong>' + SC.money(kes) + '</strong> of Kabage Forest. KES 25 a kilo goes to the Aberdares.</span>' : '';
      paintViz(lines, count, t.grams);
      paintRepeat(count);
      nextLabel();
    }

    function shares(lines, slots) {
      var total = lines.reduce(function (t, l) { return t + l.qty; }, 0);
      if (!total) return [];
      if (total <= slots) return lines.reduce(function (a, l) { for (var i = 0; i < l.qty; i++) a.push(l.product.color); return a; }, []);
      var parts = lines.map(function (l) { var exact = l.qty / total * slots; return { c: l.product.color, n: Math.floor(exact), r: exact % 1 }; });
      var left = slots - parts.reduce(function (t, p) { return t + p.n; }, 0);
      parts.slice().sort(function (a, b) { return b.r - a.r; }).slice(0, left).forEach(function (p) { p.n++; });
      return parts.reduce(function (a, p) { for (var i = 0; i < p.n; i++) a.push(p.c); return a; }, []);
    }

    var lastFill = 0;
    function paintViz(lines, total, grams) {
      if (viz === 'fridge') {
        var cols = shares(lines, SLOTS);
        $$('.od-fridge__shelves i', vizBox).forEach(function (s, i) {
          var c = cols[i];
          s.style.setProperty('--c', c || 'transparent');
          s.classList.toggle('is-on', !!c);
          if (c && i >= lastFill && !SC.reducedMotion()) s.animate([{ transform: 'translateY(-26px) rotate(-8deg)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 520, easing: 'cubic-bezier(.3,1.5,.5,1)', delay: (i - lastFill) * 40 });
        });
        lastFill = cols.length;
        vizNote.textContent = !total ? 'An empty fridge. Let’s fix that.' : total <= SLOTS ? 'Each block is one pack. ' + (grams ? SC.weight(grams) + ' of cheese.' : '') : 'Shown as shares of the fridge. ' + SC.weight(grams) + ' of cheese.';
      } else {
        $('.od-bar', vizBox).innerHTML = lines.map(function (l) {
          return '<span style="flex:' + Math.max(l.pack.g, 120) * l.qty + ';background:' + l.product.color + '" title="' + esc(l.product.name) + '"></span>';
        }).join('');
        var kg = grams >= 1000;
        $('.od-big strong', vizBox).textContent = kg ? (Math.round(grams / 100) / 10).toString() : grams;
        $('.od-big span', vizBox).textContent = kg ? 'kg of cheese' : 'g of cheese';
        vizNote.textContent = lines.length ? SC.packs(total) + ' across ' + lines.length + (lines.length === 1 ? ' product.' : ' products.') : 'Mix any cheeses and sizes.';
      }
    }

    function paintRepeat(total) {
      var box = $('.od-repeat', root), last = SC.list.history().slice(-1)[0];
      if (!last || total || step !== 1) { box.hidden = true; return; }
      var n = last.lines.reduce(function (t, l) { return t + (+l.qty || 0); }, 0);
      box.innerHTML = '<span class="od-repeat__icon">' + SC.icon('repeat') + '</span><span><strong>Welcome back.</strong> Repeat your list from ' +
        esc(new Date(last.sent).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })) + ': ' + SC.packs(n) + '.</span><button class="btn btn--sm btn--ghost" type="button" data-repeat>Repeat it</button>';
      box.hidden = false;
    }

    function nextLabel() {
      var labels = { 1: 'Continue to your details', 2: 'Continue to delivery', 3: 'Review my order', 4: 'Send on WhatsApp' };
      if (step === 'done') return;
      nextBtn.innerHTML = '<span>' + labels[step] + '</span>' + SC.icon(step === 4 ? 'whatsapp' : 'right');
      nextBtn.classList.toggle('btn--wa', step === 4);
      backBtn.hidden = step === 1;
    }

    /* ---------- Delivery fields ---------- */
    function paintDays() {
      var method = m(), box = $('[data-days]', root), days = [];
      if (method === 'market') {
        var ev = SC.events.find(function (e) { return e.id === form.elements.market.value; });
        if (ev) {
          var d = new Date(ev.start + 'T12:00:00Z'), end = new Date(ev.end + 'T12:00:00Z'), today = SC.todayEAT();
          while (d <= end) { if (d.toISOString().slice(0, 10) >= today) days.push(new Date(d)); d = new Date(d.getTime() + 864e5); }
        }
      } else if (method === 'studio') {
        days = SC.deliveryDays('studio', '', 8);
      } else {
        days = SC.deliveryDays(method, form.elements.area.value, 8);
      }
      var prev = form.elements.date ? (form.querySelector('input[name="date"]:checked') || {}).value : '';
      box.innerHTML = days.length ? days.map(function (d, i) {
        var iso = d.toISOString().slice(0, 10);
        return '<label class="od-day"><input type="radio" name="date" value="' + iso + '"' + (iso === prev ? ' checked' : '') + '><span><b>' +
          d.toLocaleDateString('en-GB', { weekday: 'short', timeZone: 'UTC' }) + '</b>' + d.getUTCDate() + '<i>' + d.toLocaleDateString('en-GB', { month: 'short', timeZone: 'UTC' }) + '</i></span></label>';
      }).join('') : '<p class="od-small">' + (method === 'market' ? 'Choose a market to see its days.' : 'Choose your area to see delivery days.') + '</p>';
      var area = form.elements.area.value, z = SC.zoneOf(area);
      $('.od-day-legend', root).textContent = method === 'market' ? 'Pick-up day at the market *' : method === 'studio' ? 'Collection day *' : method === 'town' ? 'Dispatch day *' : (z && z.days && z.days[area] ? 'Delivery day (Tuesdays and Fridays for ' + area + ') *' : 'Delivery day *');
    }

    function syncMethod() {
      var method = m();
      $('.od-area', root).hidden = method !== 'deliver';
      $('.od-town', root).hidden = method !== 'town';
      $('.od-address', root).hidden = method !== 'deliver' && method !== 'town';
      $('.od-market', root).hidden = method !== 'market';
      $('.od-time', root).hidden = method === 'market' || method === 'studio';
      var pays = method === 'market' ? ['M-Pesa', 'Card online', 'Pay at the stand'] : method === 'studio' ? ['M-Pesa', 'Card online', 'Pay at the studio'] : method === 'town' ? ['M-Pesa', 'Card online'] : ['M-Pesa', 'Card online', 'Cash on delivery'];
      var cur = (form.querySelector('input[name="pay"]:checked') || {}).value;
      $('[data-pay]', root).innerHTML = pays.map(function (p, i) { return radio('pay', p, p, '', i === 0 ? 'wallet' : '', cur ? p === cur : i === 0); }).join('');
      if (!form.querySelector('input[name="pay"]:checked')) form.querySelector('input[name="pay"]').checked = true;
      if (method === 'studio') $('[data-feeline]', root).innerHTML = SC.icon('store') + '<span>Free collection at ' + esc(C.studio) + ', ' + esc(C.near) + '. Monday to Friday 8am to 5pm, Saturday 8am to 12pm.</span>';
      if (method === 'market') {
        var ev = SC.events.find(function (e) { return e.id === form.elements.market.value; });
        $('[data-feeline]', root).innerHTML = SC.icon('tent') + '<span>' + (ev ? 'Free pick-up at the Sirimon stand, ' + esc(ev.place) + (ev.hours ? ', ' + esc(ev.hours) : '') + '.' : 'Free pick-up at the Sirimon stand.') + '</span>';
      }
      paintDays();
      paint();
    }

    /* ---------- Steps ---------- */
    function show(n, focus) {
      step = n;
      reached = Math.max(reached, n);
      $$('.od-panel', root).forEach(function (p) { p.hidden = p.getAttribute('data-panel') !== String(n); });
      $$('[data-goto]', root).forEach(function (b) {
        var k = +b.getAttribute('data-goto');
        b.disabled = k > reached;
        if (k === n) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
        b.parentNode.classList.toggle('is-done', k < n || (k <= reached && k !== n));
      });
      root.setAttribute('data-step', n);
      errBox.textContent = '';
      if (n === 2) prefill();
      if (n === 3) syncMethod();
      if (n === 4) buildReview();
      paint();
      if (opts.onStep) opts.onStep(n);
      if (focus) {
        var top = root.getBoundingClientRect().top;
        if (top < 0 || top > innerHeight * .6) SC.scrollTo(root);
        var h = $('[data-panel="' + n + '"] .od-panel__title', root);
        if (h) setTimeout(function () { h.focus({ preventScroll: true }); }, SC.reducedMotion() ? 0 : 500);
      }
    }

    function prefill() {
      var me = SC.member.current(), note = $('[data-crewnote]', root);
      if (me) {
        if (!form.elements.name.value) form.elements.name.value = me.name + (me.last && !me.demo ? ' ' + me.last : '');
        if (!form.elements.email.value) form.elements.email.value = me.email;
        if (!form.elements.phone.value && me.phone) form.elements.phone.value = me.phone;
        note.innerHTML = '<p>' + SC.icon('crown') + '<span>Filled in from your Kitchen Crew account. This order earns about <strong>' + Math.floor(totals().total / 100) + ' points</strong>.</span></p>';
      } else note.innerHTML = '<p>' + SC.icon('crown') + '<span>Kitchen Crew members check out faster and earn points. <button type="button" data-crew="login">Log in</button> or <button type="button" data-crew="join">join free</button>.</span></p>';
    }

    function check(n) {
      if (n === 1) {
        if (!SC.list.total()) { errBox.textContent = 'Add at least one cheese to continue.'; return false; }
        return true;
      }
      tried[n] = true;
      var bad = SC.validateForm(form, RULES[n]);
      if (n === 3 && !bad && m() === 'deliver' && SC.deliveryFee('deliver', form.elements.area.value, 0).fee === null) bad = form.elements.area;
      if (bad) {
        var count = $$('[data-panel="' + n + '"] [aria-invalid="true"]', root).length || 1;
        errBox.textContent = count === 1 ? 'One field needs attention.' : count + ' fields need attention.';
        bad.focus();
        return false;
      }
      return true;
    }

    function next() {
      if (step === 'done') return;
      if (!check(step)) return;
      if (step < 4) show(step + 1, true); else send(true);
    }

    function val(n) { var el = form.elements[n]; return el ? String(el.value || '').trim() : ''; }

    function details() {
      var d = val('date') ? new Date(val('date') + 'T12:00:00Z') : null;
      var ev = SC.events.find(function (e) { return e.id === val('market'); });
      return {
        who: val('who'), name: val('name'), phone: val('phone'), email: val('email'), business: val('business'), type: val('type'),
        regular: form.elements.regular.checked, method: val('method'), area: val('area'), town: val('town'), address: val('address'),
        market: ev || null, date: d, time: val('time'), pay: val('pay'), notes: val('notes')
      };
    }
    function methodText(d) {
      if (d.method === 'studio') return 'Collect at the studio, ' + C.studio;
      if (d.method === 'market') return 'Pick up at ' + (d.market ? d.market.name + ', ' + d.market.place : 'a market');
      if (d.method === 'town') return 'Courier to ' + [d.address, d.town].filter(Boolean).join(', ');
      return 'Deliver to ' + [d.address, d.area].filter(Boolean).join(', ') + (SC.zoneOf(d.area) ? ' (Zone ' + SC.zoneOf(d.area).id + ')' : '');
    }
    function whenText(d) {
      if (!d.date) return '';
      if (d.method === 'market') return longDay(d.date) + (d.market && d.market.hours ? ', ' + d.market.hours : '');
      if (d.method === 'studio') return longDay(d.date);
      return longDay(d.date) + ', ' + d.time.toLowerCase();
    }

    function buildReview() {
      var d = details(), t = totals();
      var rows = function (list) {
        return '<dl>' + list.filter(function (r) { return r[1]; }).map(function (r) { return '<div><dt>' + r[0] + '</dt><dd>' + esc(r[1]) + '</dd></div>'; }).join('') + '</dl>';
      };
      $('.od-review', root).innerHTML =
        '<article class="od-block"><header><h4>' + SC.icon('basket') + 'Cheese</h4><button type="button" data-goto="1">' + SC.icon('edit') + 'Edit</button></header>' +
        '<ul class="od-block__lines">' + t.lines.map(function (l) {
          return '<li style="--c:' + l.product.color + '"><img src="' + SC.img(l.pack.img || l.product.pack) + '" alt="" width="80" height="80"><span>' + esc(l.product.name) + '<em>' + esc(l.pack.label) + '</em></span><b>× ' + l.qty + '</b><i>' + SC.money(l.sum) + '</i></li>';
        }).join('') + t.pr.gifts.map(function (g) { return '<li><span class="od-block__gift">' + SC.icon('gift') + '</span><span>' + esc(g.label) + '<em>' + esc(g.deal.title) + '</em></span><b>× 1</b><i>Free</i></li>'; }).join('') + '</ul>' +
        '<dl class="od-block__sum"><div><dt>Cheese and jars</dt><dd>' + SC.money(t.pr.subtotal) + '</dd></div>' + (t.pr.saving ? '<div class="is-save"><dt>Kitchen Crew savings</dt><dd>−' + SC.money(t.pr.saving) + '</dd></div>' : '') +
        '<div><dt>Delivery</dt><dd>' + (t.fee ? SC.money(t.fee) : 'Free') + '</dd></div><div class="is-total"><dt>Total</dt><dd>' + SC.money(t.total) + '</dd></div></dl></article>' +
        '<article class="od-block"><header><h4>' + SC.icon(d.who === 'Business' ? 'briefcase' : 'home') + 'You</h4><button type="button" data-goto="2">' + SC.icon('edit') + 'Edit</button></header>' +
        rows([['Name', d.name], ['Phone', d.phone], ['Email', d.email], ['For', d.who === 'Business' ? d.business + (d.type ? ', ' + d.type : '') : 'Home'],
          ['Trade', d.regular ? 'Would like a weekly order and trade prices' : ''], ['Crew', SC.member.isIn() ? 'Kitchen Crew member' : '']]) + '</article>' +
        '<article class="od-block"><header><h4>' + SC.icon(d.method === 'market' ? 'tent' : d.method === 'studio' ? 'store' : 'truck') + 'Delivery</h4><button type="button" data-goto="3">' + SC.icon('edit') + 'Edit</button></header>' +
        rows([['How', methodText(d)], ['When', whenText(d)], ['Payment', d.pay], ['Notes', d.notes]]) + '</article>';
    }

    function message(record, d, t) {
      return 'Hello Sirimon! I would like to order:\n' + SC.listText(t.lines) +
        (t.pr.gifts.length ? '\n' + t.pr.gifts.map(function (g) { return '• 1 × ' + g.label + ' (' + g.deal.title + ', free)'; }).join('\n') : '') +
        '\n\nCheese and jars: ' + SC.money(t.pr.subtotal) + (t.pr.saving ? '\nKitchen Crew savings: −' + SC.money(t.pr.saving) : '') +
        '\nDelivery: ' + (t.fee ? SC.money(t.fee) : 'free') + '\nTotal: ' + SC.money(t.total) +
        '\n\nName: ' + d.name + '\nPhone: ' + d.phone + (d.email ? '\nEmail: ' + d.email : '') +
        (SC.member.isIn() ? '\nKitchen Crew member no. ' + String(SC.member.current().no).padStart(4, '0') : '') +
        '\nFor: ' + (d.who === 'Business' ? d.business + ' (' + d.type + ')' + (d.regular ? ', interested in a weekly order' : '') : 'Home') +
        '\n' + methodText(d) + (d.date ? '\nWhen: ' + whenText(d) : '') +
        '\nPayment: ' + d.pay + (d.notes ? '\nNotes: ' + d.notes : '') + '\nReference: ' + record.ref;
    }

    function send(viaWa) {
      if (step === 4 && !check(4)) return;
      var d = details(), t = totals();
      var record = {
        ref: SC.reference('SC'), sent: new Date().toISOString(), via: viaWa ? 'WhatsApp' : 'Request',
        total: SC.list.total(), grams: t.grams, amount: t.total, saving: t.pr.saving, fee: t.fee,
        lines: t.lines.map(function (l) { return { key: l.key, name: l.product.name, pack: l.pack.label, qty: l.qty, sum: l.sum }; }),
        details: Object.assign({}, d, { date: d.date ? d.date.toISOString().slice(0, 10) : '', market: d.market ? d.market.id : '' })
      };
      var text = message(record, d, t);
      if (viaWa) SC.openWa(text);
      $$('.od-send button, .od-next', root).forEach(function (b) { b.disabled = true; b.classList.add('is-busy'); });
      setTimeout(function () {
        SC.list.remember(record);
        var pts = SC.member.earn(t.total);
        sent = { record: record, d: d, t: t, text: text, pts: pts };
        SC.list.save({});
        $$('.od-send button, .od-next', root).forEach(function (b) { b.disabled = false; b.classList.remove('is-busy'); });
        done();
        if (opts.onSent) opts.onSent(record);
      }, SC.reducedMotion() ? 150 : 900);
    }

    function done() {
      var r = sent.record, d = sent.d, t = sent.t;
      var day = d.date ? longDay(d.date) : 'your chosen day';
      var panel = $('[data-panel="done"]', root);
      var crewLine = SC.member.isIn() ? '<p class="od-done__crew">' + SC.icon('crown') + '<span><strong>+' + sent.pts + ' Crew points.</strong> ' + (t.pr.saving ? 'You saved ' + SC.money(t.pr.saving) + ' with Crew prices.' : '') + '</span></p>'
        : '<p class="od-done__crew">' + SC.icon('crown') + '<span>Kitchen Crew members would have earned <strong>' + Math.floor(t.total / 100) + ' points</strong> on this order.</span><button type="button" class="btn btn--sm" data-crew="join">Join free</button></p>';
      panel.innerHTML = '<div class="od-done__badge">' + SC.icon('check') + '</div>' +
        '<h3 class="od-done__title">' + (r.via === 'WhatsApp' ? 'Over to WhatsApp' : 'Order request sent') + '</h3>' +
        '<p class="od-done__lead">Thanks, ' + esc(d.name.split(' ')[0]) + '. ' + (r.via === 'WhatsApp' ? 'Your order is written out in WhatsApp: press send there and ' : '') +
        'the Sirimon team will confirm your order on <strong>' + esc(d.phone) + '</strong> and lock in ' + esc(day) + '.</p>' +
        '<dl class="od-done__meta"><div><dt>Reference</dt><dd>' + r.ref + '</dd></div><div><dt>Total</dt><dd>' + SC.money(r.amount) + '</dd></div>' +
        '<div><dt>' + (d.method === 'deliver' || d.method === 'town' ? 'Delivery' : 'Pick-up') + '</dt><dd>' + esc(d.date ? shortDay(d.date) : '') + '</dd></div>' +
        (t.grams ? '<div><dt>Kabage Forest</dt><dd>' + SC.money(SC.trees(t.grams)) + '</dd></div>' : '') + '</dl>' + crewLine +
        '<ol class="od-track">' +
        '<li class="is-done"><span></span><div><strong>Order received</strong><p>Just now, reference ' + r.ref + '</p></div></li>' +
        '<li><span></span><div><strong>Confirmed on WhatsApp</strong><p>With payment details, to ' + esc(d.phone) + '</p></div></li>' +
        '<li><span></span><div><strong>Packed cold in Laikipia</strong><p>Fresh from the studio</p></div></li>' +
        '<li><span></span><div><strong>' + (d.method === 'market' ? 'At the Sirimon stand' : d.method === 'studio' ? 'Ready at the studio' : 'On your table') + '</strong><p>' + esc(day) + '</p></div></li></ol>' +
        '<ul class="od-done__lines">' + t.lines.map(function (l) {
          return '<li style="--c:' + l.product.color + '"><img src="' + SC.img(l.pack.img || l.product.pack) + '" alt="" width="80" height="80"><span>' + esc(l.product.name) + '<em>' + esc(l.pack.label) + '</em></span><b>× ' + l.qty + '</b></li>';
        }).join('') + '</ul>' +
        '<div class="od-done__actions"><a class="btn btn--wa" href="' + SC.wa(sent.text) + '" target="_blank" rel="noopener">' + SC.icon('whatsapp') + (r.via === 'WhatsApp' ? 'Open WhatsApp again' : 'Also send on WhatsApp') + '</a>' +
        '<button class="btn btn--ghost" type="button" data-print>' + SC.icon('print') + 'Print</button>' +
        '<button class="btn btn--ghost" type="button" data-new>' + SC.icon('repeat') + 'Start a new list</button></div>';
      step = 'done';
      root.setAttribute('data-step', 'done');
      root.classList.add('is-done');
      $$('.od-panel', root).forEach(function (p) { p.hidden = p !== panel; });
      $$('[data-goto]', root).forEach(function (b) { b.disabled = true; b.removeAttribute('aria-current'); b.parentNode.classList.add('is-done'); });
      panel.focus({ preventScroll: true });
      if (root.getBoundingClientRect().top < 0) SC.scrollTo(root);
      $('.od-share', root).hidden = true;
    }

    function restart() {
      form.reset();
      tried = {};
      reached = 1;
      root.classList.remove('is-done');
      $$('[aria-invalid]', form).forEach(function (el) { el.removeAttribute('aria-invalid'); });
      $$('.field__error', form).forEach(function (el) { el.textContent = ''; });
      $$('.has-error', form).forEach(function (el) { el.classList.remove('has-error'); });
      $('.od-biz', root).hidden = true;
      show(1, true);
    }

    function printOrder() {
      var r = sent.record, d = sent.d;
      var box = document.createElement('div');
      box.className = 'od-print';
      box.innerHTML = '<h1>Sirimon Cheese order ' + r.ref + '</h1><p>' + esc(C.studio) + ', ' + esc(C.near) + '. WhatsApp ' + esc(C.phone) + '.</p>' +
        '<table><thead><tr><th>Product</th><th>Pack</th><th>Qty</th><th>KES</th></tr></thead><tbody>' + r.lines.map(function (l) { return '<tr><td>Sirimon ' + esc(l.name) + '</td><td>' + esc(l.pack) + '</td><td>' + l.qty + '</td><td>' + l.sum.toLocaleString('en-GB') + '</td></tr>'; }).join('') + '</tbody></table>' +
        '<p>Total ' + SC.money(r.amount) + (r.saving ? ' (Kitchen Crew savings ' + SC.money(r.saving) + ')' : '') + ', delivery ' + (r.fee ? SC.money(r.fee) : 'free') + '.</p>' +
        '<p><strong>' + esc(d.name) + '</strong>, ' + esc(d.phone) + (d.who === 'Business' ? '<br>' + esc(d.business) + ', ' + esc(d.type) : '') + '</p>' +
        '<p>' + esc(methodText(d)) + '<br>' + esc(whenText(d)) + '<br>Payment: ' + esc(d.pay) + '</p>';
      document.body.appendChild(box);
      var clean = function () { box.remove(); removeEventListener('afterprint', clean); };
      addEventListener('afterprint', clean);
      window.print();
      setTimeout(clean, 1500);
    }

    /* ---------- Events ---------- */
    root.addEventListener('click', function (e) {
      var t = e.target;
      var add = t.closest('.od-item__add');
      if (add) {
        var li = add.closest('.od-item'), id = li.getAttribute('data-id');
        var pk = $('input[name="pk-' + id + '"]:checked', li);
        if (SC.addToList(id, pk ? pk.value : null, 1, true)) {
          errBox.textContent = '';
          if (!SC.reducedMotion()) $('.od-item__img img', li).animate([{ transform: 'rotate(0) scale(1)' }, { transform: 'rotate(-10deg) scale(1.1)' }, { transform: 'rotate(0) scale(1)' }], { duration: 480, easing: 'cubic-bezier(.3,1.4,.5,1)' });
        }
        return;
      }
      var line = t.closest('[data-line]');
      if (line) {
        var key = line.getAttribute('data-line'), dd = line.getAttribute('data-d');
        SC.list.set(key, dd === 'x' ? 0 : SC.list.qty(key) + +dd);
        return;
      }
      var go = t.closest('[data-goto]');
      if (go && !go.disabled) { show(+go.getAttribute('data-goto'), true); return; }
      var filter = t.closest('[data-filter]');
      if (filter) {
        var f = filter.getAttribute('data-filter');
        $$('[data-filter]', root).forEach(function (b) { b.setAttribute('aria-pressed', b === filter ? 'true' : 'false'); });
        $$('.od-item', root).forEach(function (li) { li.hidden = f !== 'all' && (' ' + li.getAttribute('data-moods') + ' ').indexOf(' ' + f + ' ') < 0; });
        return;
      }
      if (t.closest('[data-repeat]')) {
        var last = SC.list.history().slice(-1)[0], o = {};
        last.lines.forEach(function (l) { o[l.key] = +l.qty || 0; });
        SC.list.save(o);
        SC.toast('Your last list is back');
        return;
      }
      if (t.closest('.od-send__wa')) { send(true); return; }
      if (t.closest('.od-send__req')) { if (check(4)) send(false); return; }
      if (t.closest('.od-share')) {
        var tt = totals();
        SC.openWa('Hello Sirimon! Here is my cheese list:\n' + SC.listText() + '\nTotal: ' + SC.money(tt.pr.basket) + (tt.pr.saving ? ' with Kitchen Crew prices' : '') + '\n\nPlease confirm delivery and payment.');
        return;
      }
      if (t.closest('[data-print]')) { printOrder(); return; }
      if (t.closest('[data-new]')) restart();
    });
    root.addEventListener('change', function (e) {
      var n = e.target.name;
      if (n === 'who') $('.od-biz', root).hidden = e.target.value !== 'Business';
      if (n === 'method') syncMethod();
      if (n === 'area' || n === 'market') { paintDays(); if (n === 'market') syncMethod(); else paint(); }
      if (n && n.indexOf('pk-') === 0) {
        var li = e.target.closest('.od-item'), p = SC.product(li.getAttribute('data-id'));
        var k = p.packs.find(function (x) { return x.id === e.target.value; });
        if (k && k.img) $('.od-item__img img', li).src = SC.img(k.img);
      }
    });
    form.addEventListener('submit', function (e) { e.preventDefault(); next(); });
    nextBtn.addEventListener('click', next);
    backBtn.addEventListener('click', function () { if (step > 1) show(step - 1, true); });
    document.addEventListener('sc:list', function () { if (step !== 'done') paint(); });
    document.addEventListener('sc:member', function () { if (step === 2) prefill(); if (step === 4) buildReview(); });

    show(1, false);
    return {
      goTo: function (n) { if (step !== 'done' && n <= reached) show(n, true); },
      business: function () {
        var r = $('input[name="who"][value="Business"]', root);
        if (r) { r.checked = true; $('.od-biz', root).hidden = false; }
      },
      market: function (id) {
        var r = $('input[name="method"][value="market"]', root);
        if (r) { r.checked = true; form.elements.market.value = id || ''; syncMethod(); }
      },
      filter: function (mood) { var b = $('[data-filter="' + mood + '"]', root); if (b) b.click(); },
      restart: restart
    };
  };
})();
