/* Sirimon Cheese: what both concepts know about the cheeses, prices, recipes, markets, delivery and the Kitchen Crew.
   Prices, pack sizes and stock are from sirimon.co.ke/shop on 11 November 2026. Recipes are from Sirimon's recipe bank,
   with the credit each one carries there. Tasting notes for gouda, cheddar and feta are from Sirimon's own posts. */
(function () {
  var SC = window.SC = window.SC || {};

  SC.company = {
    name: 'Sirimon Cheese',
    studio: 'Plot No. 49, Kalalu, Laikipia East',
    near: 'Near Mathagiro Town, Meru',
    phone: '0799 755 690', phoneHref: 'tel:+254799755690', wa: '254799755690',
    nanyuki: '0700 112 888', nanyukiHref: 'tel:+254700112888',
    email: 'customerservice@sirimon.co.ke', emailHref: 'mailto:customerservice@sirimon.co.ke',
    careers: 'corporate@sirimon.co.ke',
    maps: 'https://www.google.com/maps/place/Sirimon+Cheese/@0.1545604,37.9082932,15z/data=!4m6!3m5!1s0x182f1782198e5a91:0xbfeab894caa1e94a!8m2!3d0.1545604!4d37.9082932!16s%2Fg%2F11ny4c2_z7',
    embed: 'https://maps.google.com/maps?q=Sirimon%20Cheese%400.1545604,37.9082932&z=11&output=embed',
    since: 2015,
    // minutes from midnight, East Africa Time. 0 = Sunday
    week: { 0: null, 1: [480, 1020], 2: [480, 1020], 3: [480, 1020], 4: [480, 1020], 5: [480, 1020], 6: [480, 720] },
    hours: [['Monday to Friday', '8am to 5pm'], ['Saturday', '8am to 12pm'], ['Sunday', 'Closed']],
    rating: { stars: '5.0', count: 9 }
  };

  SC.socials = [
    { id: 'instagram', name: 'Instagram', label: 'Sirimon Cheese on Instagram', handle: '@sirimoncheese', href: 'https://www.instagram.com/sirimoncheese/', count: '9.8K' },
    { id: 'facebook', name: 'Facebook', label: 'Sirimon Cheese on Facebook', handle: '/SirimonCheese', href: 'https://www.facebook.com/SirimonCheese', count: '29K' },
    { id: 'whatsapp', name: 'WhatsApp', label: 'Sirimon Cheese on WhatsApp', handle: '0799 755 690', href: 'https://wa.me/254799755690', count: '' }
  ];

  SC.moods = [
    { id: 'melt', name: 'Melt', icon: 'flame' },
    { id: 'grill', name: 'Grill', icon: 'grill' },
    { id: 'crumble', name: 'Crumble', icon: 'crumble' },
    { id: 'spread', name: 'Spread', icon: 'knife' },
    { id: 'board', name: 'Board', icon: 'board' },
    { id: 'jars', name: 'Jars & gifts', icon: 'gift' }
  ];

  /* g = weight in grams (0 for jars and gift boxes), price in KES, out = sold out on the shop that day */
  SC.products = [
    {
      id: 'everyday', name: 'Everyday Cheese', short: 'Everyday', color: '#E5157A', tint: '#FFE3F0', cheese: true,
      kind: 'Firm · melts beautifully', moods: ['melt', 'board'],
      line: 'Gouda and cheddar, combined. The one that melts.',
      desc: 'Firmly textured, combining characteristics reminiscent of Mozzarella, Cheddar and Gouda. Everyday Cheese is perfect for everyday use. The versatile and easy-to-cook-with cheese is a classic staple in the kitchen. Also in slices for convenience.',
      taste: { like: 'Gouda and cheddar, combined', notes: 'Firm, mellow and easy to cook with', tryit: 'Melted for a raclette night' },
      img: 'food/everyday-pull.webp', pack: 'packs/everyday-250.webp', cut: 'cut/pack-everyday.webp',
      packs: [
        { id: '150', label: '150 g', g: 150, price: 300, img: 'packs/everyday-150.webp' },
        { id: '250', label: '250 g', g: 250, price: 450, img: 'packs/everyday-250.webp' },
        { id: '500', label: '500 g', g: 500, price: 820, img: 'packs/everyday-500.webp' },
        { id: '1kg', label: '1 kg', g: 1000, price: null, out: true, img: 'packs/everyday-1kg.webp' },
        { id: '2kg', label: '2.5 kg', g: 2500, price: null, out: true, img: 'packs/everyday-2kg.webp' },
        { id: 'sl200', label: 'Slices 200 g', g: 200, price: 450, img: 'packs/slices-everyday.webp' },
        { id: 'sl1kg', label: 'Slices 1 kg', g: 1000, price: 1480, img: 'packs/slices-everyday.webp' }
      ], def: 2
    },
    {
      id: 'mozzarella', name: 'Mozzarella', short: 'Mozzarella', color: '#F2B705', tint: '#FFF4C7', cheese: true,
      kind: 'Stretched by hand', moods: ['melt'],
      line: 'Moist, delicate, stretched and kneaded by hand.',
      desc: 'Moist and delicate with hints of subtle sweetness, coming from the finest milk in Laikipia. The cheese is diligently stretched and kneaded by hand at our artisan studio, giving it its soft and springy texture. It works well in pasta, salads, sandwiches and pizzas.',
      taste: { like: 'Fresh milk with a hint of sweetness', notes: 'Soft, springy, made to stretch', tryit: 'On pizza night, or with grilled peaches' },
      img: 'food/mozzarella-pull.webp', pack: 'packs/mozzarella-250.webp', cut: 'cut/pack-mozzarella.webp',
      packs: [
        { id: '250', label: '250 g', g: 250, price: 400, img: 'packs/mozzarella-250.webp' },
        { id: '500', label: '500 g', g: 500, price: 750, img: 'packs/mozzarella-500.webp' },
        { id: '1kg', label: '1 kg', g: 1000, price: null, out: true, img: 'packs/mozzarella-1kg.webp' }
      ], def: 1
    },
    {
      id: 'cheddar', name: 'Cheddar', short: 'Cheddar', color: '#E2231A', tint: '#FFE2DD', cheese: true,
      kind: 'Mellow to vintage', moods: ['melt', 'board'],
      line: 'Five cheddars, from mellow to vintage chilli.',
      desc: 'A firm-textured cheese that goes through the unique cheddaring process for its distinctive taste and texture. Regular Cheddar is mildly flavoured, matured for 3 months. Mature Cheddar has a sharp taste with a long finish, matured for up to 7 months. The chilli cheddar is infused with bird’s eye chilli from Malindi.',
      taste: { like: 'The cheese you grew up on', notes: 'Mellow, milky, easy', tryit: 'On a bean and cheese toast' },
      variants: [
        { name: 'Mature', like: 'A meal in an Irish pub', notes: 'Sharp, tangy, with a proper bite', tryit: 'With a pickle on a sandwich' },
        { name: 'Vintage', like: 'You should be drinking a full-bodied red with it', notes: 'Deep, tangy and crumbly', tryit: 'On a cracker with ploughman’s chutney' },
        { name: 'Chilli', like: 'Your favourites with the volume turned up', notes: 'Sharp, mellow heat that rises', tryit: 'In a quesadilla' }
      ],
      img: 'food/cheddar-melt.webp', pack: 'packs/cheddar-250.webp', cut: 'cut/pack-cheddar.webp',
      packs: [
        { id: '250', label: '250 g', g: 250, price: 450, img: 'packs/cheddar-250.webp' },
        { id: '500', label: '500 g', g: 500, price: null, out: true, img: 'packs/cheddar-500.webp' },
        { id: '1kg', label: '1 kg', g: 1000, price: null, out: true, img: 'packs/cheddar-1kg.webp' },
        { id: '2kg', label: '2.5 kg', g: 2500, price: null, out: true, img: 'packs/cheddar-2kg.webp' },
        { id: 'sl1kg', label: 'Slices 1 kg', g: 1000, price: 1480, img: 'packs/slices-cheddar.webp' },
        { id: 'mature', label: 'Mature 200 g', g: 200, price: null, out: true, img: 'packs/mature.webp' },
        { id: 'vintage', label: 'Vintage 200 g', g: 200, price: 525, img: 'packs/vintage.webp' },
        { id: 'chilli', label: 'Chilli 200 g', g: 200, price: 480, img: 'packs/chilli.webp' }
      ], def: 0
    },
    {
      id: 'paneer', name: 'Paneer', short: 'Paneer', color: '#0EA5DE', tint: '#DCF3FC', cheese: true,
      kind: 'Fresh · holds its shape', moods: ['grill', 'crumble'],
      line: 'A fresh, versatile blank canvas for big flavours.',
      desc: 'Soft and crumbly in texture, fresh and versatile. Our paneer is a blank canvas for any dish. As a component of flavourful gravies, stuffed in flatbreads or grilled on a kebab, it is the perfect base for a range of Indian and South Asian food.',
      taste: { like: 'A blank canvas for big flavours', notes: 'Soft, fresh, holds its shape in the pan', tryit: 'Grilled on skewers, or in spicy githeri' },
      img: 'food/paneer-tikka.webp', pack: 'packs/paneer-250.webp', cut: 'cut/pack-paneer.webp',
      packs: [
        { id: '250', label: '250 g', g: 250, price: 400, img: 'packs/paneer-250.webp' },
        { id: '500', label: '500 g', g: 500, price: 690, img: 'packs/paneer-500.webp' },
        { id: '1kg', label: '1 kg', g: 1000, price: 1220, img: 'packs/paneer-1kg.webp' }
      ], def: 1
    },
    {
      id: 'halloumi', name: 'Halloumi', short: 'Halloumi', color: '#F28C00', tint: '#FFEBCF', cheese: true,
      kind: 'Squeaky · made to grill', moods: ['grill'],
      line: 'That squeak. That char. That salty, savoury bite.',
      desc: 'A springy white cheese, carefully brined to give it that strong, salty flavour. When cooked, the saltiness fades into a savoury bite with a slightly creamy texture. Grilled or fried, it is crispy outside and melted inside. Also with nigella seeds, as peri peri patties, and as discs.',
      taste: { like: 'That squeak. That char.', notes: 'Salty raw, savoury and creamy when cooked', tryit: 'Grilled in a bun, or fried with eggs' },
      img: 'food/halloumi-salad.webp', pack: 'packs/halloumi-250.webp', cut: 'cut/pack-halloumi.webp',
      packs: [
        { id: '250', label: 'Classic 250 g', g: 250, price: 450, img: 'packs/halloumi-250.webp' },
        { id: 'nigella', label: 'Nigella 200 g', g: 200, price: 450, img: 'packs/halloumi-nigella.webp' },
        { id: 'periperi', label: 'Peri peri patties 280 g', g: 280, price: 525, img: 'packs/halloumi-periperi.webp' },
        { id: 'discs', label: 'Discs 370 g', g: 370, price: 550, img: 'packs/halloumi-discs.webp' }
      ], def: 0
    },
    {
      id: 'feta', name: 'Feta', short: 'Feta', color: '#7DBA2F', tint: '#EAF6D9', cheese: true,
      kind: 'Crumbly · tangy', moods: ['crumble', 'board'],
      line: 'Crumble it, marinate it, stuff it in peppers.',
      desc: 'Firm and crumbly. Regular Feta is a salty white cheese with a tangy finish that hints at sweetness. Feta with za’atar adds earthiness. Marinated Feta sits in olive oil with hand-picked herbs and spices, and the stuffed peppers are sundried peppers filled with feta, olives and herbs.',
      taste: { like: 'Fresh milk doused in lemon zest', notes: 'Salty, tangy, crumbly', tryit: 'Over eggs or roast veggies' },
      variants: [
        { name: 'Marinated with olives', like: 'Briny, savoury', notes: '', tryit: 'Spooned over pasta' },
        { name: 'Marinated with 3 peppers', like: 'Sweet with a little kick', notes: '', tryit: 'On toast' },
        { name: 'Stuffed peppers', like: 'Mezze in Istanbul', notes: 'Punchy, yet sweet', tryit: 'Straight from the jar' }
      ],
      img: 'food/feta-watermelon.webp', pack: 'packs/feta-250.webp', cut: 'cut/pack-feta.webp',
      packs: [
        { id: 'olives', label: 'Marinated, olives 125 g', g: 125, price: 600, img: 'packs/feta-marinated.webp' },
        { id: 'peppers3', label: 'Marinated, 3 peppers 125 g', g: 125, price: 600, img: 'packs/feta-marinated.webp' },
        { id: 'garlic', label: 'Marinated, garlic & pepper 125 g', g: 125, price: 600, img: 'packs/feta-marinated.webp' },
        { id: 'stuffed', label: 'Stuffed peppers 160 g', g: 160, price: 700, img: 'packs/feta-peppers.webp' },
        { id: '250', label: '250 g', g: 250, price: null, out: true, img: 'packs/feta-250.webp' },
        { id: '500', label: '500 g', g: 500, price: null, out: true, img: 'packs/feta-500.webp' },
        { id: 'zaatar', label: 'Za’atar 200 g', g: 200, price: null, out: true, img: 'packs/feta-250.webp' }
      ], def: 0
    },
    {
      id: 'gouda', name: 'Gouda', short: 'Gouda', color: '#D98E04', tint: '#FCEFD3', cheese: true,
      kind: 'Buttery · nutty', moods: ['melt', 'board'],
      line: 'Regular, smoked, spiced and truffle.',
      desc: 'A semi-hard cheese with a salty, buttery and nutty flavour. Regular for the kids’ toasties, aged for the board, smoked for the sandwich, and the spiced range for whoever is hosting: black pepper, roasted cumin and truffle.',
      taste: { like: 'Warm milk and a spoonful of caramel', notes: 'Mild, buttery, faintly sweet', tryit: 'Melted in a toastie' },
      variants: [
        { name: 'Smoked', like: 'The smell of nyama choma', notes: 'Soft smoke with a whiff of cream', tryit: 'Melted over a burger' },
        { name: 'Cumin', like: 'A masala omelette', notes: '', tryit: 'On baked potatoes' },
        { name: 'Truffle', like: 'Mushrooms after rain', notes: 'Earthy', tryit: 'On scrambled eggs' },
        { name: 'Black pepper', like: 'A slow, warm bite', notes: '', tryit: 'On a cheeseboard' },
        { name: 'Aged', like: 'Butterscotch with a savoury edge', notes: 'Firm, nutty, with crunchy crystals', tryit: 'With a slice of ripe pear' }
      ],
      img: 'client/gouda-wheel.webp', pack: 'packs/gouda.webp', cut: '',
      packs: [
        { id: '250', label: '250 g', g: 250, price: 450, img: 'packs/gouda.webp' },
        { id: '500', label: '500 g', g: 500, price: 820, img: 'packs/gouda.webp' },
        { id: '1kg', label: '1 kg', g: 1000, price: 1580, img: 'packs/gouda.webp' },
        { id: 'smoked', label: 'Smoked 200 g', g: 200, price: 480, img: 'packs/gouda-smoked.webp' },
        { id: 'pepper', label: 'Black pepper 200 g', g: 200, price: 480, img: 'packs/gouda-pepper.webp' },
        { id: 'cumin', label: 'Roasted cumin 200 g', g: 200, price: 480, img: 'packs/gouda-cumin.webp' },
        { id: 'truffle', label: 'Truffle 200 g', g: 200, price: 560, img: 'packs/gouda.webp' },
        { id: 'aged', label: 'Aged 200 g', g: 200, price: null, out: true, img: 'packs/gouda.webp' }
      ], def: 0
    },
    {
      id: 'cream', name: 'Cream Cheese', short: 'Cream cheese', color: '#8B6CE8', tint: '#EEE8FF', cheese: true,
      kind: 'Soft · spreadable', moods: ['spread'],
      line: 'Fresh white cheese in its softest form.',
      desc: 'Versatile white cheese in its softest and spreadable form. For bagels, roll-ups, cheesecakes and pies. Sibiola and ricotta come back in small batches.',
      taste: { like: 'Fresh, soft and gently tangy', notes: 'Smooth and spreadable', tryit: 'In strawberry roll-ups or a berry pie' },
      img: 'client/cream-cheese.webp', pack: 'packs/cream-cheese.webp', cut: '',
      packs: [
        { id: '200', label: '200 g', g: 200, price: 450, img: 'packs/cream-cheese.webp' },
        { id: 'sibiola', label: 'Sibiola 200 g', g: 200, price: null, out: true, img: 'packs/sibiola.webp' },
        { id: 'ricotta', label: 'Ricotta 200 g', g: 200, price: null, out: true, img: 'packs/cream-cheese.webp' }
      ], def: 0
    },
    {
      id: 'labneh', name: 'Labneh Mdabale', short: 'Labneh', color: '#5C8A2E', tint: '#E6F0DA', cheese: true,
      kind: 'Creamy · Middle Eastern', moods: ['spread', 'board'],
      line: 'Creamy labneh balls, plain or infused.',
      desc: 'Pure rich ingredients crafted using a Middle Eastern technique for an authentically creamy labneh. Best enjoyed with bread, crackers or in a salad. Plain, or infused with black pepper, chilli, nigella seeds or olives.',
      taste: { like: 'A slow breakfast with warm bread', notes: 'Thick, creamy and tangy', tryit: 'On grilled baguette with tomatoes and honey' },
      img: 'food/labneh.webp', pack: 'packs/labneh-nigella.webp', cut: '',
      packs: [
        { id: 'plain', label: 'Plain', g: 200, price: 700, img: 'packs/labneh-plain.webp' },
        { id: 'pepper', label: 'Black pepper', g: 200, price: 700, img: 'packs/labneh-pepper.webp' },
        { id: 'chilli', label: 'Chilli', g: 200, price: 700, img: 'packs/labneh-chilli.webp' },
        { id: 'nigella', label: 'Nigella', g: 200, price: 700, img: 'packs/labneh-nigella.webp' },
        { id: 'olives', label: 'Olives', g: 200, price: 700, img: 'packs/labneh-olives.webp' }
      ], def: 3
    },
    {
      id: 'ghee', name: 'Ghee', short: 'Ghee', color: '#E0A100', tint: '#FFF0C9', cheese: false,
      kind: 'Pure clarified butter', moods: ['spread'],
      line: 'Clarified butter in its purest form.',
      desc: 'Clarified butter in its purest form, with no additives or preservatives, from the heart of our studio in Laikipia. It comes from the cream we separate before cheesemaking.',
      taste: { like: 'Toasted butter', notes: 'Nutty, golden, no additives', tryit: 'On chapati, or in a curry' },
      img: 'client/ghee.webp', pack: 'packs/ghee.webp', cut: '',
      packs: [{ id: '1kg', label: '1 kg', g: 1000, price: null, out: true, img: 'packs/ghee.webp' }], def: 0
    },
    {
      id: 'jars', name: 'Jars of Goodness', short: 'Jars', color: '#EF5A24', tint: '#FFE6DA', cheese: false,
      kind: 'Chutneys, sauces, jams', moods: ['jars', 'board'],
      line: 'Chutneys, mustards and sauces made in Kenya.',
      desc: 'An artisanal selection of gourmet condiments, from jams and chutneys to vinaigrettes and sauces made with love in Kenya. Every good cheese needs a delightful companion.',
      taste: { like: 'A cheeseboard’s best friend', notes: 'Sweet, sharp, smoky or hot', tryit: 'Cheeseboard Chutney with Vintage Cheddar' },
      img: 'client/feta-jars.webp', pack: 'packs/jar-cheeseboard.webp', cut: '',
      packs: [
        { id: 'cheeseboard', label: 'Cheeseboard Chutney 250 g', g: 0, price: 580, img: 'packs/jar-cheeseboard.webp' },
        { id: 'ploughmans', label: 'Ploughman’s Chutney 250 g', g: 0, price: 450, img: 'packs/jar-ploughmans.webp' },
        { id: 'chilli-oil', label: 'Crispy Chilli Oil 250 g', g: 0, price: 520, img: 'packs/jar-chilli-oil.webp' },
        { id: 'whiskey', label: 'Whiskey Mustard 250 g', g: 0, price: 540, img: 'packs/jar-whiskey-mustard.webp' },
        { id: 'curd', label: 'Passionfruit Curd 250 g', g: 0, price: 550, img: 'packs/jar-passion-curd.webp' },
        { id: 'harissa', label: 'Rosa Harissa Paste 250 g', g: 0, price: 560, img: 'packs/jar-harissa.webp' },
        { id: 'sundried', label: 'Sundried Tomato Chutney 250 g', g: 0, price: 620, img: 'packs/jar-sundried.webp' },
        { id: 'marmalade', label: 'Boozy Highlands Marmalade 250 g', g: 0, price: 704, img: 'packs/jar-marmalade.webp' },
        { id: 'balsamic', label: 'Balsamic Vinaigrette 340 ml', g: 0, price: 800, img: 'packs/jar-balsamic.webp' }
      ], def: 0
    },
    {
      id: 'gifts', name: 'Gift Boxes', short: 'Gifts', color: '#14946B', tint: '#D9F3EA', cheese: false,
      kind: 'Festive boxes', moods: ['jars'],
      line: 'Festive boxes of jars, ready to give.',
      desc: 'Small jars, big moments. Festive boxes from Jars of Goodness, new in stock for the season.',
      taste: { like: 'Christmas morning', notes: 'Chutneys, jams and honey in one box', tryit: 'Under the tree, next to a gouda' },
      img: 'packs/gift-festive.webp', pack: 'packs/gift-festive.webp', cut: '',
      packs: [
        { id: 'celebration', label: 'Celebration Box', g: 0, price: 2500, img: 'packs/gift-celebration.webp' },
        { id: 'festive', label: 'Festive Indulgence Collection', g: 0, price: 2500, img: 'packs/gift-festive.webp' },
        { id: 'double', label: 'Double the Flavour pack', g: 0, price: 1250, img: 'packs/gift-double.webp' },
        { id: 'medley', label: 'Mini Medley Pack', g: 0, price: 1000, img: 'packs/gift-medley.webp' }
      ], def: 1
    }
  ];

  SC.product = function (id) { return SC.products.find(function (p) { return p.id === id; }) || null; };

  /* Recipes: cheese = [productId, packId, packs] that "Add the cheese" puts on the list */
  SC.recipes = [
    { id: 'chapati-pizzas', name: 'Chapati Pizzas', by: 'Cooking with Jaz', img: 'recipes/chapati-pizzas.webp', mins: 20, serves: '2 to 4', tags: ['kenyan', 'quick', 'party'],
      cheese: [['mozzarella', '250', 1], ['cheddar', '250', 1]],
      intro: 'Perfect for leftover chapatis during Christmas week, with cheddar and mozzarella melting over the top.',
      ingredients: ['Leftover chapatis', 'Pizza tomato sauce', 'Sirimon Mozzarella', 'Sirimon Cheddar', 'Roasted chicken', 'Chopped red and yellow peppers', 'Sautéed courgette (zucchini)', 'Onion chutney', 'Olive oil', 'Fresh parsley or basil'],
      method: ['Preheat the oven to 180°C.', 'Put parchment paper on a baking tray. Lay a chapati on it, spread the pizza sauce, then the toppings, then the grated or torn cheese. Bake for a few minutes.', 'Once ready, drizzle with olive oil and spoon some chutney on top, with fresh parsley or basil.'] },
    { id: 'halloumi-buns', name: 'Loaded Halloumi Cheese Buns', by: 'Ngina Kabucho', img: 'recipes/halloumi-buns.webp', mins: 20, serves: '4', tags: ['party'],
      cheese: [['halloumi', '250', 1]],
      intro: 'Whole wheat buns filled with spiced mince and golden, squeaky halloumi.',
      ingredients: ['4 tbsp oil', '4 whole wheat buns', '100 g minced beef', '1 large onion', '3 cloves garlic', 'Salt and black pepper', '½ medium green bell pepper', '½ cup tomatoes', '½ tsp curry powder', '4 slices Sirimon Halloumi', '¼ cup mayonnaise', 'Parsley, to top'],
      method: ['In a medium pot, heat the oil and add the minced beef. Mix well until it changes colour.', 'Add the onion and garlic. Cook for 2 minutes, then add the bell pepper, tomatoes and spices. Cook for 5 minutes and set aside.', 'In a pan, heat a little oil and lay the halloumi slices in a single layer. Season with salt and pepper.', 'Cook the halloumi for 2 minutes until lightly browned, then flip and cook for 2 more minutes until both sides are golden.', 'Make a hole in each bun and fill it with the mince, with halloumi on top. Drizzle with mayonnaise, top with parsley and serve.'] },
    { id: 'mince-fries', name: 'Cheesy Minced Beef Loaded Fries', by: 'Ngina Kabucho', img: 'recipes/mince-fries.webp', mins: 30, serves: '4', tags: ['party'],
      cheese: [['mozzarella', '250', 1]],
      intro: 'Crisp homemade fries under spiced mince and a blanket of melted mozzarella.',
      ingredients: ['2 tbsp oil', '1 tbsp chopped garlic', '1 chopped onion', '250 g minced beef', '1 tsp salt', '¼ tsp chilli powder', '1 tsp cumin', '1 tsp coriander', '½ tsp paprika', '¼ tsp black pepper', '½ cup crushed tomatoes', '¼ cup finely chopped parsley', '200 g grated Sirimon Mozzarella', '5 large potatoes'],
      method: ['In a hot pan, add the oil and garlic. Fry for 1 minute, then add the onion and sauté for 2 minutes.', 'Add the minced beef and mix until it changes colour. Cover and cook for 6 to 8 minutes.', 'Add the spices and crushed tomatoes and cook for 4 minutes.', 'Slice the potatoes 1 cm thick and soak them in cold water for 5 minutes. Pat dry and fry in hot oil for 8 to 10 minutes, then drain on paper towels.', 'Top the fries with the mince, then sprinkle the cheese over.', 'Broil in the oven for 5 minutes, until the cheese melts. Top with parsley and serve.'] },
    { id: 'feta-shakshuka', name: 'Feta Shakshuka', by: 'Ngina Kabucho', img: 'recipes/feta-shakshuka.webp', mins: 20, serves: '2 to 4', tags: ['veg', 'breakfast', 'quick'],
      cheese: [['feta', 'peppers3', 1]],
      intro: 'Eggs poached in a spiced tomato and pepper sauce, finished with crumbled feta.',
      ingredients: ['2 tbsp vegetable oil', '1 large onion, sliced', '1 red bell pepper, sliced', '3 cloves garlic, minced', '2 cups crushed tomatoes', '½ tsp cumin', '½ tsp paprika', '½ tsp coriander', '¼ tsp red pepper flakes', 'Salt and freshly ground black pepper', '4 large eggs', '¼ cup crumbled Sirimon Feta', 'Fresh parsley, to garnish'],
      method: ['In a large skillet over medium heat, heat the oil. Add the onion and sauté for 2 to 3 minutes.', 'Add the bell pepper and cook until soft, 2 minutes, then add the garlic and cook until fragrant, 1 minute more.', 'Pour in the tomatoes and spices and season with salt and pepper. Simmer to thicken slightly, 6 minutes.', 'Make 4 wells in the sauce and crack an egg into each. Season the eggs.', 'Cover and cook on low heat until the egg whites are just set, 6 to 10 minutes.', 'Top with feta and garnish with parsley.'] },
    { id: 'chicken-spaghetti', name: 'Cheesy Chicken Spaghetti', by: 'Ngina Kabucho', img: 'recipes/chicken-spaghetti.webp', mins: 20, serves: '2 to 3', tags: ['quick'],
      cheese: [['everyday', '250', 1]],
      intro: 'A weeknight pan of creamy, cheesy spaghetti with golden chicken.',
      ingredients: ['2 tbsp unsalted butter', '2 tbsp olive oil', '1 large onion, finely chopped', '3 cloves garlic, minced', '1 bunch parsley', '1 cup diced chicken breast', '1 cup shredded Sirimon Everyday Cheese', '½ cup cooking cream', '½ tsp black pepper', 'Spaghetti'],
      method: ['Cook the spaghetti according to the packet. Drain, saving some of the pasta water.', 'In a deep skillet, melt the butter with the oil over medium heat.', 'Add the chicken and cook until golden brown, about 6 minutes.', 'Add the onion and garlic and cook for about 2 minutes, stirring often.', 'Add the pasta water and the cream, with some salt and black pepper.', 'Stir in the cheese, add the spaghetti, mix and top with parsley.'] },
    { id: 'garlic-bread', name: 'Garlic Cheese Bread', by: 'Cooking with Harriet', img: 'recipes/garlic-bread.webp', mins: 60, serves: '6', tags: ['veg', 'party'],
      cheese: [['everyday', '250', 1], ['mozzarella', '250', 1]],
      intro: 'Roasted garlic butter under a bubbling layer of Everyday Cheese and mozzarella. The perfect side for a warm bowl of soup.',
      ingredients: ['1 large loaf of bread', '2 heads of garlic', '1 onion', 'Chopped coriander', 'Salt and pepper', 'Olive oil', 'Softened unsalted butter', '1 cup Sirimon Mozzarella', '1 cup Sirimon Everyday Cheese'],
      method: ['Preheat the oven to 180°C.', 'Cut the tops off the garlic and the onion, place them on foil, drizzle with olive oil and season. Wrap and roast for 45 minutes.', 'Squeeze the cooled garlic and onion into a bowl, add the butter, coriander, salt and pepper and mix well.', 'Cut open the bread, spread the garlic butter on both halves and add as much cheese as you like.', 'Bake under the grill at 200°C for 10 minutes, until the cheese is melted and golden.', 'Garnish with coriander, slice and enjoy.'] },
    { id: 'gouda-samosa', name: 'Gouda Samosa', by: 'Krishna Mehta', img: 'recipes/gouda-samosa.webp', mins: 45, serves: '4 to 6', tags: ['veg', 'party', 'kenyan'],
      cheese: [['gouda', '250', 1]],
      intro: 'Crisp homemade samosas filled with grated gouda, coloured peppers and green chilli.',
      ingredients: ['Sirimon Gouda, grated', '½ red capsicum, chopped', '½ green capsicum, chopped', '½ yellow capsicum, chopped', '1 white onion, chopped', '2 green chillies, chopped', '⅓ cup fresh coriander, chopped', '1½ cups all-purpose flour', '½ tsp salt', '2 tbsp oil', 'Oil for frying'],
      method: ['For the filling, mix the grated cheese with the peppers, onion, chillies and coriander. Add a pinch of salt only if needed.', 'For the dough, mix the flour with the oil and salt and knead a tight dough. Rest for 10 to 15 minutes.', 'Divide the dough, roll each portion into an oval chapati and cut it into two halves.', 'Fold into cones, fill, seal and fry on medium heat until golden and crispy.', 'Serve with the chutney of your choice.'] },
    { id: 'halloumi-bao', crew: true, name: 'Gochujang Halloumi Bao', by: 'Krishna Mehta', img: 'recipes/halloumi-bao.webp', mins: 150, serves: '4', tags: ['veg', 'party'],
      cheese: [['halloumi', '250', 1]],
      intro: 'Soft steamed buns with crispy halloumi in a sticky, spicy gochujang glaze.',
      ingredients: ['Sirimon Halloumi', '1 tbsp gochujang paste', '1 tsp dark soy sauce', '2 tbsp sriracha', '½ tsp vinegar', '1 tsp oil', '½ tsp ginger paste', '½ tsp garlic paste', '1 tsp cornflour', 'Salt to taste', 'Fresh coriander', 'Black and white sesame', 'Buns: 1 cup all-purpose flour, 1 tsp active yeast, 1 tsp baking powder, ¼ cup milk, 1 tbsp oil, ½ tsp salt'],
      method: ['Combine the bun ingredients and knead a soft dough with warm water. Cover and rest for 60 to 90 minutes.', 'Roll the risen dough 1 cm thick and cut 8 cm rounds. Oil each round, fold in half, flatten gently and rest under a damp cloth for 15 to 20 minutes.', 'Steam on parchment for 12 minutes, then leave in the steamer, off the heat, for 5 more.', 'Cut the halloumi into strips and cook in a non-stick pan until golden and crispy.', 'Mix the gochujang with the soy, sriracha and vinegar. Dissolve the cornflour in ¼ cup of water.', 'Sauté the ginger and garlic in the oil, add the gochujang mix and ⅔ cup of water and bring to a boil. Add the cornflour a teaspoon at a time until the sauce thickens.', 'Coat the halloumi in the sauce, fill the buns with it and fresh coriander, and finish with sesame.'] },
    { id: 'paneer-chaat', crew: true, name: 'Paneer Tikka Chaat', by: 'Krishna Mehta', img: 'recipes/paneer-chaat.webp', mins: 90, serves: '2 to 3', tags: ['veg', 'party'],
      cheese: [['paneer', '250', 1]],
      intro: 'Charred paneer tikka tossed with chutneys, onion, tomato, pomegranate and crunchy sev.',
      ingredients: ['250 g Sirimon Paneer', '½ cup yoghurt', '1 tbsp roasted chickpea flour', '1 tbsp oil', '1 tsp lemon juice', '½ tsp each ginger and garlic paste', '¼ tsp turmeric', '1 tsp chilli powder', '½ tsp each black pepper, cumin, garam masala, black salt, salt and chaat masala', '¼ tsp kasuri methi', '1 tbsp coriander and mint chutney', '2 tbsp tamarind chutney', '1 tsp chilli garlic chutney', '½ onion and ½ tomato, chopped', 'Sev, pomegranate and fresh coriander'],
      method: ['Cut the paneer into cubes. Combine the yoghurt, chickpea flour, oil, lemon and spices to make the tikka marinade.', 'Add the paneer and rest for an hour.', 'Thread onto skewers and grill until charred. Cut into bite-size pieces.', 'In a large bowl, mix the paneer tikka with the chutneys, onion, tomato, coriander and pomegranate.', 'Add sev on top and serve.'] },
    { id: 'zucchini-skewers', name: 'Zucchini & Halloumi Skewers', by: 'Krishna Mehta', img: 'recipes/zucchini-skewers.webp', mins: 25, serves: '4', tags: ['veg', 'quick'],
      cheese: [['halloumi', '250', 1]],
      intro: 'For a summer BBQ or a healthy family meal: grilled zucchini ribbons and halloumi with a za’atar dressing.',
      ingredients: ['3 zucchini', 'Sirimon Halloumi', 'Oil for cooking', 'Salt and pepper', 'Dressing: 2 tbsp olive oil, 1 tbsp lemon juice, 2 tbsp za’atar, ¼ tsp garlic powder, salt'],
      method: ['Slice the zucchini with a mandolin. Cut the halloumi into cubes.', 'Grill the zucchini and halloumi with a little oil, then season with salt and pepper.', 'Whisk the dressing ingredients together.', 'Thread the zucchini and halloumi onto skewers, drizzle with the dressing and serve with couscous.'] },
    { id: 'peach-caprese', name: 'Grilled Peach Caprese', by: 'Krishna Mehta', img: 'recipes/peach-caprese.webp', mins: 15, serves: '4', tags: ['veg', 'quick'],
      cheese: [['mozzarella', '250', 1]],
      intro: 'When life gives you peaches, make caprese: juicy grilled peaches, creamy mozzarella, basil and balsamic glaze.',
      ingredients: ['Sirimon Mozzarella', '4 peaches', 'Basil leaves', 'Micro greens', 'Balsamic glaze', 'A little olive oil'],
      method: ['Cut the cheese into triangles.', 'Halve the peaches, remove the stones and cut into wedges.', 'Brush the peaches with a little olive oil and grill them on both sides.', 'Serve with the mozzarella, basil and micro greens, with a drizzle of balsamic glaze.'] },
    { id: 'labneh-bruschetta', name: 'Olive Labneh & Grilled Tomato Bruschetta', by: 'Krishna Mehta', img: 'recipes/labneh-bruschetta.webp', mins: 15, serves: '4', tags: ['veg', 'quick', 'party'],
      cheese: [['labneh', 'olives', 1]],
      intro: 'Grilled baguette, charred cherry tomatoes and labneh balls, finished with honey.',
      ingredients: ['Sirimon Labneh with olives', 'Baguette, sliced', 'Olive oil', 'Cherry tomatoes', '¼ tsp garlic, minced', 'Salt and pepper', 'Rocket leaves', 'Honey'],
      method: ['Brush the baguette slices with olive oil and grill them on both sides.', 'In the same pan, add more olive oil, sauté the garlic, then add the cherry tomatoes, salt and pepper. Grill until charred.', 'Top the bread with the tomatoes, labneh balls and rocket. Serve with a drizzle of honey.'] },
    { id: 'broccoli-soup', name: 'Broccoli & Cheddar Soup with a Cheddar Tuile', by: 'Krishna Mehta', img: 'recipes/broccoli-soup.webp', mins: 30, serves: '4', tags: ['veg'],
      cheese: [['cheddar', '250', 1]],
      intro: 'A silky broccoli and cheddar soup with a lacy, crisp cheddar tuile on top.',
      ingredients: ['2 tbsp butter', '1 white onion, chopped', '2 cloves garlic, minced', '2 heads broccoli, in florets', '3 cups vegetable stock', '½ cup milk', '½ cup grated Sirimon Cheddar, plus more for the tuile', '½ cup heavy cream (optional)', 'Salt and pepper'],
      method: ['Heat the butter in a pan and sauté the onion and garlic.', 'Add the broccoli and stock. Cover and cook until the broccoli softens, then blend until smooth.', 'Add the milk, cream, cheddar, salt and pepper. Cook until the cheese melts.', 'For the tuile, spread a thin layer of grated cheddar in a non-stick pan and cook until golden on both sides.', 'Serve the soup with the tuile on top.'] },
    { id: 'githeri', name: 'Spicy Githeri with Paneer', by: 'Chef Raphael', img: 'recipes/githeri.webp', mins: 12, serves: '2 to 3', tags: ['kenyan', 'veg', 'quick'],
      cheese: [['paneer', '250', 1]],
      intro: 'Kenya’s favourite maize and beans, spiced with curry and studded with paneer.',
      ingredients: ['½ kg boiled githeri', '1 onion, chopped', '3 to 4 cloves garlic, chopped', 'A small piece of ginger, chopped', '2 tbsp curry powder', '1 tomato, diced or blended', 'A small bunch of dhania', '1 carrot', '½ green pepper', 'Sirimon Paneer, diced'],
      method: ['Fry the onion and ginger in a little oil until they start to brown, stirring constantly.', 'Add the garlic and curry powder and cook for about 1 minute on low heat.', 'Add the carrot and tomato, stir and cook covered for about 2 minutes, adding a little water if needed.', 'Add the pepper and diced paneer, stir and leave covered for about 2 minutes, then mix in the githeri and cook until hot.', 'Serve hot, with chopped dhania added at the very end.'] },
    { id: 'chapati-rolex', name: 'Chapati Rolex with Feta', by: 'Chef Raphael', img: 'recipes/chapati-rolex.webp', mins: 10, serves: '1', tags: ['kenyan', 'breakfast', 'quick', 'veg'],
      cheese: [['feta', 'garlic', 1]],
      intro: 'The street-food rolex: egg, peppers and feta, rolled up in a chapati.',
      ingredients: ['Sirimon Feta, diced', '1 chapati', '2 eggs', '½ cup mixed coloured peppers', 'Salt and pepper', 'Butter or cooking oil'],
      method: ['In a medium-hot pan, add the butter and cook the peppers until soft, about 45 seconds.', 'Beat the eggs with salt and pepper and pour into the pan, spreading the peppers evenly.', 'Scatter the feta over the egg.', 'While the egg is still wet, press the chapati onto it and cook on low heat until the egg is set, about 1 minute.', 'Flip, roll, cut in the middle and serve hot or cold.'] },
    { id: 'cheesy-shakshuka', name: 'Cheesy Shakshuka', by: 'Chef Raphael', img: 'recipes/cheesy-shakshuka.webp', mins: 10, serves: '2', tags: ['breakfast', 'veg', 'quick'],
      cheese: [['everyday', '250', 1]],
      intro: 'Eggs in tomato sauce under a melting layer of grated Everyday Cheese.',
      ingredients: ['3 tomatoes, chopped', '½ tbsp butter or oil', '1 large onion, chopped', '3 cloves garlic', '4 eggs', 'Sirimon Everyday Cheese, grated', 'Salt and pepper', 'Buttered toast, to serve'],
      method: ['In a large pan, cook the onion and garlic in the oil until soft.', 'Add the tomatoes with salt and pepper and cook for 3 minutes on low heat.', 'Make 4 holes in the sauce and crack an egg into each. Season.', 'Sprinkle the grated cheese over, cover and cook on low heat until the eggs are done to your liking.', 'Serve hot with buttered toast.'] },
    { id: 'halloumi-sandwich', name: 'Coleslaw & Halloumi Sandwich', by: 'Chef Raphael', img: 'recipes/halloumi-sandwich.webp', mins: 15, serves: '2', tags: ['veg', 'quick'],
      cheese: [['halloumi', '250', 1]],
      intro: 'Pan-fried halloumi on crunchy homemade coleslaw in a toasted bun.',
      ingredients: ['Sirimon Halloumi', 'Burger buns', 'Cabbage', 'Carrot', 'Spring onion', 'Mayonnaise', 'Salt and pepper'],
      method: ['Mix the cabbage, grated carrot and spring onion with the mayonnaise. Taste and season.', 'Slice the cheese evenly and season with salt and pepper.', 'Cook in a little hot oil on medium heat until browned on both sides, about 3 minutes in all.', 'Toast the bread if you like, add the coleslaw, then the cheese, and close. Eat while the cheese is warm.'] },
    { id: 'cheese-balls', name: 'Everyday Cheese Balls', by: 'Nikki Lulu', img: 'recipes/cheese-balls.webp', mins: 40, serves: '4 to 6', tags: ['kenyan', 'veg', 'party'],
      cheese: [['everyday', '150', 1]],
      intro: 'A playful take on Kenya’s beloved staple: crispy ugali balls with a molten Everyday Cheese middle.',
      ingredients: ['150 g Sirimon Everyday Cheese', '2 cups maize meal (ugali flour)', '4 cups water', '1 tbsp butter', '½ cup spring onions, finely chopped', '1 tsp minced garlic', '¼ tsp salt', '¼ cup wheat flour', '2 cups breadcrumbs', '1 egg', 'Oil for deep frying'],
      method: ['Bring the water to a boil and add the maize meal gradually, stirring with a mwiko until it forms a firm ugali.', 'Move it to a bowl and mix in the butter, spring onions, garlic and salt.', 'Cut the cheese into ½ cm cubes. Wrap each in a handful of ugali and roll into a ball. Coat in flour.', 'Dip in whisked egg, then breadcrumbs, and chill for 10 minutes.', 'Deep fry until brown and crispy. Serve with ketchup or a sauce of your choice.'] },
    { id: 'mac-cheese', name: 'Mac and Cheese', by: 'Patrick Gitau', img: 'recipes/mac-cheese.webp', mins: 45, serves: '4 to 6', tags: ['family'],
      cheese: [['everyday', '250', 1]],
      intro: 'Macaroni, broccoli and chicken, baked under a golden lid of Everyday Cheese.',
      ingredients: ['400 g macaroni', '3½ cups water', '2 cups milk', '50 g butter', '120 g broccoli florets', '300 g chicken breast, cubed and cooked', '2 tsp salt', '1 tsp black pepper', '1 tsp garlic powder', '250 g Sirimon Everyday Cheese, shredded'],
      method: ['Bring the water to a boil and add the pasta. Cook for about 5 minutes, then add the broccoli, salt, pepper and garlic powder.', 'Add 1 cup of milk and the butter and simmer for 5 minutes. When it reduces, add the second cup of milk and simmer for 3 more minutes.', 'Cook the chicken in a hot skillet with a little oil for about 6 minutes, seasoned with salt and pepper, and stir it into the pasta.', 'Pour into a casserole dish and cover the top with the shredded cheese.', 'Bake at 180°C for 15 to 20 minutes. Serve warm.'] },
    { id: 'nachos', name: 'Baked Ground Beef Nachos', by: 'Patrick Gitau', img: 'recipes/nachos.webp', mins: 40, serves: '4', tags: ['party'],
      cheese: [['everyday', '250', 1]],
      intro: 'A tray of tortilla chips under beef, beans and a bubbling layer of Everyday Cheese.',
      ingredients: ['250 g ground beef', '400 g refried red kidney beans', '272 ml tomato ketchup', '½ cup chopped green bell pepper', '½ cup chopped onion', '1 tsp homemade taco seasoning', '1 cup shredded Sirimon Everyday Cheese', '200 g tortilla chips', 'Sour cream, salsa and scallions, to serve'],
      method: ['Heat the oven to 180°C.', 'Brown the beef in a little oil, breaking it up. Add the beans, ketchup, pepper, onion and taco seasoning and simmer for 10 to 12 minutes.', 'Arrange the chips in a shallow casserole dish and spoon the hot mixture over.', 'Sprinkle the cheese on top and bake for 20 minutes, until melted and lightly browned.', 'Serve hot with sour cream and the other toppings.'] },
    { id: 'frittata', name: 'Potato & Halloumi Frittata', by: 'Patrick Gitau', img: 'recipes/frittata.webp', mins: 30, serves: '4', tags: ['breakfast', 'veg'],
      cheese: [['halloumi', '250', 1]],
      intro: 'Thin potatoes and shredded halloumi set in eggs, finished with pesto and rocket.',
      ingredients: ['4 medium potatoes, thinly sliced', '1 garlic clove, finely chopped', '8 large eggs, lightly beaten', '1 tbsp sunflower oil', '100 g Sirimon Halloumi, shredded', '3 tbsp homemade pesto', 'A handful of rocket', 'Tomato and basil salad (optional)'],
      method: ['Boil the potatoes in salted water for 5 minutes until just tender. Heat the oven to 180°C.', 'Mix the halloumi, garlic and eggs with some seasoning, then stir in the drained potatoes.', 'Heat the oil in an ovenproof pan, tip in the mixture and cook on low heat for 5 minutes, until two-thirds set.', 'Finish in the oven for 10 to 15 minutes, until cooked through.', 'Drizzle with pesto, top with rocket and serve.'] },
    { id: 'halloumi-tacos', name: 'Halloumi Tacos with Slaw & Tzatziki', by: 'Freshly', img: 'recipes/halloumi-tacos.webp', mins: 25, serves: '2 to 3', tags: ['veg', 'party'],
      cheese: [['halloumi', 'nigella', 1]],
      intro: 'Golden halloumi with nigella seeds, red cabbage slaw and cool tzatziki in soft tacos.',
      ingredients: ['200 g Sirimon Halloumi with nigella seeds', 'Slaw: 1 cup finely sliced red cabbage, ½ tsp sesame oil, 1 tsp lemon juice, ½ tsp garlic, salt and pepper', 'Tzatziki: 200 ml Greek yoghurt, 1 tsp lemon juice, 1 tsp dill, ½ cucumber grated and drained, 1 clove garlic, salt and pepper', 'Soft tacos'],
      method: ['Mix the slaw ingredients in a bowl and set aside.', 'Mix the tzatziki ingredients in another bowl and set aside.', 'Slice the halloumi into ¼-inch thick pieces.', 'Fry in a drizzle of oil in a cast iron pan on medium-high heat until golden, about 2 minutes a side.', 'Assemble the tacos with tzatziki, slaw and halloumi.'] },
    { id: 'christmas-tree', crew: true, name: 'Pull-Apart Christmas Tree', by: 'Patrick Gitau', img: 'recipes/christmas-tree.webp', mins: 40, serves: '8', tags: ['festive', 'party', 'veg'],
      cheese: [['mozzarella', '500', 1]],
      intro: 'Dough balls hiding cubes of mozzarella, baked in the shape of a tree and pulled apart at the table.',
      ingredients: ['550 g pizza dough', '500 g Sirimon Mozzarella', '½ tbsp dried basil', '½ tbsp dried thyme', '1 tbsp melted butter', '2 cloves minced garlic', '1 red bell pepper', '1 bunch fresh coriander', '1 egg, for the egg wash'],
      method: ['Roll out the pizza dough and cut it into squares.', 'Cut the cheese into cubes, place one on each square and form into a ball.', 'Arrange the balls in the shape of a Christmas tree on a lined baking tin.', 'Brush with egg wash, and with the butter mixed with garlic and herbs, and bake at 180°C for 20 minutes.', 'Decorate with chopped coriander and red pepper.'] }
  ];
  SC.recipe = function (id) { return SC.recipes.find(function (r) { return r.id === id; }) || null; };
  SC.recipeTags = [
    { id: 'all', name: 'Everything' }, { id: 'quick', name: 'Under 30 min' }, { id: 'kenyan', name: 'Kenyan twist' },
    { id: 'veg', name: 'Vegetarian' }, { id: 'party', name: 'For a crowd' }, { id: 'breakfast', name: 'Breakfast' }, { id: 'festive', name: 'Festive' }
  ];

  /* Weekly Munchies, from Sirimon's posts: "Smart saving eats with Sirimon. Enjoy every gram." */
  SC.munchies = [
    { id: 'halloumi', product: 'halloumi', grams: 250, buy: [['250', 1]], title: '250 g Halloumi',
      days: [['Mon', 'Pan-fried over salad', 35], ['Tue', 'Vegetable skewers', 40], ['Wed', 'Halloumi fries', 45], ['Thu', 'Watermelon salad', 30], ['Fri', 'Halloumi burger', 40], ['Sat', 'Fried with eggs', 25], ['Sun', 'Wrap with hummus', 35]] },
    { id: 'mozzarella', product: 'mozzarella', grams: 500, buy: [['500', 1]], title: '500 g Mozzarella',
      days: [['Mon', 'Pasta bake', 90], ['Tue', 'Pizza night', 100], ['Wed', 'Toasted sandwich', 60], ['Thu', 'Stuffed chicken', 70], ['Fri', 'Loaded nachos', 80], ['Sat', 'Caprese salad', 50], ['Sun', 'Baked dip', 50]] },
    { id: 'cheddar', product: 'cheddar', grams: 500, buy: [['250', 2]], title: '500 g Cheddar',
      days: [['Mon', 'Mac and cheese', 120], ['Tue', 'Grilled cheese', 60], ['Wed', 'Omelette', 40], ['Thu', 'Baked potatoes', 80], ['Fri', 'Burger night', 60], ['Sat', 'Caprese salad', 50], ['Sun', 'Cheese sauce over roast veg', 80]] },
    { id: 'paneer', product: 'paneer', grams: 500, buy: [['500', 1]], title: '500 g Paneer',
      days: [['Mon', 'Paneer curry', 100], ['Tue', 'Stir-fry', 70], ['Wed', 'Paneer chapati', 50], ['Thu', 'Grilled skewers', 90], ['Fri', 'Paneer wrap', 60], ['Sat', 'Paneer bhajia', 70], ['Sun', 'Paneer salad', 60]] },
    { id: 'feta', product: 'feta', grams: 250, buy: [['olives', 1], ['peppers3', 1]], title: '250 g Feta',
      days: [['Mon', 'Tomato and cucumber salad', 40], ['Tue', 'Scrambled eggs', 25], ['Wed', 'Watermelon and feta', 35], ['Thu', 'Baked feta in tomato sauce', 60], ['Fri', 'Beetroot pasta with feta', 35], ['Sat', 'Feta and herb dip', 30], ['Sun', 'Roasted vegetable tray', 25]] }
  ];

  /* Pop-ups and markets this season, from Sirimon's posters (Facebook, November 2026) */
  SC.events = [
    { id: 'arusha', name: 'Arusha Christmas Fair', start: '2026-11-13', end: '2026-11-15', hours: '', place: 'Schwari School, Mateves', city: 'Arusha, Tanzania', note: 'Explore our whole range of cheesy goodness', poster: 'events/arusha.webp', color: '#8FB39B', collect: false },
    { id: 'rascals', name: 'Rascals Rave', start: '2026-11-14', end: '2026-11-14', hours: '10am to 5pm', place: 'New Muthaiga Mall, Thigiri', city: 'Nairobi', note: 'Our cheeses, made for good family fun', poster: 'events/rascals.webp', color: '#F7D4B0', collect: true },
    { id: 'xmasbox', name: 'Christmas Box', start: '2026-11-27', end: '2026-11-29', hours: '9am to 6pm', place: 'Ngong Racecourse', city: 'Nairobi', note: 'Artisanal favourites for every festive spread', poster: 'events/xmasbox.webp', color: '#8FB39B', collect: true },
    { id: 'family', name: 'Family Festival', start: '2026-11-28', end: '2026-11-28', hours: '2pm to 7pm', place: 'Braeburn Garden Estate', city: 'Nairobi', note: 'Our cheeses, made for good family fun', poster: 'events/family.webp', color: '#F7D4B0', collect: true },
    { id: 'artisan', name: 'Artisan Makers Market', start: '2026-12-05', end: '2026-12-06', hours: '9am to 6pm', place: 'Shamba Café, Loresho', city: 'Nairobi', note: 'Festive favourites made for sharing', poster: 'events/artisan.webp', color: '#C9A3A3', collect: true },
    { id: 'eawl', name: 'EAWL Nanyuki', start: '2026-12-06', end: '2026-12-06', hours: '9:30am to 5pm', place: 'The Field, Cape Chestnut', city: 'Nanyuki', note: 'Our artisanal range, made for festive moments', poster: 'events/eawl.webp', color: '#C9A3A3', collect: true },
    { id: 'bizbaz', name: 'Biz Baz Xmas Edition', start: '2026-12-11', end: '2026-12-13', hours: '', place: 'KSTVET, UN Avenue', city: 'Nairobi', note: 'Our range of artisanal goodness, festive specials included', poster: 'events/bigbaz.webp', color: '#8FB39B', collect: true }
  ];

  /* Nairobi delivery, from Sirimon's delivery chart (May 2026) */
  SC.zones = [
    { id: 'A', fee: 250, freeFrom: 3500, areas: ['Westlands', 'Parklands', 'Spring Valley'] },
    { id: 'B', fee: 350, freeFrom: 3500, areas: ['Lavington', 'CBD', 'Community', 'Kileleshwa', 'Upperhill', 'Lake View', 'Hill View', 'Kitisuru', 'Nyari', 'Gigiri', 'Ngara', 'Eastleigh', 'Pangani', 'Loresho', 'Kilimani', 'Junction'] },
    { id: 'C', fee: 400, freeFrom: 4000, areas: ['Ngong Road', 'Highrise', 'South B', 'South C', 'Jamhuri', 'Muthaiga', 'Mountain Mall'] },
    { id: 'D', fee: 450, freeFrom: 4000, areas: ['Runda', 'Garden City', 'Garden Estate', 'TRM', 'Ruaka', 'Racecourse', 'Ridgeways', 'Industrial Area'] },
    { id: 'E', fee: 550, freeFrom: 4000, areas: ['Karen', 'Buruburu', 'Donholm', 'Langata', 'Galleria', 'Mombasa Road', 'Fedha', 'Pipeline', 'Nyayo Estate', 'Imara Daima', 'Lower Kabete', 'Waiyaki Way', 'Kasarani'], days: { Karen: [2, 5], Langata: [2, 5] } },
    { id: 'F', fee: 700, freeFrom: null, lead: 2, areas: ['Past Karen', 'Past JKIA', 'Kiambu', 'Kikuyu', 'Mwiki', 'Ongata Rongai'] }
  ];
  SC.outOfTown = { fee: 600, lead: 2 };
  SC.cutoffHour = 14;

  SC.team = [
    { id: 'eric', name: 'Eric Njuguna', role: 'Cheesemaker', since: 2018, fact: 'Joined just as the creamery was being built. His home is a kilometre away.' },
    { id: 'peter', name: 'Peter Waweru', role: 'Senior production assistant', since: 2017, fact: 'Walks 20 minutes from his home, three kilometres away, every morning.' },
    { id: 'mary', name: 'Mary Wanjiku', role: 'Packaging and labelling', since: 2019, fact: 'Walks nearly 45 minutes each day to reach the creamery.' },
    { id: 'johnson', name: 'Johnson Muragori', role: 'Production assistant', since: 2019, fact: 'Was working as a driver when a friend told him about the creamery.' },
    { id: 'stephen', name: 'Stephen Njoroge', role: 'Packaging assistant', since: 2021, fact: 'Spotted the opening on social media and hasn’t looked back.' },
    { id: 'duncan', name: 'Duncan Mackenzie', role: 'Stores and finished goods', since: null, fact: 'In charge of stores and finished goods. Lives 15 minutes away.' }
  ];

  SC.process = [
    { n: 1, title: 'Milk collection & testing', text: 'Fresh milk from local smallholder families, collected daily and tested in our lab before a drop goes in.' },
    { n: 2, title: 'Pasteurisation at 73°C', text: 'Exact temperatures and times, monitored so nothing is left to chance.' },
    { n: 3, title: 'Cream separation', text: 'The cream we lift off becomes Sirimon Ghee. Nothing is wasted.' },
    { n: 4, title: 'Ageing, up to 8 months', text: 'Curds get time to develop naturally, never rushed.' },
    { n: 5, title: 'Final quality checks', text: 'Every wheel and block is checked for colour, texture and taste.' }
  ];

  SC.reviews = [
    { name: 'Sijui W.', meta: 'Local Guide', text: 'Best cheese in Kenya. We love to order online with them. Quick and reliable delivery and customer care. The everyday cheese is perfect for a Raclette and melts very nicely.' },
    { name: 'Niyomahoro J.', meta: 'Local Guide', text: 'Sirimon Ghee is the best ghee you will ever get your hands on in the Kenyan market. Artisanal, with zero additives like seed oils or coconut oil. Highly recommended.' },
    { name: 'Diana S.', meta: 'Local Guide', text: 'Love Sirimon Cheeses and Halloumi.' },
    { name: 'Dorothy W.', meta: 'Google review', text: 'I’ve tried almost all of them and I love them.' }
  ];

  /* Storage tips from Sirimon's own posts */
  SC.tips = [
    'Keep cheese in the vegetable drawer: it is out of the dry, circulating air and away from the temperature swings of the door.',
    'Cheese is porous. Store it away from onions, garlic, herbs and strongly spiced leftovers.',
    'Cut only what you need, with a clean knife, and keep the rind on as long as you can. Pre-slicing a whole block shortens its life.',
    'Let cheese rest before serving. Cold mutes aroma and flattens flavour; hard cheeses need longer at room temperature than soft ones.',
    'Opened paneer: keep it under clean water in a sealed container, change the water daily and use it within 3 to 4 days.'
  ];

  /* The Kitchen Crew. Deals marked real follow promotions Sirimon has run; the rest are ideas to confirm. */
  SC.tiers = [
    { id: 'fresh', name: 'Fresh', from: 0, color: '#8DC63F' },
    { id: 'mature', name: 'Mature', from: 500, color: '#F28C00' },
    { id: 'vintage', name: 'Vintage', from: 1500, color: '#E2231A' }
  ];
  SC.deals = [
    { id: 'crew10', code: 'CREW10', kind: 'pct', pct: 10, keys: ['everyday|150', 'everyday|250', 'everyday|500', 'everyday|1kg', 'mozzarella|250', 'mozzarella|500', 'mozzarella|1kg'],
      title: '10% off Everyday & Mozzarella', sub: 'Every pack size, every order', color: '#E5157A', real: true },
    { id: 'saycheese', code: 'SAYCHEESE', kind: 'pct', pct: 10, products: ['cheddar'],
      title: 'Say cheese: 10% off cheddar', sub: 'From mellow to vintage chilli', color: '#E2231A', real: true },
    { id: 'bundle3', code: 'FRESH3', kind: 'bundle', pct: 8, min: 3, products: ['mozzarella', 'paneer'],
      title: 'Bundle of 3: 8% off', sub: 'Three or more Mozzarella or Paneer packs of one size', color: '#0EA5DE', real: true },
    { id: 'freedrop', code: 'CREWDROP', kind: 'delivery', min: 2500, zones: ['A', 'B', 'C'],
      title: 'Free delivery from KES 2,500', sub: 'Zones A to C in Nairobi', color: '#14946B' },
    { id: 'birthday', code: 'BIRTHDAY', kind: 'gift', gift: 'halloumi|250', when: 'birthday',
      title: 'A birthday Halloumi', sub: 'Free 250 g Halloumi in your birthday month', color: '#F28C00' },
    { id: 'boardbuddy', code: 'BOARDBUDDY', kind: 'gift', gift: 'jars|cheeseboard', when: 'gifts',
      title: 'Free Cheeseboard Chutney', sub: 'With any gift box this festive season', color: '#EF5A24' },
    { id: 'early', kind: 'perk', title: 'First taste of new batches', sub: 'Small-batch cheeses like Truffle Gouda, before everyone', color: '#D98E04' },
    { id: 'markets', kind: 'perk', title: 'Double points at markets', sub: 'Show your Crew card at the Sirimon stand', color: '#8B6CE8' }
  ];
})();
