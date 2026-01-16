// MediaPipe Hands Setup
import { Hands } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';

// Game State
const gameState = {
    score: 0,
    highScore: localStorage.getItem('fruitNinjaHighScore') || 0,
    lives: 3,
    isPlaying: false,
    isPaused: false,
    fruits: [],
    slicedCount: 0,
    missedCount: 0,
    difficulty: 'medium',
    fruitType: 'fruits',
    soundEnabled: true,
    showHandTracking: true,
    gameStartTime: 0,
    speedMultiplier: 1,
    playerName: localStorage.getItem('fruitNinjaPlayerName') || 'Guest'
};

// Fruit/Vegetable Emojis - 30+ varieties each
const fruitEmojis = {
    fruits: [
        '🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍑', '🥝', '🍍',
        '🥭', '🍒', '🍈', '🫐', '🍐', '🥥', '🍏', '🍅', '🥑', '🍆',
        '🌶️', '🫒', '🥔', '🍠', '🧄', '🧅', '🥕', '🌽', '🥒', '🥦',
        '🥬', '🫑', '🥗', '🍄'
    ],
    vegetables: [
        '🥕', '🥦', '🥬', '🌽', '🥒', '🍅', '🧅', '🫑', '🥔', '🍆',
        '🥑', '🌶️', '🫒', '🍠', '🧄', '🥗', '🍄', '🫘', '🥜', '🌰',
        '🫚', '🥕', '🧅', '🥦', '🥒', '🌽', '🫑', '🥔', '🍆', '🥬',
        '🍅', '🧄', '🥑', '🌶️'
    ],
    mixed: [
        '🍎', '🍊', '🥕', '🍋', '🥦', '🍌', '🌽', '🍉', '🍇', '🥒',
        '🍓', '🥬', '🍑', '🫑', '🥝', '🍍', '🥔', '🥭', '🍆', '🍒',
        '🍈', '🧅', '🫐', '🍐', '🥥', '🍏', '🍅', '🥑', '🌶️', '🫒',
        '🍠', '🧄', '🥗', '🍄', '🫘', '🥜', '🌰', '🫚'
    ]
};

// Difficulty Settings - Starting speeds
const difficultySettings = {
    easy: { spawnRate: 2000, fallSpeed: 1.0, bombChance: 0.1 },
    medium: { spawnRate: 1500, fallSpeed: 1.0, bombChance: 0.15 },
    hard: { spawnRate: 1000, fallSpeed: 1.0, bombChance: 0.2 }
};

// DOM Elements
const videoElement = document.getElementById('videoElement');
const gameCanvas = document.getElementById('gameCanvas');
const handCanvas = document.getElementById('handCanvas');
const gameCtx = gameCanvas.getContext('2d');
const handCtx = handCanvas.getContext('2d');

const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('highScore');
const livesEl = document.getElementById('lives');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const pauseBtn = document.getElementById('pauseBtn');
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const loadingScreen = document.getElementById('loadingScreen');
const cameraStatus = document.getElementById('cameraStatus');
const finalScoreEl = document.getElementById('finalScore');
const finalHighScoreEl = document.getElementById('finalHighScore');
const playerNameInput = document.getElementById('playerNameInput');
const playerNameDisplay = document.getElementById('playerNameDisplay');
const playerNameEl = document.getElementById('playerName');
const gameOverPlayerNameEl = document.getElementById('gameOverPlayerName');

// Stats Elements
const slicedCountEl = document.getElementById('slicedCount');
const missedCountEl = document.getElementById('missedCount');
const accuracyEl = document.getElementById('accuracy');

// Control Elements
const fruitTypeSelect = document.getElementById('fruitType');
const difficultySelect = document.getElementById('difficulty');
const soundToggle = document.getElementById('soundToggle');
const showHandTrackingToggle = document.getElementById('showHandTracking');

// Hand Tracking Variables
let handLandmarks = []; // Array to store multiple hands
let primaryHandCenter = null; // Track the center of primary hands
let hands = null;
let camera = null;

// Animation Variables
let lastSpawnTime = 0;
let animationFrameId = null;

// Particle System
const particles = [];

// Set Canvas Size
function resizeCanvas() {
    const container = document.querySelector('.game-container');
    gameCanvas.width = container.clientWidth;
    gameCanvas.height = container.clientHeight;
    handCanvas.width = container.clientWidth;
    handCanvas.height = container.clientHeight;
}

