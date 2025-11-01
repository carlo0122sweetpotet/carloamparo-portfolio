// Minigames Hub Module
const MinigamesHub = (() => {
    let currentGame = null;

    const init = () => {
        createMinigamesHub();
    };

    const createMinigamesHub = () => {
        const minigamesTab = document.getElementById('minigames');
        if (!minigamesTab) return;

        minigamesTab.innerHTML = `
            <div class="minigames-hub">
                <div class="hub-header">
                    <h3>Minigames</h3>
                    <p class="hub-description">Choose a game to play</p>
                </div>

                <div class="games-grid">
                    <div class="game-card" data-game="click-dot">
                        <div class="game-card-icon">
                            <i class="fas fa-circle-dot"></i>
                        </div>
                        <div class="game-card-content">
                            <h4>Click the Dot</h4>
                            <p>Test your reaction time</p>
                        </div>
                        <div class="game-card-arrow">
                            <i class="fas fa-chevron-right"></i>
                        </div>
                    </div>

                    <div class="game-card coming-soon">
                        <div class="game-card-icon">
                            <i class="fas fa-brain"></i>
                        </div>
                        <div class="game-card-content">
                            <h4>Memory Match</h4>
                            <p>Coming Soon</p>
                        </div>
                        <div class="coming-soon-badge">Soon</div>
                    </div>
                </div>
            </div>

            <div class="game-container" id="click-dot-game" style="display: none;">
                <!-- Game content will be loaded here -->
            </div>
        `;

        setupGameCards();
    };

    const setupGameCards = () => {
        const gameCards = document.querySelectorAll('.game-card:not(.coming-soon)');
        
        gameCards.forEach(card => {
            card.addEventListener('click', () => {
                const gameName = card.dataset.game;
                loadGame(gameName);
            });
        });
    };

    const loadGame = (gameName) => {
        const hub = document.querySelector('.minigames-hub');
        const gameContainer = document.getElementById('click-dot-game');

        if (gameName === 'click-dot') {
            hub.style.display = 'none';
            gameContainer.style.display = 'block';
            
            if (!currentGame) {
                ClickDotGame.init();
                currentGame = 'click-dot';
            }
        }
    };

    const showHub = () => {
        const hub = document.querySelector('.minigames-hub');
        const gameContainer = document.getElementById('click-dot-game');
        
        hub.style.display = 'block';
        gameContainer.style.display = 'none';
    };

    return {
        init,
        showHub
    };
})();

