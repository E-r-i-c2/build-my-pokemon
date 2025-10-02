// Game configuration
const CONFIG = {
    TILE_SIZE: 32,
    MAP_WIDTH: 50,
    MAP_HEIGHT: 40,
    PLAYER_SPEED: 0.5,
    CAMERA_ZOOM: 2.5,
    CAMERA_SMOOTHING: 0.08
};

// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game state
let gameState = {
    player: {
        x: 200,
        y: 200,
        width: 24,
        height: 24,
        direction: 'down'
    },
    camera: {
        x: 0,
        y: 0
    },
    keys: {},
    isPaused: false
};

// Image assets
const images = {
    grass: null,
    tree: null,
    toriigate: null
};

// Load images
function loadImages() {
    const imagePromises = [];
    
    // Load grass tile
    imagePromises.push(
        new Promise((resolve) => {
            images.grass = new Image();
            images.grass.onload = () => resolve();
            images.grass.src = 'images/tiles/grass.png';
        })
    );
    
    // Load tree tile
    imagePromises.push(
        new Promise((resolve) => {
            images.tree = new Image();
            images.tree.onload = () => resolve();
            images.tree.src = 'images/tiles/tree.png';
        })
    );
    
    // Load toriigate tile
    imagePromises.push(
        new Promise((resolve) => {
            images.toriigate = new Image();
            images.toriigate.onload = () => resolve();
            images.toriigate.src = 'images/tiles/toriigate.png';
        })
    );
    
    return Promise.all(imagePromises);
}

// Tile types for the map
const TILE_TYPES = {
    GROUND: 0,
    WATER: 1,
    SAND: 2,
    ROCK: 3,
    TREE: 4,
    FLOWER: 5,
    PATH: 6,
    TORIIGATE: 7,
    GRASS: 8
};

// Colors for different tile types (fallback when images aren't loaded)
const TILE_COLORS = {
    [TILE_TYPES.GROUND]: '#4a7c59',
    [TILE_TYPES.WATER]: '#4a90e2',
    [TILE_TYPES.SAND]: '#f4e4bc',
    [TILE_TYPES.ROCK]: '#8b7355',
    [TILE_TYPES.TREE]: '#2d5016',
    [TILE_TYPES.FLOWER]: '#ff69b4',
    [TILE_TYPES.PATH]: '#d2b48c',
    [TILE_TYPES.TORIIGATE]: '#8b4513',
    [TILE_TYPES.GRASS]: '#2d5016'
};

// Image mapping for tile types
const TILE_IMAGES = {
    [TILE_TYPES.GRASS]: 'grass',
    [TILE_TYPES.TREE]: 'tree',
    [TILE_TYPES.TORIIGATE]: 'toriigate'
};

