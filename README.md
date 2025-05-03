# Langton's Ant Simulation

A simple HTML/CSS/JavaScript implementation of Langton's Ant cellular automaton with customizable rules.

## What is Langton's Ant?

Langton's Ant is a cellular automaton consisting of an "ant" moving on a grid of cells that can be either "on" (black) or "off" (white). The ant follows these simple rules:

1. At a white square, turn 90° clockwise, flip the color of the square, move forward one unit
2. At a black square, turn 90° counter-clockwise, flip the color of the square, move forward one unit

Despite its simple ruleset, Langton's Ant produces complex, emergent behavior.

## Features

- Visual grid-based simulation of Langton's Ant
- Controls to start, pause, and reset the simulation
- Speed slider to adjust the simulation speed
- Responsive design that works on different screen sizes
- Customization options for the simulation rules:
  - Change the ant color
  - Modify turn behavior on white/black cells
  - Enable multi-color mode with up to 8 different cell states
  - Randomize all settings with a single click

## How to Use

1. Open `index.html` in a web browser
2. Use the buttons to control the simulation:
   - **Start**: Begin the simulation
   - **Pause**: Pause the simulation
   - **Reset**: Reset the grid and ant position
3. Adjust the speed slider to control how fast the ant moves

### Customizing the Simulation

1. Click the "Customize" tab in the top right
2. Modify the simulation rules:
   - **Ant Color**: Change the color of the ant
   - **On White**: Change what the ant does when it encounters a white cell
   - **On Black**: Change what the ant does when it encounters a black cell
   - **Multi-Color Mode**: Enable to use more than just black and white states
   - **Number of Colors**: In multi-color mode, set how many different colors/states to use
3. Click "Apply" to update the simulation with your new rules
4. Click "Randomize" to generate a random set of rules and create unique patterns

## Implementation Details

- The grid is represented as a 2D array where cells can have multiple states (0, 1, 2, etc.)
- The ant is represented by its position (x, y) and direction (0: up, 1: right, 2: down, 3: left)
- The simulation wraps around the edges of the grid, creating a toroidal topology
- In multi-color mode, the cell cycles through multiple states instead of just flipping between black and white 