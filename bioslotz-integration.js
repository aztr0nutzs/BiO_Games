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
            // Try multiple possible paths
            const basePath = window.location.pathname.includes('Bio_Slotz') ? '../' : '';
            script.src = basePath + 'shared/memorybank.js';
            script.onload = initIntegration;
            script.onerror = function() {
                // Try alternative paths
                script.src = basePath + 'memorybank.js';
                script.onload = initIntegration;
                script.onerror = function() {
                    script.src = 'shared/memorybank.js';
                    script.onload = initIntegration;
                };
            };
            document.head.appendChild(script);
            return;
        }

        // Wait for game state to be available
        if (typeof window.state === 'undefined') {
            setTimeout(initIntegration, 100);
            return;
        }

        console.log('Bio_Slotz Integration: Initializing...');

        // Wait a bit for game to fully initialize
        setTimeout(() => {
            // Access state from the game's scope (it's in an IIFE, so we need to hook after init)
            // The game exposes state via window or we can hook into updateHUD
            
            // Load saved credits from MemoryBank
            const savedCredits = window.memoryBank.get('currencies', 'credits');
            if (savedCredits !== null && savedCredits > 0) {
                // Try to set credits via updateHUD or direct state access
                // Since state is in IIFE, we'll hook into updateHUD
                const originalUpdateHUD = window.updateHUD;
                if (originalUpdateHUD) {
                    // First load: set credits
                    try {
                        // Access state if exposed, otherwise we'll track via HUD
                        if (typeof state !== 'undefined') {
                            state.credits = savedCredits;
                        }
                    } catch(e) {
                        console.log('Bio_Slotz Integration: State not directly accessible, will track via HUD');
                    }
                }
            }

            // Hook into updateHUD to track credits
            const originalUpdateHUD = window.updateHUD;
            if (originalUpdateHUD) {
                let lastCredits = null;
                let lastWin = null;
                
                window.updateHUD = function() {
                    const result = originalUpdateHUD.apply(this, arguments);
                    
                    // Try to get current credits from HUD element
                    const creditsEl = document.getElementById('hudCredits');
                    if (creditsEl && window.memoryBank) {
                        const currentCredits = parseInt(creditsEl.textContent) || 0;
                        
                        // Save credits
                        if (currentCredits !== lastCredits) {
                            window.memoryBank.set('currencies', 'credits', currentCredits);
                            lastCredits = currentCredits;
                        }
                        
                        // Track wins
                        const winEl = document.getElementById('hudWin');
                        if (winEl) {
                            const currentWin = parseInt(winEl.textContent) || 0;
                            if (currentWin > 0 && currentWin !== lastWin) {
                                const stats = window.memoryBank.get('gameStats', 'bioslotz') || {};
                                stats.totalWins = (stats.totalWins || 0) + 1;
                                stats.totalCreditsWon = (stats.totalCreditsWon || 0) + currentWin;
                                stats.highestWin = Math.max(stats.highestWin || 0, currentWin);
                                window.memoryBank.updateGameStats('bioslotz', stats);
                                lastWin = currentWin;
                            }
                        }
                    }
                    return result;
                };
            }

            // Track spins via button clicks
            const spinBtn = document.getElementById('btn-spin');
            if (spinBtn) {
                let spinCount = 0;
                spinBtn.addEventListener('click', function() {
                    spinCount++;
                    setTimeout(() => {
                        if (window.memoryBank) {
                            const stats = window.memoryBank.get('gameStats', 'bioslotz') || {};
                            stats.totalSpins = (stats.totalSpins || 0) + 1;
                            const creditsEl = document.getElementById('hudCredits');
                            const betEl = document.getElementById('hudBet');
                            if (creditsEl && betEl) {
                                const credits = parseInt(creditsEl.textContent) || 0;
                                const bet = parseInt(betEl.textContent) || 0;
                                stats.totalCreditsSpent = (stats.totalCreditsSpent || 0) + bet;
                                if (credits < bet) {
                                    stats.totalLosses = (stats.totalLosses || 0) + 1;
                                }
                            }
                            window.memoryBank.updateGameStats('bioslotz', stats);
                        }
                    }, 100);
                }, true);
            }
        }, 500);

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
            // Try multiple possible paths
            const basePath = window.location.pathname.includes('Bio_Slotz') ? '../' : '';
            window.location.href = basePath + 'main_lobby.html';
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

