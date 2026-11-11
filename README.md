# Sirimon Cheese: website concepts

Two concept websites for **Sirimon Cheese**, the independent artisan cheese studio at the foot of Mt Kenya in Laikipia (Plot No. 49, Kalalu, Laikipia East). Both speak to home cooks first, with a path for restaurants, cafés and shops.

| | Concept | Folder | Follows | Look |
|---|---|---|---|---|
| A | Editorial | `site-a-editorial/` | [Santo Mare](https://stupendous-monstera-021684.framer.app/), made bright | Oswald capitals (the face Sirimon's own posts use), Plex Mono labels and square buttons on cream, with full-bleed bands in the colours Sirimon's packs wear. "SIRIMON" is cut out of the page with a cheese pull playing inside the letters, and scrolling flies you through the I into the melt. A texture band with pictures that follow the pointer, a range list whose stage swaps the photo, the real pack and the tasting notes, a pinned five-clip melt reel, seven ways to say cheese, a dinner shuffle through the recipe bank, the Sirimon way with Moses's film, the makers, a forest that grows as you scroll, the cheese list, the Kitchen Crew, markets, the map and socials |
| B | Lively | `site-b-fun/` | [Ruota](https://ruota-template.framer.website/) and [Palazzo](https://palazzo.framer.website/), made loud | Clash Display and Satoshi on Everyday pink, Mozzarella yellow and Paneer cyan. "Sirim[o]n" with a skillet of molten cheese as the o and the real packs floating around it, three spinning circles, a flavour dial that repaints the page in each cheese's colour, a grilled cheese you drag to pull apart, a wall of melt, Sirimon's Weekly Munchies turned into a planner, stacked recipe cards, Jars of Goodness, a tilting Crew card, stamp-edged pop-up cards, the map and socials |

`index.html` at the root is a chooser that links to both.

**Live:** https://23f3000111.github.io/sirimon-cheese-concepts/

## In both concepts

- **The cheese list** (`shared/js/order.js`), the "shopping list" ordering flow in four steps:
  1. Pick cheese: every Sirimon cheese, Jars of Goodness and the festive gift boxes, with **the shop's real prices and pack sizes** (sirimon.co.ke/shop, 11 November 2026). Sold-out packs are greyed out and offer "notify me". Filters by Melt, Grill, Crumble, Spread, Board, Jars & gifts. The summary shows the weight as a colour bar (A) or a fridge whose shelves fill with packs (B).
  2. About you: home or business (restaurant, café, hotel, caterer, shop), with a standing weekly order option. Kitchen Crew members are filled in.
  3. Delivery: **Sirimon's real Nairobi zones** (A KES 250 to F KES 700, free from KES 3,500 in A and B and from KES 4,000 in C to E), courier out of town at KES 600, pick-up at one of this season's markets, or collection at the studio. Order by 2pm for next-day delivery; out of town and Zone F take two working days; Karen and Langata only on Tuesdays and Fridays. A meter shows how much more for free delivery.
  4. Review with edit links and totals, consent, then **Send on WhatsApp** (the whole order written out to 0799 755 690) or **Send as a request**. The confirmation shows a reference, a tracker, Crew points, Kabage Forest money, print and "start a new list".
  The list survives a reload, the header counts packs, a returning visitor can repeat the last order, and "Just send my list on WhatsApp" works at any step.
- **The Kitchen Crew**, a members' area named from Sirimon's own pop-up ("Join our kitchen crew for simple, crowd-pleasing recipes, exclusive specials, and serious cheese-loving perks") (`shared/js/members.js`):
  - Join free or log in. Try the demo member **crew@sirimon.co.ke** with the password **cheese**.
  - Members' prices switch on everywhere: 10% off Everyday and Mozzarella, 10% off every cheddar, 8% off three or more Mozzarella or Paneer packs, free delivery from KES 2,500 in zones A to C. Guests see what they would save on their list.
  - A birthday Halloumi in your birthday month, a free Cheeseboard Chutney with a gift box, members' recipes (three are locked for guests), a market pass for double points, a points card with Fresh, Mature and Vintage tiers, order history with "repeat", and "your forest".
- **WhatsApp chat assistant** (`shared/js/chat.js`), dressed as WhatsApp and rule based (no server). It prices any cheese, takes typed orders ("add 2 halloumi", "mozzarella 500g", "nataka paneer"), refuses sold-out packs politely and offers what is in stock, checks delivery to a named area ("delivery to Karen?"), knows the next market, studio hours (live), storage tips from Sirimon's posts, halal and vegetarian, Cheese for Trees, the Crew, platters, careers and Swahili greetings. "Continue on WhatsApp" hands the chat and the list to the real number.
- **23 recipes** from Sirimon's recipe bank, with the cook credited (Ngina Kabucho, Krishna Mehta, Chef Raphael, Nikki Lulu, Patrick Gitau, Cooking with Jaz, Cooking with Harriet, Freshly): ingredients you can tick, method, and "add the cheese" at shop prices. A searchable recipe bank pop-up with mood filters.
- **Pop-ups**: every cheese (food photo, the real pack, tasting notes, every pack with its price, Crew saving, recipes), every recipe, the recipe bank, Moses's studio film (with sound), a platter pre-order that writes a WhatsApp message, and "notify me" for sold-out packs.
- **Cheese for Trees**: KES 25 from every kilo bought direct goes to Kabage Forest in the Aberdares (FOECT). The list, the confirmation and the Crew dashboard show the visitor's share.
- **Pop-ups we're at**: this season's seven markets from Sirimon's posters, with a countdown and "order ahead, pick up at the stand".
- **The studio**: Google Maps, directions, live open or closed (Monday to Friday 8 to 5, Saturday 8 to 12), Nairobi and Nanyuki office numbers, email. Google reviews. Instagram, Facebook and WhatsApp in the header, footer, social sections and chat.
- **Motion**: GSAP with ScrollTrigger and SplitText, Lenis smooth scrolling. `prefers-reduced-motion` turns it off and everything stays visible and usable.
- Sans-serif only, bright throughout, laptop first (checked at 1280, 1366, 1440 and 1920 wide). Phones were not polished, as briefed.

## What is not connected yet

- **Orders, requests and forms**: GitHub Pages cannot receive them. Orders go to WhatsApp and a copy stays in the visitor's browser (`localStorage`: `sc-orders`, the draft list in `sc-list`, notify-me in `sc-notify`, newsletter sign-ups in `sc-news`). To go live, point `send()` in `shared/js/order.js` at the shop's basket API (sirimon.co.ke runs Django Oscar, which already has a basket and checkout) or a form service.
- **The Kitchen Crew lives in the browser**. Accounts and points are stored in `localStorage` (`sc-crew-accounts`, `sc-crew`) so the idea can be tried; passwords are hashed but this is not real security. A live version would use the shop's existing accounts (sirimon.co.ke already has a login) and apply the deals at checkout.
- **The chat is a website bot styled as WhatsApp.** A bot inside WhatsApp itself needs the WhatsApp Business Platform on 0799 755 690 and a small server; the rules in `chat.js` can move there.
- **Prices and stock are a snapshot** of the shop on 11 November 2026.

## What is real and what to confirm with the client

**Real, from Sirimon's own material:**
- Logo, product photos, every price, pack size and sold-out flag (sirimon.co.ke/shop). Product descriptions and the about text ("The process is sacred. This is the Sirimon way.", the Sirimon River, HACCP, Halal and ISO, vegetarian, no GMO or artificial ingredients).
- The 23 recipes, their photos and credits (sirimon.co.ke/recipes; methods lightly tidied).
- Tasting notes for gouda, cheddar and feta ("tastes like the smell of nyama choma", "a meal in an Irish pub", "mezze in Istanbul"), the Weekly Munchies plans, the storage tips, "How we make such great cheese" (milk testing, pasteurisation at 73°C, cream to ghee, ageing up to 8 months, final checks), Cheese for Trees, 1,200+ farming families, 10 years of Sirimon: Sirimon's Facebook and Instagram posts.
- The team: Eric Njuguna, Peter Waweru, Mary Wanjiku, Johnson Muragori, Stephen Njoroge and Duncan Mackenzie, their roles and facts, from the "Meet ..." posts; Moses's film, "Handcrafted = better" and the Peri Peri Halloumi clip from Facebook.
- The seven markets and their dates, places and hours (Facebook posters, November 2026).
- The Nairobi delivery zones, fees and rules (Sirimon's delivery chart on the shop page, May 2026).
- Phones 0799 755 690 (Nairobi office, and the shop's WhatsApp link) and 0700 112 888 (Nanyuki office), customerservice@sirimon.co.ke, corporate@sirimon.co.ke, the studio address, opening hours and reviews (Google Maps), "Kenya's preferred cheese brand" (Instagram bio), The Cheese Spread newsletter (Linktree).
- Three Crew deals follow promotions Sirimon has run: 10% off Everyday and Mozzarella, "Say cheese: 10% off your favourite cheddar", and the Mozzarella and Paneer "bundle of 3".

**Written for the mockup, to confirm:**
- All Kitchen Crew mechanics: the 8% bundle rate, points (one per KES 100), tiers and their thresholds, free delivery from KES 2,500, the birthday Halloumi, free chutney with a gift box, early access, double points at markets, members' recipes. The demo member "Wanjiru" is fictional.
- Pick-up at markets and collection at the studio; payment options (M-Pesa, card, cash on delivery, pay at the stand or studio).
- Tasting notes for Everyday, Mozzarella, Paneer, Halloumi, Cream Cheese, Labneh, Ghee and the jars were written from Sirimon's descriptions. Cooking times and servings for recipes whose pages give none. Short recipe intros.
- The order of the Weekly Munchies cheddar plan includes "caprese salad", as posted.
- Stock photos and clips are illustrations, not Sirimon dishes (see CREDITS.md); the second row of B's melt wall and the stage packs are Sirimon's own.

**Worth telling the client:**
- Many staples are sold out on the shop today (regular Feta, Cheddar 500 g to 2.5 kg, Mozzarella 1 kg, Everyday 1 kg and 2.5 kg, Ghee, Aged Gouda). A "notify me" list and a members' early-access list would turn that into demand.
- The Beef Lasagna recipe page shows the Pull-Apart Christmas Tree method. Several recipe titles use decorative Unicode letters, which makes their web addresses unreadable, and Feta Irio, Matoke Paneer and Ham & Cheese Mahamri have no written recipe (left out here).
- Google has two listings: "Sirimon Cheese" (5.0 from 9 reviews) and "Sirimon Cheese Factory" (4.7 from 118). The map here shows the factory pin.

## Run locally

```bash
python -m http.server 8793     # then open http://127.0.0.1:8793/
```

The tools used to build and test this are kept out of the repository. They include a browser test of the cheese list, delivery zones, checkout, the Kitchen Crew, the chat, the pop-ups and each concept's own interactions (54 checks on A, 58 on B).
