// Canvas setup
const canvas = document.getElementById('grid');
const ctx = canvas.getContext('2d');

// Controls
const speedSlider = document.getElementById('speed');
const speedValueDisplay = document.getElementById('speed-value');
const turboIndicator = document.getElementById('turbo-indicator');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');

// Tab controls
const tabButtons = document.querySelectorAll('.tab-btn');
const panels = document.querySelectorAll('.panel');

// Customize controls
const antColorPicker = document.getElementById('ant-color');
const whiteDirectionSelect = document.getElementById('white-direction');
const blackDirectionSelect = document.getElementById('black-direction');
const multiColorCheckbox = document.getElementById('multi-color');
const colorCountSlider = document.getElementById('color-count');
const colorCountValue = document.getElementById('color-count-value');
const randomizeButton = document.getElementById('randomize');
const applyButton = document.getElementById('apply');
const colorCountContainer = document.getElementById('color-count-container');

// Grid parameters
const cellSize = 8; // Smaller cell size for more cells on screen
let columns, rows;
let grid = [];

// Ant parameters
let antX, antY;
let antDirection = 0; // 0: up, 1: right, 2: down, 3: left
let antColor = '#FF0000';

// Rules parameters
let rules = {
    white: 'right', // turn right on white
    black: 'left',  // turn left on black
    multiColor: false,
    colorCount: 2,
    colors: ['white', 'black']
};

// Color palette for multi-color mode - modified to have white be the colored state
const colorPalette = [
    '#FFFFFF', // white (0) - background
    '#000000', // black (1) - now white in the UI
    '#FF0000', // red (2)
    '#00FF00', // green (3)
    '#0000FF', // blue (4)
    '#FFFF00', // yellow (5)
    '#FF00FF', // magenta (6)
    '#00FFFF'  // cyan (7)
];

// For inverted display - what we display for each state
const displayColors = [
    '#FFFFFF', // display color for state 0 (empty/background)
    '#FFFFFF', // display color for state 1 (filled)
    '#FF0000', // display color for state 2
    '#00FF00', // display color for state 3
    '#0000FF', // display color for state 4
    '#FFFF00', // display color for state 5
    '#FF00FF', // display color for state 6
    '#00FFFF'  // display color for state 7
];

const turnDirections = {
    'right': 1,    // 90° clockwise
    'left': 3,     // 90° counter-clockwise (same as -1 mod 4)
    '180': 2,      // 180°
    'none': 0      // no turn
};

// Animation
let animationId = null;
let speed = 20; // ms per step
let turboMode = false; // For extremely high speeds
let stepsPerFrame = 1; // Steps to calculate per animation frame

// Initialize
function init() {
    // Set canvas size to fill the window
    resizeCanvas();
    
    // Calculate grid dimensions
    columns = Math.floor(canvas.width / cellSize);
    rows = Math.floor(canvas.height / cellSize);
    
    // Create grid (0 = empty initially)
    if (rules.multiColor) {
        grid = Array(rows).fill().map(() => Array(columns).fill(0));
    } else {
        grid = Array(rows).fill().map(() => Array(columns).fill(0));
    }
    
    // Place ant in the center
    antX = Math.floor(columns / 2);
    antY = Math.floor(rows / 2);
    
    // Reset direction
    antDirection = 0;
    
    // Initial draw
    drawGrid();
    drawAnt();
    
    // Update UI
    updateCustomizeUI();
}

// Resize canvas to fill the window
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Draw the grid
function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (rules.multiColor) {
        // Multi-color mode
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < columns; x++) {
                const colorIndex = grid[y][x] % rules.colorCount;
                if (colorIndex > 0) { // Skip white/empty (0)
                    ctx.fillStyle = displayColors[colorIndex];
                    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
                }
            }
        }
    } else {
        // Binary mode (black and white - now inverted to white for filled cells)
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < columns; x++) {
                if (grid[y][x] === 1) {
                    ctx.fillStyle = displayColors[1]; // Use white for filled cells
                    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
                }
            }
        }
    }
}

// Draw the ant
function drawAnt() {
    ctx.fillStyle = antColor;
    ctx.fillRect(antX * cellSize, antY * cellSize, cellSize, cellSize);
}

// Update ant's position and direction based on customized rules
function updateAnt() {
    // Get current cell state
    const currentCellState = grid[antY][antX];
    
    if (rules.multiColor) {
        // Multi-color mode: Increment the cell state
        grid[antY][antX] = (currentCellState + 1) % rules.colorCount;
        
        // Turn based on the current cell state
        // For multi-color, we'll use a simple algorithm: 
        // Even states turn right, odd states turn left
        const turn = currentCellState % 2 === 0 ? turnDirections['right'] : turnDirections['left'];
        antDirection = (antDirection + turn) % 4;
    } else {
        // Binary mode (traditional Langton's Ant)
        if (currentCellState === 0) { // White
            // Apply white rule
            antDirection = (antDirection + turnDirections[rules.white]) % 4;
        } else { // Black
            // Apply black rule
            antDirection = (antDirection + turnDirections[rules.black]) % 4;
        }
        
        // Flip the cell state (0 → 1, 1 → 0)
        grid[antY][antX] = 1 - currentCellState;
    }
    
    // Move forward
    switch (antDirection) {
        case 0: // Up
            antY = (antY - 1 + rows) % rows;
            break;
        case 1: // Right
            antX = (antX + 1) % columns;
            break;
        case 2: // Down
            antY = (antY + 1) % rows;
            break;
        case 3: // Left
            antX = (antX - 1 + columns) % columns;
            break;
    }
}

