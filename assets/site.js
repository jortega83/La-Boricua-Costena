// Shared across every page: a floating back-to-top button that
// appears once the user has scrolled down a bit.

(function(){
  const btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '↑';
  document.body.appendChild(btn);

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  }, { passive: true });
})();

// ---------- Recipe assistant (free, runs entirely in the browser) ----------
// No API, no backend, no cost. Searches this site's own recipes and answers
// a handful of common weight-loss questions using canned, on-brand answers.

const RECIPE_INDEX = [
    { title: 'Coconut Rice Costeño', href: 'recipes/arroz-de-coco.html', desc: 'Titoté-based coastal coconut rice', category: 'Colombian Coast' },
    { title: 'Shrimp Cocktail', href: 'recipes/coctel-de-camaron.html', desc: 'Shrimp and langostino in a fresh dressing', category: 'Colombian Coast' },
    { title: 'Fried Red Snapper Costeño', href: 'recipes/pargo-rojo-frito.html', desc: 'Whole fried red snapper, Cartagena style', category: 'Colombian Coast' },
    { title: 'Arroz con Fideos', href: 'recipes/arroz-con-fideos.html', desc: 'Rice toasted with golden angel hair pasta', category: 'Colombian Coast' },
    { title: 'Pescado con Coco', href: 'recipes/pescado-con-coco.html', desc: 'Fish simmered in tomato-coconut sauce', category: 'Colombian Coast' },
    { title: 'Pastel de Arroz Cartagenero', href: 'recipes/pastel-de-arroz-cartagenero.html', desc: 'Achiote rice and stewed meats wrapped in vijao, Navidad', category: 'Colombian Coast' },
    { title: 'Patacón Costeño con Todo', href: 'recipes/patacon-costeno.html', desc: 'Loaded fried plantain sandwich, comida callejera', category: 'Colombian Coast' },
    { title: 'Mote de Frijol de Ojo Negro', href: 'recipes/mote-de-frijol-de-ojo-negro.html', desc: 'Black-eyed pea and ripe plantain stew', category: 'Colombian Coast' },
    { title: 'Lentejas Colombianas', href: 'recipes/lentejas-colombianas.html', desc: 'Lentil stew with Colombian chorizo, carrot, and potato', category: 'Colombian Coast' },
    { title: 'Patacones Clásicos', href: 'recipes/patacones-clasicos.html', desc: 'Plain twice-fried plantain chips, great for dipping', category: 'Colombian Coast' },
    { title: 'Mote de Queso', href: 'recipes/mote-de-queso.html', desc: 'Ñame and cheese soup, a Cartagena classic', category: 'Colombian Coast' },
    { title: 'Turkish Chicken Salad', href: 'recipes/turkish-chicken-salad.html', desc: "Family recipe from Cartagena's Turkish community", category: 'Colombian Coast' },
    { title: 'Arroz con Almendras y Pollo', href: 'recipes/arroz-con-almendras-y-pollo.html', desc: 'Rice with toasted almonds, caramelized onion, cinnamon', category: 'Colombian Coast' },
    { title: 'Pernil Asado', href: 'recipes/pernil.html', desc: 'Slow-roasted pork shoulder with crispy skin, Navidad', category: 'Cocina Boricua' },
    { title: 'Pasteles Boricua', href: 'recipes/pasteles-de-masa.html', desc: 'Christmas root vegetable and pork parcels, Navidad', category: 'Cocina Boricua' },
    { title: "Arroz con Gandules", href: 'recipes/arroz-con-gandules.html', desc: "Puerto Rico's national dish, rice with pigeon peas", category: 'Cocina Boricua' },
    { title: "Johanna's Coquito", href: 'recipes/coquito.html', desc: 'Puerto Rican coconut rum nog, bebidas', category: 'Cocina Boricua' },
    { title: 'Habichuelas Guisadas', href: 'recipes/habichuelas-guisadas.html', desc: 'Pink beans stewed with sofrito, ham, and potatoes', category: 'Cocina Boricua' },
    { title: "Thu's White Rice", href: 'recipes/arroz-blanco.html', desc: 'Everyday fluffy white rice, the base for habichuelas', category: 'Cocina Boricua' },
    { title: "Thu's Tostones", href: 'recipes/tus-tostones.html', desc: 'Twice-fried crispy green plantains', category: 'Cocina Boricua' },
    { title: "Johanna's Famous Chili", href: 'recipes/johannas-chili.html', desc: 'Beef and pork chili with three beans, cold weather favorite', category: 'American Kitchen' },
    { title: 'Garlic Butter Grilled Chicken', href: 'recipes/garlic-butter-grilled-chicken.html', desc: 'Grilled chicken breast with garlic parsley butter', category: 'American Kitchen' },
    { title: "Johanna's Meatloaf", href: 'recipes/johannas-meatloaf.html', desc: 'Beef and pork meatloaf with a tangy ketchup glaze', category: 'American Kitchen' },
    { title: 'Creamy Mashed Potatoes', href: 'recipes/creamy-mashed-potatoes.html', desc: 'Yukon Golds with butter and cream', category: 'American Kitchen' },
    { title: "Thu's Mac & Cheese", href: 'recipes/tus-mac-and-cheese.html', desc: 'Baked mac and cheese with a crisp panko crust', category: 'American Kitchen' },
    { title: "Thu's Grilled Chicken", href: 'recipes/tus-grilled-chicken.html', desc: 'Brined and marinated for maximum juiciness', category: 'American Kitchen' },
    { title: "Juji's Chop Cheese", href: 'recipes/jujis-chop-cheese.html', desc: 'Bodega-style chopped burger sandwich, melted cheese', category: 'American Kitchen' },
    { title: 'Baked Sweet Potato', href: 'recipes/baked-sweet-potato.html', desc: 'Puffed and caramelized, crispy skin', category: 'American Kitchen' },
    { title: "Juji's Ground Beef Burger Bowl", href: 'recipes/jujis-burger-bowl.html', desc: 'Burger flavor, no bun, with roasted sweet potatoes', category: 'American Kitchen' },
    { title: 'Curry Chicken Salad', href: 'recipes/curry-chicken-salad.html', desc: 'Grapes, toasted cashews, and a Greek yogurt curry dressing', category: 'American Kitchen' },
    { title: "Titi Nork's Jalapeño Poppers", href: 'recipes/titi-norks-jalapeno-poppers.html', desc: 'Cream cheese, bacon-wrapped, baked crisp', category: 'American Kitchen' },
    { title: 'Pineapple Chicken Fried Rice', href: 'recipes/pineapple-chicken-fried-rice.html', desc: 'Ground chicken, scrambled eggs, sweet pineapple', category: 'American Kitchen' },
    { title: "Chris E's Sourdough Bread", href: 'recipes/chris-e-sourdough-bread.html', desc: 'High-hydration Tartine-style loaf, dark crackling crust', category: 'American Kitchen' },
    { title: "Chris E's Sourdough Crumpets", href: 'recipes/sourdough-crumpets.html', desc: 'A great way to use up starter discard', category: 'American Kitchen' },
    { title: "Chris E's Sourdough Buttermilk Waffles", href: 'recipes/sourdough-buttermilk-waffles.html', desc: 'Light, airy, crispy on the outside', category: 'American Kitchen' },
    { title: "Chris E's Sourdough Pizza", href: 'recipes/sourdough-pizza.html', desc: 'Charred base, pan-fried and broiled', category: 'American Kitchen' },
    { title: "Johanna's Seafood Boil", href: 'recipes/johannas-seafood-boil.html', desc: 'King crab, snow crab, and shrimp, restaurant-style sauce', category: 'American Kitchen' },
    { title: 'Chipotle Chicken Bowl', href: 'recipes/chipotle-chicken-meal-prep.html', desc: 'Cilantro lime rice, black beans, fajita veggies', category: 'Meal Prep' },
    { title: 'Chipotle Steak Bowl', href: 'recipes/chipotle-steak-meal-prep.html', desc: 'Seared steak, cilantro lime rice, black beans', category: 'Meal Prep' },
    { title: 'Sweet and Sour Chicken', href: 'recipes/sweet-and-sour-chicken-meal-prep.html', desc: 'Crispy chicken, peppers, and pineapple, better than takeout', category: 'Meal Prep' },
    { title: 'Taco Chicken Potato Bowl', href: 'recipes/taco-chicken-potato-bowl.html', desc: 'High protein, crispy potatoes, pico de gallo', category: 'Meal Prep' },
    { title: 'Teriyaki Chicken Bowl', href: 'recipes/teriyaki-chicken-bowl-meal-prep.html', desc: 'Sweet-savory glaze, steamed broccoli, rice', category: 'Meal Prep' },
    { title: 'Honey Garlic Chicken', href: 'recipes/honey-garlic-chicken-meal-prep.html', desc: 'Sticky glaze with roasted green beans and rice', category: 'Meal Prep' },
    { title: 'Greek Chicken Bowl', href: 'recipes/greek-chicken-bowl-meal-prep.html', desc: 'Lemon-oregano chicken, feta, tzatziki', category: 'Meal Prep' },
    { title: 'Korean Beef Bowl', href: 'recipes/korean-beef-bowl-meal-prep.html', desc: 'Gochujang beef, sesame cucumbers, rice', category: 'Meal Prep' },
    { title: 'Cajun Chicken and Sausage Rice', href: 'recipes/cajun-chicken-sausage-rice-meal-prep.html', desc: 'One-pot jambalaya-style, andouille sausage', category: 'Meal Prep' },
    { title: 'Buffalo Chicken Bowl', href: 'recipes/buffalo-chicken-bowl-meal-prep.html', desc: 'Spicy chicken, ranch drizzle, celery, carrots', category: 'Meal Prep' },
    { title: 'Mediterranean Chicken Bowl', href: 'recipes/mediterranean-chicken-bowl-meal-prep.html', desc: 'Hummus, olives, cucumber, yogurt sauce', category: 'Meal Prep' },
    { title: 'Camarones al Maní', href: 'recipes/camarones-al-mani-con-patacones.html', desc: 'Shrimp in peanut sauce with patacones folded in', category: 'Latin Cuisine' },
    { title: 'Moros y Cristianos', href: 'recipes/moros-y-cristianos.html', desc: 'Cuban black beans and rice with crispy bacon', category: 'Latin Cuisine' },
    { title: 'Ensalada Rusa Clásica', href: 'recipes/ensalada-rusa-clasica.html', desc: 'Potato salad with apple, celery, and peas', category: 'Latin Cuisine' },
    { title: 'Ensalada Rusa con Remolacha', href: 'recipes/ensalada-rusa-con-remolacha.html', desc: 'Potato, carrot, and beet salad, a Cartagena side', category: 'Colombian Coast' },
    { title: 'Shrimp & Sweet Potato Bowl', href: 'recipes/shrimp-sweet-potato-bowl-meal-prep.html', desc: 'Cajun shrimp, roasted sweet potato, hot honey', category: 'Meal Prep' },
    { title: 'Loaded Party Nachos', href: 'recipes/loaded-party-nachos.html', desc: 'Double-layered beef and bean nachos, fully loaded', category: 'Snacks & Game Day' },
    { title: 'Crab Rangoon Nachos', href: 'recipes/crab-rangoon-nachos.html', desc: 'Crispy wonton chips, warm crab and cream cheese', category: 'Snacks & Game Day' },
    { title: 'Spicy Vodka Chicken Parm', href: 'recipes/spicy-vodka-chicken-parmesan.html', desc: 'Crispy cutlets, fiery vodka sauce, melted cheese', category: 'American Kitchen' },
    { title: 'Chicken Shawarma Bowl', href: 'recipes/chicken-shawarma-bowl-meal-prep.html', desc: 'Spiced chicken, turmeric rice, sumac salad, garlic sauce', category: 'Meal Prep' },
    { title: 'Creamy Gorgonzola Spaghetti', href: 'recipes/creamy-gorgonzola-spaghetti.html', desc: 'One-pan Brazilian pasta, sun-dried tomato, gorgonzola', category: 'Latin Cuisine' },
];