// Initialize
function init() {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Display high score and player name
    highScoreEl.textContent = gameState.highScore;
    playerNameInput.value = gameState.playerName === 'Guest' ? '' : gameState.playerName;
    
    // Event Listeners
    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', restartGame);
    pauseBtn.addEventListener('click', togglePause);
    
    // Save player name when typing
    playerNameInput.addEventListener('input', (e) => {
        const name = e.target.value.trim();
        if (name) {
            gameState.playerName = name;
            localStorage.setItem('fruitNinjaPlayerName', name);
        }
    });
    
    fruitTypeSelect.addEventListener('change', (e) => {
        gameState.fruitType = e.target.value;
    });
    
    difficultySelect.addEventListener('change', (e) => {
        gameState.difficulty = e.target.value;
    });
    
    soundToggle.addEventListener('change', (e) => {
        gameState.soundEnabled = e.target.checked;
    });
    
    showHandTrackingToggle.addEventListener('change', (e) => {
        gameState.showHandTracking = e.target.checked;
    });
}

// Sound Effects (Web Audio API)
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playSliceSound() {
    if (!gameState.soundEnabled) return;
    
    // Create a positive, satisfying "slice" sound with rising pitch
    const oscillator1 = audioContext.createOscillator();
    const oscillator2 = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // First tone - rising pitch for satisfaction
    oscillator1.frequency.setValueAtTime(600, audioContext.currentTime);
    oscillator1.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
    oscillator1.type = 'sine';
    
    // Second tone - higher harmonic for brightness
    oscillator2.frequency.setValueAtTime(1200, audioContext.currentTime);
    oscillator2.frequency.exponentialRampToValueAtTime(1800, audioContext.currentTime + 0.1);
    oscillator2.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.25, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
    
    oscillator1.start(audioContext.currentTime);
    oscillator1.stop(audioContext.currentTime + 0.15);
    oscillator2.start(audioContext.currentTime);
    oscillator2.stop(audioContext.currentTime + 0.15);
}

function playMissSound() {
    if (!gameState.soundEnabled) return;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 200;
    oscillator.type = 'sawtooth';
    
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
}

function playLoseLifeSound() {
    if (!gameState.soundEnabled) return;
    
    // Create a dramatic descending sound with multiple oscillators
    const times = [0, 0.1, 0.2];
    const frequencies = [400, 300, 150];
    
    times.forEach((time, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequencies[index];
        oscillator.type = 'square';
        
        const startTime = audioContext.currentTime + time;
        gainNode.gain.setValueAtTime(0.3, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + 0.15);
    });
    
    // Add a lower rumble effect
    const rumble = audioContext.createOscillator();
    const rumbleGain = audioContext.createGain();
    
    rumble.connect(rumbleGain);
    rumbleGain.connect(audioContext.destination);
    
    rumble.frequency.value = 50;
    rumble.type = 'sine';
    
    rumbleGain.gain.setValueAtTime(0.4, audioContext.currentTime);
    rumbleGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
    
    rumble.start(audioContext.currentTime);
    rumble.stop(audioContext.currentTime + 0.4);
}

function playExplosionSound() {
    if (!gameState.soundEnabled) return;
    
    // Create a loud explosive sound
    const times = [0, 0.05, 0.1, 0.15];
    const frequencies = [100, 80, 60, 40];
    
    times.forEach((time, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequencies[index];
        oscillator.type = 'sawtooth';
        
        const startTime = audioContext.currentTime + time;
        gainNode.gain.setValueAtTime(0.5, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + 0.2);
    });
    
    // Add white noise for explosion effect
    const bufferSize = audioContext.sampleRate * 0.3;
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }
    
    const whiteNoise = audioContext.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    const noiseGain = audioContext.createGain();
    
    whiteNoise.connect(noiseGain);
    noiseGain.connect(audioContext.destination);
    
    noiseGain.gain.setValueAtTime(0.3, audioContext.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    whiteNoise.start(audioContext.currentTime);
}

function playWhooshSound() {
    if (!gameState.soundEnabled) return;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.2);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
}