// Click the Dot Game Module
const ClickDotGame = (() => {
    let gameContainer;
    let scoreElement;
    let timeElement;
    let accuracyElement;
    let statusElement;
    let startButton;
    let backButton;
    let gameInterval;
    let dotTimeout;
    let gameActive = false;
    let score = 0;
    let clicks = 0;
    let hits = 0;
    let timeLeft = 30;
    let currentDot = null;

    const init = () => {
        createGameUI();
        setupEventListeners();
    };

    const createGameUI = () => {
        const gameContainer = document.getElementById('click-dot-game');
        if (!gameContainer) return;

        gameContainer.innerHTML = `
            <button class="back-to-hub-btn" id="back-to-hub">
                <i class="fas fa-arrow-left"></i> Back
            </button>

            <div class="game-header">
                <h3>Click the Dot</h3>
                <p class="game-description">Click the dots as fast as you can before they disappear!</p>
            </div>

            <div class="game-stats">
                <div class="stat-item">
                    <div class="stat-label">Score</div>
                    <div class="stat-value" id="game-score">0</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Time</div>
                    <div class="stat-value" id="game-time">30</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Accuracy</div>
                    <div class="stat-value" id="game-accuracy">100%</div>
                </div>
            </div>

            <div class="game-status" id="game-status">
                Click START to begin!
            </div>

            <div class="game-play-area" id="game-play-area">
                <div class="game-ready-message">
                    <i class="fas fa-hand-pointer"></i>
                    <p>Get Ready!</p>
                </div>
            </div>

            <button class="game-start-btn" id="game-start-btn">
                <i class="fas fa-play"></i> START
            </button>
        `;

        setupGameElements();
    };

    const setupGameElements = () => {
        gameContainer = document.getElementById('game-play-area');
        scoreElement = document.getElementById('game-score');
        timeElement = document.getElementById('game-time');
        accuracyElement = document.getElementById('game-accuracy');
        statusElement = document.getElementById('game-status');
        startButton = document.getElementById('game-start-btn');
        backButton = document.getElementById('back-to-hub');
    };

    const setupEventListeners = () => {
        if (startButton) {
            startButton.addEventListener('click', toggleGame);
        }

        if (gameContainer) {
            gameContainer.addEventListener('click', handleMissedClick);
        }

        if (backButton) {
            backButton.addEventListener('click', () => {
                if (gameActive) {
                    endGame();
                }
                MinigamesHub.showHub();
            });
        }
    };

    const toggleGame = () => {
        if (gameActive) {
            endGame();
        } else {
            startGame();
        }
    };

    const startGame = () => {
        gameActive = true;
        score = 0;
        clicks = 0;
        hits = 0;
        timeLeft = 30;

        updateStats();
        statusElement.textContent = 'Click the dots!';
        startButton.innerHTML = '<i class="fas fa-stop"></i> STOP';
        startButton.classList.add('active');
        gameContainer.querySelector('.game-ready-message').style.display = 'none';

        gameInterval = setInterval(() => {
            timeLeft--;
            timeElement.textContent = timeLeft;

            if (timeLeft <= 0) {
                endGame();
            } else if (timeLeft <= 10) {
                timeElement.style.color = '#ff3b30';
            }
        }, 1000);

        spawnDot();
    };

    const endGame = () => {
        gameActive = false;
        clearInterval(gameInterval);
        clearTimeout(dotTimeout);

        if (currentDot) {
            currentDot.remove();
            currentDot = null;
        }

        const accuracy = clicks > 0 ? Math.round((hits / clicks) * 100) : 100;
        statusElement.textContent = `Game Over! Final Score: ${score} | Accuracy: ${accuracy}%`;
        startButton.innerHTML = '<i class="fas fa-play"></i> START';
        startButton.classList.remove('active');
        timeElement.style.color = '';

        gameContainer.querySelector('.game-ready-message').style.display = 'flex';
    };

    const spawnDot = () => {
        if (!gameActive) return;

        if (currentDot) {
            currentDot.remove();
        }

        // Randomly decide if this should be a square (trap) or a dot (target)
        const isTrap = Math.random() < 0.25; // 25% chance to spawn a square trap

        const shape = document.createElement('div');
        shape.className = isTrap ? 'game-square' : 'game-dot';
        
        const size = Math.random() * 40 + 40;
        shape.style.width = `${size}px`;
        shape.style.height = `${size}px`;

        const maxX = gameContainer.clientWidth - size - 20;
        const maxY = gameContainer.clientHeight - size - 20;
        const x = Math.random() * maxX + 10;
        const y = Math.random() * maxY + 10;

        shape.style.left = `${x}px`;
        shape.style.top = `${y}px`;

        const colors = ['#ff3b30', '#ff9500', '#ffcc00', '#34c759', '#00c7be', '#32ade6', '#007aff', '#5856d6', '#af52de', '#ff2d55'];
        shape.style.background = colors[Math.floor(Math.random() * colors.length)];

        currentDot = shape;
        
        if (isTrap) {
            shape.addEventListener('click', handleTrapClick);
        } else {
            shape.addEventListener('click', handleDotClick);
        }
        
        gameContainer.appendChild(shape);

        const lifetime = Math.random() * 1000 + 1000;
        dotTimeout = setTimeout(() => {
            if (currentDot === shape) {
                shape.remove();
                currentDot = null;
                spawnDot();
            }
        }, lifetime);
    };

    const handleDotClick = (e) => {
        e.stopPropagation();
        
        if (!gameActive) return;

        clicks++;
        hits++;
        score += 10;

        createParticles(e.clientX, e.clientY);

        if (currentDot) {
            currentDot.remove();
            currentDot = null;
        }

        clearTimeout(dotTimeout);
        updateStats();

        setTimeout(spawnDot, 100);
    };

    const handleTrapClick = (e) => {
        e.stopPropagation();
        
        if (!gameActive) return;

        clicks++;
        // No hit increment - this counts as a miss!

        // Visual feedback for trap click
        const trap = document.createElement('div');
        trap.className = 'trap-indicator';
        trap.textContent = 'TRAP!';
        trap.style.left = `${e.clientX - gameContainer.offsetLeft}px`;
        trap.style.top = `${e.clientY - gameContainer.offsetTop}px`;
        gameContainer.appendChild(trap);

        setTimeout(() => trap.remove(), 500);

        if (currentDot) {
            currentDot.remove();
            currentDot = null;
        }

        clearTimeout(dotTimeout);
        updateStats();

        setTimeout(spawnDot, 100);
    };

    const handleMissedClick = (e) => {
        if (!gameActive || e.target.classList.contains('game-dot') || e.target.classList.contains('game-square')) return;
        
        clicks++;
        updateStats();

        const miss = document.createElement('div');
        miss.className = 'miss-indicator';
        miss.textContent = 'MISS';
        miss.style.left = `${e.clientX - gameContainer.offsetLeft}px`;
        miss.style.top = `${e.clientY - gameContainer.offsetTop}px`;
        gameContainer.appendChild(miss);

        setTimeout(() => miss.remove(), 500);
    };

    const createParticles = (x, y) => {
        const colors = ['#ff3b30', '#ff9500', '#ffcc00', '#34c759', '#00c7be', '#32ade6', '#007aff', '#5856d6'];
        
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            
            const angle = (Math.PI * 2 * i) / 8;
            const velocity = 100;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            particle.style.setProperty('--tx', `${vx}px`);
            particle.style.setProperty('--ty', `${vy}px`);
            
            document.body.appendChild(particle);
            
            setTimeout(() => particle.remove(), 600);
        }
    };

    const updateStats = () => {
        scoreElement.textContent = score;
        const accuracy = clicks > 0 ? Math.round((hits / clicks) * 100) : 100;
        accuracyElement.textContent = `${accuracy}%`;
    };

    return {
        init
    };
})();

