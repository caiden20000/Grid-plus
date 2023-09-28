import { Square } from './SquareClass';
import { Vec2 } from './VecClass';
import { Camera } from './CameraClass';
import { Style } from './StyleClass';

interface Drawable {
  draw(ctx: CanvasRenderingContext2D): void;
}

// Graphical grid on a canvas.
// Grid coordinates start at 0, 0 for top left square.
export class Grid {
  // Map of Square objects on the grid.
  squares: Map<string, Square | undefined>;
  style: Style;
  lineWidth: number;
  constructor(style?: Style, lineWidth: number = 0.5) {
    this.squares = new Map();
    this.style = style ?? Style.BLACK();
    this.lineWidth = lineWidth;
  }

  clearGrid() {
    this.squares = new Map();
  }

  setSquare(pos: Vec2, square: Square | undefined): boolean {
    this.squares.set(this._posToKey(pos), square);
    return true;
  }

  getSquare(pos: Vec2): Square | undefined {
    const square = this.squares.get(this._posToKey(pos));
    return square;
  }

  // Returns the grid square that corrosponds to the position on screen.
  screenPosToGridPos(screenPos: Vec2, screenSize: Vec2, camera: Camera): Vec2 {
    // camera.pos is the _center_ of the viewport
    const cameraTopLeft = camera.getTopLeft(screenSize);
    const normalGridPos = screenPos.divide(camera.scale);
    const offsetGridPos = normalGridPos.addVec(cameraTopLeft);
    const flooredResult = offsetGridPos.floor();
    return flooredResult;
  }

  // We cannot use Vec2 directly for map key,
  // each Object has unique hash.
  _posToKey(pos: Vec2): string {
    //const key = `${pos.x},${pos.y}`;
    const key = pos.toString();
    return key;
  }

  _keyToPos(key: string): Vec2 {
    // const numberArray = key.split(',');
    // const pos = new Vec2(parseInt(numberArray[0]), parseInt(numberArray[1]));
    const pos = Vec2.fromString(key);
    return pos;
  }
  // TODO: Camera means center of screen, not top left corner
  // Change all rendering to adhere to that fact.

  drawGrid(
    ctx: CanvasRenderingContext2D,
    screenSize: Vec2,
    camera: Camera,
    lineWidth: number = this.lineWidth
  ): void {
    const oldLineWidth = ctx.lineWidth;
    const lineWidthScaleRatio = 0.02;
    const additionalLineWidth = camera.scale * lineWidthScaleRatio;
    ctx.lineWidth = lineWidth + additionalLineWidth;

    // camera.pos is the _center_ of the viewport
    // the top left of the camera is what's important for us
    const cameraTopLeft = camera.getTopLeft(screenSize);

    // Scale of camera determines grid square size
    // Grid square size == distance between grid lines
    const numberOfVerticalLines = screenSize.x / camera.scale + 1;
    const numberOfHorizontalLines = screenSize.y / camera.scale + 1;
    // Grid lines must start somewhere, use modulo to determine offset
    // Set negative because positive camera position == shifting the grid the other way.
    // % 1 because camera.position is a GRID position,
    //  +1 position == +1 square, which is cycle repeating.
    const verticalLineOffset = (cameraTopLeft.x % 1) * -camera.scale;
    const horizontalLineOffset = (cameraTopLeft.y % 1) * -camera.scale;

    this.style.applyStyle(ctx);

    for (let i = 0; i < numberOfVerticalLines; i++) {
      this._drawVerticalLine(
        ctx,
        screenSize,
        i * camera.scale + verticalLineOffset
      );
    }

    for (let i = 0; i < numberOfHorizontalLines; i++) {
      this._drawHorizontalLine(
        ctx,
        screenSize,
        i * camera.scale + horizontalLineOffset
      );
    }

    this.style.revertStyle(ctx);
    ctx.lineWidth = oldLineWidth;
  }

