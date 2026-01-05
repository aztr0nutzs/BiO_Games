/**
 * Bio_Slotz MemoryBank Integration
 * This script integrates MemoryBank into Bio_Slotz without modifying core game.js
 * Include this AFTER game.js loads
 */

(function() {
    'use strict';

    // Wait for both MemoryBank and game to be ready
    function initIntegration() {
        if (!window.memoryBank) {
            console.warn('Bio_Slotz Integration: MemoryBank not found, loading...');
            const script = document.createElement('script');
            script.src = '../memory-bank.js';
            script.onload = initIntegration;
            document.head.appendChild(script);
            return;
        }

        // Wait for game state to be available
        if (typeof window.state === 'undefined') {
            setTimeout(initIntegration, 100);
            return;
        }

        console.log('Bio_Slotz Integration: Initializing...');

        // Load saved credits from MemoryBank
        const savedCredits = window.memoryBank.get('currencies', 'credits');
        if (savedCredits !== null && savedCredits > 0) {
            window.state.credits = savedCredits;
            if (window.updateHUD) window.updateHUD();
        }

        // Override startSpin to save credits
        const originalStartSpin = window.startSpin;
        if (originalStartSpin) {
            window.startSpin = function() {
                const result = originalStartSpin.apply(this, arguments);
                // Save credits after spin
                if (window.state && window.memoryBank) {
                    window.memoryBank.set('currencies', 'credits', window.state.credits);
                }
                return result;
            };
        }

        // Hook into game state updates
        const originalUpdateHUD = window.updateHUD;
        if (originalUpdateHUD) {
            window.updateHUD = function() {
                const result = originalUpdateHUD.apply(this, arguments);
                // Auto-save credits
                if (window.state && window.memoryBank) {
                    window.memoryBank.set('currencies', 'credits', window.state.credits);
                    
                    // Update game stats
                    if (window.state.lastWin > 0) {
                        const stats = window.memoryBank.get('gameStats', 'bioslotz') || {};
                        stats.totalWins = (stats.totalWins || 0) + 1;
                        stats.totalCreditsWon = (stats.totalCreditsWon || 0) + window.state.lastWin;
                        stats.highestWin = Math.max(stats.highestWin || 0, window.state.lastWin);
                        window.memoryBank.updateGameStats('bioslotz', stats);
                    }
                }
                return result;
            };
        }

        // Track spins
        const originalSpin = window.startSpin || (() => {});
        window.startSpin = function() {
            const result = originalSpin.apply(this, arguments);
            if (window.state && window.memoryBank) {
                const stats = window.memoryBank.get('gameStats', 'bioslotz') || {};
                stats.totalSpins = (stats.totalSpins || 0) + 1;
                if (window.state.credits < window.totalBet()) {
                    stats.totalLosses = (stats.totalLosses || 0) + 1;
                }
                stats.totalCreditsSpent = (stats.totalCreditsSpent || 0) + (window.totalBet() || 0);
                window.memoryBank.updateGameStats('bioslotz', stats);
            }
            return result;
        };

        // Add return to lobby button
        addReturnToLobbyButton();

        console.log('Bio_Slotz Integration: Complete');
    }

    function addReturnToLobbyButton() {
        // Check if we came from lobby
        if (sessionStorage.getItem('returnToLobby') !== 'true') {
            return;
        }

        // Create return button
        const returnBtn = document.createElement('button');
        returnBtn.innerHTML = '← RETURN TO LOBBY';
        returnBtn.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 10000;
            padding: 12px 24px;
            background: rgba(38, 255, 246, 0.2);
            border: 2px solid #26fff6;
            border-radius: 8px;
            color: #26fff6;
            font-family: 'Orbitron', monospace;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 0 20px rgba(38, 255, 246, 0.3);
        `;
        returnBtn.onmouseenter = function() {
            this.style.background = 'rgba(38, 255, 246, 0.4)';
            this.style.boxShadow = '0 0 30px rgba(38, 255, 246, 0.5)';
        };
        returnBtn.onmouseleave = function() {
            this.style.background = 'rgba(38, 255, 246, 0.2)';
            this.style.boxShadow = '0 0 20px rgba(38, 255, 246, 0.3)';
        };
        returnBtn.onclick = function() {
            if (window.memoryBank) {
                window.memoryBank.save();
            }
            window.location.href = '../main_lobby.html';
        };
        document.body.appendChild(returnBtn);
    }

    // Start integration when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initIntegration);
    } else {
        initIntegration();
    }
})();