// Generate a Pokemon-style map
function generateMap() {
    const map = [];
    
    for (let y = 0; y < CONFIG.MAP_HEIGHT; y++) {
        map[y] = [];
        for (let x = 0; x < CONFIG.MAP_WIDTH; x++) {
            // Create a varied landscape
            let tileType = TILE_TYPES.GROUND;
            
            // Add water areas
            if ((x > 10 && x < 20 && y > 5 && y < 15) || 
                (x > 30 && x < 40 && y > 25 && y < 35)) {
                tileType = TILE_TYPES.WATER;
            }
            // Add sand areas
            else if ((x > 5 && x < 15 && y > 20 && y < 30)) {
                tileType = TILE_TYPES.SAND;
            }
            // Add rocky areas
            else if ((x > 25 && x < 35 && y > 5 && y < 15)) {
                tileType = TILE_TYPES.ROCK;
            }
            // Add trees (scattered) - but not near the torii gate
            else if (Math.random() < 0.1 && !(x >= 0 && x <= 8 && y >= 0 && y <= 8)) {
                tileType = TILE_TYPES.TREE;
            }
            // Add grass/bushes (scattered, less common than trees) - but not near the torii gate
            else if (Math.random() < 0.08 && !(x >= 0 && x <= 8 && y >= 0 && y <= 8)) {
                tileType = TILE_TYPES.GRASS;
            }
            // Add flowers (less common)
            else if (Math.random() < 0.05) {
                tileType = TILE_TYPES.FLOWER;
            }
            // Add paths
            else if ((x === 0 || x === CONFIG.MAP_WIDTH - 1 || y === 0 || y === CONFIG.MAP_HEIGHT - 1) ||
                     (x > 20 && x < 30 && y > 15 && y < 25)) {
                tileType = TILE_TYPES.PATH;
            }
            // Add toriigate (special structures)
            else if ((x === 15 && y === 10) || (x === 35 && y === 25) || (x === 5 && y === 30)) {
                tileType = TILE_TYPES.TORIIGATE;
            }
            // Create one large torii gate structure at spawn area (top-left corner)
            // This creates a single large gate structure spanning multiple tiles
            else if ((x >= 2 && x <= 6 && y >= 2 && y <= 6)) {
                tileType = TILE_TYPES.TORIIGATE;
            }
            
            map[y][x] = tileType;
        }
    }
    
    return map;
}

// Generate the map
const gameMap = generateMap();

// Find a safe spawn location in the center of the torii gate
function findSafeSpawnLocation() {
    // Spawn in the center of the torii gate (tile 4,4 which is the center of the 5x5 gate)
    const centerX = 4;
    const centerY = 4;
    
    return {
        x: centerX * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2,
        y: centerY * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2
    };
}

// Set player to safe spawn location
const safeSpawn = findSafeSpawnLocation();
gameState.player.x = safeSpawn.x;
gameState.player.y = safeSpawn.y;

// Input handling
document.addEventListener('keydown', (e) => {
    gameState.keys[e.key.toLowerCase()] = true;
    
    if (e.key === 'Escape') {
        gameState.isPaused = !gameState.isPaused;
    }
});

document.addEventListener('keyup', (e) => {
    gameState.keys[e.key.toLowerCase()] = false;
});

// Check if a position is walkable
function isWalkable(x, y) {
    const tileX = Math.floor(x / CONFIG.TILE_SIZE);
    const tileY = Math.floor(y / CONFIG.TILE_SIZE);
    
    if (tileX < 0 || tileX >= CONFIG.MAP_WIDTH || tileY < 0 || tileY >= CONFIG.MAP_HEIGHT) {
        return false;
    }
    
    const tileType = gameMap[tileY][tileX];
    
    // Check for torii gate collision (only the posts are solid)
    if (tileType === TILE_TYPES.TORIIGATE) {
        // Check if we're in the large torii gate area
        if (tileX >= 2 && tileX <= 6 && tileY >= 2 && tileY <= 6) {
            // Debug: Log collision checks
            console.log(`Torii gate collision check: tileX=${tileX}, tileY=${tileY}`);
            
            // Only the posts and beams are solid - allow walking through the center
            // Left post (tiles 2,3 and 2,4)
            if (tileX === 2 && (tileY === 3 || tileY === 4)) {
                console.log('Hit left post - SOLID');
                return false; // Solid
            }
            // Right post (tiles 6,3 and 6,4) 
            if (tileX === 6 && (tileY === 3 || tileY === 4)) {
                console.log('Hit right post - SOLID');
                return false; // Solid
            }
            // Top beam (tiles 3,2 through 5,2)
            if (tileY === 2 && tileX >= 3 && tileX <= 5) {
                console.log('Hit top beam - SOLID');
                return false; // Solid
            }
            // Bottom beam (tiles 3,6 through 5,6)
            if (tileY === 6 && tileX >= 3 && tileX <= 5) {
                console.log('Hit bottom beam - SOLID');
                return false; // Solid
            }
            // Center area is walkable
            console.log('Center area - WALKABLE');
            return true;
        } else {
            // Individual torii gate tiles are solid
            console.log('Individual torii gate - SOLID');
            return false;
        }
    }
    
    // Only water, trees, and rocks are impassable
    return tileType !== TILE_TYPES.WATER && tileType !== TILE_TYPES.TREE && tileType !== TILE_TYPES.ROCK;
}

