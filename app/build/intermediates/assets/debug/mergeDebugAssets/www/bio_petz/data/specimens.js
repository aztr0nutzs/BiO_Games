// Bio_Petz Specimen Database
// Defines all available bio-pet species and their base traits

const SPECIMENS = {
  's01': {
    name: 'Proto-Slime',
    description: 'Basic gelatinous organism. The foundation of bio-engineering.',
    baseTraits: {
      size: 'small',
      toxicity: 'low',
      intelligence: 'basic',
      color: 'green',
      habitat: 'aquatic'
    },
    rarity: 'common',
    unlockRequirement: 0,
    baseStats: {
      maxHealth: 80,
      maxHappiness: 90,
      growthRate: 1.0
    }
  },
  's02': {
    name: 'Bio-Lurker',
    description: 'Camouflaged predator with adaptive camouflage.',
    baseTraits: {
      size: 'medium',
      toxicity: 'medium',
      intelligence: 'adaptive',
      color: 'chameleon',
      habitat: 'terrestrial'
    },
    rarity: 'uncommon',
    unlockRequirement: 5,
    baseStats: {
      maxHealth: 100,
      maxHappiness: 85,
      growthRate: 0.8
    }
  },
  's03': {
    name: 'Neuro-Gel',
    description: 'Intelligent gel with neural network patterns.',
    baseTraits: {
      size: 'small',
      toxicity: 'high',
      intelligence: 'advanced',
      color: 'cyan',
      habitat: 'digital'
    },
    rarity: 'rare',
    unlockRequirement: 15,
    baseStats: {
      maxHealth: 70,
      maxHappiness: 95,
      growthRate: 0.6
    }
  },
  's04': {
    name: 'Toxi-Blob',
    description: 'Highly toxic amorphous creature.',
    baseTraits: {
      size: 'large',
      toxicity: 'extreme',
      intelligence: 'basic',
      color: 'purple',
      habitat: 'hazardous'
    },
    rarity: 'rare',
    unlockRequirement: 20,
    baseStats: {
      maxHealth: 120,
      maxHappiness: 70,
      growthRate: 0.5
    }
  },
  's05': {
    name: 'Crystal-Spawn',
    description: 'Crystalline entity with geometric patterns.',
    baseTraits: {
      size: 'medium',
      toxicity: 'low',
      intelligence: 'logical',
      color: 'crystal',
      habitat: 'mineral'
    },
    rarity: 'epic',
    unlockRequirement: 30,
    baseStats: {
      maxHealth: 90,
      maxHappiness: 100,
      growthRate: 0.4
    }
  }
};

// Specimen trait definitions for mutations
const TRAIT_TYPES = {
  size: ['tiny', 'small', 'medium', 'large', 'massive'],
  toxicity: ['none', 'low', 'medium', 'high', 'extreme'],
  intelligence: ['instinctive', 'basic', 'adaptive', 'advanced', 'genius'],
  color: ['green', 'cyan', 'purple', 'red', 'yellow', 'crystal', 'chameleon'],
  habitat: ['aquatic', 'terrestrial', 'aerial', 'subterranean', 'digital', 'hazardous', 'mineral']
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SPECIMENS, TRAIT_TYPES };
} else {
  window.SPECIMENS = SPECIMENS;
  window.TRAIT_TYPES = TRAIT_TYPES;
}