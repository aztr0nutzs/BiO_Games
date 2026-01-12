// Bio_Petz Core Game Logic
// Main game class and pet management system

class BioPet {
  constructor(specimenId, traits = null, name = null) {
    this.id = this.generateId();
    this.specimenId = specimenId;
    this.specimen = window.SPECIMENS[specimenId];
    this.name = name || this.generateName();
    this.traits = traits || { ...this.specimen.baseTraits };

    // Initialize stats
    this.stats = {
      health: this.specimen.baseStats.maxHealth,
      maxHealth: this.specimen.baseStats.maxHealth,
      happiness: this.specimen.baseStats.maxHappiness,
      maxHappiness: this.specimen.baseStats.maxHappiness,
      hunger: 0,
      cleanliness: 100,
      energy: 100
    };

    // Progression
    this.level = 1;
    this.experience = 0;
    this.age = 0; // in game days

    // Timestamps
    this.created = Date.now();
    this.lastFed = Date.now();
    this.lastCleaned = Date.now();
    this.lastPlayed = Date.now();

    // Status effects
    this.statusEffects = [];
  }

  generateId() {
    return 'pet_' + Math.random().toString(36).substr(2, 9);
  }

  generateName() {
    const prefixes = ['Bio', 'Neo', 'Proto', 'Xeno', 'Cyber'];
    const suffixes = ['Blob', 'Spawn', 'Entity', 'Form', 'Mass'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    return prefix + '-' + suffix;
  }

  // Update pet stats over time
  update(deltaTime) {
    // Hunger increases over time
    this.stats.hunger = Math.min(100, this.stats.hunger + deltaTime * 0.1);

    // Cleanliness decreases over time
    this.stats.cleanliness = Math.max(0, this.stats.cleanliness - deltaTime * 0.05);

    // Energy regenerates slowly
    this.stats.energy = Math.min(100, this.stats.energy + deltaTime * 0.02);

    // Health and happiness affected by other stats
    this.updateDerivedStats();
  }

  updateDerivedStats() {
    // Health affected by hunger and cleanliness
    const healthModifier = (this.stats.hunger * -0.5) + ((100 - this.stats.cleanliness) * -0.3);
    this.stats.health = Math.max(0, Math.min(this.stats.maxHealth,
      this.stats.maxHealth + healthModifier));

    // Happiness affected by health, hunger, cleanliness, and energy
    const happinessModifier = (this.stats.health / this.stats.maxHealth * 50) -
                             (this.stats.hunger * 0.3) -
                             ((100 - this.stats.cleanliness) * 0.2) +
                             (this.stats.energy * 0.1);
    this.stats.happiness = Math.max(0, Math.min(this.stats.maxHappiness, happinessModifier));
  }

  // Care actions
  feed(item) {
    const effect = item.effect;
    if (effect.hunger) {
      this.stats.hunger = Math.max(0, this.stats.hunger + effect.hunger);
    }
    if (effect.happiness) {
      this.stats.happiness = Math.min(this.stats.maxHappiness,
        this.stats.happiness + effect.happiness);
    }
    if (effect.health) {
      this.stats.health = Math.min(this.stats.maxHealth,
        this.stats.health + effect.health);
    }
    this.lastFed = Date.now();
    this.gainExperience(5);
  }

  clean() {
    this.stats.cleanliness = 100;
    this.stats.happiness = Math.min(this.stats.maxHappiness,
      this.stats.happiness + 10);
    this.lastCleaned = Date.now();
    this.gainExperience(3);
  }

  play() {
    this.stats.energy = Math.max(0, this.stats.energy - 20);
    this.stats.happiness = Math.min(this.stats.maxHappiness,
      this.stats.happiness + 25);
    this.lastPlayed = Date.now();
    this.gainExperience(8);
  }

  medicate(item) {
    const effect = item.effect;
    if (effect.health) {
      this.stats.health = Math.min(this.stats.maxHealth,
        this.stats.health + effect.health);
    }
    if (effect.happiness) {
      this.stats.happiness = Math.min(this.stats.maxHappiness,
        this.stats.happiness + effect.happiness);
    }
  }

  // Experience and leveling
  gainExperience(amount) {
    this.experience += amount;
    const expNeeded = this.level * 100;

    if (this.experience >= expNeeded) {
      this.levelUp();
    }
  }

  levelUp() {
    this.level++;
    this.experience = 0;

    // Level up bonuses
    this.stats.maxHealth += 5;
    this.stats.maxHappiness += 2;
    this.stats.health = this.stats.maxHealth; // Full heal on level up
  }

  // Get pet status
  getStatus() {
    let status = 'normal';

    if (this.stats.health < 30) status = 'critical';
    else if (this.stats.health < 60) status = 'injured';
    else if (this.stats.hunger > 70) status = 'hungry';
    else if (this.stats.cleanliness < 30) status = 'dirty';
    else if (this.stats.happiness > 80) status = 'happy';
    else if (this.stats.happiness < 40) status = 'sad';

    return status;
  }

  // Serialize for saving
  toJSON() {
    return {
      id: this.id,
      specimenId: this.specimenId,
      name: this.name,
      traits: this.traits,
      stats: this.stats,
      level: this.level,
      experience: this.experience,
      age: this.age,
      created: this.created,
      lastFed: this.lastFed,
      lastCleaned: this.lastCleaned,
      lastPlayed: this.lastPlayed,
      statusEffects: this.statusEffects
    };
  }

  // Deserialize from save
  static fromJSON(data) {
    const pet = new BioPet(data.specimenId, data.traits, data.name);
    Object.assign(pet, data);
    return pet;
  }
}

// Game state management
class GameState {
  constructor() {
    this.pets = [];
    this.inventory = {};
    this.currency = { credits: 100, toxins: 0 };
    this.unlockedSpecimens = ['s01'];
    this.unlockedItems = ['food_basic', 'medicine_basic'];
    this.labLevel = 1;
    this.gameStats = {
      totalPetsCreated: 0,
      experimentsPerformed: 0,
      mutationsAchieved: 0
    };
    this.settings = {
      soundEnabled: true,
      notificationsEnabled: true
    };
  }

