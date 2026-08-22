// Shared engine for recipe pages. Each recipe page defines `window.RECIPE`
// with: baseServings, ingredients[], steps[], accent ("coral" or "rum")

(function(){
  const RECIPE = window.RECIPE;
  if(!RECIPE) return;

  const accentClass = RECIPE.accent === 'rum' ? 'rum' : '';

  function fmtAmount(n){
    const whole = Math.floor(n);
    const frac = n - whole;
    const fracMap = [
      [0.125, "⅛"], [0.25, "¼"], [0.333, "⅓"], [0.375, "⅜"],
      [0.5, "½"], [0.625, "⅝"], [0.666, "⅔"], [0.75, "¾"], [0.875, "⅞"]
    ];
    let closest = null, diff = 0.06;
    for(const [val, sym] of fracMap){
      if(Math.abs(frac - val) < diff){ diff = Math.abs(frac - val); closest = sym; }
    }
    if(Math.abs(frac) < 0.02) return `${whole}`;
    if(closest) return whole > 0 ? `${whole}${closest}` : closest;
    return n.toFixed(2).replace(/\.?0+$/,'');
  }

  let servings = RECIPE.baseServings;
  const STEP_SIZE = RECIPE.servingStep || 2;
  const MIN_S = RECIPE.minServings || 2;
  const MAX_S = RECIPE.maxServings || 40;

  function renderIngredients(){
    const scale = servings / RECIPE.baseServings;
    const list = document.getElementById('ingredientsList');
    list.innerHTML = '';
    RECIPE.ingredients.forEach(ing => {
      const amt = ing.base * scale;
      const li = document.createElement('li');
      li.innerHTML = `<span class="amt">${fmtAmount(amt)} ${ing.unit || ''}</span>
                       <span class="name">${ing.name}${ing.sub ? `<small>${ing.sub}</small>` : ''}</span>`;
      list.appendChild(li);
    });
    document.getElementById('servingsCount').textContent = servings;
    if(RECIPE.servingsNote){
      document.getElementById('servingsNoteText').textContent = RECIPE.servingsNote(scale, fmtAmount);
    }
  }

  document.getElementById('inc').addEventListener('click', () => {
    if(servings < MAX_S){ servings += STEP_SIZE; renderIngredients(); }
  });
  document.getElementById('dec').addEventListener('click', () => {
    if(servings > MIN_S){ servings -= STEP_SIZE; renderIngredients(); }
  });

  renderIngredients();

  // ---------- Cook mode ----------
  const steps = RECIPE.steps;
  let currentStep = 0;
  let timerInterval = null;
  let timerRemaining = 0;
  let timerTotal = 0;
  let timerRunning = false;

  const cookOverlay = document.getElementById('cookOverlay');
  const stepCount = document.getElementById('stepCount');
  const stepEyebrow = document.getElementById('stepEyebrow');
  const stepTitle = document.getElementById('stepTitle');
  const stepContent = document.getElementById('stepContent');
  const progressTrack = document.getElementById('progressTrack');
  const timerWrap = document.getElementById('timerWrap');
  const dialTime = document.getElementById('dialTime');
  const dialLabel = document.getElementById('dialLabel');
  const dialFill = document.getElementById('dialFill');
  const timerToggle = document.getElementById('timerToggle');
  const timerDoneBadge = document.getElementById('timerDoneBadge');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const cookBody = document.getElementById('cookBody');
  const doneScreen = document.getElementById('doneScreen');
  const cookNav = document.getElementById('cookNav');

  if(accentClass){
    progressTrack.classList.add('rum');
    stepEyebrow.classList.add('rum');
    dialFill.classList.add('rum');
    timerToggle.classList.add('rum');
    nextBtn.classList.add('rum');
  }

  const RADIUS = 82;
  const CIRC = 2 * Math.PI * RADIUS;
  dialFill.style.strokeDasharray = `${CIRC}`;

  function buildProgress(){
    progressTrack.innerHTML = '';
    steps.forEach((_, i) => {
      const seg = document.createElement('div');
      seg.className = 'seg' + (i < currentStep ? ' done' : i === currentStep ? ' current' : '');
      progressTrack.appendChild(seg);
    });
  }

  function fmtTime(sec){
    const m = Math.floor(sec/60).toString().padStart(2,'0');
    const s = Math.floor(sec%60).toString().padStart(2,'0');
    return `${m}:${s}`;
  }

  function stopTimer(){
    clearInterval(timerInterval);
    timerInterval = null;
    timerRunning = false;
  }

  function setupTimerForStep(step){
    stopTimer();
    timerDoneBadge.classList.remove('show');
    if(step.timer){
      timerWrap.style.display = 'flex';
      timerTotal = step.timer;
      timerRemaining = step.timer;
      dialTime.textContent = fmtTime(timerRemaining);
      dialLabel.textContent = 'READY';
      dialFill.style.strokeDashoffset = `${CIRC}`;
      timerToggle.textContent = 'Start timer';
    } else {
      timerWrap.style.display = 'none';
    }
  }

  function tickTimer(){
    timerRemaining -= 1;
    if(timerRemaining <= 0){
      timerRemaining = 0;
      stopTimer();
      dialLabel.textContent = 'DONE';
      timerToggle.textContent = 'Start timer';
      timerDoneBadge.classList.add('show');
      if(navigator.vibrate) navigator.vibrate([200,100,200]);
    }
    dialTime.textContent = fmtTime(timerRemaining);
    const offset = CIRC * (1 - timerRemaining/timerTotal);
    dialFill.style.strokeDashoffset = `${offset}`;
  }

  timerToggle.addEventListener('click', () => {
    if(timerRunning){
      stopTimer();
      timerToggle.textContent = 'Resume';
      dialLabel.textContent = 'PAUSED';
    } else {
      if(timerRemaining <= 0) return;
      timerRunning = true;
      dialLabel.textContent = 'COOKING';
      timerToggle.textContent = 'Pause';
      timerDoneBadge.classList.remove('show');
      timerInterval = setInterval(tickTimer, 1000);
    }
  });

  document.getElementById('timerReset').addEventListener('click', () => {
    setupTimerForStep(steps[currentStep]);
  });

  function renderStep(){
    const step = steps[currentStep];
    stepCount.textContent = `STEP ${currentStep+1} / ${steps.length}`;
    stepEyebrow.textContent = step.eyebrow;
    stepTitle.textContent = step.title;
    stepContent.innerHTML = step.content;
    buildProgress();
    setupTimerForStep(step);
    prevBtn.disabled = currentStep === 0;
    nextBtn.textContent = currentStep === steps.length - 1 ? 'Finish' : 'Next step';
    cookBody.style.display = 'flex';
    cookBody.style.flexDirection = 'column';
    doneScreen.classList.remove('active');
    cookNav.style.display = 'flex';
  }

  function openCook(){
    currentStep = 0;
    cookOverlay.classList.add('active');
    renderStep();
    document.body.style.overflow = 'hidden';
  }
  function closeCook(){
    cookOverlay.classList.remove('active');
    stopTimer();
    document.body.style.overflow = '';
  }

  document.getElementById('startBtn').addEventListener('click', openCook);
  document.getElementById('closeBtn').addEventListener('click', closeCook);
  document.getElementById('restartBtn').addEventListener('click', openCook);

  prevBtn.addEventListener('click', () => {
    if(currentStep > 0){ currentStep--; renderStep(); }
  });
  nextBtn.addEventListener('click', () => {
    if(currentStep < steps.length - 1){
      currentStep++;
      renderStep();
    } else {
      stopTimer();
      cookBody.style.display = 'none';
      cookNav.style.display = 'none';
      doneScreen.classList.add('active');
      progressTrack.querySelectorAll('.seg').forEach(s => { s.className = 'seg done'; });
    }
  });
})();
