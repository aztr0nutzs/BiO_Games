/**
 * KNXT4 MemoryBank Integration
 * This script integrates MemoryBank into KNXT4 without modifying core game files
 * Include this AFTER the main game script loads
 */

(function() {
    'use strict';

    // Wait for MemoryBank to be ready
    function initIntegration() {
        if (!window.memoryBank) {
            console.warn('KNXT4 Integration: MemoryBank not found, loading...');
            const script = document.createElement('script');
            // Try multiple possible paths
            const basePath = window.location.pathname.includes('KNXT4') ? '../' : '';
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

        console.log('KNXT4 Integration: Initializing...');

        // Wait for game to initialize
        setTimeout(() => {
            // Hook into handleWin function
            // Since it's in an IIFE, we'll monitor the messageBox for win messages
            const messageBox = document.querySelector('.messageBox, #messageBox, [class*="message"]');
            if (messageBox) {
                let lastMessage = messageBox.textContent;
                const observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        if (mutation.type === 'childList' || mutation.type === 'characterData') {
                            const newMessage = messageBox.textContent || messageBox.innerText;
                            if (newMessage !== lastMessage) {
                                lastMessage = newMessage;
                                
                                // Check for win/loss messages
                                if (window.memoryBank) {
                                    const stats = window.memoryBank.get('gameStats', 'knxt4') || {};
                                    
                                    if (newMessage.includes('connected 4') || newMessage.includes('outmaneuvered')) {
                                        stats.gamesPlayed = (stats.gamesPlayed || 0) + 1;
                                        
                                        // Check if P1 won (player wins)
                                        if (newMessage.includes('P1 has connected 4')) {
                                            stats.gamesWon = (stats.gamesWon || 0) + 1;
                                            stats.winStreak = (stats.winStreak || 0) + 1;
                                            stats.bestWinStreak = Math.max(stats.bestWinStreak || 0, stats.winStreak);
                                        } else {
                                            // P2 won or AI won (player lost)
                                            stats.gamesLost = (stats.gamesLost || 0) + 1;
                                            stats.winStreak = 0;
                                        }
                                        
                                        window.memoryBank.updateGameStats('knxt4', stats);
                                    } else if (newMessage.includes('Stalemate') || newMessage.includes('draw')) {
                                        stats.gamesPlayed = (stats.gamesPlayed || 0) + 1;
                                        stats.gamesLost = (stats.gamesLost || 0) + 1;
                                        stats.winStreak = 0;
                                        window.memoryBank.updateGameStats('knxt4', stats);
                                    }
                                }
                            }
                        }
                    });
                });
                
                observer.observe(messageBox, {
                    childList: true,
                    characterData: true,
                    subtree: true
                });
            }

            // Also track new game button clicks to count games
            const newGameBtn = document.querySelector('[class*="newGame"], [id*="newGame"], button');
            if (newGameBtn && newGameBtn.textContent && 
                (newGameBtn.textContent.includes('New') || newGameBtn.textContent.includes('new'))) {
                let gameCounted = false;
                newGameBtn.addEventListener('click', function() {
                    // Reset flag when new game starts
                    gameCounted = false;
                }, true);
            }
        }, 500);

        // Add return to lobby button
        addReturnToLobbyButton();

        console.log('KNXT4 Integration: Complete');
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
            background: rgba(127, 43, 255, 0.2);
            border: 2px solid #7f2bff;
            border-radius: 8px;
            color: #7f2bff;
            font-family: 'Orbitron', monospace;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 0 20px rgba(127, 43, 255, 0.3);
        `;
        returnBtn.onmouseenter = function() {
            this.style.background = 'rgba(127, 43, 255, 0.4)';
            this.style.boxShadow = '0 0 30px rgba(127, 43, 255, 0.5)';
        };
        returnBtn.onmouseleave = function() {
            this.style.background = 'rgba(127, 43, 255, 0.2)';
            this.style.boxShadow = '0 0 20px rgba(127, 43, 255, 0.3)';
        };
        returnBtn.onclick = function() {
            if (window.memoryBank) {
                window.memoryBank.save();
            }
            // Try multiple possible paths
            const basePath = window.location.pathname.includes('KNXT4') ? '../' : '';
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