  // Pet management
  addPet(pet) {
    this.pets.push(pet);
    this.gameStats.totalPetsCreated++;
  }

  removePet(petId) {
    this.pets = this.pets.filter(pet => pet.id !== petId);
  }

  getActivePet() {
    return this.pets.find(pet => pet.isActive) || this.pets[0];
  }

  // Inventory management
  addItem(itemId, quantity = 1) {
    this.inventory[itemId] = (this.inventory[itemId] || 0) + quantity;
  }

  removeItem(itemId, quantity = 1) {
    if (this.inventory[itemId]) {
      this.inventory[itemId] = Math.max(0, this.inventory[itemId] - quantity);
    }
  }

  hasItem(itemId, quantity = 1) {
    return (this.inventory[itemId] || 0) >= quantity;
  }

  // Currency management
  addCredits(amount) {
    this.currency.credits += amount;
  }

  spendCredits(amount) {
    if (this.currency.credits >= amount) {
      this.currency.credits -= amount;
      return true;
    }
    return false;
  }

  // Specimen unlocking
  unlockSpecimen(specimenId) {
    if (!this.unlockedSpecimens.includes(specimenId)) {
      this.unlockedSpecimens.push(specimenId);
    }
  }

  canUnlockSpecimen(specimenId) {
    const specimen = window.SPECIMENS[specimenId];
    return this.gameStats.totalPetsCreated >= specimen.unlockRequirement;
  }

  // Save/Load
  save() {
    const saveData = {
      pets: this.pets.map(pet => pet.toJSON()),
      inventory: this.inventory,
      currency: this.currency,
      unlockedSpecimens: this.unlockedSpecimens,
      unlockedItems: this.unlockedItems,
      labLevel: this.labLevel,
      gameStats: this.gameStats,
      settings: this.settings,
      timestamp: Date.now()
    };

    localStorage.setItem('bio_petz_save', JSON.stringify(saveData));
  }

  load() {
    const saveData = localStorage.getItem('bio_petz_save');
    if (saveData) {
      const data = JSON.parse(saveData);
      this.pets = data.pets.map(petData => BioPet.fromJSON(petData));
      this.inventory = data.inventory || {};
      this.currency = data.currency || { credits: 100, toxins: 0 };
      this.unlockedSpecimens = data.unlockedSpecimens || ['s01'];
      this.unlockedItems = data.unlockedItems || ['food_basic', 'medicine_basic'];
      this.labLevel = data.labLevel || 1;
      this.gameStats = data.gameStats || {};
      this.settings = data.settings || {};
    }
  }

