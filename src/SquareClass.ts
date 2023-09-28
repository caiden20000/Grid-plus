import { Style } from './StyleClass';
import { Vec2 } from './VecClass';

// Represents an object on a grid.
// Does not store its own position.
export class Square {
  // The base square color
  style: Style;
  constructor(style: Style = new Style()) {
    this.style = style;
  }

  draw(ctx: CanvasRenderingContext2D, pos: Vec2, scale: number) {
    this.style.applyStyle(ctx);
    ctx.fillRect(pos.x, pos.y, scale, scale);
    this.style.revertStyle(ctx);
  }
}
