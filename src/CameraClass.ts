import { Vec2 } from './VecClass';

// Represents the view of a grid.
// Controls where the grid is and how big it is on screen.
export class Camera {
  // Where the center of the camera is pointing.
  // Note: This is the position of the camera in the grid.
  pos: Vec2;
  // How many pixels a grid square takes up.
  _scale: number;

  // (min, max) for scale.
  scaleConstraints: Vec2;
  constructor(pos: Vec2 = new Vec2(0, 0), scale: number = 2) {
    this.pos = pos;
    this._scale = scale;
    this.scaleConstraints = new Vec2(1, 100);
  }

  set scale(newScale: number) {
    this._scale = newScale;
    if (this._scale < this.scaleConstraints.x)
      this._scale = this.scaleConstraints.x;
    if (this._scale > this.scaleConstraints.y)
      this._scale = this.scaleConstraints.y;
    if (this._scale == 0) this._scale = 1;
  }

  get scale(): number {
    return this._scale;
  }

  // In grid coordinates
  getTopLeft(screenSize: Vec2): Vec2 {
    const cameraTopLeft = this.pos.subtractVec(
      screenSize.divide(2 * this.scale)
    );
    return cameraTopLeft;
  }
}