// Update player position
function updatePlayer() {
    if (gameState.isPaused) return;
    
    const player = gameState.player;
    let newX = player.x;
    let newY = player.y;
    
    // Handle movement
    if (gameState.keys['w'] || gameState.keys['arrowup']) {
        newY -= CONFIG.PLAYER_SPEED;
        player.direction = 'up';
    }
    if (gameState.keys['s'] || gameState.keys['arrowdown']) {
        newY += CONFIG.PLAYER_SPEED;
        player.direction = 'down';
    }
    if (gameState.keys['a'] || gameState.keys['arrowleft']) {
        newX -= CONFIG.PLAYER_SPEED;
        player.direction = 'left';
    }
    if (gameState.keys['d'] || gameState.keys['arrowright']) {
        newX += CONFIG.PLAYER_SPEED;
        player.direction = 'right';
    }
    
    // Check collision for X movement
    if (isWalkable(newX, player.y) && isWalkable(newX + player.width, player.y) &&
        isWalkable(newX, player.y + player.height) && isWalkable(newX + player.width, player.y + player.height)) {
        player.x = newX;
    }
    
    // Check collision for Y movement
    if (isWalkable(player.x, newY) && isWalkable(player.x + player.width, newY) &&
        isWalkable(player.x, newY + player.height) && isWalkable(player.x + player.width, newY + player.height)) {
        player.y = newY;
    }
}

// Update camera to follow player
function updateCamera() {
    const player = gameState.player;
    const camera = gameState.camera;
    
    // Calculate target camera position (centered on player)
    const targetX = player.x - canvas.width / (2 * CONFIG.CAMERA_ZOOM);
    const targetY = player.y - canvas.height / (2 * CONFIG.CAMERA_ZOOM);
    
    // Smooth camera movement
    camera.x += (targetX - camera.x) * CONFIG.CAMERA_SMOOTHING;
    camera.y += (targetY - camera.y) * CONFIG.CAMERA_SMOOTHING;
    
    // Keep camera within map bounds
    camera.x = Math.max(0, Math.min(camera.x, CONFIG.MAP_WIDTH * CONFIG.TILE_SIZE - canvas.width / CONFIG.CAMERA_ZOOM));
    camera.y = Math.max(0, Math.min(camera.y, CONFIG.MAP_HEIGHT * CONFIG.TILE_SIZE - canvas.height / CONFIG.CAMERA_ZOOM));
}