  drawSquares(ctx: CanvasRenderingContext2D, screenSize: Vec2, camera: Camera) {
    // padding is for culling, how many grid pos out of screen to still draw
    const padding = 1;
    const cameraTopLeft = camera.getTopLeft(screenSize);
    const cameraBottomRight = cameraTopLeft.addVec(
      screenSize.divide(camera.scale)
    );
    // TODO: Culling
    for (const entry of this.squares.entries()) {
      const square = entry[1];
      if (square == undefined) continue;
      const pos = this._keyToPos(entry[0]);
      // Culling: If square is off screen, don't draw it.
      if (
        pos.x < cameraTopLeft.x - padding ||
        pos.x > cameraBottomRight.x + padding ||
        pos.y < cameraTopLeft.y - padding ||
        pos.y > cameraBottomRight.y + padding
      ) {
        continue;
      }
      //if (this.isPosOnScreen(pos, screenSize, camera) == false) continue;
      const drawPos = pos.subtractVec(cameraTopLeft).multiply(camera.scale);
      square.draw(ctx, drawPos, camera.scale);
    }
  }

  // Instead of iterating through all the squares to see whether or not we should cull then,
  // wouldn't it be nice if we conveniently had a hashmap of their positions?
  // Wouldn't it?
  // I came up with this "algorithm" after running an exponential model in GOL.
  // I figured the thousands of squares outside the camera were slowing the sim down.
  // After implementing this, I realized how *IN*efficient this is for most cases.
  // changed name: drawSquaresEfficiently() -> drawSquaresLessEfficiently()
  drawSquaresLessEfficiently(
    ctx: CanvasRenderingContext2D,
    screenSize: Vec2,
    camera: Camera
  ) {
    const padding = 1;
    const cameraTopLeft = camera.getTopLeft(screenSize);
    const cameraBottomRight = cameraTopLeft.addVec(
      screenSize.divide(camera.scale)
    );

    for (
      let x = cameraTopLeft.x - padding;
      x < cameraBottomRight.x + padding;
      x++
    ) {
      for (
        let y = cameraTopLeft.y - padding;
        y < cameraBottomRight.y + padding;
        y++
      ) {
        const pos = new Vec2(x, y);
        const square = this.getSquare(pos);
        if (square) {
          const drawPos = pos.subtractVec(cameraTopLeft).multiply(camera.scale);
          square.draw(ctx, drawPos, camera.scale);
        }
      }
    }
  }

  isPosOnScreen(pos: Vec2, screenSize: Vec2, camera: Camera): boolean {
    const padding = 1;
    const cameraTopLeft = camera.getTopLeft(screenSize);
    const cameraBottomRight = cameraTopLeft.addVec(
      screenSize.divide(camera.scale)
    );
    if (
      pos.x < cameraTopLeft.x - padding ||
      pos.x > cameraBottomRight.x + padding
    )
      return false;
    if (
      pos.y < cameraTopLeft.y - padding ||
      pos.y > cameraBottomRight.y + padding
    )
      return false;
    return true;
  }

  _drawLine(ctx: CanvasRenderingContext2D, startPos: Vec2, endPos: Vec2) {
    ctx.beginPath();
    ctx.moveTo(startPos.x, startPos.y);
    ctx.lineTo(endPos.x, endPos.y);
    ctx.closePath();
    ctx.stroke();
  }

  _drawHorizontalLine(
    ctx: CanvasRenderingContext2D,
    screenSize: Vec2,
    yPos: number
  ) {
    this._drawLine(ctx, new Vec2(0, yPos), new Vec2(screenSize.x, yPos));
  }

  _drawVerticalLine(
    ctx: CanvasRenderingContext2D,
    screenSize: Vec2,
    xPos: number
  ) {
    this._drawLine(ctx, new Vec2(xPos, 0), new Vec2(xPos, screenSize.y));
  }
}