// MediaPipe Hands Setup
async function setupHandTracking() {
    loadingScreen.classList.remove('hidden');
    cameraStatus.classList.remove('hidden');
    
    try {
        hands = new Hands({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
            }
        });
        
        hands.setOptions({
            maxNumHands: 2,
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });
        
        hands.onResults(onHandResults);
        
        camera = new Camera(videoElement, {
            onFrame: async () => {
                await hands.send({ image: videoElement });
            },
            width: 1280,
            height: 720
        });
        
        await camera.start();
        
        loadingScreen.classList.add('hidden');
        cameraStatus.classList.add('hidden');
        
    } catch (error) {
        console.error('Error setting up hand tracking:', error);
        alert('Failed to initialize camera. Please ensure camera permissions are granted.');
        loadingScreen.classList.add('hidden');
        cameraStatus.textContent = '❌ Camera initialization failed';
    }
}

// Calculate hand center position (average of all landmarks)
function getHandCenter(landmarks) {
    let sumX = 0, sumY = 0;
    landmarks.forEach(point => {
        sumX += point.x;
        sumY += point.y;
    });
    return { x: sumX / landmarks.length, y: sumY / landmarks.length };
}

// Check if two hands are likely from the same person (based on proximity)
function areHandsFromSamePerson(hand1, hand2, maxDistance = 0.6) {
    const center1 = getHandCenter(hand1);
    const center2 = getHandCenter(hand2);
    const distance = Math.sqrt(
        Math.pow(center1.x - center2.x, 2) + Math.pow(center1.y - center2.y, 2)
    );
    return distance < maxDistance;
}

// Hand Results Callback
function onHandResults(results) {
    handCtx.clearRect(0, 0, handCanvas.width, handCanvas.height);
    
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        if (results.multiHandLandmarks.length === 1) {
            // Only one hand detected - use it and update primary center
            handLandmarks = [results.multiHandLandmarks[0]];
            primaryHandCenter = getHandCenter(results.multiHandLandmarks[0]);
        } else if (results.multiHandLandmarks.length === 2) {
            // Two hands detected - check if they're from the same person
            if (areHandsFromSamePerson(results.multiHandLandmarks[0], results.multiHandLandmarks[1])) {
                // Both hands are close enough - likely same person
                handLandmarks = results.multiHandLandmarks;
                // Update primary center to midpoint between both hands
                const center1 = getHandCenter(results.multiHandLandmarks[0]);
                const center2 = getHandCenter(results.multiHandLandmarks[1]);
                primaryHandCenter = {
                    x: (center1.x + center2.x) / 2,
                    y: (center1.y + center2.y) / 2
                };
            } else if (primaryHandCenter) {
                // Two hands detected but far apart - use the ones closer to primary center
                const center1 = getHandCenter(results.multiHandLandmarks[0]);
                const center2 = getHandCenter(results.multiHandLandmarks[1]);
                
                const dist1 = Math.sqrt(
                    Math.pow(center1.x - primaryHandCenter.x, 2) + Math.pow(center1.y - primaryHandCenter.y, 2)
                );
                const dist2 = Math.sqrt(
                    Math.pow(center2.x - primaryHandCenter.x, 2) + Math.pow(center2.y - primaryHandCenter.y, 2)
                );
                
                // Keep both hands if both are reasonably close to primary center
                if (dist1 < 0.4 && dist2 < 0.4) {
                    handLandmarks = results.multiHandLandmarks;
                } else if (dist1 < dist2 && dist1 < 0.4) {
                    handLandmarks = [results.multiHandLandmarks[0]];
                    primaryHandCenter = center1;
                } else if (dist2 < 0.4) {
                    handLandmarks = [results.multiHandLandmarks[1]];
                    primaryHandCenter = center2;
                } else {
                    // Both too far - keep previous state or reset
                    handLandmarks = [];
                }
            } else {
                // No previous primary center - assume first detection is correct
                handLandmarks = results.multiHandLandmarks;
                const center1 = getHandCenter(results.multiHandLandmarks[0]);
                const center2 = getHandCenter(results.multiHandLandmarks[1]);
                primaryHandCenter = {
                    x: (center1.x + center2.x) / 2,
                    y: (center1.y + center2.y) / 2
                };
            }
        }
        
        if (gameState.showHandTracking) {
            drawHandLandmarks();
        }
    } else {
        handLandmarks = [];
        primaryHandCenter = null;
    }
}

