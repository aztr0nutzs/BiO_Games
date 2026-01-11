// Bio_Petz Mutation System
// Defines mutation rules, chances, and effects

class MutationEngine {
  constructor() {
    this.mutationTypes = {
      beneficial: 0.4,    // 40% chance of positive mutations
      neutral: 0.4,       // 40% chance of neutral changes
      detrimental: 0.2    // 20% chance of negative mutations
    };
  }

  // Calculate mutation chance based on experiment type and equipment
  calculateMutationChance(experimentType, modifiers = {}) {
    const baseChances = {
      'breeding': 0.3,
      'radiation': 0.6,
      'chemical': 0.5,
      'genetic_splicing': 0.7,
      'random_experiment': 0.4
    };

    let chance = baseChances[experimentType] || 0.3;

    // Apply modifiers from equipment
    if (modifiers.mutationRisk !== undefined) {
      chance += modifiers.mutationRisk;
    }

    // Clamp between 0 and 1
    return Math.max(0, Math.min(1, chance));
  }

  // Apply random mutation to a pet
  mutate(pet, experimentType, modifiers = {}) {
    const mutationChance = this.calculateMutationChance(experimentType, modifiers);
    const roll = Math.random();

    if (roll < mutationChance) {
      return this.applyRandomMutation(pet, modifiers);
    }

    return { success: false, message: 'No mutation occurred' };
  }

  // Apply a random mutation
  applyRandomMutation(pet, modifiers = {}) {
    const mutationRoll = Math.random();
    let mutationType;

    if (modifiers.positiveMutationChance && Math.random() < modifiers.positiveMutationChance) {
      mutationType = 'beneficial';
    } else if (mutationRoll < this.mutationTypes.beneficial) {
      mutationType = 'beneficial';
    } else if (mutationRoll < this.mutationTypes.beneficial + this.mutationTypes.neutral) {
      mutationType = 'neutral';
    } else {
      mutationType = 'detrimental';
    }

    const traitType = this.selectRandomTrait();
    const mutation = this.generateMutation(traitType, mutationType);

    // Apply mutation to pet
    pet.traits[traitType] = mutation.newValue;

    // Apply stat effects if any
    if (mutation.statEffect) {
      Object.assign(pet.stats, mutation.statEffect);
    }

    return {
      success: true,
      type: mutationType,
      trait: traitType,
      oldValue: mutation.oldValue,
      newValue: mutation.newValue,
      message: mutation.message,
      statEffect: mutation.statEffect
    };
  }

  // Select a random trait to mutate
  selectRandomTrait() {
    const traits = Object.keys(window.TRAIT_TYPES || {});
    return traits[Math.floor(Math.random() * traits.length)];
  }

  // Generate a specific mutation
  generateMutation(traitType, mutationType) {
    const traitValues = window.TRAIT_TYPES[traitType];
    const currentValue = Math.random(); // Placeholder - would use actual pet trait

    let newValue;
    let message;
    let statEffect = {};

    switch (mutationType) {
      case 'beneficial':
        // Upgrade to better trait value
        const currentIndex = traitValues.indexOf(currentValue);
        const upgradeIndex = Math.min(currentIndex + 1, traitValues.length - 1);
        newValue = traitValues[upgradeIndex];
        message = `Beneficial mutation! ${traitType} improved to ${newValue}`;
        statEffect = this.getBeneficialStatEffect(traitType);
        break;

      case 'neutral':
        // Random change
        newValue = traitValues[Math.floor(Math.random() * traitValues.length)];
        message = `Neutral mutation: ${traitType} changed to ${newValue}`;
        break;

      case 'detrimental':
        // Downgrade or negative effect
        const downgradeIndex = Math.max(currentIndex - 1, 0);
        newValue = traitValues[downgradeIndex];
        message = `Detrimental mutation: ${traitType} reduced to ${newValue}`;
        statEffect = this.getDetrimentalStatEffect(traitType);
        break;
    }

    return {
      oldValue: currentValue,
      newValue: newValue,
      message: message,
      statEffect: statEffect
    };
  }

  // Get stat effects for beneficial mutations
  getBeneficialStatEffect(traitType) {
    const effects = {
      size: { maxHealth: 10 },
      toxicity: { happiness: -5 }, // More toxic = harder to care for
      intelligence: { happiness: 10, experience: 10 },
      color: { happiness: 5 },
      habitat: { happiness: 5 }
    };
    return effects[traitType] || {};
  }

  // Get stat effects for detrimental mutations
  getDetrimentalStatEffect(traitType) {
    const effects = {
      size: { maxHealth: -10 },
      toxicity: { happiness: -10 },
      intelligence: { happiness: -5 },
      color: { happiness: -5 },
      habitat: { happiness: -10 }
    };
    return effects[traitType] || {};
  }

  // Breeding mutation (combines traits from two parents)
  breed(parent1, parent2, modifiers = {}) {
    const offspringTraits = {};

    // Combine traits with possible mutations
    Object.keys(parent1.traits).forEach(trait => {
      const parent1Trait = parent1.traits[trait];
      const parent2Trait = parent2.traits[trait];

      // 70% chance to inherit from parent1, 30% from parent2
      offspringTraits[trait] = Math.random() < 0.7 ? parent1Trait : parent2Trait;
    });

    // Chance for breeding-specific mutations
    const breedingMutationChance = 0.2 + (modifiers.breedingSuccess || 0);

    if (Math.random() < breedingMutationChance) {
      const mutationTrait = this.selectRandomTrait();
      const mutation = this.generateMutation(mutationTrait, 'beneficial');
      offspringTraits[mutationTrait] = mutation.newValue;
    }

    return offspringTraits;
  }
}

// Mutation history tracking
class MutationHistory {
  constructor() {
    this.history = [];
  }

  addMutation(petId, mutation) {
    this.history.push({
      petId: petId,
      timestamp: Date.now(),
      ...mutation
    });
  }

  getPetHistory(petId) {
    return this.history.filter(entry => entry.petId === petId);
  }

  getRecentMutations(count = 10) {
    return this.history.slice(-count);
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MutationEngine, MutationHistory };
} else {
  window.MutationEngine = MutationEngine;
  window.MutationHistory = MutationHistory;
}