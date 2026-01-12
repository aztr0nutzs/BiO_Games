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