// Draw a tile (ground layer only)
function drawTile(x, y, tileType, tileX, tileY) {
    // Only draw ground tiles, not structures that should overlay
    if (tileType === TILE_TYPES.TORIIGATE || tileType === TILE_TYPES.TREE || tileType === TILE_TYPES.GRASS) {
        // Draw ground underneath structures
        ctx.fillStyle = TILE_COLORS[TILE_TYPES.GROUND];
        ctx.fillRect(x, y, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
        return;
    }
    
    // Check if we have an image for this tile type
    const imageName = TILE_IMAGES[tileType];
    const image = imageName ? images[imageName] : null;
    
    if (image && image.complete) {
        // Draw the image sprite
        ctx.drawImage(image, x, y, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
    } else {
        // Fallback to colored rectangle
        ctx.fillStyle = TILE_COLORS[tileType];
        ctx.fillRect(x, y, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
        
        // Add some texture to different tile types
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
        
        // Add special patterns for certain tiles (only for non-image tiles)
        if (tileType === TILE_TYPES.FLOWER) {
            // Draw a simple flower
            ctx.fillStyle = '#ff69b4';
            ctx.beginPath();
            ctx.arc(x + 16, y + 16, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#ffff00';
            ctx.beginPath();
            ctx.arc(x + 16, y + 16, 2, 0, Math.PI * 2);
            ctx.fill();
        } else if (tileType === TILE_TYPES.WATER) {
            // Add water animation effect
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            const waveOffset = Math.sin(Date.now() * 0.005 + x * 0.1) * 2;
            ctx.fillRect(x, y + 16 + waveOffset, CONFIG.TILE_SIZE, 4);
        }
    }
}

// Draw the large torii gate as one continuous structure
function drawLargeToriiGate(x, y, tileX, tileY) {
    // Only draw the structure once (from the top-left corner)
    if (tileX === 2 && tileY === 2) {
        // Draw the entire large torii gate structure
        const gateWidth = 5 * CONFIG.TILE_SIZE;
        const gateHeight = 5 * CONFIG.TILE_SIZE;
        
        // Use the toriigate image if available, otherwise draw a large structure
        if (images.toriigate && images.toriigate.complete) {
            // Draw the toriigate image scaled to cover the entire structure
            ctx.drawImage(images.toriigate, x, y, gateWidth, gateHeight);
        } else {
            // Draw a large torii gate structure with fallback colors
            ctx.fillStyle = '#8b4513'; // Brown color for the gate
            ctx.fillRect(x, y, gateWidth, gateHeight);
            
            // Add some structure details
            ctx.fillStyle = '#654321';
            ctx.fillRect(x + 10, y + 10, gateWidth - 20, 20); // Top beam
            ctx.fillRect(x + 10, y + gateHeight - 30, gateWidth - 20, 20); // Bottom beam
            ctx.fillRect(x + 20, y + 30, 15, gateHeight - 60); // Left pillar
            ctx.fillRect(x + gateWidth - 35, y + 30, 15, gateHeight - 60); // Right pillar
        }
    }
}

// Draw the map
function drawMap() {
    const camera = gameState.camera;
    
    // Save the current canvas state
    ctx.save();
    
    // Apply zoom transformation
    ctx.scale(CONFIG.CAMERA_ZOOM, CONFIG.CAMERA_ZOOM);
    
    // Calculate which tiles to draw (adjusted for zoom)
    const startX = Math.floor(camera.x / CONFIG.TILE_SIZE);
    const startY = Math.floor(camera.y / CONFIG.TILE_SIZE);
    const endX = Math.min(startX + Math.ceil(canvas.width / (CONFIG.TILE_SIZE * CONFIG.CAMERA_ZOOM)) + 1, CONFIG.MAP_WIDTH);
    const endY = Math.min(startY + Math.ceil(canvas.height / (CONFIG.TILE_SIZE * CONFIG.CAMERA_ZOOM)) + 1, CONFIG.MAP_HEIGHT);
    
    for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
            const screenX = x * CONFIG.TILE_SIZE - camera.x;
            const screenY = y * CONFIG.TILE_SIZE - camera.y;
            drawTile(screenX, screenY, gameMap[y][x], x, y);
        }
    }
    
    // Restore the canvas state
    ctx.restore();
}

// Draw map overlay (structures that can appear in front or behind player depending on depth)
function drawMapOverlayPass(shouldDrawInThisPass) {
    const camera = gameState.camera;
    const player = gameState.player;
    
    // Save the current canvas state
    ctx.save();
    
    // Apply zoom transformation
    ctx.scale(CONFIG.CAMERA_ZOOM, CONFIG.CAMERA_ZOOM);
    
    // Calculate which tiles to draw (adjusted for zoom)
    const startX = Math.floor(camera.x / CONFIG.TILE_SIZE);
    const startY = Math.floor(camera.y / CONFIG.TILE_SIZE);
    const endX = Math.min(startX + Math.ceil(canvas.width / (CONFIG.TILE_SIZE * CONFIG.CAMERA_ZOOM)) + 1, CONFIG.MAP_WIDTH);
    const endY = Math.min(startY + Math.ceil(canvas.height / (CONFIG.TILE_SIZE * CONFIG.CAMERA_ZOOM)) + 1, CONFIG.MAP_HEIGHT);
    
    for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
            const tileType = gameMap[y][x];
            if (tileType !== TILE_TYPES.TORIIGATE && tileType !== TILE_TYPES.TREE && tileType !== TILE_TYPES.GRASS) continue;
            
            const tileWorldX = x * CONFIG.TILE_SIZE;
            const tileWorldY = y * CONFIG.TILE_SIZE;
            
            // Compute overlay object's vertical bounds
            let overlayTopY = tileWorldY;
            let overlayBottomY = tileWorldY + CONFIG.TILE_SIZE;
            let shouldDrawThisTile = true;
            
            // Large torii gate is drawn once from its top-left tile (2,2)
            if (tileType === TILE_TYPES.TORIIGATE && x >= 2 && x <= 6 && y >= 2 && y <= 6) {
                if (x === 2 && y === 2) {
                    overlayTopY = 2 * CONFIG.TILE_SIZE;
                    overlayBottomY = (6 + 1) * CONFIG.TILE_SIZE; // bottom edge of the 5x5 gate area
                } else {
                    // Skip other tiles of the large gate to avoid multiple draws
                    shouldDrawThisTile = false;
                }
            }
            
            if (!shouldDrawThisTile) continue;
            
            // Decide pass based on whether the object's bottom is below the player's y (draw in front then)
            const drawInFrontOfPlayer = overlayBottomY >= player.y;
            if (!shouldDrawInThisPass(drawInFrontOfPlayer)) continue;
            
            const screenX = tileWorldX - camera.x;
            const screenY = tileWorldY - camera.y;
            drawOverlayStructure(screenX, screenY, tileType, x, y);
        }
    }
    
    // Restore the canvas state
    ctx.restore();
}