const SUBSTITUTIONS = {
  'achiote': "No achiote oil? Heat oil with a little paprika and a pinch of turmeric for color, it won't be identical but it gets you close.",
  'sofrito': "No sofrito on hand? A quick blend of onion, bell pepper, garlic, and cilantro pulses close enough for most recipes here.",
  'sazon': "Out of sazón? Mix a pinch of ground annatto or paprika with garlic powder, oregano, and a little cumin.",
  'vijao': "Can't find vijao leaves? Banana leaves work as a substitute for wrapping pasteles and pastel de arroz.",
  'yautia': "No yautía? White or yellow malanga is the closest substitute for pasteles.",
  'cream of coconut': "Out of cream of coconut? A can of full-fat coconut milk with a couple tablespoons of sugar stirred in works in a pinch, for coquito especially.",
  'buttermilk': "No buttermilk? Add a tablespoon of lemon juice or vinegar to a cup of milk and let it sit 5 minutes.",
  'queso costeno': "No queso costeño in the US? Feta is the closest match, cotija and queso blanco work well too. Some Sam's Club locations carry a Central American cheese called queso El Viajero that's even closer.",
  'suero': "No suero costeño? A squeeze of fresh lime juice does the same brightening job. For something closer to the tang, thin a little sour cream with milk and lime juice.",
  'ñame': "Can't find ñame? Yuca or a regular yam both work as substitutes, look for frozen ñame at a Latin market too.",
};