// Draw Hand Landmarks
function drawHandLandmarks() {
    if (!handLandmarks || handLandmarks.length === 0) return;
    
    // Draw connections
    const connections = [
        [0, 1], [1, 2], [2, 3], [3, 4],  // Thumb
        [0, 5], [5, 6], [6, 7], [7, 8],  // Index
        [0, 9], [9, 10], [10, 11], [11, 12],  // Middle
        [0, 13], [13, 14], [14, 15], [15, 16],  // Ring
        [0, 17], [17, 18], [18, 19], [19, 20],  // Pinky
        [5, 9], [9, 13], [13, 17]  // Palm
    ];
    
    const fingerTips = [4, 8, 12, 16, 20]; // All five finger tips: Thumb, Index, Middle, Ring, Pinky
    
    // Draw each hand with different colors
    const handColors = ['#00FF00', '#00FFFF']; // Green for first hand, Cyan for second
    const tipColors = ['#FF0000', '#FF00FF']; // Red for first hand, Magenta for second
    
    handLandmarks.forEach((landmarks, handIndex) => {
        handCtx.strokeStyle = handColors[handIndex % handColors.length];
        handCtx.lineWidth = 2;
        
        // Draw connections for this hand
        connections.forEach(([start, end]) => {
            const startPoint = landmarks[start];
            const endPoint = landmarks[end];
            
            handCtx.beginPath();
            handCtx.moveTo(startPoint.x * handCanvas.width, startPoint.y * handCanvas.height);
            handCtx.lineTo(endPoint.x * handCanvas.width, endPoint.y * handCanvas.height);
            handCtx.stroke();
        });
        
        // Draw landmarks for this hand
        landmarks.forEach((landmark, index) => {
            const x = landmark.x * handCanvas.width;
            const y = landmark.y * handCanvas.height;
            
            if (fingerTips.includes(index)) {
                handCtx.fillStyle = tipColors[handIndex % tipColors.length];
                handCtx.beginPath();
                handCtx.arc(x, y, 8, 0, 2 * Math.PI);
                handCtx.fill();
            } else {
                handCtx.fillStyle = handColors[handIndex % handColors.length];
                handCtx.beginPath();
                handCtx.arc(x, y, 4, 0, 2 * Math.PI);
                handCtx.fill();
            }
        });
    });
}

// Fruit Class
class Fruit {
    constructor() {
        // Determine if this is a bomb
        const difficulty = difficultySettings[gameState.difficulty];
        this.isBomb = Math.random() < difficulty.bombChance;
        
        // Set emoji based on bomb status
        this.emoji = this.isBomb ? '💣' : this.getRandomEmoji();
        
        // Spawn from top of screen
        this.x = Math.random() * (gameCanvas.width - 60) + 30;
        this.y = -50;
        this.size = 50;
        
        // Simple falling speed with speed multiplier
        this.speed = difficulty.fallSpeed * gameState.speedMultiplier;
        
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 5;
        this.sliced = false;
        this.opacity = 1.0; // Full opacity initially
        this.fadeSpeed = 0.05; // How fast it fades after being sliced
    }
    
    getRandomEmoji() {
        const emojis = fruitEmojis[gameState.fruitType];
        return emojis[Math.floor(Math.random() * emojis.length)];
    }
    
    update() {
        // Simple downward movement
        this.y += this.speed;
        
        // Rotation
        this.rotation += this.rotationSpeed;
        
        // Fade out if sliced
        if (this.sliced && this.opacity > 0) {
            this.opacity -= this.fadeSpeed;
        }
    }
    
    draw() {
        gameCtx.save();
        
        // Apply transparency (50% when sliced)
        if (this.sliced) {
            gameCtx.globalAlpha = this.opacity * 0.5; // 50% of current opacity
        } else {
            gameCtx.globalAlpha = 1.0; // Full opacity when not sliced
        }
        
        gameCtx.translate(this.x, this.y);
        gameCtx.rotate((this.rotation * Math.PI) / 180);
        gameCtx.font = `${this.size}px Arial`;
        gameCtx.textAlign = 'center';
        gameCtx.textBaseline = 'middle';
        
        // Add red glow for bombs
        if (this.isBomb) {
            gameCtx.shadowColor = 'red';
            gameCtx.shadowBlur = 20;
        }
        
        gameCtx.fillText(this.emoji, 0, 0);
        gameCtx.restore();
    }
    
