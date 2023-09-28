// Utility functions to easily integrate controls to a canvas.

import { Camera } from './CameraClass';
import { Grid } from './GridClass';
import { Square } from './SquareClass';
import { Vec2 } from './VecClass';

type GridControlOptions = {};

const defaultOptions: GridControlOptions = {};

export function applyMouseCameraControls(
  canvas: HTMLElement,
  camera: Camera,
  options: GridControlOptions = defaultOptions
) {
  // Prevent context menu on right click
  canvas.addEventListener('contextmenu', (event) => {
    event.preventDefault();
  });

  // Prevent middle click scroll circle
  canvas.addEventListener('mousedown', (event) => {
    if (event.buttons == 4) event.preventDefault();
  });

  // Mouse dragging view (middle click or left click + shift)
  canvas.addEventListener('mousemove', (event) => {
    mouseDragCamera(event, camera);
  });

  // Zooming in/out of the canvas
  canvas.addEventListener('wheel', (event) => {
    event.preventDefault();
    mouseScrollZoomCamera(event, camera);
  });
}

// Bind to "mousemove" event
export function mouseDragCamera(event: MouseEvent, camera: Camera) {
  if (event.buttons == 4 || (event.buttons == 1 && event.shiftKey)) {
    // Middle click
    const deltaMovement = new Vec2(event.movementX, event.movementY);
    const deltaGridMovement = deltaMovement.divide(camera.scale);
    camera.pos = camera.pos.subtractVec(deltaGridMovement);
  }
}

// bind to "wheel" event
export function mouseScrollZoomCamera(
  event: WheelEvent,
  camera: Camera,
  zoomRatio: number = 0.005
) {
  // Amount of scroll input from browser
  const scrollAmount = event.deltaY;
  // Linear amount to change the camera scale
  let deltaScale = scrollAmount * -1;
  // Prevent feeling like zoom slows down when zoomed in
  // and speeds up when zooming out by making it depend on the current scale
  const exponentialZoomRatio = 50;
  deltaScale += camera.scale * exponentialZoomRatio * Math.sign(deltaScale);
  camera.scale += deltaScale * zoomRatio;
}

type MousePlacementOptions = {
  additiveButtons?: number[];
  subtractiveButtons?: number[];
  disableOnShift?: boolean;
};

// Passes Vec2's to callback function so you can use it for other grid systems.
// Second callback argument is true for adding, false for subtracting.
// callback(gridPosition: Vec2, adding: boolean);
export function abstractPlacement(
  event: MouseEvent,
  grid: Grid,
  screenSize: Vec2,
  camera: Camera,
  callback: (gridPos: Vec2, adding: boolean) => void,
  options: MousePlacementOptions | undefined = undefined
) {
  // Typescript doesn't like this version.
  // options = {
  //   additiveButtons: options?.additiveButtons ?? [1],
  //   subtractiveButtons: options?.subtractiveButtons ?? [2],
  //   disableOnShift: options?.disableOnShift ?? true,
  // };
  if (options == undefined) options = {};
  if (options.additiveButtons == undefined) options.additiveButtons = [1];
  if (options.subtractiveButtons == undefined) options.subtractiveButtons = [2];
  if (options.disableOnShift == undefined) options.disableOnShift == true;
  if (
    options.additiveButtons
      .concat(options.subtractiveButtons)
      .includes(event.buttons)
  ) {
    const clickPos = new Vec2(event.offsetX, event.offsetY);
    const gridPos = grid.screenPosToGridPos(clickPos, screenSize, camera);
    // If left click + drag, place square
    if (
      options.additiveButtons.includes(event.buttons) &&
      (event.shiftKey && options.disableOnShift) == false
    ) {
      callback(gridPos, true);
    }
    // If right click + drag, remove square
    if (options.subtractiveButtons.includes(event.buttons)) {
      callback(gridPos, false);
    }
  }
}

export function squarePlacement(
  event: MouseEvent,
  grid: Grid,
  screenSize: Vec2,
  camera: Camera,
  square: Square = new Square(),
  options: MousePlacementOptions | undefined = undefined
) {
  abstractPlacement(
    event,
    grid,
    screenSize,
    camera,
    (gridPos, adding) => {
      const insertingObject = adding ? square : undefined;
      grid.setSquare(gridPos, insertingObject);
    },
    options
  );
}

export function applyPlacementControls(
  canvas: HTMLElement,
  grid: Grid,
  screenSize: Vec2,
  camera: Camera,
  callback: (gridPos: Vec2, adding: boolean) => void,
  options: MousePlacementOptions | undefined = undefined
) {
  const mousePlacement = (event: MouseEvent) => {
    abstractPlacement(event, grid, screenSize, camera, callback, options);
  };
  canvas.addEventListener('mousemove', mousePlacement);
  canvas.addEventListener('mousedown', mousePlacement);
}