function drawMapOverlayBeforePlayer() {
    // Draw overlays that are behind the player (visually above the player)
    return drawMapOverlayPass((drawInFrontOfPlayer) => !drawInFrontOfPlayer);
}

function drawMapOverlayAfterPlayer() {
    // Draw overlays that are in front of the player (visually below the player)
    return drawMapOverlayPass((drawInFrontOfPlayer) => drawInFrontOfPlayer);
}

// Draw overlay structures (trees, bushes, torii gate)
function drawOverlayStructure(x, y, tileType, tileX, tileY) {
    // Check if we're in the large torii gate area
    if (tileType === TILE_TYPES.TORIIGATE && tileX >= 2 && tileX <= 6 && tileY >= 2 && tileY <= 6) {
        // Draw the large torii gate as one continuous structure
        drawLargeToriiGate(x, y, tileX, tileY);
        return;
    }
    
    // Draw individual structures
    if (tileType === TILE_TYPES.TREE) {
        // Draw tree
        if (images.tree && images.tree.complete) {
            ctx.drawImage(images.tree, x, y, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
        } else {
            // Fallback tree
            ctx.fillStyle = '#8b4513';
            ctx.fillRect(x + 12, y + 20, 8, 12);
            ctx.fillStyle = '#228b22';
            ctx.beginPath();
            ctx.arc(x + 16, y + 16, 12, 0, Math.PI * 2);
            ctx.fill();
        }
    } else if (tileType === TILE_TYPES.GRASS) {
        // Draw bush/grass
        if (images.grass && images.grass.complete) {
            ctx.drawImage(images.grass, x, y, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
        } else {
            // Fallback bush
            ctx.fillStyle = '#2d5016';
            ctx.beginPath();
            ctx.arc(x + 16, y + 16, 12, 0, Math.PI * 2);
            ctx.fill();
        }
    } else if (tileType === TILE_TYPES.TORIIGATE) {
        // Draw individual torii gate tiles
        if (images.toriigate && images.toriigate.complete) {
            ctx.drawImage(images.toriigate, x, y, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
        } else {
            // Fallback torii gate
            ctx.fillStyle = '#8b4513';
            ctx.fillRect(x, y, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
        }
    }
}

// Draw the player
function drawPlayer() {
    const player = gameState.player;
    const camera = gameState.camera;
    
    // Save the current canvas state
    ctx.save();
    
    // Apply zoom transformation
    ctx.scale(CONFIG.CAMERA_ZOOM, CONFIG.CAMERA_ZOOM);
    
    const screenX = player.x - camera.x;
    const screenY = player.y - camera.y;
    
    // Draw player body
    ctx.fillStyle = '#ff6b6b';
    ctx.fillRect(screenX, screenY, player.width, player.height);
    
    // Draw player direction indicator
    ctx.fillStyle = '#333';
    const centerX = screenX + player.width / 2;
    const centerY = screenY + player.height / 2;
    
    switch (player.direction) {
        case 'up':
            ctx.fillRect(centerX - 2, screenY + 2, 4, 6);
            break;
        case 'down':
            ctx.fillRect(centerX - 2, screenY + player.height - 8, 4, 6);
            break;
        case 'left':
            ctx.fillRect(screenX + 2, centerY - 2, 6, 4);
            break;
        case 'right':
            ctx.fillRect(screenX + player.width - 8, centerY - 2, 6, 4);
            break;
    }
    
    // Draw player outline
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(screenX, screenY, player.width, player.height);
    
    // Restore the canvas state
    ctx.restore();
}

// Draw UI
function drawUI() {
    if (gameState.isPaused) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#fff';
        ctx.font = '32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
        ctx.font = '16px Arial';
        ctx.fillText('Press ESC to resume', canvas.width / 2, canvas.height / 2 + 40);
    }
    
    // Draw coordinates
    ctx.fillStyle = '#fff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`X: ${Math.floor(gameState.player.x)}, Y: ${Math.floor(gameState.player.y)}`, 10, 20);
}

// Main game loop
function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update game state
    updatePlayer();
    updateCamera();
    
    // Draw everything with proper layering
    drawMap();
    drawMapOverlayBeforePlayer();
    drawPlayer();
    drawMapOverlayAfterPlayer(); // Draw structures that should appear in front of player
    drawUI();
    
    // Continue the loop
    requestAnimationFrame(gameLoop);
}

// Start the game
async function startGame() {
    try {
        console.log('Loading images...');
        await loadImages();
        console.log('Images loaded successfully!');
        
        // Start the game loop
        gameLoop();
        
        console.log('Pokemon Style Map Game Started!');
        console.log('Use WASD or Arrow Keys to move around');
        console.log('Press ESC to pause/unpause');
    } catch (error) {
        console.error('Error loading images:', error);
        // Start game anyway with fallback colors
        gameLoop();
        console.log('Game started with fallback graphics');
    }
}

// Initialize the game
startGame();

// Card Creator toggle logic
(function initCardCreatorToggle() {
    const toggleBtn = document.getElementById('cardCreatorToggle');
    const panel = document.getElementById('cardCreatorPanel');
    const closeBtn = document.getElementById('cardCreatorClose');

    if (!toggleBtn || !panel || !closeBtn) return;

    function openPanel() {
        panel.classList.add('open');
        panel.setAttribute('aria-hidden', 'false');
        toggleBtn.setAttribute('aria-expanded', 'true');
    }
    function closePanel() {
        panel.classList.remove('open');
        panel.setAttribute('aria-hidden', 'true');
        toggleBtn.setAttribute('aria-expanded', 'false');
    }
    function togglePanel() {
        const isOpen = panel.classList.contains('open');
        if (isOpen) closePanel(); else openPanel();
    }

    toggleBtn.addEventListener('click', togglePanel);
    closeBtn.addEventListener('click', closePanel);
})();