    isOffScreen() {
        // Remove if off screen or fully faded out after being sliced
        return this.y > gameCanvas.height + 50 || (this.sliced && this.opacity <= 0);
    }
    
    checkCollision(fingerX, fingerY) {
        const distance = Math.sqrt(
            Math.pow(this.x - fingerX, 2) + Math.pow(this.y - fingerY, 2)
        );
        return distance < this.size / 2 + 10;
    }
    
    slice() {
        this.sliced = true;
        createParticles(this.x, this.y, this.emoji, this.isBomb);
        
        // Only play positive slice sound for fruits/vegetables, not bombs
        if (!this.isBomb) {
            playSliceSound();
        }
    }
    
    explode() {
        createExplosion(this.x, this.y);
        playExplosionSound();
    }
}

// Particle Class
class Particle {
    constructor(x, y, emoji) {
        this.x = x;
        this.y = y;
        this.emoji = emoji;
        this.vx = (Math.random() - 0.5) * 10;
        this.vy = (Math.random() - 0.5) * 10 - 5;
        this.life = 1;
        this.size = 30;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 20;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.5;  // Gravity
        this.life -= 0.02;
        this.rotation += this.rotationSpeed;
    }
    
    draw() {
        gameCtx.save();
        // Fade from 100% opacity (1.0) to 40% opacity (0.4)
        // 60% transparency = 40% opacity
        gameCtx.globalAlpha = 0.4 + (this.life * 0.6);
        gameCtx.translate(this.x, this.y);
        gameCtx.rotate((this.rotation * Math.PI) / 180);
        gameCtx.font = `${this.size}px Arial`;
        gameCtx.textAlign = 'center';
        gameCtx.textBaseline = 'middle';
        gameCtx.fillText(this.emoji, 0, 0);
        gameCtx.restore();
    }
}

// Create Particles
function createParticles(x, y, emoji, isBomb = false) {
    const particleCount = isBomb ? 12 : 6;
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(x, y, emoji));
    }
}

// Create Explosion Effect
function createExplosion(x, y) {
    // Create explosion particles
    for (let i = 0; i < 20; i++) {
        particles.push(new Particle(x, y, '💥'));
    }
    
    // Create fire particles
    for (let i = 0; i < 15; i++) {
        particles.push(new Particle(x, y, '🔥'));
    }
}

// Spawn Fruit
function spawnFruit() {
    gameState.fruits.push(new Fruit());
    playWhooshSound();
}

// Start Game
async function startGame() {
    // Get and store player name
    const name = playerNameInput.value.trim();
    if (name) {
        gameState.playerName = name;
        localStorage.setItem('fruitNinjaPlayerName', name);
    } else {
        gameState.playerName = 'Guest';
    }
    
    // Show player name in header
    playerNameEl.textContent = gameState.playerName;
    playerNameDisplay.style.display = 'flex';
    
    startScreen.classList.add('hidden');
    pauseBtn.disabled = false;
    
    if (!hands) {
        await setupHandTracking();
    }
    
    gameState.isPlaying = true;
    gameState.score = 0;
    gameState.lives = 3;
    gameState.slicedCount = 0;
    gameState.missedCount = 0;
    gameState.fruits = [];
    particles.length = 0;
    lastSpawnTime = Date.now();
    
    // Reset speed progression
    gameState.gameStartTime = Date.now();
    gameState.speedMultiplier = 1;
    
    updateUI();
    gameLoop();
}

// Restart Game
function restartGame() {
    gameOverScreen.classList.add('hidden');
    startGame();
}

// Toggle Pause
function togglePause() {
    gameState.isPaused = !gameState.isPaused;
    pauseBtn.textContent = gameState.isPaused ? '▶️ Resume' : '⏸️ Pause';
    
    if (!gameState.isPaused) {
        gameLoop();
    }
}