// Animation step
function step() {
    // Calculate steps per frame based on speed
    if (speed > 200) {
        // Turbo mode: Do multiple updates per frame
        turboMode = true;
        stepsPerFrame = Math.floor((speed - 200) / 10) + 1; // Calculate based on speed
        
        // Cap to a reasonable maximum
        stepsPerFrame = Math.min(stepsPerFrame, 100);
        
        // Do multiple updates per frame
        for (let i = 0; i < stepsPerFrame; i++) {
            updateAnt();
        }
        drawGrid();
        drawAnt();
        
        // Use requestAnimationFrame for smoother animation at high speeds
        animationId = requestAnimationFrame(step);
    } else {
        // Normal mode: One update per setTimeout
        turboMode = false;
        stepsPerFrame = 1;
        
        updateAnt();
        drawGrid();
        drawAnt();
        
        // Schedule next update based on speed
        const delay = Math.floor(1000 / parseInt(speed));
        animationId = setTimeout(step, delay);
    }
}

// Tab switching
function switchTab(event) {
    const tabName = event.target.getAttribute('data-tab');
    
    // Update active tab button
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Show selected panel, hide others
    panels.forEach(panel => {
        if (panel.id === `${tabName}-panel`) {
            panel.classList.remove('hidden');
        } else {
            panel.classList.add('hidden');
        }
    });
}

// Update UI based on current rules
function updateCustomizeUI() {
    antColorPicker.value = antColor;
    whiteDirectionSelect.value = rules.white;
    blackDirectionSelect.value = rules.black;
    multiColorCheckbox.checked = rules.multiColor;
    colorCountSlider.value = rules.colorCount;
    colorCountValue.textContent = rules.colorCount;
    
    // Show/hide color count options based on multi-color mode
    colorCountContainer.style.display = rules.multiColor ? 'flex' : 'none';
}

// Apply customization changes
function applyChanges() {
    antColor = antColorPicker.value;
    rules.white = whiteDirectionSelect.value;
    rules.black = blackDirectionSelect.value;
    rules.multiColor = multiColorCheckbox.checked;
    rules.colorCount = parseInt(colorCountSlider.value);
    
    // Update UI
    colorCountContainer.style.display = rules.multiColor ? 'flex' : 'none';
    
    // Reset simulation with new rules
    if (animationId) {
        if (turboMode) {
            cancelAnimationFrame(animationId);
        } else {
            clearTimeout(animationId);
        }
        animationId = null;
    }
    init();
}

// Randomize rules
function randomizeRules() {
    // Random ant color
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    antColorPicker.value = randomColor;
    antColor = randomColor;
    
    // Random turn directions
    const directions = ['right', 'left', '180', 'none'];
    rules.white = directions[Math.floor(Math.random() * directions.length)];
    rules.black = directions[Math.floor(Math.random() * directions.length)];
    
    // Random multi-color mode
    rules.multiColor = Math.random() > 0.5;
    
    // Random color count if in multi-color mode
    if (rules.multiColor) {
        rules.colorCount = Math.floor(Math.random() * 7) + 2; // 2 to 8 colors
    }
    
    // Update UI
    updateCustomizeUI();
    
    // Apply changes
    applyChanges();
}

// Event Listeners
startButton.addEventListener('click', () => {
    if (!animationId) {
        step();
    }
});

pauseButton.addEventListener('click', () => {
    if (animationId) {
        if (turboMode) {
            cancelAnimationFrame(animationId);
        } else {
            clearTimeout(animationId);
        }
        animationId = null;
    }
});

resetButton.addEventListener('click', () => {
    if (animationId) {
        if (turboMode) {
            cancelAnimationFrame(animationId);
        } else {
            clearTimeout(animationId);
        }
        animationId = null;
    }
    init();
});

speedSlider.addEventListener('input', () => {
    speed = parseInt(speedSlider.value);
    speedValueDisplay.textContent = speed;
    
    // Show/hide turbo indicator
    if (speed > 200) {
        turboIndicator.classList.remove('hidden');
    } else {
        turboIndicator.classList.add('hidden');
    }
    
    // If animation is running, it will adjust on next step automatically
});

// Tab event listeners
tabButtons.forEach(button => {
    button.addEventListener('click', switchTab);
});

// Customize controls event listeners
multiColorCheckbox.addEventListener('change', () => {
    colorCountContainer.style.display = multiColorCheckbox.checked ? 'flex' : 'none';
});

colorCountSlider.addEventListener('input', () => {
    colorCountValue.textContent = colorCountSlider.value;
});

applyButton.addEventListener('click', applyChanges);
randomizeButton.addEventListener('click', randomizeRules);

// Handle window resize
window.addEventListener('resize', () => {
    resizeCanvas();
    // Recalculate grid dimensions and recreate grid (preserving existing pattern if possible)
    const oldColumns = columns;
    const oldRows = rows;
    const oldGrid = [...grid];
    
    columns = Math.floor(canvas.width / cellSize);
    rows = Math.floor(canvas.height / cellSize);
    
    // Create new grid
    grid = Array(rows).fill().map(() => Array(columns).fill(0));
    
    // Copy over existing data where possible
    const minRows = Math.min(oldRows, rows);
    const minCols = Math.min(oldColumns, columns);
    
    for (let y = 0; y < minRows; y++) {
        for (let x = 0; x < minCols; x++) {
            if (oldGrid[y] && oldGrid[y][x] !== undefined) {
                grid[y][x] = oldGrid[y][x];
            }
        }
    }
    
    // Make sure ant is still in bounds
    antX = Math.min(antX, columns - 1);
    antY = Math.min(antY, rows - 1);
    
    // Redraw
    drawGrid();
    drawAnt();
});

// Initialize on load
window.addEventListener('load', init); 