const CALORIE_ANSWERS = [
  { keywords: ['how many calories', 'calorie target', 'how much should i eat'], answer: "That depends on your age, height, weight, and activity level, head to the Weight Loss Planner and it'll calculate a personalized target for you." },
  { keywords: ['how much protein', 'protein target'], answer: "A good starting point for fat loss while preserving muscle is roughly 1 gram of protein per pound of body weight. The Weight Loss Planner calculates this exactly for you." },
  { keywords: ['how fast', 'how quickly', 'lose weight fast', 'rate of loss'], answer: "Aim for around 1% of your body weight per week or less. Faster than that raises the risk of losing muscle along with fat, which is what causes a soft or loose look afterward." },
  { keywords: ['loose skin', 'hanging', 'saggy'], answer: "The two biggest levers against loose skin are a moderate (not extreme) calorie deficit and enough protein plus resistance training to preserve muscle. See the Weight Loss Planner for a plan built around exactly that." },
];

(function(){
  const fab = document.createElement('button');
  fab.className = 'chat-fab';
  fab.setAttribute('aria-label', 'Ask a question');
  fab.innerHTML = '💬';
  document.body.appendChild(fab);

  const isRecipesRoot = location.pathname.includes('/recipes/');
  const homeLink = isRecipesRoot ? '../index.html' : 'index.html';
  const plannerLink = isRecipesRoot ? '../weight-loss-planner.html' : 'weight-loss-planner.html';

  const panel = document.createElement('div');
  panel.className = 'chat-panel';
  panel.innerHTML = `
    <div class="chat-head">
      <div class="title">Ask La Boricua<small>Recipe search &amp; quick answers</small></div>
      <button type="button" aria-label="Close" id="chatClose">✕</button>
    </div>
    <div class="chat-messages" id="chatMessages">
      <div class="chat-msg assistant">Hi! Ask what you're craving ("chicken bowl", "something with plantains"), a substitution ("no sofrito"), or a quick weight-loss question.</div>
    </div>
    <div class="chat-input-row">
      <input type="text" id="chatInput" placeholder="Ask a question..." autocomplete="off">
      <button type="button" id="chatSend" aria-label="Send">→</button>
    </div>
  `;
  document.body.appendChild(panel);

  const messagesEl = panel.querySelector('#chatMessages');
  const inputEl = panel.querySelector('#chatInput');
  const sendBtn = panel.querySelector('#chatSend');
  const closeBtn = panel.querySelector('#chatClose');

  function open() {
    panel.classList.add('open');
    fab.classList.add('hide');
    inputEl.focus();
  }
  function close() {
    panel.classList.remove('open');
    fab.classList.remove('hide');
  }

  fab.addEventListener('click', open);
  closeBtn.addEventListener('click', close);

  function addMessage(role, html) {
    const div = document.createElement('div');
    div.className = 'chat-msg ' + role;
    div.innerHTML = html;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return div;
  }
  function addText(role, text) {
    const div = document.createElement('div');
    div.className = 'chat-msg ' + role;
    div.textContent = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return div;
  }

  function scoreMatch(query, recipe) {
    const q = query.toLowerCase();
    const hay = (recipe.title + ' ' + recipe.desc + ' ' + recipe.category).toLowerCase();
    const words = q.split(/\s+/).filter(w => w.length > 2);
    let score = 0;
    words.forEach(w => { if (hay.includes(w)) score++; });
    return score;
  }

  function answerQuery(query) {
    const q = query.toLowerCase();

    // Substitution questions
    for (const key in SUBSTITUTIONS) {
      if (q.includes(key)) return SUBSTITUTIONS[key];
    }

    // Canned weight-loss answers
    for (const item of CALORIE_ANSWERS) {
      if (item.keywords.some(k => q.includes(k))) return item.answer;
    }

    // Recipe search
    const scored = RECIPE_INDEX
      .map(r => ({ r, score: scoreMatch(query, r) }))
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);

    if (scored.length > 0) {
      const links = scored.map(x => {
        const href = isRecipesRoot ? x.r.href.replace('recipes/', '') : x.r.href;
        return `<div style="margin-top:6px;"><a href="${href}" style="color:var(--meal);">${x.r.title}</a><br><span style="font-size:12px; opacity:0.75;">${x.r.desc}</span></div>`;
      }).join('');
      return `Here's what I found:${links}`;
    }

    return `I couldn't find a close match on the site. Try browsing by <a href="${homeLink}" style="color:var(--meal);">category on the home page</a>, or check the <a href="${plannerLink}" style="color:var(--meal);">Weight Loss Planner</a> for calorie and meal guidance.`;
  }

  function sendMessage() {
    const text = inputEl.value.trim();
    if (!text) return;

    addText('user', text);
    inputEl.value = '';

    setTimeout(() => {
      addMessage('assistant', answerQuery(text));
    }, 200);
  }

  sendBtn.addEventListener('click', sendMessage);
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
})();
