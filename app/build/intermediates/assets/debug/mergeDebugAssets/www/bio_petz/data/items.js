// Bio_Petz Items Database
// Defines consumables, equipment, and lab tools

const ITEMS = {
  // Consumables
  'food_basic': {
    name: 'Nutrient Paste',
    description: 'Basic nutritional supplement for bio-pets.',
    type: 'consumable',
    category: 'food',
    effect: { hunger: -30, happiness: 5 },
    cost: 10,
    rarity: 'common'
  },
  'food_premium': {
    name: 'Enriched Formula',
    description: 'High-quality nutrient mix for faster growth.',
    type: 'consumable',
    category: 'food',
    effect: { hunger: -50, happiness: 10, experience: 5 },
    cost: 25,
    rarity: 'uncommon'
  },
  'medicine_basic': {
    name: 'Stabilizer Serum',
    description: 'Restores health and prevents mutations.',
    type: 'consumable',
    category: 'medicine',
    effect: { health: 25, mutationResistance: 20 },
    cost: 15,
    rarity: 'common'
  },
  'medicine_advanced': {
    name: 'Genetic Repair Kit',
    description: 'Advanced treatment for genetic anomalies.',
    type: 'consumable',
    category: 'medicine',
    effect: { health: 50, mutationResistance: 50, happiness: -10 },
    cost: 40,
    rarity: 'rare'
  },
  'toy_basic': {
    name: 'Stimulation Orb',
    description: 'Floating orb that responds to bio-pet interaction.',
    type: 'consumable',
    category: 'toy',
    effect: { happiness: 20, intelligence: 2 },
    cost: 20,
    rarity: 'common',
    duration: 3600000 // 1 hour in milliseconds
  },

  // Lab Equipment
  'lab_stabilizer': {
    name: 'Genetic Stabilizer',
    description: 'Reduces mutation risk during experiments.',
    type: 'equipment',
    category: 'lab',
    effect: { mutationRisk: -0.2 },
    cost: 100,
    rarity: 'uncommon',
    unlockRequirement: 10
  },
  'lab_enhancer': {
    name: 'Trait Enhancer',
    description: 'Increases chance of positive mutations.',
    type: 'equipment',
    category: 'lab',
    effect: { positiveMutationChance: 0.15 },
    cost: 150,
    rarity: 'rare',
    unlockRequirement: 20
  },
  'breeding_chamber': {
    name: 'Breeding Chamber',
    description: 'Advanced facility for controlled breeding.',
    type: 'equipment',
    category: 'lab',
    effect: { breedingSuccess: 0.25, mutationRisk: 0.1 },
    cost: 200,
    rarity: 'epic',
    unlockRequirement: 25
  },

  // Decorations
  'decoration_tank': {
    name: 'Aquatic Habitat Tank',
    description: 'Specialized tank for aquatic bio-pets.',
    type: 'decoration',
    category: 'habitat',
    effect: { happiness: 15, habitatBonus: 'aquatic' },
    cost: 75,
    rarity: 'uncommon'
  },
  'decoration_light': {
    name: 'Bio-Luminescent Lamp',
    description: 'Provides ambient lighting and energy boost.',
    type: 'decoration',
    category: 'habitat',
    effect: { happiness: 10, energyRegen: 5 },
    cost: 50,
    rarity: 'common'
  }
};

// Item categories for UI organization
const ITEM_CATEGORIES = {
  consumable: ['food', 'medicine', 'toy'],
  equipment: ['lab'],
  decoration: ['habitat']
};

// Shop inventory (unlocked items)
const SHOP_INVENTORY = [
  'food_basic', 'food_premium', 'medicine_basic', 'toy_basic', 'decoration_light'
];

// Lab equipment unlocks based on player progress
const LAB_EQUIPMENT_UNLOCKS = {
  10: ['lab_stabilizer'],
  20: ['lab_enhancer'],
  25: ['breeding_chamber']
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ITEMS, ITEM_CATEGORIES, SHOP_INVENTORY, LAB_EQUIPMENT_UNLOCKS };
} else {
  window.ITEMS = ITEMS;
  window.ITEM_CATEGORIES = ITEM_CATEGORIES;
  window.SHOP_INVENTORY = SHOP_INVENTORY;
  window.LAB_EQUIPMENT_UNLOCKS = LAB_EQUIPMENT_UNLOCKS;
}