// Update UI
function updateUI() {
    scoreEl.textContent = gameState.score;
    highScoreEl.textContent = gameState.highScore;
    livesEl.textContent = '❤️'.repeat(gameState.lives);
    slicedCountEl.textContent = gameState.slicedCount;
    missedCountEl.textContent = gameState.missedCount;
    
    const accuracy = gameState.slicedCount + gameState.missedCount > 0
        ? Math.round((gameState.slicedCount / (gameState.slicedCount + gameState.missedCount)) * 100)
        : 0;
    accuracyEl.textContent = accuracy;
}

// Game Over
function gameOver() {
    gameState.isPlaying = false;
    pauseBtn.disabled = true;
    
    // Update high score
    if (gameState.score > gameState.highScore) {
        gameState.highScore = gameState.score;
        localStorage.setItem('fruitNinjaHighScore', gameState.highScore);
    }
    
    // Display player name in game over screen
    gameOverPlayerNameEl.textContent = gameState.playerName !== 'Guest' ? gameState.playerName : '';
    
    finalScoreEl.textContent = gameState.score;
    finalHighScoreEl.textContent = gameState.highScore;
    gameOverScreen.classList.remove('hidden');
}

// Game Loop
function gameLoop() {
    if (!gameState.isPlaying || gameState.isPaused) return;
    
    // Update speed multiplier based on elapsed time
    const elapsedSeconds = (Date.now() - gameState.gameStartTime) / 1000;
    const speedIncreaseIntervals = Math.floor(elapsedSeconds / 5);
    gameState.speedMultiplier = 1 + (speedIncreaseIntervals * 0.1);
    
    // Clear canvas
    gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    
    // Spawn fruits (max 3 on screen at a time)
    const currentTime = Date.now();
    const spawnRate = difficultySettings[gameState.difficulty].spawnRate;
    const maxFruitsOnScreen = 3;
    
    if (currentTime - lastSpawnTime > spawnRate && gameState.fruits.length < maxFruitsOnScreen) {
        spawnFruit();
        lastSpawnTime = currentTime;
    }
    
    // Get all five finger tip positions from both hands (Thumb, Index, Middle, Ring, Pinky)
    const fingerTips = [4, 8, 12, 16, 20];
    const fingerPositions = [];
    
    if (handLandmarks && handLandmarks.length > 0) {
        // Loop through each detected hand
        handLandmarks.forEach(landmarks => {
            fingerTips.forEach(tipIndex => {
                if (landmarks[tipIndex]) {
                    fingerPositions.push({
                        x: landmarks[tipIndex].x * gameCanvas.width,
                        y: landmarks[tipIndex].y * gameCanvas.height
                    });
                }
            });
        });
    }
    
    // Update and draw fruits
    for (let i = gameState.fruits.length - 1; i >= 0; i--) {
        const fruit = gameState.fruits[i];
        
        fruit.update();
        fruit.draw();
        
        // Check collision with any finger tip
        if (!fruit.sliced && fingerPositions.length > 0) {
            for (const finger of fingerPositions) {
                if (fruit.checkCollision(finger.x, finger.y)) {
                    fruit.slice();
                    
                    // Check if sliced object was a bomb
                    if (fruit.isBomb) {
                        // Slicing a bomb is bad! Lose a life and no points
                        fruit.explode(); // This calls playExplosionSound()
                        gameState.lives--;
                        // Don't play additional sounds - explosion sound is enough
                    } else {
                        // Normal fruit - gain points
                        gameState.score += 10;
                        gameState.slicedCount++;
                    }
                    
                    updateUI();
                    
                    if (gameState.lives <= 0) {
                        gameOver();
                        return;
                    }
                    
                    break; // Only slice once per fruit
                }
            }
        }
        
        // Remove off-screen fruits
        if (fruit.isOffScreen()) {
            gameState.fruits.splice(i, 1);
            if (!fruit.sliced) {
                if (fruit.isBomb) {
                    // Bomb avoided successfully - no penalty!
                    // Player did the right thing by NOT touching it
                } else {
                    // Regular fruit missed - lose a life
                    gameState.lives--;
                    gameState.missedCount++;
                    playLoseLifeSound();
                    updateUI();
                    
                    if (gameState.lives <= 0) {
                        gameOver();
                        return;
                    }
                }
            }
        }
    }
    
    // Update and draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.update();
        particle.draw();
        
        if (particle.life <= 0) {
            particles.splice(i, 1);
        }
    }
    
    animationFrameId = requestAnimationFrame(gameLoop);
}

// Initialize game
init();