// Export for use in main.js
window.MinigamesHub = MinigamesHub;
window.ClickDotGame = ClickDotGame;

// Add CSS for the minigames hub and game
const gameStyles = `
    /* Minigames Hub Styles */
    .minigames-hub {
        padding: 0;
    }

    .hub-header {
        text-align: center;
        margin-bottom: 20px;
        padding: 0 8px;
    }

    .hub-header h3 {
        font-size: 24px;
        font-weight: 600;
        margin-bottom: 6px;
        letter-spacing: -0.5px;
    }

    .hub-description {
        color: var(--secondary-text);
        font-size: 13px;
        line-height: 1.4;
    }

    .games-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
    }

    .game-card {
        background: var(--glass-bg);
        backdrop-filter: blur(40px) saturate(180%);
        -webkit-backdrop-filter: blur(40px) saturate(180%);
        border: 1px solid var(--glass-border);
        border-radius: 16px;
        padding: 20px;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 2px 12px var(--shadow-color);
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 12px;
        position: relative;
        min-height: 160px;
    }

    .game-card:not(.coming-soon):hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px var(--shadow-color);
    }

    .game-card.coming-soon {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .game-card-icon {
        width: 60px;
        height: 60px;
        border-radius: 14px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        color: white;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .game-card.coming-soon .game-card-icon {
        background: linear-gradient(135deg, #86868b 0%, #636366 100%);
    }

    .game-card-content {
        flex: 1;
    }

    .game-card-content h4 {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 4px;
        letter-spacing: -0.3px;
    }

    .game-card-content p {
        font-size: 12px;
        color: var(--secondary-text);
    }

    .game-card-arrow {
        color: var(--secondary-text);
        font-size: 14px;
    }

    .coming-soon-badge {
        position: absolute;
        top: 12px;
        right: 12px;
        background: var(--secondary-text);
        color: white;
        font-size: 10px;
        font-weight: 600;
        padding: 4px 8px;
        border-radius: 6px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    /* Back Button */
    .back-to-hub-btn {
        background: var(--glass-bg);
        backdrop-filter: blur(40px) saturate(180%);
        -webkit-backdrop-filter: blur(40px) saturate(180%);
        border: 1px solid var(--glass-border);
        border-radius: 10px;
        color: #0071e3;
        padding: 8px 16px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        margin-bottom: 16px;
        box-shadow: 0 2px 8px var(--shadow-color);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .back-to-hub-btn:hover {
        transform: translateX(-4px);
        box-shadow: 0 4px 12px var(--shadow-color);
    }

    [data-theme="dark"] .back-to-hub-btn {
        color: #2997ff;
    }

    /* Game Container */
    .game-container {
        padding: 0;
    }

    .game-header {
        text-align: center;
        margin-bottom: 16px;
        padding: 0 8px;
    }

    .game-header h3 {
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 6px;
        letter-spacing: -0.5px;
    }

    .game-description {
        color: var(--secondary-text);
        font-size: 13px;
        line-height: 1.4;
    }

    .game-stats {
        display: flex;
        gap: 8px;
        margin-bottom: 12px;
    }

    .stat-item {
        flex: 1;
        background: var(--glass-bg);
        backdrop-filter: blur(40px) saturate(180%);
        -webkit-backdrop-filter: blur(40px) saturate(180%);
        border: 1px solid var(--glass-border);
        border-radius: 12px;
        padding: 14px 12px;
        text-align: center;
        box-shadow: 0 2px 12px var(--shadow-color);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .stat-item:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 16px var(--shadow-color);
    }

    .stat-label {
        font-size: 11px;
        color: var(--secondary-text);
        margin-bottom: 6px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-weight: 500;
    }

    .stat-value {
        font-size: 28px;
        font-weight: 600;
        color: var(--text-color);
        letter-spacing: -0.5px;
    }

    .game-status {
        background: var(--glass-bg);
        backdrop-filter: blur(40px) saturate(180%);
        -webkit-backdrop-filter: blur(40px) saturate(180%);
        border: 1px solid var(--glass-border);
        border-radius: 12px;
        padding: 14px 16px;
        text-align: center;
        margin-bottom: 12px;
        font-size: 13px;
        font-weight: 500;
        color: var(--text-color);
        box-shadow: 0 2px 12px var(--shadow-color);
    }

    .game-play-area {
        background: var(--glass-bg);
        backdrop-filter: blur(40px) saturate(180%);
        -webkit-backdrop-filter: blur(40px) saturate(180%);
        border: 1px solid var(--glass-border);
        border-radius: 16px;
        height: 420px;
        position: relative;
        margin-bottom: 12px;
        overflow: hidden;
        box-shadow: 0 4px 20px var(--shadow-color),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1);
    }

    .game-ready-message {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: var(--secondary-text);
    }

    .game-ready-message i {
        font-size: 48px;
        margin-bottom: 12px;
        opacity: 0.5;
    }

    .game-ready-message p {
        font-size: 18px;
        font-weight: 500;
    }

    .game-dot {
        position: absolute;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25),
                    0 2px 8px rgba(0, 0, 0, 0.15),
                    inset 0 1px 0 rgba(255, 255, 255, 0.3);
        animation: dotAppear 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .game-dot:hover {
        transform: scale(1.15);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3),
                    0 3px 12px rgba(0, 0, 0, 0.2),
                    inset 0 1px 0 rgba(255, 255, 255, 0.4);
    }

    .game-dot:active {
        transform: scale(0.9);
    }

    .game-square {
        position: absolute;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25),
                    0 2px 8px rgba(0, 0, 0, 0.15),
                    inset 0 1px 0 rgba(255, 255, 255, 0.3);
        animation: dotAppear 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .game-square:hover {
        transform: scale(1.15) rotate(5deg);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3),
                    0 3px 12px rgba(0, 0, 0, 0.2),
                    inset 0 1px 0 rgba(255, 255, 255, 0.4);
    }

    .game-square:active {
        transform: scale(0.9) rotate(-5deg);
    }

    @keyframes dotAppear {
        from {
            opacity: 0;
            transform: scale(0);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }

    .miss-indicator {
        position: absolute;
        color: #ff3b30;
        font-size: 14px;
        font-weight: 600;
        pointer-events: none;
        animation: missFloat 0.5s ease;
        transform: translate(-50%, -50%);
    }

    .trap-indicator {
        position: absolute;
        color: #ff9500;
        font-size: 16px;
        font-weight: 700;
        pointer-events: none;
        animation: trapFloat 0.5s ease;
        transform: translate(-50%, -50%);
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    @keyframes trapFloat {
        from {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.2) rotate(0deg);
        }
        to {
            opacity: 0;
            transform: translate(-50%, -80px) scale(0.8) rotate(10deg);
        }
    }

    @keyframes missFloat {
        from {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        to {
            opacity: 0;
            transform: translate(-50%, -80px) scale(0.8);
        }
    }

    .particle {
        position: fixed;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        pointer-events: none;
        animation: particleFloat 0.6s ease-out;
        transform: translate(-50%, -50%);
        z-index: 9999;
    }

    @keyframes particleFloat {
        from {
            opacity: 1;
            transform: translate(-50%, -50%) translate(0, 0) scale(1);
        }
        to {
            opacity: 0;
            transform: translate(-50%, -50%) translate(var(--tx), var(--ty)) scale(0);
        }
    }

    .game-start-btn {
        width: 100%;
        padding: 16px;
        background: var(--glass-bg);
        backdrop-filter: blur(40px) saturate(180%);
        -webkit-backdrop-filter: blur(40px) saturate(180%);
        color: #0071e3;
        border: 1px solid var(--glass-border);
        border-radius: 12px;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 2px 12px var(--shadow-color);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        letter-spacing: -0.3px;
    }

    .game-start-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 20px var(--shadow-color);
        background: rgba(0, 113, 227, 0.1);
    }

    .game-start-btn:active {
        transform: translateY(0);
    }

    .game-start-btn.active {
        color: #ff3b30;
        background: rgba(255, 59, 48, 0.1);
    }

    .game-start-btn.active:hover {
        background: rgba(255, 59, 48, 0.15);
    }

    [data-theme="dark"] .game-start-btn {
        color: #2997ff;
    }

    [data-theme="dark"] .game-start-btn:hover {
        background: rgba(41, 151, 255, 0.15);
    }

    [data-theme="dark"] .game-start-btn.active {
        color: #ff453a;
        background: rgba(255, 69, 58, 0.15);
    }

    [data-theme="dark"] .game-start-btn.active:hover {
        background: rgba(255, 69, 58, 0.2);
    }

    @media (max-width: 735px) {
        .games-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
        }

        .game-card {
            min-height: 140px;
            padding: 16px;
        }

        .game-card-icon {
            width: 50px;
            height: 50px;
            font-size: 24px;
        }

        .game-play-area {
            height: 350px;
        }

        .stat-value {
            font-size: 20px;
        }

        .game-ready-message i {
            font-size: 40px;
        }

        .game-ready-message p {
            font-size: 16px;
        }
    }

    @media (max-width: 480px) {
        .hub-header h3 {
            font-size: 20px;
        }

        .game-card {
            min-height: 120px;
            padding: 14px;
        }

        .game-card-icon {
            width: 44px;
            height: 44px;
            font-size: 20px;
        }

        .game-card-content h4 {
            font-size: 14px;
        }

        .game-play-area {
            height: 300px;
        }

        .game-stats {
            gap: 8px;
        }

        .stat-item {
            padding: 10px;
        }

        .stat-value {
            font-size: 18px;
        }

        .game-start-btn {
            padding: 12px;
            font-size: 14px;
        }
    }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = gameStyles;
document.head.appendChild(styleSheet);