  // Reset game
  reset() {
    localStorage.removeItem('bio_petz_save');
    Object.assign(this, new GameState());
  }
}

// Main game controller
class BioPetzGame {
  constructor() {
    this.gameState = new GameState();
    this.mutationEngine = new window.MutationEngine();
    this.currentScreen = 'home';
    this.lastUpdate = Date.now();

    this.initialize();
  }

  initialize() {
    this.gameState.load();

    // Create initial pet if none exist
    if (this.gameState.pets.length === 0) {
      const initialPet = new BioPet('s01');
      this.gameState.addPet(initialPet);
    }

    this.setupEventListeners();
    this.startGameLoop();
    this.render();
  }

  setupEventListeners() {
    // Screen navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const screen = e.target.dataset.screen;
        this.switchScreen(screen);
      });
    });
  }

  switchScreen(screenName) {
    this.currentScreen = screenName;
    document.querySelectorAll('.screen').forEach(screen => {
      screen.classList.remove('active');
    });
    document.getElementById(`${screenName}-screen`).classList.add('active');
    this.render();
  }

  startGameLoop() {
    const gameLoop = () => {
      const now = Date.now();
      const deltaTime = (now - this.lastUpdate) / 1000; // Convert to seconds
      this.lastUpdate = now;

      // Update all pets
      this.gameState.pets.forEach(pet => {
        pet.update(deltaTime);
      });

      // Auto-save every 30 seconds
      if (Math.floor(now / 30000) !== Math.floor(this.lastUpdate / 30000)) {
        this.gameState.save();
      }

      requestAnimationFrame(gameLoop);
    };

    gameLoop();
  }

  render() {
    switch (this.currentScreen) {
      case 'home':
        this.renderHomeScreen();
        break;
      case 'lab':
        this.renderLabScreen();
        break;
      case 'inventory':
        this.renderInventoryScreen();
        break;
      case 'shop':
        this.renderShopScreen();
        break;
    }
  }

  renderHomeScreen() {
    const activePet = this.gameState.getActivePet();
    if (!activePet) return;

    // Update pet display
    const petDisplay = document.getElementById('pet-display');
    petDisplay.innerHTML = `
      <div class="pet-visual">
        <div class="pet-sprite" style="background-color: ${this.getTraitColor(activePet.traits.color)}">
          ${activePet.name}
        </div>
      </div>
      <div class="pet-info">
        <h3>${activePet.name}</h3>
        <p>${activePet.specimen.name}</p>
        <div class="pet-stats">
          <div class="stat-bar">
            <label>Health</label>
            <div class="bar">
              <div class="fill health" style="width: ${activePet.stats.health}%"></div>
            </div>
          </div>
          <div class="stat-bar">
            <label>Happiness</label>
            <div class="bar">
              <div class="fill happiness" style="width: ${activePet.stats.happiness}%"></div>
            </div>
          </div>
          <div class="stat-bar">
            <label>Hunger</label>
            <div class="bar">
              <div class="fill hunger" style="width: ${activePet.stats.hunger}%"></div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Update care buttons
    document.getElementById('feed-btn').disabled = !this.gameState.hasItem('food_basic');
    document.getElementById('clean-btn').disabled = false;
    document.getElementById('play-btn').disabled = activePet.stats.energy < 20;
  }

  getTraitColor(colorTrait) {
    const colors = {
      green: '#39ff14',
      cyan: '#00f3ff',
      purple: '#bc13fe',
      red: '#ff0055',
      yellow: '#ffff00',
      crystal: '#ffffff',
      chameleon: '#39ff14'
    };
    return colors[colorTrait] || '#39ff14';
  }

  renderLabScreen() {
    // Lab screen rendering logic
  }

  renderInventoryScreen() {
    // Inventory screen rendering logic
  }

  renderShopScreen() {
    // Shop screen rendering logic
  }

  // Care actions
  feedPet() {
    const activePet = this.gameState.getActivePet();
    const foodItem = window.ITEMS['food_basic'];

    if (this.gameState.hasItem('food_basic')) {
      activePet.feed(foodItem);
      this.gameState.removeItem('food_basic');
      this.render();
    }
  }

  cleanPet() {
    const activePet = this.gameState.getActivePet();
    activePet.clean();
    this.render();
  }

  playWithPet() {
    const activePet = this.gameState.getActivePet();
    activePet.play();
    this.render();
  }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.game = new BioPetzGame();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BioPet, GameState, BioPetzGame };
} else {
  window.BioPet = BioPet;
  window.GameState = GameState;
  window.BioPetzGame = BioPetzGame;
}
// === PET SETTINGS PERSISTENCE ===
const PET_SETTINGS_STORAGE = 'bio_petz_settings';

function loadPetSettings(){
  try {
    return JSON.parse(localStorage.getItem(PET_SETTINGS_STORAGE)) || {};
  } catch(e){ return {}; }
}
function savePetSettings(data){
  localStorage.setItem(PET_SETTINGS_STORAGE, JSON.stringify(data));
}

// Extend game init to apply settings
const _origInit = Game.prototype.init;
Game.prototype.init = function(){
  _origInit.call(this);
  try{ this.loadMutations(); }catch(e){console.warn(e)}
  const s = loadPetSettings();
  if(s.petName) this.pet.name = s.petName;
  if(s.neonEnabled === false){
    document.documentElement.classList.remove('neon-enabled');
  }
  if(s.accent){
    document.documentElement.style.setProperty('--neon-accent', s.accent);
  }
};

// === DNA_MUTATION_SYSTEM ===
Game.prototype.petDNA = { aggression:40, intelligence:55, mutation:20 };

Game.prototype.applyDNA = function(){
  const a = this.petDNA.aggression;
  const i = this.petDNA.intelligence;
  const m = this.petDNA.mutation;

  // Simple behavioral effects
  if(a > 70) this.pet.mood = 'aggressive';
  if(i > 70) this.pet.mood = 'curious';

  // Visual reaction
  const el = document.querySelector('#pet-display');
  if(el){
    el.animate([
      { transform:'scale(1)' },
      { transform:'scale(1.05)' },
      { transform:'scale(1)' }
    ], { duration:300 });
  }
};


// === UNIQUE_PETZ_CATALOG ===
Game.prototype.uniquePetz = [
  { id: 'biofluff', name: 'Biofluff', img: 'https://i.imgur.com/8Km9tLL.png', traits: { ears:0, spikes:0, eyeGlow:1 } },
  { id: 'neonbyte', name: 'NeonByte', img: 'https://i.imgur.com/6rkqGkR.png', traits: { ears:1, spikes:0, eyeGlow:1 } },
  { id: 'spikeling', name: 'Spikeling', img: 'https://i.imgur.com/4AiXzf8.png', traits: { ears:0, spikes:1, eyeGlow:0 } },
  { id: 'eyeshift', name: 'EyeShift', img: 'https://i.imgur.com/3Z3L0X2.png', traits: { ears:0, spikes:0, eyeGlow:2 } }
];

// Initialize mutations state
Game.prototype.mutationState = { ears:0, spikes:0, eyeGlow:0, variant: 'biofluff' };

// Terminal log helper
Game.prototype.pushLog = function(text){
  try{
    const consoleEl = document.getElementById('console-log');
    if(!consoleEl) return;
    const time = new Date().toLocaleTimeString();
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.textContent = '['+time+'] ' + text;
    consoleEl.appendChild(entry);
    consoleEl.scrollTop = consoleEl.scrollHeight;
    // persist minimal recent logs
    const logs = JSON.parse(localStorage.getItem('bio_petz_logs')||'[]');
    logs.push({t:Date.now(), m:text});
    if(logs.length>200) logs.shift();
    localStorage.setItem('bio_petz_logs', JSON.stringify(logs));
  }catch(e){console.warn(e)}
};

// Load persisted mutations
Game.prototype.loadMutations = function(){
  try{
    const s = JSON.parse(localStorage.getItem('bio_petz_mutations')||'{}');
    this.mutationState = Object.assign(this.mutationState, s);
    // apply visual
    this.applyMutationsVisual(); this.mutationParticles(); this.applyAbility(); this.checkEvolution(); this.checkInstability();
    // restore variant pet image if set
    if(this.mutationState.variant){
      const v = this.uniquePetz.find(x=>x.id===this.mutationState.variant);
      if(v) document.getElementById('pet-img').src = v.img;
    }
  }catch(e){console.warn(e)}
};

Game.prototype.saveMutations = function(){
  try{
    localStorage.setItem('bio_petz_mutations', JSON.stringify(this.mutationState));
  }catch(e){}
};

// Apply visual mutation overlays based on mutationState
Game.prototype.applyMutationsVisual = function(){
  const s = this.mutationState;
  const wrap = document.getElementById('pet-image-wrap');
  const ears = document.getElementById('mut-ears');
  const spikes = document.getElementById('mut-spikes');
  const eyes = document.getElementById('mut-eyes');
  if(!wrap) return;
  // ears
  ears.style.opacity = s.ears ? '1' : '0';
  ears.dataset.level = s.ears || 0;
  // spikes
  spikes.style.opacity = s.spikes ? '1' : '0';
  spikes.dataset.level = s.spikes || 0;
  // eyes glow intensity
  eyes.style.opacity = s.eyeGlow ? (0.4 + s.eyeGlow*0.3) : '0';
  // update name display if variant
  const v = this.uniquePetz.find(x=>x.id===s.variant);
  if(v) document.getElementById('pet-name-display').textContent = v.name;
  this.pushLog('Mutation visuals applied: ' + JSON.stringify(s));
};

// Mutation injection: consumes a lab item and triggers a mutation event
Game.prototype.injectMutation = function(){
  // simple random mutation influenced by petDNA.mutation if present
  const dna = this.petDNA && this.petDNA.mutation ? this.petDNA.mutation : 20;
  const roll = Math.random()*100;
  const result = { ears:0, spikes:0, eyeGlow:0, variant:this.mutationState.variant };
  // base chance scaled by DNA mutation rate
  if(roll < (10 + dna*0.6)){ result.ears = Math.floor(Math.random()*3); }
  if(roll < (5 + dna*0.4)){ result.spikes = Math.floor(Math.random()*2); }
  if(roll < (15 + dna*0.8)){ result.eyeGlow = Math.floor(1 + Math.random()*2); }

  // small chance to transform into a unique pet
  if(Math.random()*100 < (dna*0.25)){
    const pick = this.uniquePetz[Math.floor(Math.random()*this.uniquePetz.length)];
    result.variant = pick.id;
    document.getElementById('pet-img').src = pick.img;
    this.pushLog('Mutation event detected: variant -> ' + pick.name);
  } else {
    this.pushLog('Mutation event detected: traits -> ' + JSON.stringify(result));
  }

  // Apply to state and visuals
  this.mutationState = Object.assign(this.mutationState, result);
  this.applyMutationsVisual(); this.mutationParticles(); this.applyAbility(); this.checkEvolution(); this.checkInstability();
  this.saveMutations();

  // Animate pet reaction
  const el = document.getElementById('pet-image-wrap');
  if(el){
    el.animate([
      { transform:'translateY(0) scale(1)' },
      { transform:'translateY(-8px) scale(1.06)' },
      { transform:'translateY(0) scale(1)' }
    ], { duration:500, easing: 'cubic-bezier(.2,.8,.2,1)' });
  }
};


// === SPECIAL_ABILITIES & ADVANCED PETZ ===
Game.prototype.uniquePetz = [
  { id:'biofluff', name:'Biofluff', img:'https://i.imgur.com/8Km9tLL.png',
    dna:{aggression:20,intelligence:40,mutation:10},
    traits:{ears:0,spikes:0,eyeGlow:1},
    ability:'regen'
  },
  { id:'neonbyte', name:'NeonByte', img:'https://i.imgur.com/6rkqGkR.png',
    dna:{aggression:10,intelligence:80,mutation:20},
    traits:{ears:1,spikes:0,eyeGlow:2},
    ability:'xpBoost'
  },
  { id:'spikeling', name:'Spikeling', img:'https://i.imgur.com/4AiXzf8.png',
    dna:{aggression:75,intelligence:25,mutation:30},
    traits:{ears:0,spikes:2,eyeGlow:0},
    ability:'intimidate'
  },
  { id:'eyeshift', name:'EyeShift', img:'https://i.imgur.com/3Z3L0X2.png',
    dna:{aggression:40,intelligence:60,mutation:60},
    traits:{ears:0,spikes:0,eyeGlow:3},
    ability:'mutationSurge'
  },
  { id:'voidling', name:'Voidling', img:'https://i.imgur.com/qIufhof.png',
    dna:{aggression:90,intelligence:70,mutation:80},
    traits:{ears:2,spikes:2,eyeGlow:3},
    ability:'chaos'
  }
];

Game.prototype.applyAbility = function(){
  const v = this.uniquePetz.find(p=>p.id===this.mutationState.variant);
  if(!v) return;
  this.pushLog('Ability active: ' + v.ability);
  if(v.ability==='regen') this.pet.health = Math.min(this.pet.health+5, this.pet.maxHealth);
  if(v.ability==='xpBoost') this.gainExperience && this.gainExperience(5);
  if(v.ability==='intimidate') this.pet.mood='dominant';
  if(v.ability==='mutationSurge') this.petDNA.mutation += 5;
  if(v.ability==='chaos') this.injectMutation();
};


// === INVENTORY_SYSTEM ===
Game.prototype.inventory = {
  mutagen: 5,
  stabilizer: 2
};

Game.prototype.consumeItem = function(item){
  if(this.inventory[item]>0){
    this.inventory[item]--;
    localStorage.setItem('bio_petz_inventory', JSON.stringify(this.inventory));
    return true;
  }
  this.pushLog('Inventory empty: ' + item);
  return false;
};

Game.prototype.loadInventory = function(){
  try{
    const inv = JSON.parse(localStorage.getItem('bio_petz_inventory'));
    if(inv) this.inventory = inv;
  }catch(e){}
};

// Override injectMutation to consume mutagen
const _origInject = Game.prototype.injectMutation;
Game.prototype.injectMutation = function(){
  if(!this.consumeItem('mutagen')) return;
  this.pushLog('Mutagen consumed. Remaining: ' + this.inventory.mutagen);
  _origInject.call(this);
};


// === PARTICLE_EFFECTS ===
Game.prototype.mutationParticles = function(){
  const wrap = document.getElementById('pet-image-wrap');
  if(!wrap) return;
  for(let i=0;i<18;i++){
    const p = document.createElement('div');
    p.className='particle';
    p.style.left = Math.random()*100+'%';
    p.style.top = Math.random()*100+'%';
    wrap.appendChild(p);
    p.animate([
      {transform:'scale(0)',opacity:1},
      {transform:'scale(1.5)',opacity:0}
    ],{duration:600+Math.random()*400});
    setTimeout(()=>p.remove(),900);
  }
};


// === EVOLUTION_SYSTEM ===
Game.prototype.evolutionStage = 'larva'; // larva -> adult -> apex

Game.prototype.checkEvolution = function(){
  const m = this.petDNA.mutation;
  let newStage = this.evolutionStage;
  if(m >= 70) newStage = 'apex';
  else if(m >= 35) newStage = 'adult';

  if(newStage !== this.evolutionStage){
    this.evolutionStage = newStage;
    this.pushLog('Evolution stage reached: ' + newStage.toUpperCase());
    document.body.setAttribute('data-evolution', newStage);
  }
};


// === INSTABILITY_SYSTEM ===
Game.prototype.checkInstability = function(){
  if(this.petDNA.mutation > 80 && Math.random() < 0.35){
    this.pushLog('DNA instability detected!');
    if(Math.random() < 0.5){
      this.pushLog('Mutation failure: deformity');
      this.mutationState.spikes = Math.max(0, this.mutationState.spikes - 1);
      this.mutationState.eyeGlow = Math.max(0, this.mutationState.eyeGlow - 1);
      this.pet.mood = 'distressed';
    }
  }
};


// === LAB_CRAFTING ===
Game.prototype.craftItem = function(a,b){
  const recipes = {
    'mutagen+stabilizer':'pure_mutagen',
    'mutagen+mutagen':'unstable_serum'
  };
  const key = [a,b].sort().join('+');
  const result = recipes[key];
  if(!result){ this.pushLog('Crafting failed'); return; }
  if(this.inventory[a]>0 && this.inventory[b]>0){
    this.inventory[a]--; this.inventory[b]--;
    this.inventory[result] = (this.inventory[result]||0)+1;
    this.pushLog('Crafted: '+result);
  }
};


// === ARENA_SYSTEM ===
Game.prototype.enterArena = function(){
  const enemy = {
    power: Math.random()*80+20,
    aggression: Math.random()*100
  };
  const score = this.petDNA.aggression + this.petDNA.mutation;
  this.pushLog('Arena test initiated...');
  if(score > enemy.power){
    this.pushLog('Arena victory! Combat data recorded.');
    this.gainExperience && this.gainExperience(10);
  }else{
    this.pushLog('Arena defeat. Pet injured.');
    this.pet.health = Math.max(0, this.pet.health - 15);
    if(this.pet.health === 0) this.handleDeath();
  }
};


// === CLONING_SYSTEM ===
Game.prototype.handleDeath = function(){
  this.pushLog('Pet生命信号消失 — Subject deceased');
  document.body.classList.add('pet-dead');
};

Game.prototype.clonePet = function(){
  if(!this.inventory.stabilizer || this.inventory.stabilizer < 1){
    this.pushLog('Cloning failed: no stabilizer');
    return;
  }
  this.inventory.stabilizer--;
  this.pet.health = this.pet.maxHealth;
  this.petDNA.mutation = Math.max(10, this.petDNA.mutation - 20);
  this.pushLog('Clone activated. DNA partially stabilized.');
  document.body.classList.remove('pet-dead');
};


// === BREEDING_SYSTEM ===
Game.prototype.breedWith = function(){
  const partnerDNA = {
    aggression: Math.random()*100,
    intelligence: Math.random()*100,
    mutation: Math.random()*100
  };
  const childDNA = {
    aggression: Math.round((this.petDNA.aggression + partnerDNA.aggression)/2),
    intelligence: Math.round((this.petDNA.intelligence + partnerDNA.intelligence)/2),
    mutation: Math.round((this.petDNA.mutation + partnerDNA.mutation)/2)
  };
  this.petDNA = childDNA;
  this.evolutionStage = 'larva';
  this.pushLog('Breeding complete. New offspring DNA synthesized.');
};


// === RETIREMENT & SACRIFICE ===
Game.prototype.retirePet = function(){
  this.pushLog('Pet retired peacefully. Research data archived.');
  this.inventory.stabilizer = (this.inventory.stabilizer||0) + 2;
  this.pet.health = 0;
  document.body.classList.add('pet-retired');
};

Game.prototype.sacrificePet = function(){
  this.pushLog('⚠ BLACK LAB SACRIFICE INITIATED');
  this.inventory.mutagen = (this.inventory.mutagen||0) + 5;
  this.inventory.unstable_serum = (this.inventory.unstable_serum||0) + 1;
  this.pet.health = 0;
  document.body.classList.add('pet-dead');
};


// === BLACK MARKET ===
Game.prototype.blackMarketUpgrades = {
  injectorBoost:{cost:2, effect:function(g){ g.petDNA.mutation+=10; }},
  arenaRig:{cost:3, effect:function(g){ g.arenaBonus=15; }},
  forbiddenGenome:{cost:4, effect:function(g){ g.petDNA.mutation+=25; }}
};

Game.prototype.buyUpgrade = function(key){
  const up = this.blackMarketUpgrades[key];
  if(!up) return;
  if(this.inventory.unstable_serum>=up.cost){
    this.inventory.unstable_serum-=up.cost;
    up.effect(this);
    this.pushLog('Black market upgrade installed: '+key);
  }else{
    this.pushLog('Insufficient unstable serum');
  }
};


// === STORY EVENTS ===
Game.prototype.storyEvents = [
  {t:'A rival lab breaches containment...', fx:function(g){ g.petDNA.mutation+=5; }},
  {t:'Corporate audit incoming. Hide experiments.', fx:function(g){ g.petDNA.mutation-=5; }},
  {t:'Ancient genome fragment recovered.', fx:function(g){ g.inventory.mutagen+=2; }}
];

Game.prototype.triggerStoryEvent = function(){
  const e = this.storyEvents[Math.floor(Math.random()*this.storyEvents.length)];
  this.pushLog('EVENT: '+e.t);
  e.fx(this);
};


// === POLISH PASS ===
Game.prototype.safeClampDNA = function(){
  for(const k in this.petDNA){
    this.petDNA[k] = Math.max(0, Math.min(100, this.petDNA[k]));
  }
};

const _oldInject = Game.prototype.injectMutation;
Game.prototype.injectMutation = function(){
  _oldInject.call(this);
  this.safeClampDNA();
};

Game.prototype.pushLog = function(msg){
  const t = new Date().toLocaleTimeString();
  const line = '['+t+'] ' + msg;
  console.log(line);
  if(!this.logs) this.logs=[];
  this.logs.push(line);
  this.logs = this.logs.slice(-40);
  localStorage.setItem('bio_petz_logs', JSON.stringify(this.logs));
  const el = document.getElementById('terminal-log');
  if(el){
    el.textContent = this.logs.join('\n');
    el.scrollTop = el.scrollHeight;
  }
};
