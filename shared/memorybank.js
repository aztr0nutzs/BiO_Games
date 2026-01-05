/**
 * MemoryBank - Persistent Data Storage System for Bio Games
 * Uses localStorage for cross-platform compatibility (web & Android)
 * 
 * Data Schema:
 * - profile: { username, avatar, level, xp, joinDate, lastLogin }
 * - currencies: { credits, tickets, bioCoins }
 * - inventory: { items: [], unlocks: [] }
 * - gameStats: { bioslotz: {}, knxt4: {} }
 * - settings: { audio, theme, preferences }
 */

(function() {
    'use strict';

    const STORAGE_KEY = 'bio_games_memory_bank';
    const VERSION = '1.0.0';

    class MemoryBank {
        constructor() {
            this.data = this.load();
            this.listeners = [];
        }

        /**
         * Initialize or load existing data
         */
        load() {
            try {
                const stored = localStorage.getItem(STORAGE_KEY);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    // Migrate old data if needed
                    if (parsed.version !== VERSION) {
                        return this.migrateData(parsed);
                    }
                    return parsed;
                }
            } catch (e) {
                console.warn('MemoryBank: Failed to load data, initializing new:', e);
            }
            return this.getDefaultData();
        }

        /**
         * Get default data structure
         */
        getDefaultData() {
            return {
                version: VERSION,
                profile: {
                    username: 'RESEARCHER_' + Math.random().toString(36).substr(2, 6).toUpperCase(),
                    avatar: '🧬',
                    level: 1,
                    xp: 0,
                    xpToNext: 100,
                    joinDate: new Date().toISOString(),
                    lastLogin: new Date().toISOString()
                },
                currencies: {
                    credits: 2000,
                    tickets: 500,
                    bioCoins: 0
                },
                inventory: {
                    items: [],
                    unlocks: []
                },
                gameStats: {
                    bioslotz: {
                        totalSpins: 0,
                        totalWins: 0,
                        totalLosses: 0,
                        highestWin: 0,
                        totalCreditsWon: 0,
                        totalCreditsSpent: 0,
                        freeSpinsEarned: 0,
                        lastPlayed: null
                    },
                    knxt4: {
                        gamesPlayed: 0,
                        gamesWon: 0,
                        gamesLost: 0,
                        winStreak: 0,
                        bestWinStreak: 0,
                        totalMoves: 0,
                        lastPlayed: null
                    }
                },
                settings: {
                    audio: {
                        enabled: true,
                        musicVolume: 0.7,
                        sfxVolume: 0.8
                    },
                    theme: 'default',
                    preferences: {
                        autoSave: true,
                        showTutorials: true
                    }
                }
            };
        }

        /**
         * Migrate old data format to new format
         */
        migrateData(oldData) {
            const newData = this.getDefaultData();
            // Merge old data into new structure
            if (oldData.profile) Object.assign(newData.profile, oldData.profile);
            if (oldData.currencies) Object.assign(newData.currencies, oldData.currencies);
            if (oldData.inventory) Object.assign(newData.inventory, oldData.inventory);
            if (oldData.gameStats) Object.assign(newData.gameStats, oldData.gameStats);
            if (oldData.settings) Object.assign(newData.settings, oldData.settings);
            newData.version = VERSION;
            return newData;
        }

        /**
         * Save data to localStorage
         */
        save() {
            try {
                this.data.lastLogin = new Date().toISOString();
                localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
                this.notifyListeners('save');
                return true;
            } catch (e) {
                console.error('MemoryBank: Failed to save data:', e);
                return false;
            }
        }

        /**
         * Auto-save with debouncing
         */
        autoSave() {
            if (this.saveTimeout) clearTimeout(this.saveTimeout);
            this.saveTimeout = setTimeout(() => this.save(), 500);
        }

        /**
         * Get entire data object
         */
        getAll() {
            return JSON.parse(JSON.stringify(this.data)); // Deep copy
        }

        /**
         * Get specific data section or path-based value
         * Supports both old API (section, key) and new API (path)
         */
        get(section, key = null) {
            // New path-based API: get("profile.username")
            if (key === null && typeof section === 'string' && section.includes('.')) {
                const path = section.split('.');
                let value = this.data;
                for (const p of path) {
                    if (value === null || value === undefined) return null;
                    value = value[p];
                }
                return value !== undefined ? JSON.parse(JSON.stringify(value)) : null;
            }
            // Old API: get('profile', 'username')
            if (!this.data[section]) return null;
            if (key === null) return JSON.parse(JSON.stringify(this.data[section]));
            return this.data[section][key];
        }

        /**
         * Set specific data value
         * Supports both old API (section, key, value) and new API (path, value)
         */
        set(section, key, value) {
            // New path-based API: set("profile.username", "NewName")
            if (arguments.length === 2 && typeof section === 'string' && section.includes('.')) {
                const path = section.split('.');
                const finalKey = path.pop();
                let target = this.data;
                for (const p of path) {
                    if (!target[p]) target[p] = {};
                    target = target[p];
                }
                target[finalKey] = value;
                this.autoSave();
                this.notifyListeners('update', { path: section, value });
                return;
            }
            // Old API: set('profile', 'username', 'NewName')
            if (!this.data[section]) this.data[section] = {};
            this.data[section][key] = value;
            this.autoSave();
            this.notifyListeners('update', { section, key, value });
        }

        /**
         * Increment a numeric value by path
         */
        inc(path, delta = 1) {
            const current = this.get(path);
            if (typeof current !== 'number') {
                console.warn(`MemoryBank.inc: Path "${path}" is not a number, initializing to ${delta}`);
                this.set(path, delta);
                return delta;
            }
            const newValue = current + delta;
            this.set(path, newValue);
            return newValue;
        }

        /**
         * Update multiple values at once
         */
        update(section, updates) {
            if (!this.data[section]) this.data[section] = {};
            Object.assign(this.data[section], updates);
            this.autoSave();
            this.notifyListeners('update', { section, updates });
        }

        /**
         * Add to currency (with bounds checking)
         */
        addCurrency(type, amount) {
            const current = this.get('currencies', type) || 0;
            const newValue = Math.max(0, current + amount);
            this.set('currencies', type, newValue);
            return newValue;
        }

        /**
         * Subtract from currency (with bounds checking)
         */
        subtractCurrency(type, amount) {
            const current = this.get('currencies', type) || 0;
            const newValue = Math.max(0, current - amount);
            this.set('currencies', type, newValue);
            return newValue;
        }

        /**
         * Add XP and handle level up
         */
        addXP(amount) {
            const profile = this.get('profile');
            profile.xp += amount;
            let leveledUp = false;
            
            while (profile.xp >= profile.xpToNext) {
                profile.xp -= profile.xpToNext;
                profile.level += 1;
                profile.xpToNext = Math.floor(profile.xpToNext * 1.5);
                leveledUp = true;
            }
            
            this.update('profile', profile);
            if (leveledUp) {
                this.notifyListeners('levelup', { level: profile.level });
            }
            return { xp: profile.xp, level: profile.level, leveledUp };
        }

        /**
         * Update game stats
         */
        updateGameStats(game, stats) {
            if (!this.data.gameStats[game]) {
                this.data.gameStats[game] = {};
            }
            Object.assign(this.data.gameStats[game], stats, {
                lastPlayed: new Date().toISOString()
            });
            this.autoSave();
            this.notifyListeners('stats', { game, stats });
        }

        /**
         * Add item to inventory
         */
        addItem(item) {
            const inventory = this.get('inventory');
            inventory.items.push({
                ...item,
                acquired: new Date().toISOString()
            });
            this.update('inventory', inventory);
        }

        /**
         * Add unlock
         */
        addUnlock(unlockId) {
            const inventory = this.get('inventory');
            if (!inventory.unlocks.includes(unlockId)) {
                inventory.unlocks.push(unlockId);
                this.update('inventory', inventory);
            }
        }

        /**
         * Check if unlocked
         */
        isUnlocked(unlockId) {
            const inventory = this.get('inventory');
            return inventory.unlocks.includes(unlockId);
        }

        /**
         * Register event listener
         */
        on(event, callback) {
            if (!this.listeners[event]) this.listeners[event] = [];
            this.listeners[event].push(callback);
        }

        /**
         * Remove event listener
         */
        off(event, callback) {
            if (!this.listeners[event]) return;
            this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
        }

        /**
         * Notify listeners
         */
        notifyListeners(event, data) {
            if (!this.listeners[event]) return;
            this.listeners[event].forEach(callback => {
                try {
                    callback(data);
                } catch (e) {
                    console.error('MemoryBank: Listener error:', e);
                }
            });
        }

        /**
         * Export data (for backup)
         */
        export() {
            return JSON.stringify(this.data, null, 2);
        }

        /**
         * Import data (from backup)
         */
        import(jsonString) {
            try {
                const imported = JSON.parse(jsonString);
                this.data = this.migrateData(imported);
                this.save();
                this.notifyListeners('import');
                return true;
            } catch (e) {
                console.error('MemoryBank: Failed to import data:', e);
                return false;
            }
        }

        /**
         * Reset all data (with confirmation token)
         */
        reset(confirmToken = null) {
            // Require explicit confirmation token
            if (confirmToken !== 'RESET_CONFIRMED') {
                console.warn('MemoryBank.reset: Requires confirmation token. Call with reset("RESET_CONFIRMED")');
                return false;
            }
            this.data = this.getDefaultData();
            this.save();
            this.notifyListeners('reset');
            return true;
        }

        /**
         * Clear storage (nuclear option)
         */
        clear() {
            localStorage.removeItem(STORAGE_KEY);
            this.data = this.getDefaultData();
            this.notifyListeners('clear');
        }
    }

    // Create global instance
    window.MemoryBank = MemoryBank;
    window.memoryBank = new MemoryBank();

    // Auto-save on page unload
    window.addEventListener('beforeunload', () => {
        window.memoryBank.save();
    });

    // Auto-save periodically (every 30 seconds)
    setInterval(() => {
        window.memoryBank.save();
    }, 30000);

    // Cross-page sync via storage events
    window.addEventListener('storage', function(e) {
        if (e.key === STORAGE_KEY && e.newValue) {
            try {
                const newData = JSON.parse(e.newValue);
                // Only reload if version matches and data is different
                if (newData.version === VERSION && 
                    JSON.stringify(window.memoryBank.data) !== JSON.stringify(newData)) {
                    window.memoryBank.data = newData;
                    window.memoryBank.notifyListeners('sync', { source: 'storage' });
                    console.log('MemoryBank: Synced from storage event');
                }
            } catch (err) {
                console.warn('MemoryBank: Failed to sync from storage event:', err);
            }
        }
    });

    // Also trigger custom storage event for same-tab sync (since storage event only fires in other tabs)
    const originalSave = window.memoryBank.save.bind(window.memoryBank);
    window.memoryBank.save = function() {
        const result = originalSave();
        // Dispatch custom event for same-tab listeners
        window.dispatchEvent(new CustomEvent('memorybank:save', {
            detail: { data: this.data }
        }));
        return result;
    };

    console.log('MemoryBank initialized:', window.memoryBank.getAll());
})();

