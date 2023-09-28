// Conway's Game Of Life
// This Code Not Property of Conway

// This module binds controls and rendering to a generated canvas inside a given HTML element.
// Bind by supplying the parent element's ID to initGame: initGame('some-id-name');
// Controls for the game are:
//    Left click: place cell
//    Right click: destroy cell
//    Scroll wheel: zoom in/out
//    Middle click + drag: Drag camera around
//    Left click + shift + drag: Drag camera around
//    Space: Step the simulation forward in time
//    Left Arrow key: Step the simunation back in time
//    Right Arrow key: Fast-forward the simulation.

// Import stylesheets
import { Camera } from './CameraClass';
import { Vec2 } from './VecClass';
import { Square } from './SquareClass';
import {
  abstractPlacement,
  applyMouseCameraControls,
  applyPlacementControls,
} from './Interactions';
import { Style } from './StyleClass';
import { Color } from './ColorClass';
import { Grid } from './GridClass';
import * as GOL from './GOL';

var globalNumberOfGOLInstances = 0;

export function initGame(appId: string) {
  const appDiv: HTMLElement = document.getElementById(appId) as HTMLElement;
  const canvasID = 'gol-canvas' + globalNumberOfGOLInstances;
  appDiv.innerHTML = `
  <div id="${canvasID}-container" style="width:100%;height:100%;">
  <canvas id="${canvasID}" tabindex="0"></canvas>
  </div>`;
  const canvasContainer = document.getElementById(canvasID + '-container') as HTMLElement;
  const canvas = document.getElementById(canvasID) as HTMLCanvasElement;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  globalNumberOfGOLInstances++;

  // Get canvas height & width from parent container
  const screenSize = new Vec2(
    canvasContainer.clientWidth,
    canvasContainer.clientHeight
  );
  canvas.height = screenSize.y;
  canvas.width = screenSize.x;
  canvas.style.border = '1px solid black';
  canvas.style.background = 'black';

  // Some constants
  const simSpeed = 2; // ms per step
  const fps = 60; // frams per second

  // Main objects for the scene
  let grid = new Grid();
  let GOLMap: GOL.TileMap = new Map();
  const camera = new Camera();

  const whiteSquareWithGlow = new Style(Color.WHITE(), Color.WHITE(), {
    blur: 5,
    color: '#FFFFFF',
    offsetX: 0,
    offsetY: 0,
  });
  const whiteSquareWithoutGlow = new Style(Color.WHITE(), Color.WHITE());

  // Glow square uses shadows
  // Shadows seem to make very laggy when many squares.
  // Only choose glowy squares if you really like it
  const defaultSquareStyle = whiteSquareWithoutGlow;

  // TODO: Why does multiplying by 0.5 result in black?
  grid.style = new Style(Color.WHITE().multiply(0.6));
  grid.lineWidth = 0.04;

  const universe = new GOL.UniverseHistory(100, false);
  let hasBeenModifiedThisStep = false;

  /////
  // Add event listeners
  ////////////

  applyPlacementControls(
    canvas,
    grid,
    screenSize,
    camera,
    (gridPos, adding) => {
      hasBeenModifiedThisStep = true;
      const square = new Square(defaultSquareStyle);
      grid.setSquare(gridPos, adding ? square : undefined);
      GOL.smartSet(GOLMap, gridPos, adding);
    }
  );

  applyMouseCameraControls(canvas, camera);

  const stepMap = function () {
    if (hasBeenModifiedThisStep) {
      universe.setNow(GOLMap);
      // Changing the present changes the future
      universe.destroyFuture();
      // If modified, have to generate new future from scratch
      GOLMap = universe.step();
    } else {
      // If mas is unmodified and in the past, just load predetermined future
      GOLMap = universe.stepOrTravel();
    }
    hasBeenModifiedThisStep = false;
  };

  const reverseStepMap = function () {
    if (hasBeenModifiedThisStep) universe.setNow(GOLMap);
    GOLMap = universe.timeTravel(-1);
    hasBeenModifiedThisStep = false;
  };

  const keyMap: Map<string, boolean> = new Map();
  canvas.addEventListener('keydown', (event) => keyMap.set(event.key, true));
  canvas.addEventListener('keyup', (event) => keyMap.set(event.key, false));
  // For fast stepping
  setInterval(() => {
    if (keyMap.get('ArrowRight')) stepMap();
    //if (keyMap.get('ArrowLeft')) reverseStepMap();
  }, simSpeed);

  // For single stepping
  canvas.addEventListener('keydown', (event) => {
    if (event.key == ' ') {
      // Prevent scrolling down the page on space press
      event.preventDefault();
      stepMap();
    }

    if (event.key == 'ArrowRight') event.preventDefault();
    if (event.key == 'ArrowLeft') {
      event.preventDefault();
      reverseStepMap();
    }
  });

  camera.scale = 15;
  setInterval(() => {
    clearCanvas(ctx, screenSize);
    grid.clearGrid();
    mapToGrid(GOLMap, grid, new Square(defaultSquareStyle));
    grid.drawGrid(ctx, screenSize, camera);
    grid.drawSquares(ctx, screenSize, camera);
  }, 1000 / fps);
}

function clearCanvas(ctx: CanvasRenderingContext2D, screenSize: Vec2) {
  ctx.clearRect(0, 0, screenSize.x, screenSize.y);
}

function mapToGrid(map: GOL.TileMap, grid: Grid, square: Square) {
  for (const tile of map.values()) {
    grid.setSquare(tile.pos, tile.active ? square : undefined);
  }
}
