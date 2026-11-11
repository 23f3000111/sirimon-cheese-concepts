/* Pop-ups shared by both concepts: a cheese, a recipe, the recipe bank, the studio films,
   a platter pre-order, and "notify me" for sold-out packs. */
(function () {
  var SC = window.SC, $ = SC.$, $$ = SC.$$, esc = SC.esc;

  function cheeseChip(id) {
    var p = SC.product(id);
    return '<button type="button" class="sc-chip" data-open-product="' + p.id + '" style="--c:' + p.color + '"><i></i>' + esc(p.name) + '</button>';
  }
  function tasteHTML(t, cls) {
    return '<dl class="taste ' + (cls || '') + '"><div><dt>Tastes like</dt><dd>' + esc(t.like) + '</dd></div>' +
      (t.notes ? '<div><dt>Notes</dt><dd>' + esc(t.notes) + '</dd></div>' : '') +
      '<div><dt>Try it</dt><dd>' + esc(t.tryit) + '</dd></div></dl>';
  }
  SC.tasteHTML = tasteHTML;

  /* ---------- A cheese ---------- */
  SC.openProduct = function (id, packId) {
    var p = SC.product(id);
    if (!p) return;
    var recipes = SC.recipes.filter(function (r) { return r.cheese.some(function (c) { return c[0] === p.id; }); });
    var start = packId ? p.packs.findIndex(function (k) { return k.id === packId; }) : p.packs.findIndex(function (k, i) { return i === (p.def || 0); });
    if (start < 0 || p.packs[start].out) start = p.packs.findIndex(function (k) { return !k.out; });
    var html =
      '<article class="pm" style="--c:' + p.color + ';--tint:' + p.tint + '">' +
      '<div class="pm__media"><img class="pm__food" src="' + SC.img(p.img) + '" alt="' + esc(p.name) + '" width="1000" height="1250">' +
      '<figure class="pm__pack"><img data-pm-pack src="' + SC.img((p.packs[Math.max(start, 0)] || {}).img || p.pack) + '" alt="The ' + esc(p.name) + ' pack" width="480" height="480"><figcaption>The real pack</figcaption></figure></div>' +
      '<div class="pm__body">' +
      '<p class="pm__kicker"><i></i>' + esc(p.kind) + '</p>' +
      '<h2 class="pm__title">' + esc(p.name) + '</h2>' +
      '<p class="pm__desc">' + esc(p.desc) + '</p>' +
      tasteHTML(p.taste, 'pm__taste') +
      (p.variants ? '<div class="pm__variants">' + p.variants.map(function (v) { return '<p><strong>' + esc(v.name) + '.</strong> ' + esc(v.like) + (v.notes ? '. ' + esc(v.notes) : '') + '. Try it ' + esc(v.tryit.charAt(0).toLowerCase() + v.tryit.slice(1)) + '.</p>'; }).join('') + '</div>' : '') +
      '<form class="pm__buy" data-product="' + p.id + '">' +
      '<fieldset><legend>Pick a pack</legend><div class="pm__packs">' + p.packs.map(function (k, i) {
        return '<label' + (k.out ? ' class="is-out"' : '') + '><input type="radio" name="pack" value="' + k.id + '"' + (i === start ? ' checked' : '') + (k.out ? ' disabled' : '') + '>' +
          '<span><b>' + esc(k.label) + '</b><em>' + (k.out ? 'Sold out' : SC.money(k.price)) + '</em></span></label>';
      }).join('') + '</div></fieldset>' +
      (p.packs.some(function (k) { return k.out; }) ? '<button type="button" class="pm__notify" data-notify>' + SC.icon('bell') + 'Tell me when sold-out packs are back</button>' : '') +
      '<div class="pm__row">' + SC.stepperHTML('pm', 1, 'How many packs') +
      '<button class="btn btn--primary pm__add" type="submit">' + SC.icon('basket') + '<span>Add to my list</span><b class="pm__sum"></b></button></div>' +
      '<p class="pm__crew" data-pm-crew></p>' +
      '</form>' +
      (recipes.length ? '<div class="pm__recipes"><h3>Cook it</h3><div>' + recipes.slice(0, 3).map(function (r) {
        return '<button type="button" class="pm__rec" data-open-recipe="' + r.id + '"><img src="' + SC.img(r.img) + '" alt="" width="160" height="160" loading="lazy"><span><strong>' + esc(r.name) + '</strong><em>' + (r.mins ? r.mins + ' min · ' : '') + 'by ' + esc(r.by) + '</em></span></button>';
      }).join('') + '</div></div>' : '') +
      '<a class="pm__ask" href="' + SC.wa('Hello Sirimon! I have a question about ' + p.name + '.') + '" target="_blank" rel="noopener">' + SC.icon('whatsapp') + 'Ask about ' + esc(p.name) + ' on WhatsApp</a>' +
      '</div></article>';
    SC.modal.open(html, { className: 'sc-dialog--product', label: p.name, onOpen: function (d) {
      var form = $('.pm__buy', d);
      function sync() {
        var k = p.packs.find(function (x) { return x.id === (form.elements.pack.value || ''); });
        var n = Math.max(1, SC.stepperValue($('.qty', form)));
        $('.pm__sum', form).textContent = k && k.price ? SC.money(k.price * n) : '';
        if (k) $('[data-pm-pack]', d).src = SC.img(k.img || p.pack);
        var deal = k ? SC.lineDeal({ key: p.id + '|' + k.id, product: p, qty: n }) : null;
        var crew = $('[data-pm-crew]', d);
        if (deal && k.price) {
          var cut = Math.round(k.price * n * deal.pct / 100);
          crew.innerHTML = SC.member.isIn() ? SC.icon('crown') + '<span>Crew price: you save <strong>' + SC.money(cut) + '</strong> (' + esc(deal.title) + ')</span>'
            : SC.icon('lock') + '<span>Kitchen Crew members save <strong>' + SC.money(cut) + '</strong> on this. <button type="button" data-crew="join">Join free</button></span>';
          crew.hidden = false;
        } else crew.hidden = true;
      }
      form.addEventListener('change', sync);
      form.addEventListener('input', sync);
      form.addEventListener('click', function (e) {
        var b = e.target.closest('[data-step]');
        if (b) { var box = b.closest('.qty'); $('input', box).value = Math.max(1, SC.stepperValue(box) + +b.getAttribute('data-step')); sync(); }
        if (e.target.closest('[data-notify]')) SC.openNotify(p.id);
      });
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var n = Math.max(1, SC.stepperValue($('.qty', form)));
        if (!form.elements.pack.value) return;
        SC.addToList(p.id, form.elements.pack.value, n);
        var btn = $('.pm__add span', form);
        btn.textContent = 'Added. Add more?';
        setTimeout(function () { btn.textContent = 'Add to my list'; }, 2200);
      });
      document.addEventListener('sc:member', sync);
      sync();
    } });
  };

  /* ---------- A recipe ---------- */
  SC.openRecipe = function (id) {
    var r = SC.recipe(id);
    if (!r) return;
    if (r.crew && !SC.member.isIn()) {
      SC.crew.open('join', function () { SC.openRecipe(id); });
      SC.toast(r.name + ' is a Kitchen Crew recipe. Join free to open it.', { icon: 'lock', label: 'Log in', run: function () { SC.modal.closeAll(); SC.crew.open('login', function () { SC.openRecipe(id); }); } });
      return;
    }
    var cheeses = r.cheese.map(function (c) { return SC.product(c[0]); });
    var add = r.cheese.map(function (c) { var p = SC.product(c[0]); var k = p.packs.find(function (x) { return x.id === c[1]; }); return { p: p, k: k, n: c[2] }; });
    var total = add.reduce(function (t, a) { return t + (a.k.price || 0) * a.n; }, 0);
    var html =
      '<article class="rm">' +
      '<div class="rm__media"><img src="' + SC.img(r.img) + '" alt="' + esc(r.name) + '" width="900" height="900">' +
      '<span class="rm__badge">' + SC.icon('chef') + 'Recipe by ' + esc(r.by) + '</span>' + (r.crew ? '<span class="rm__crew">' + SC.icon('crown') + 'Kitchen Crew recipe</span>' : '') + '</div>' +
      '<div class="rm__body">' +
      '<ul class="rm__meta">' + (r.mins ? '<li>' + SC.icon('clock') + r.mins + ' min</li>' : '') + (r.serves ? '<li>' + SC.icon('users') + 'Serves ' + esc(r.serves) + '</li>' : '') +
      r.tags.map(function (t) { var tag = SC.recipeTags.find(function (x) { return x.id === t; }); return tag ? '<li class="rm__tag">' + esc(tag.name) + '</li>' : ''; }).join('') + '</ul>' +
      '<h2 class="rm__title">' + esc(r.name) + '</h2>' +
      '<p class="rm__intro">' + esc(r.intro) + '</p>' +
      '<div class="rm__cheese">' + cheeses.map(function (p) { return cheeseChip(p.id); }).join('') + '</div>' +
      '<div class="rm__cols">' +
      '<section><h3>You need</h3><ul class="rm__ing">' + r.ingredients.map(function (x) {
        return '<li><label><input type="checkbox"><span>' + esc(x) + '</span></label></li>';
      }).join('') + '</ul></section>' +
      '<section><h3>Method</h3><ol class="rm__steps">' + r.method.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ol></section></div>' +
      '<div class="rm__buy"><p>' + SC.icon('basket') + '<span><strong>The Sirimon cheese for this:</strong> ' + add.map(function (a) { return a.n + ' × ' + esc(a.p.name) + ' ' + esc(a.k.label); }).join(', ') + ' · ' + SC.money(total) + '</span></p>' +
      '<div class="rm__actions"><button type="button" class="btn btn--primary" data-add-recipe>' + SC.icon('plus') + '<span>Add the cheese to my list</span></button>' +
      '<a class="btn btn--wa" href="' + SC.wa('Hello Sirimon! Please send me the cheese for ' + r.name + ':\n' + add.map(function (a) { return '• ' + a.n + ' × ' + a.p.name + ', ' + a.k.label; }).join('\n')) + '" target="_blank" rel="noopener">' + SC.icon('whatsapp') + '<span>Order on WhatsApp</span></a></div></div>' +
      '</div></article>';
    SC.modal.open(html, { className: 'sc-dialog--recipe', label: r.name, onOpen: function (d) {
      $('[data-add-recipe]', d).addEventListener('click', function () {
        var ok = 0;
        r.cheese.forEach(function (c) { if (SC.addToList(c[0], c[1], c[2], true)) ok++; });
        if (ok) SC.toast('The cheese for ' + r.name + ' is on your list', { label: 'View list', icon: 'basket', run: function () { SC.go('#order'); } });
      });
    } });
  };

  /* ---------- The recipe bank ---------- */
  SC.openRecipes = function (tag) {
    tag = tag || 'all';
    var html = '<div class="rb"><header class="rb__head"><p class="rb__kicker">' + SC.icon('chef') + 'Cook with Sirimon</p><h2>The recipe bank</h2>' +
      '<p>Recipes from Kenyan cooks and chefs who cook with Sirimon. Pick one and its cheese goes on your list in a tap.</p>' +
      '<div class="rb__tools"><label class="rb__search">' + SC.icon('search') + '<span class="visually-hidden">Search recipes</span><input type="search" placeholder="Search: halloumi, chapati, breakfast…" data-rb-q></label>' +
      '<div class="rb__tags" role="group" aria-label="Filter recipes">' + SC.recipeTags.map(function (t) { return '<button type="button" data-rb-tag="' + t.id + '" aria-pressed="' + (t.id === tag) + '">' + esc(t.name) + '</button>'; }).join('') + '</div></div></header>' +
      '<div class="rb__grid" data-rb-grid></div><p class="rb__empty" data-rb-empty hidden>No recipe matches that yet. Try “halloumi” or “breakfast”.</p>' +
      '<p class="rb__more">More than 80 recipes live on <a href="https://www.sirimon.co.ke/recipes/" target="_blank" rel="noopener">sirimon.co.ke/recipes</a>.</p></div>';
    SC.modal.open(html, { className: 'sc-dialog--bank', label: 'The recipe bank', onOpen: function (d) {
      var grid = $('[data-rb-grid]', d), q = $('[data-rb-q]', d), cur = tag;
      function paint() {
        var s = q.value.trim().toLowerCase();
        var list = SC.recipes.filter(function (r) {
          var hay = (r.name + ' ' + r.by + ' ' + r.tags.join(' ') + ' ' + r.cheese.map(function (c) { return SC.product(c[0]).name; }).join(' ')).toLowerCase();
          return (cur === 'all' || r.tags.indexOf(cur) > -1) && (!s || hay.indexOf(s) > -1);
        });
        grid.innerHTML = list.map(function (r) {
          var p = SC.product(r.cheese[0][0]);
          return '<button type="button" class="rb__item" data-open-recipe="' + r.id + '" style="--c:' + p.color + '">' +
            '<span class="rb__img"><img src="' + SC.img(r.img) + '" alt="" width="400" height="400" loading="lazy">' + (r.crew ? '<i class="rb__lock">' + SC.icon(SC.member.isIn() ? 'crown' : 'lock') + '</i>' : '') + '</span>' +
            '<strong>' + esc(r.name) + '</strong><span>' + (r.mins ? r.mins + ' min · ' : '') + esc(p.short) + ' · by ' + esc(r.by) + '</span></button>';
        }).join('');
        $('[data-rb-empty]', d).hidden = list.length > 0;
      }
      d.addEventListener('click', function (e) {
        var b = e.target.closest('[data-rb-tag]');
        if (!b) return;
        cur = b.getAttribute('data-rb-tag');
        $$('[data-rb-tag]', d).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        paint();
      });
      q.addEventListener('input', paint);
      paint();
    } });
  };

  /* ---------- Films: Moses at the studio (with sound) and the hands at work ---------- */
  SC.openVideo = function (which) {
    var films = {
      moses: { src: 'video/moses.mp4', poster: 'video/moses.webp', cap: '<strong>Meet Moses.</strong> “It’s members of our team like Moses that help us see how far we’ve come.” Filmed at the Sirimon artisan studio in Laikipia, from Sirimon’s Facebook page.' },
      handcrafted: { src: 'video/handcrafted.mp4', poster: 'video/handcrafted.webp', cap: '<strong>Handcrafted = better.</strong> The true character of our cheese is crafted by the skilled hands of our cheesemakers. From Sirimon’s Facebook page.' }
    };
    var f = films[which || 'moses'] || films.moses;
    var html = '<div class="vm"><video src="' + SC.media(f.src) + '" poster="' + SC.media(f.poster) + '" controls autoplay playsinline preload="metadata"' + (which === 'handcrafted' ? ' muted loop' : '') + '></video>' +
      '<p class="vm__cap">' + f.cap + '</p></div>';
    SC.modal.open(html, { className: 'sc-dialog--video', label: 'A film from the Sirimon studio' });
  };

  /* ---------- Sirimon Cheese Platter: pre-order, written out for WhatsApp ---------- */
  SC.openPlatter = function () {
    var min = new Date(Date.now() + 2 * 864e5).toISOString().slice(0, 10);
    var html =
      '<div class="bm"><div class="bm__media"><img src="' + SC.img('food/grazing.webp') + '" alt="A grazing platter of cheeses and seasonal bites" width="1400" height="933"><p>Pre-order only</p></div>' +
      '<form class="bm__form" novalidate><p class="bm__kicker">The Sirimon Cheese Platter</p><h2>Pre-order a platter</h2>' +
      '<p class="bm__lead">A beautifully arranged grazing board with a curated selection of cheeses, accompaniments and seasonal bites, crafted to impress and ready to serve.</p>' +
      '<fieldset class="field field--full"><legend>How many guests?</legend><div class="bm__opts">' + ['4 to 6', '8 to 12', '15 to 20', '25 or more'].map(function (g, i) {
        return '<label><input type="radio" name="guests" value="' + g + '"' + (i === 1 ? ' checked' : '') + '><span><strong>' + g + '</strong><em>' + ['A date or a small dinner', 'Friends round', 'A party', 'An event table'][i] + '</em></span></label>';
      }).join('') + '</div></fieldset>' +
      '<div class="field"><label for="bm-occ">Occasion</label><select id="bm-occ" name="occasion">' + SC.optionsHTML(['Christmas or New Year', 'Birthday', 'Office or corporate', 'Wedding or engagement', 'Baby or bridal shower', 'Just because'], 'Choose one') + '</select></div>' +
      '<div class="field"><label for="bm-date">Date *</label><input id="bm-date" name="date" type="date" min="' + min + '"></div>' +
      '<div class="field"><label for="bm-name">Your name *</label><input id="bm-name" name="name" autocomplete="name"></div>' +
      '<div class="field"><label for="bm-phone">Phone *</label><input id="bm-phone" name="phone" type="tel" autocomplete="tel" placeholder="0712 345 678"></div>' +
      '<div class="field field--full"><label for="bm-notes">Anything we should know?</label><textarea id="bm-notes" name="notes" rows="2" placeholder="Venue, delivery area, favourite cheeses, dietary needs"></textarea></div>' +
      '<button class="btn btn--wa bm__send" type="submit">' + SC.icon('whatsapp') + '<span>Send on WhatsApp</span></button>' +
      '<p class="bm__note">This opens WhatsApp with your request written out. The team confirms the board and the price.</p></form></div>';
    SC.modal.open(html, { className: 'sc-dialog--board', label: 'Pre-order a Sirimon Cheese Platter', onOpen: function (d) {
      var form = $('form', d), tried = false;
      var rules = { date: SC.rules.required('Pick the date you need it.'), name: SC.rules.name, phone: SC.rules.phone };
      SC.liveValidate(form, rules, function () { return tried; });
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        tried = true;
        var bad = SC.validateForm(form, rules);
        if (bad) { bad.focus(); return; }
        var when = new Date(form.elements.date.value + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
        var msg = 'Hello Sirimon! I would like to pre-order a Sirimon Cheese Platter.\n\n' +
          '• Guests: ' + form.elements.guests.value + '\n' + (form.elements.occasion.value ? '• Occasion: ' + form.elements.occasion.value + '\n' : '') +
          '• Date: ' + when + '\n• Name: ' + form.elements.name.value.trim() + '\n• Phone: ' + form.elements.phone.value.trim() +
          (form.elements.notes.value.trim() ? '\n• Notes: ' + form.elements.notes.value.trim() : '');
        SC.openWa(msg);
        SC.modal.close(d);
        SC.toast('WhatsApp is open with your platter request');
      });
    } });
  };

  /* ---------- Notify me when a sold-out pack is back ---------- */
  SC.openNotify = function (productId, packId) {
    var p = SC.product(productId);
    var outs = p.packs.filter(function (k) { return k.out; });
    var me = SC.member.current();
    var html = '<form class="nm" novalidate><span class="nm__icon" style="--c:' + p.color + '">' + SC.icon('bell') + '</span>' +
      '<h2>Tell me when it’s back</h2><p>Small batches sell out. We’ll message you the day ' + esc(p.name) + ' is back in stock.</p>' +
      '<fieldset class="field field--full"><legend>Which pack?</legend><div class="nm__packs">' + outs.map(function (k) {
        return '<label><input type="checkbox" name="pack" value="' + k.id + '"' + (!packId || packId === k.id ? ' checked' : '') + '><span>' + esc(k.label) + '</span></label>';
      }).join('') + '</div></fieldset>' +
      '<div class="field"><label for="nm-contact">Email or WhatsApp number *</label><input id="nm-contact" name="contact" value="' + esc(me ? me.email : '') + '" placeholder="you@example.com or 0712 345 678"></div>' +
      '<button class="btn btn--primary" type="submit">' + SC.icon('bell') + '<span>Notify me</span></button>' +
      (me ? '<p class="nm__crew">' + SC.icon('crown') + 'Crew members hear first.</p>' : '') + '</form>';
    SC.modal.open(html, { className: 'sc-dialog--notify', label: 'Notify me', onOpen: function (d) {
      var form = $('form', d);
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var v = form.elements.contact.value.trim();
        var ok = SC.rules.emailReq(v) === true || SC.rules.phone(v) === true;
        SC.setError(form.elements.contact, ok ? '' : 'Enter an email address or a Kenyan mobile number.');
        if (!ok) { form.elements.contact.focus(); return; }
        var packs = $$('input[name="pack"]:checked', form).map(function (i) { return i.value; });
        var all = SC.store.get('sc-notify', []);
        all.push({ product: p.id, packs: packs, contact: v, at: new Date().toISOString() });
        SC.store.set('sc-notify', all);
        SC.modal.close(d);
        SC.toast('Done. We’ll tell you when ' + p.name + ' is back.', { icon: 'bell' });
      });
    } });
  };

  /* Any element with data-open-* opens the matching pop-up */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-open-product],[data-open-recipe],[data-open-video],[data-open-platter],[data-open-recipes],[data-add]');
    if (!t) return;
    e.preventDefault();
    if (t.hasAttribute('data-open-product')) SC.openProduct(t.getAttribute('data-open-product'), t.getAttribute('data-pack'));
    else if (t.hasAttribute('data-open-recipe')) SC.openRecipe(t.getAttribute('data-open-recipe'));
    else if (t.hasAttribute('data-open-video')) SC.openVideo(t.getAttribute('data-open-video'));
    else if (t.hasAttribute('data-open-platter')) SC.openPlatter();
    else if (t.hasAttribute('data-open-recipes')) SC.openRecipes(t.getAttribute('data-open-recipes'));
    else if (t.hasAttribute('data-add')) {
      var parts = t.getAttribute('data-add').split('|');
      SC.addToList(parts[0], parts[1] || null, +(parts[2] || 1));
    }
  });
})();
