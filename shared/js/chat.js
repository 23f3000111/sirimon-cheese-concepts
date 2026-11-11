/* Sirimon on WhatsApp: a chat that looks and feels like WhatsApp, answers from the site's own content
   (real prices, delivery zones, markets, recipes, storage tips), builds the cheese list, knows the Kitchen Crew,
   and hands the conversation to the real WhatsApp number. Rule based, no server. */
(function () {
  var SC = window.SC, $ = SC.$, $$ = SC.$$, esc = SC.esc;
  var C = SC.company;

  var CHIPS = [
    { label: 'Order cheese', say: 'I want to order cheese' },
    { label: 'What’s for dinner?', say: 'What’s for dinner tonight?' },
    { label: 'Delivery fees', say: 'How much is delivery?' },
    { label: 'Markets this week', say: 'Where can I find you this weekend?' },
    { label: 'Kitchen Crew deals', say: 'What are the member deals?' }
  ];

  function strip(s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’']/g, '').replace(/[^a-z0-9.\s]/g, ' '); }

  var CHEESE_WORDS = {
    everyday: /every ?day|evry ?day|kila siku|raclette/, mozzarella: /mozz?a?rr?ell?a|\bmozz\b|stretchy|pizza cheese/, cheddar: /chedd?ar|cheder|cheddah/,
    paneer: /paneer|panir|panner/, halloumi: /hall?oum?i|halumi|haloumi|grilling cheese|squeaky/, feta: /\bfeta\b/, gouda: /gouda|guoda|truffle/,
    cream: /cream cheese|creamcheese|sibiola|ricotta/, labneh: /labneh|labne|labna|mdabale/, ghee: /\bghee\b|samli/,
    jars: /chutney|jam\b|mustard|marmalade|chilli oil|chili oil|harissa|vinaigrette|\bjars?\b|condiment|sauce/, gifts: /gift|hamper|festive box|celebration box|medley/
  };

  var INTENTS = [
    { id: 'person', re: /\b(person|human|someone|agent|real person|staff)\b|talk to|speak to|call me/ },
    { id: 'crew', re: /crew|member|login|log in|sign up|signup|join|account|loyalty|points|reward|deal|offer|discount|promo|coupon|code|special/ },
    { id: 'list', re: /my list|my cart|my basket|my order|what.*in (my )?(list|cart|basket)|show list|view list/ },
    { id: 'add', re: /\badd\b|\bnataka\b|nipe|i want|i ll take|ill take|give me|put .* in|\bbuy\b|\bget me\b/ },
    { id: 'trees', re: /tree|forest|kabage|aberdare|foect|environment|planet|sustainab|climate/ },
    { id: 'platter', re: /platter|grazing|board for|party board|cheese board|cheeseboard for/ },
    { id: 'trade', re: /hotel|restaurant|bulk|wholesale|supplier|supply|distribut|cater|trade|business|large order|weekly order|school|cafe\b/ },
    { id: 'delivery', re: /deliver|delivery|courier|shipping|ship|send to|zone|kuleta|peleka|fee|transport/ },
    { id: 'markets', re: /market|pop.?up|fair|festival|bazaar|biz baz|stand|this weekend|event|find you/ },
    { id: 'price', re: /price|cost|how much|\bbei\b|rate|cheap|expensive|\bksh\b|\bkes\b|shilling|pesa/ },
    { id: 'order', re: /order|checkout|purchase|nunua|place an order|shop/ },
    { id: 'stockists', re: /supermarket|carrefour|naivas|quickmart|chandarana|zucchini|stockist|in store|where (can|do) i (buy|get)/ },
    { id: 'hours', re: /open|hours|closing|\bclose\b|what time|\bsaa\b|weekend|sunday|saturday/ },
    { id: 'where', re: /where|location|locat|address|factory|studio|visit|direction|\bmap\b|laikipia|nanyuki|wapi|office/ },
    { id: 'dinner', re: /dinner|tonight|supper|what (should|can) i (cook|make)|surprise me|random|hungry/ },
    { id: 'recipes', re: /recipe|cook|make with|idea|lunch|breakfast|curry|salad|bbq|grill|sandwich|toastie|pasta|snack|ugali|chapati|melt|pizza|samosa|githeri/ },
    { id: 'veg', re: /vegetarian|veg\b|rennet|halal|animal|vegan|ingredient|kebs|certif|haccp|iso|gmo|additive|preservative/ },
    { id: 'storage', re: /store|keep|fridge|freez|shelf life|expir|how long|last|mould|mold/ },
    { id: 'story', re: /who are you|about|history|since|started|sirimon (mean|river)|story|farmer|founded|how (is|do you make)|process/ },
    { id: 'careers', re: /job|career|vacanc|hiring|employ|work (for|with) you|cv\b/ },
    { id: 'social', re: /instagram|insta|facebook|\bfb\b|social|follow|tiktok|youtube/ },
    { id: 'contact', re: /contact|phone|\bcall\b|number|email|whatsapp|reach/ },
    { id: 'range', re: /range|cheeses|products|what do you (make|sell|have)|types|kinds|aina|menu|catalog/ },
    { id: 'thanks', re: /thank|asante|\bthx\b|great|perfect|\bcool\b|\bok\b|okay|nice|sawa|poa/ },
    { id: 'bye', re: /\bbye\b|goodbye|kwaheri|see you|later/ },
    { id: 'greet', re: /\b(hi|hello|hey|hola|jambo|habari|mambo|sasa|niaje|hujambo|good (morning|afternoon|evening))\b/ }
  ];

  function cheeseIn(s) {
    var hit = null;
    Object.keys(CHEESE_WORDS).forEach(function (id) { if (!hit && CHEESE_WORDS[id].test(s)) hit = id; });
    return hit;
  }
  function areaIn(s) {
    var found = null;
    SC.zones.forEach(function (z) { z.areas.forEach(function (a) { if (!found && s.indexOf(strip(a)) > -1) found = a; }); });
    return found;
  }
  function qtyIn(s) {
    var m = s.match(/\b(\d{1,2})\s*(x|packs?|pcs|pieces|blocks?|of)?\b(?!\s*(g|kg|gram|ml))/);
    var words = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, moja: 1, mbili: 2, tatu: 3, nne: 4, tano: 5 };
    if (m) return Math.min(+m[1], 30);
    var w = Object.keys(words).find(function (k) { return new RegExp('\\b' + k + '\\b').test(s); });
    return w ? words[w] : 1;
  }
  function packIn(p, s) {
    var size = s.match(/(\d+(?:\.\d+)?)\s*(kg|g|gram|grams)\b/) || s.match(/\b(half|nusu) ?(kilo|kg)\b/);
    var avail = p.packs.filter(function (k) { return !k.out; });
    var kw = [['slice', /slice/], ['nigella', /nigella|black seed/], ['periperi', /peri|patt/], ['discs', /disc/], ['smoked', /smok/], ['truffle', /truffle/],
      ['cumin', /cumin/], ['pepper', /pepper/], ['vintage', /vintage/], ['chilli', /chil+i/], ['mature', /mature/], ['olives', /olive/], ['peppers3', /3 pepper|three pepper/],
      ['garlic', /garlic/], ['stuffed', /stuffed/], ['plain', /plain/], ['cheeseboard', /cheeseboard|cheese board chutney/], ['ploughmans', /ploughman/], ['chilli-oil', /chil+i oil/],
      ['whiskey', /whisk/], ['curd', /curd|passion/], ['harissa', /harissa/], ['sundried', /sundried|sun dried/], ['marmalade', /marmalade/], ['balsamic', /balsamic/],
      ['celebration', /celebration/], ['festive', /festive|indulgence/], ['double', /double/], ['medley', /medley/]];
    for (var i = 0; i < kw.length; i++) {
      if (kw[i][1].test(s)) {
        var hit = p.packs.find(function (k) { return k.id === kw[i][0] || (kw[i][0] === 'slice' && /^sl/.test(k.id)); });
        if (hit) return hit;
      }
    }
    if (size) {
      var g = /half|nusu/.test(size[0]) ? 500 : size[2] === 'kg' ? +size[1] * 1000 : +size[1];
      var k = p.packs.find(function (x) { return x.g === g && !/^sl/.test(x.id); }) || p.packs.find(function (x) { return x.g === g; });
      if (k) return k;
    }
    return null;
  }

  function listSummary() {
    var lines = SC.list.lines();
    if (!lines.length) return '';
    var pr = SC.pricing(lines);
    return lines.map(function (l) { return l.qty + ' × ' + l.product.name + ' ' + l.pack.label + ' · ' + SC.money(l.sum); }).join('\n') +
      '\nTotal: ' + SC.money(pr.basket) + (pr.saving ? ' (Crew prices, −' + SC.money(pr.saving) + ')' : '');
  }
  function priceList(p) {
    return p.packs.map(function (k) { return '• ' + k.label + ': ' + (k.out ? 'sold out right now' : SC.money(k.price)); }).join('\n');
  }

  function reply(intent, ctx, raw) {
    var waList = { label: 'Send my list on WhatsApp', act: 'wa-list' };
    var desk = { label: 'Open my cheese list', act: 'order' };
    var person = { label: 'Chat with the team', act: 'wa-person' };
    var s = strip(raw || '');
    switch (intent) {
      case 'greet':
        return { text: 'Habari! 👋 Welcome to Sirimon Cheese, crafted with heart in Laikipia. I can build your order at shop prices, find a recipe, tell you delivery fees or where our next market is. What would you like?', chips: CHIPS };
      case 'range':
        return { text: 'Here’s the Sirimon family: Everyday, Mozzarella, Cheddar, Paneer, Halloumi, Feta, Gouda, Cream Cheese, Labneh and Ghee, plus Jars of Goodness. All vegetarian. Tap one for prices and packs.', products: SC.products.filter(function (p) { return p.id !== 'gifts'; }).map(function (p) { return p.id; }) };
      case 'product':
        var p = SC.product(ctx);
        return { text: 'Sirimon ' + p.name + ': ' + p.line + '\n\n' + priceList(p), products: [p.id], chips: [{ label: 'Recipes with ' + p.short, say: 'recipe with ' + p.name }, { label: 'Add ' + p.short, say: 'add ' + p.name }] };
      case 'add':
        var pr = SC.product(ctx);
        if (!pr) return { text: 'Which one would you like? Tap a cheese below, or type it like “2 halloumi” or “mozzarella 500g”.', products: ['everyday', 'mozzarella', 'cheddar', 'paneer', 'halloumi', 'feta'] };
        var n = qtyIn(s), pk = packIn(pr, s) || pr.packs[pr.def || 0];
        if (pk.out) {
          var alt = pr.packs.find(function (k) { return !k.out; });
          return { text: 'Sorry, ' + pr.name + ' ' + pk.label + ' is sold out right now. ' + (alt ? 'Would ' + alt.label + ' at ' + SC.money(alt.price) + ' do?' : ''), chips: alt ? [{ label: 'Yes, add ' + alt.label, say: 'add ' + n + ' ' + pr.name + ' ' + alt.label }] : null, actions: [{ label: 'Tell me when it’s back', act: 'notify', id: pr.id, pack: pk.id }] };
        }
        SC.addToList(pr.id, pk.id, n, true);
        return { text: 'Done ✅ ' + n + ' × ' + pr.name + ', ' + pk.label + ' is on your list.\n\n' + listSummary(), actions: [waList, desk], chips: [{ label: 'Add another cheese', say: 'What cheeses do you make?' }, { label: 'Delivery to my area', say: 'How much is delivery?' }] };
      case 'list':
        var sum = listSummary();
        return sum ? { text: 'Your cheese list:\n' + sum, actions: [waList, desk] } : { text: 'Your list is empty for now. Shall I show you the range?', chips: [{ label: 'See the range', say: 'What cheeses do you make?' }] };
      case 'order':
        var has = SC.list.total();
        return { text: has ? 'Lovely. You have ' + SC.packs(has) + ' on your list. Send it on WhatsApp, or finish the order on the page: delivery, a market pick-up or collection at the studio.' : 'Easy: type what you’d like, like “2 halloumi and a 500g mozzarella”, or tap a cheese. Prices are the shop’s prices.', actions: has ? [waList, desk] : [desk], products: has ? null : ['everyday', 'mozzarella', 'halloumi', 'paneer'] };
      case 'price':
        if (ctx) { var pp = SC.product(ctx); return { text: 'Sirimon ' + pp.name + ' prices today:\n' + priceList(pp) + (SC.deals.some(function (d) { return d.products && d.products.indexOf(pp.id) > -1 || d.keys && d.keys.join(' ').indexOf(pp.id + '|') > -1; }) ? '\n\nKitchen Crew members get 10% off this one.' : ''), products: [pp.id] }; }
        return { text: 'Every price on the site is the shop’s price: Everyday from KES 300, Mozzarella and Paneer from KES 400, Halloumi from KES 450, Gouda from KES 450, Labneh KES 700. Which cheese should I price for you?', chips: [{ label: 'Halloumi', say: 'how much is halloumi' }, { label: 'Mozzarella', say: 'how much is mozzarella' }, { label: 'Paneer', say: 'how much is paneer' }] };
      case 'delivery':
        var area = areaIn(s);
        if (area) {
          var z = SC.zoneOf(area), crew = SC.member.dropFor(z.id);
          return { text: area + ' is in Zone ' + z.id + ': delivery is ' + SC.money(z.fee) + (z.freeFrom ? ', free on orders from ' + SC.money(z.freeFrom) : '') + '.' + (crew ? ' As a Crew member it’s free from ' + SC.money(crew) + '.' : '') +
            (z.days && z.days[area] ? '\n' + area + ' deliveries go out on Tuesdays and Fridays.' : '') + (z.lead ? '\nZone ' + z.id + ' needs two working days.' : '\nOrder by 2pm for next-day delivery.'), actions: [desk] };
        }
        return { text: 'Nairobi delivery goes by zone:\n• Zone A (Westlands, Parklands) KES 250\n• Zone B (Kilimani, Lavington, CBD…) KES 350\n• Zone C (Ngong Road, South B/C…) KES 400\n• Zone D (Runda, Ruaka…) KES 450\n• Zone E (Karen, Langata, Kasarani…) KES 550\n• Zone F (Kiambu, Kikuyu, Rongai…) KES 700\nFree from KES 3,500 in A and B, and from KES 4,000 in C to E. Out of town is KES 600 by courier. Order by 2pm for next-day delivery. Tell me your area and I’ll check it.', chips: [{ label: 'Kilimani', say: 'delivery to Kilimani' }, { label: 'Karen', say: 'delivery to Karen' }, { label: 'Out of town', say: 'delivery out of town' }] };
      case 'markets':
        var ev = SC.upcomingEvents();
        if (!ev.length) return { text: 'New pop-ups are announced on Instagram. Follow @sirimoncheese to hear first.' };
        var nx = ev[0], dd = SC.daysUntil(nx.start);
        return { text: 'Our next pop-up is ' + nx.name + ', ' + SC.eventDates(nx) + (nx.hours ? ', ' + nx.hours : '') + ' at ' + nx.place + ', ' + nx.city + (dd > 0 ? ' (in ' + dd + (dd === 1 ? ' day' : ' days') + ')' : dd === 0 ? ' (today!)' : '') + '.\n\nAfter that:\n' +
          ev.slice(1, 5).map(function (e) { return '• ' + e.name + ', ' + SC.eventDates(e) + ', ' + e.place; }).join('\n') + '\n\nOrder ahead and pick it up at the stand.', actions: [{ label: 'Order ahead for a market', act: 'market', id: nx.collect ? nx.id : (ev.find(function (e) { return e.collect; }) || {}).id }] };
      case 'hours':
        var st = SC.openState();
        return { text: (st.open ? 'The studio is open right now. ' + st.sub + '.' : 'The studio is closed right now. ' + st.sub + '.') + '\n\n' + C.hours.map(function (h) { return h[0] + ': ' + h[1]; }).join('\n') + '\n\nOnline orders and this chat are open all the time.', location: true };
      case 'where':
        return { text: 'Our artisan cheese studio is at ' + C.studio + ', ' + C.near + ', at the foot of Mt Kenya. Nairobi office: ' + C.phone + '. Nanyuki office: ' + C.nanyuki + '.', location: true, chips: [{ label: 'Opening hours', say: 'What time are you open?' }, { label: 'Markets', say: 'Where can I find you this weekend?' }] };
      case 'stockists':
        return { text: 'Sirimon is available across the country through select stockists, at our pop-up markets, and direct from us with delivery. Buying direct also sends KES 25 a kilo to Kabage Forest.', actions: [desk, person] };
      case 'dinner':
        var pick = SC.recipes[Math.floor(Math.random() * SC.recipes.length)];
        return { text: 'What’s for dinner tonight? 🫕 How about ' + pick.name + ' by ' + pick.by + (pick.mins ? ', ready in about ' + pick.mins + ' minutes' : '') + '?', recipes: [pick.id], chips: [{ label: 'Something else', say: 'what’s for dinner tonight' }, { label: 'Quick ideas', say: 'quick recipe' }] };
      case 'recipes':
        var c = cheeseIn(s);
        var recs = SC.recipes.filter(function (r) { return (!c || r.cheese.some(function (x) { return x[0] === c; })) && (!/quick|fast/.test(s) || r.tags.indexOf('quick') > -1) && (!/breakfast/.test(s) || r.tags.indexOf('breakfast') > -1) && (!/kenya|ugali|chapati|githeri/.test(s) || r.tags.indexOf('kenyan') > -1); });
        if (!recs.length) recs = SC.recipes;
        return { text: c ? 'Here’s what to cook with Sirimon ' + SC.product(c).name + ':' : 'Hungry? Pick one. Each recipe can put its cheese on your list in one tap.', recipes: recs.slice(0, 6).map(function (r) { return r.id; }), actions: [{ label: 'Open the recipe bank', act: 'bank' }] };
      case 'veg':
        return { text: 'All our products are vegetarian, and our factory is HACCP, Halal and ISO certified. No genetically modified, synthetic or artificial ingredients go into our cheese. The finest starter cultures, natural rennet and whole milk from the local community give it its flavour.', actions: [person] };
      case 'storage':
        if (/paneer/.test(s)) return { text: 'Paneer tips from the studio:\n• Unopened: keep it sealed in its pack in the coldest part of the fridge.\n• Opened: keep it under clean water in a sealed container, change the water daily and use it within 3 to 4 days.\n• Freezing: split a 1 kg pack into two 500 g portions, squeeze out the air and use within 2 months. Thaw overnight in the fridge.' };
        return { text: 'How to keep Sirimon at its best:\n• ' + SC.tips.slice(0, 4).join('\n• ') };
      case 'story':
        return { text: 'Sirimon is an independent artisanal cheese studio at the foot of Mt Kenya in Laikipia, named for the Sirimon River and its pure water. We work with 1,200+ local dairy farming families, test every milk delivery in our lab, and have been making cheese for 10 years. The process is sacred. This is the Sirimon way.', actions: [{ label: 'Watch: meet Moses at the studio', act: 'video' }] };
      case 'trees':
        return { text: 'Cheese for Trees 🌳 For every 1 kg of cheese you buy direct from us, KES 25 goes to planting Kabage Forest in the Aberdares, with Friends of Environment Conservation Trust. It protects the pastures that feed our dairy and supports 1,200+ farming families.' + (SC.list.grams() ? '\n\nYour list so far plants ' + SC.money(SC.trees(SC.list.grams())) + '.' : ''), actions: [desk] };
      case 'crew':
        var me = SC.member.current();
        if (me) return { text: 'You’re in the Kitchen Crew, ' + me.name + ' 👑 Your Crew prices are on: 10% off Everyday, Mozzarella and every cheddar, 8% off three or more Mozzarella or Paneer, free delivery from KES 2,500 in zones A to C' + (SC.member.birthdayMonth(me) ? ', and a free birthday Halloumi this month' : '') + '. You have ' + (me.points || 0).toLocaleString('en-GB') + ' points.', actions: [{ label: 'Open my Kitchen Crew', act: 'crew' }, desk] };
        return { text: 'Join the Kitchen Crew, free: members’ prices (10% off Everyday, Mozzarella and cheddar), free delivery from KES 2,500 in zones A to C, a birthday Halloumi, members’ recipes and double points at markets.' + (SC.pricing().could ? '\n\nOn your current list you’d save ' + SC.money(SC.pricing().could) + '.' : ''), actions: [{ label: 'Join the Kitchen Crew', act: 'crew' }, { label: 'Log in', act: 'crew-login' }] };
      case 'platter':
        return { text: 'The Sirimon Cheese Platter is a grazing board of curated cheeses, accompaniments and seasonal bites, crafted to impress and ready to serve. It’s made to order: tell us the date and how many guests.', actions: [{ label: 'Pre-order a platter', act: 'platter' }, person] };
      case 'trade':
        return { text: 'We supply restaurants, cafés, hotels, caterers and shops: Everyday Cheese up to 2.5 kg blocks, cheddar, paneer, mozzarella and burger slices. Tell us what you cook and roughly how much a week, and the team will share trade prices and a delivery plan.', actions: [{ label: 'Start a business order', act: 'trade' }, person] };
      case 'careers':
        return { text: 'We’re growing! Past openings include retail brand promoter, chef and brand ambassador. Send your CV and a short note about yourself to ' + C.careers + '.', actions: [{ label: 'Email ' + C.careers, href: 'mailto:' + C.careers }] };
      case 'social':
        return { text: 'Follow Sirimon for recipes, market dates and new small batches:', actions: SC.socials.map(function (x) { return { label: x.name + ' · ' + x.handle + (x.count ? ' · ' + x.count : ''), href: x.href }; }) };
      case 'contact':
      case 'person':
        return { text: 'The Sirimon team is on WhatsApp at ' + C.phone + ' (Nairobi office), on ' + C.nanyuki + ' (Nanyuki office) and at ' + C.email + '. Tap below and I’ll pass our chat to a person.', actions: [person, { label: 'Call ' + C.phone, href: C.phoneHref }, { label: 'Email us', href: C.emailHref }] };
      case 'thanks':
        return { text: 'Karibu sana! Anything else? 🧀', chips: CHIPS };
      case 'bye':
        return { text: 'Kwaheri! Naturally extraordinary cheese is one message away. 🧀' };
      default:
        return { text: 'I’m not sure about that one yet. I can help with prices, orders, delivery, markets, recipes and the Kitchen Crew, or pass you to a person.', chips: CHIPS, actions: [person] };
    }
  }

  function understand(text) {
    var s = strip(text);
    var cheese = cheeseIn(s);
    var hit = INTENTS.find(function (i) { return i.re.test(s); });
    if (hit && hit.id === 'add') return reply('add', cheese, text);
    if (hit && hit.id === 'price') return reply('price', cheese, text);
    if (cheese && hit && (hit.id === 'recipes' || hit.id === 'storage')) return reply(hit.id, cheese, text);
    if (cheese && hit && hit.id === 'order') return reply('add', cheese, text);
    if (cheese && (!hit || ['range', 'greet', 'thanks', 'story', 'dinner', 'where'].indexOf(hit.id) > -1)) return reply('product', cheese, text);
    if (!hit && areaIn(s)) return reply('delivery', null, text);
    return reply(hit ? hit.id : 'fallback', cheese, text);
  }

  function clock() { return new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }); }

  SC.chat = {
    init: function (cfg) {
      cfg = cfg || {};
      var root = document.createElement('div');
      root.className = 'wa';
      root.innerHTML =
        '<div class="wa__teaser" hidden><button class="wa__teaser-text" type="button"><span class="wa__teaser-av"><img src="' + SC.img('logo/badge-sm.webp') + '" alt=""></span>' +
        '<span><strong>Sirimon Cheese</strong>' + esc(cfg.teaser || 'Habari! 👋 What’s for dinner tonight? Ask me about cheese, prices or delivery.') + '</span></button>' +
        '<button class="wa__teaser-x" type="button" aria-label="Dismiss">' + SC.icon('close') + '</button></div>' +
        '<section class="wa__panel" id="wa-panel" data-lenis-prevent aria-label="Chat with Sirimon Cheese" hidden>' +
        '<header class="wa__head"><span class="wa__av"><img src="' + SC.img('logo/badge-sm.webp') + '" alt=""></span>' +
        '<span class="wa__who"><strong>Sirimon Cheese</strong><span class="wa__status">online</span></span>' +
        '<a class="wa__head-btn" href="' + C.phoneHref + '" aria-label="Call Sirimon Cheese">' + SC.icon('phone') + '</a>' +
        '<button class="wa__head-btn wa__close" type="button" aria-label="Close chat">' + SC.icon('close') + '</button></header>' +
        '<div class="wa__log" role="log" aria-live="polite" aria-relevant="additions">' +
        '<p class="wa__day">Today</p>' +
        '<p class="wa__sys">' + SC.icon('info') + 'Answers come from Sirimon’s cheese assistant. Tap “Continue on WhatsApp” any time to reach a person.</p></div>' +
        '<form class="wa__form"><span class="wa__emoji" aria-hidden="true">' + SC.icon('smile') + '</span><label class="visually-hidden" for="wa-input">Message</label>' +
        '<input id="wa-input" type="text" autocomplete="off" maxlength="300" placeholder="Type a message, e.g. 2 halloumi">' +
        '<button type="submit" class="wa__send" aria-label="Send">' + SC.icon('send') + '</button></form>' +
        '<a class="wa__continue" target="_blank" rel="noopener" href="' + SC.wa() + '">' + SC.icon('whatsapp') + 'Continue on WhatsApp</a>' +
        '</section>' +
        '<button class="wa__launcher" type="button" aria-expanded="false" aria-controls="wa-panel" aria-label="Chat with Sirimon on WhatsApp">' +
        SC.icon('whatsapp') + '<span class="wa__badge">1</span></button>';
      document.body.appendChild(root);

      var panel = $('.wa__panel', root), log = $('.wa__log', root), launcher = $('.wa__launcher', root);
      var input = $('#wa-input', root), teaser = $('.wa__teaser', root), status = $('.wa__status', root), cont = $('.wa__continue', root);
      var started = false, transcript = [];

      function down() { log.scrollTop = log.scrollHeight; }
      function updateContinue() {
        var last = transcript.slice(-4).join('\n');
        var sum = listSummary();
        cont.href = SC.wa('Hello Sirimon! ' + (sum ? 'My cheese list:\n' + sum + '\n\n' : '') + (last ? 'From the website chat:\n' + last : 'I have a question.'));
      }

      function addUser(text) {
        var m = document.createElement('div');
        m.className = 'wa-msg wa-msg--out';
        m.innerHTML = '<p>' + esc(text) + '</p><span class="wa-msg__meta">' + clock() + '<i class="wa-msg__ticks">' + SC.icon('checks') + '</i></span>';
        log.appendChild(m);
        transcript.push('Me: ' + text);
        down();
        setTimeout(function () { m.classList.add('is-read'); }, 700);
      }

      function card(p) {
        var from = SC.fromPrice(p);
        return '<div class="wa-card" style="--c:' + p.color + '"><button type="button" class="wa-card__img" data-p="' + p.id + '"><img src="' + SC.img(p.pack) + '" alt=""></button>' +
          '<strong>' + esc(p.name) + '</strong><span>' + (from ? 'From ' + SC.money(from) : 'Sold out') + '</span>' +
          '<span class="wa-card__btns"><button type="button" data-wa-add="' + p.id + '">' + SC.icon('plus') + 'Add</button><button type="button" data-p="' + p.id + '">Packs</button></span></div>';
      }

      function renderBot(r) {
        var m = document.createElement('div');
        m.className = 'wa-msg wa-msg--in';
        var html = '<p>' + esc(r.text).replace(/\n/g, '<br>') + '</p>';
        if (r.location) {
          html += '<a class="wa-loc" href="' + C.maps + '" target="_blank" rel="noopener"><span class="wa-loc__map">' + SC.icon('pin') + '</span><span><strong>Sirimon Cheese studio</strong>' + esc(C.studio) + '</span></a>';
        }
        html += '<span class="wa-msg__meta">' + clock() + '</span>';
        m.innerHTML = html;
        log.appendChild(m);
        transcript.push('Sirimon: ' + r.text.split('\n')[0].slice(0, 140));
        if (r.products) {
          var row = document.createElement('div');
          row.className = 'wa-cards';
          row.innerHTML = r.products.map(function (id) { return card(SC.product(id)); }).join('');
          log.appendChild(row);
        }
        if (r.recipes) {
          var rr = document.createElement('div');
          rr.className = 'wa-cards wa-cards--rec';
          rr.innerHTML = r.recipes.map(function (id) {
            var x = SC.recipe(id);
            return '<div class="wa-card"><button type="button" class="wa-card__img wa-card__img--sq" data-r="' + x.id + '"><img src="' + SC.img(x.img) + '" alt=""></button><strong>' + esc(x.name) + '</strong><span>' + (x.mins ? x.mins + ' min · ' : '') + 'by ' + esc(x.by) + '</span>' +
              '<span class="wa-card__btns"><button type="button" data-r="' + x.id + '">Recipe</button><button type="button" data-rc="' + x.id + '">' + SC.icon('plus') + 'Cheese</button></span></div>';
          }).join('');
          log.appendChild(rr);
        }
        if (r.actions) {
          var acts = document.createElement('div');
          acts.className = 'wa-acts';
          acts.innerHTML = r.actions.map(function (a, i) {
            if (a.href) return '<a href="' + a.href + '" target="_blank" rel="noopener">' + esc(a.label) + '</a>';
            return '<button type="button" data-i="' + i + '">' + esc(a.label) + '</button>';
          }).join('');
          $$('button', acts).forEach(function (btn) { btn.addEventListener('click', function () { act(r.actions[+btn.getAttribute('data-i')]); }); });
          log.appendChild(acts);
        }
        if (r.chips) renderChips(r.chips);
        updateContinue();
        down();
      }

      function renderChips(chips) {
        var old = $('.wa-chips', log);
        if (old) old.remove();
        var c = document.createElement('div');
        c.className = 'wa-chips';
        chips.forEach(function (ch) {
          var b = document.createElement('button');
          b.type = 'button';
          b.textContent = ch.label;
          b.addEventListener('click', function () { ask(ch.say); });
          c.appendChild(b);
        });
        log.appendChild(c);
      }

      function botSay(r) {
        status.textContent = 'typing…';
        var t = document.createElement('div');
        t.className = 'wa-msg wa-msg--in wa-msg--typing';
        t.setAttribute('aria-label', 'Sirimon is typing');
        t.innerHTML = '<i></i><i></i><i></i>';
        log.appendChild(t);
        down();
        setTimeout(function () { t.remove(); status.textContent = 'online'; renderBot(r); }, SC.reducedMotion() ? 120 : 600 + Math.min(r.text.length * 4, 900));
      }

      function ask(text, forced) {
        var old = $('.wa-chips', log);
        if (old) old.remove();
        addUser(text);
        botSay(forced || understand(text));
      }

      function act(a) {
        if (a.act === 'order') { close(); SC.go('#order'); }
        else if (a.act === 'trade') { close(); if (SC.desk) SC.desk.business(); SC.go('#order'); }
        else if (a.act === 'market') { close(); if (SC.desk) SC.desk.market(a.id); SC.go('#order'); }
        else if (a.act === 'video') SC.openVideo('moses');
        else if (a.act === 'platter') SC.openPlatter();
        else if (a.act === 'bank') SC.openRecipes();
        else if (a.act === 'notify') SC.openNotify(a.id, a.pack);
        else if (a.act === 'crew') SC.crew.open('join');
        else if (a.act === 'crew-login') SC.crew.open('login');
        else if (a.act === 'wa-list') {
          var pr = SC.pricing();
          SC.openWa('Hello Sirimon! Here is my cheese list:\n' + SC.listText() + '\nTotal: ' + SC.money(pr.basket) + '\n\nPlease confirm delivery and payment.');
        } else if (a.act === 'wa-person') {
          updateContinue();
          window.open(cont.href, '_blank', 'noopener');
        }
      }

      log.addEventListener('click', function (e) {
        var t = e.target.closest('button');
        if (!t) return;
        if (t.hasAttribute('data-wa-add')) {
          var p = SC.product(t.getAttribute('data-wa-add'));
          ask('Add ' + p.name, reply('add', p.id, 'add ' + p.name));
        } else if (t.hasAttribute('data-p')) SC.openProduct(t.getAttribute('data-p'));
        else if (t.hasAttribute('data-r')) SC.openRecipe(t.getAttribute('data-r'));
        else if (t.hasAttribute('data-rc')) {
          var r = SC.recipe(t.getAttribute('data-rc'));
          r.cheese.forEach(function (c) { SC.addToList(c[0], c[1], c[2], true); });
          botSay({ text: 'The cheese for ' + r.name + ' is on your list ✅\n\n' + listSummary(), actions: [{ label: 'Send my list on WhatsApp', act: 'wa-list' }, { label: 'Open my cheese list', act: 'order' }] });
        }
      });

      function open() {
        panel.hidden = false;
        teaser.hidden = true;
        root.classList.add('is-open');
        launcher.setAttribute('aria-expanded', 'true');
        try { sessionStorage.setItem('sc-chat-seen', '1'); } catch (e) { /* ignore */ }
        if (!started) {
          started = true;
          var me = SC.member.current();
          botSay({ text: cfg.greeting || ('Habari' + (me ? ' ' + me.name : '') + '! 👋 I’m Sirimon’s cheese assistant. I can build your order at shop prices, check delivery to your area, find a recipe or tell you where our next market is.'), chips: CHIPS });
        }
        setTimeout(function () { input.focus(); }, 60);
      }
      function close() {
        root.classList.remove('is-open');
        launcher.setAttribute('aria-expanded', 'false');
        panel.hidden = true;
      }

      launcher.addEventListener('click', function () { if (panel.hidden) open(); else close(); });
      $('.wa__close', root).addEventListener('click', function () { close(); launcher.focus(); });
      panel.addEventListener('keydown', function (e) { if (e.key === 'Escape') { close(); launcher.focus(); } });
      $('.wa__form', root).addEventListener('submit', function (e) {
        e.preventDefault();
        var v = input.value.trim();
        if (!v) return;
        input.value = '';
        ask(v);
      });
      $('.wa__teaser-text', root).addEventListener('click', open);
      $('.wa__teaser-x', root).addEventListener('click', function () {
        teaser.hidden = true;
        try { sessionStorage.setItem('sc-chat-seen', '1'); } catch (e) { /* ignore */ }
      });
      var seen = false;
      try { seen = sessionStorage.getItem('sc-chat-seen') === '1'; } catch (e) { /* ignore */ }
      if (!seen) setTimeout(function () { if (panel.hidden) teaser.hidden = false; }, cfg.teaserDelay || 6000);

      SC.chat.open = open;
      SC.chat.close = close;
      SC.chat.ask = function (text) { open(); setTimeout(function () { ask(text); }, started ? 50 : 1400); };
    }
  };
  SC.chat.understand = understand;
})();
