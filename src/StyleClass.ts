import { Color } from './ColorClass';

type Shadow = {
  blur: number;
  color: string;
  offsetX: number;
  offsetY: number;
};

// Class to represent the styles of drawing on a canvas.
// Includes functions to set and undo a style.
export class Style {
  fillColor: Color;
  strokeColor: Color;
  oldFillColor: string | CanvasGradient | CanvasPattern | undefined;
  oldStrokeColor: string | CanvasGradient | CanvasPattern | undefined;
  shadow: Shadow | undefined;
  oldShadow: Shadow | undefined;
  constructor(
    fillColor: Color = Color.RED(),
    strokeColor?: Color,
    shadow?: Shadow | undefined
  ) {
    this.fillColor = fillColor;
    this.strokeColor = strokeColor ?? fillColor;
    this.shadow = shadow;
  }

  static WHITE = () => new Style(Color.WHITE(), Color.WHITE());
  static BLACK = () => new Style(Color.BLACK(), Color.BLACK());

  applyStyle(ctx: CanvasRenderingContext2D) {
    this.oldFillColor = ctx.fillStyle;
    this.oldStrokeColor = ctx.strokeStyle;
    ctx.fillStyle = this.fillColor.toHex(true);
    ctx.strokeStyle = this.strokeColor.toHex(true);

    if (this.shadow) {
      this.oldShadow = {
        blur: ctx.shadowBlur,
        color: ctx.shadowColor,
        offsetX: ctx.shadowOffsetX,
        offsetY: ctx.shadowOffsetY,
      };
      ctx.shadowBlur = this.shadow.blur;
      ctx.shadowColor = this.shadow.color;
      ctx.shadowOffsetX = this.shadow.offsetX;
      ctx.shadowOffsetY = this.shadow.offsetY;
    }
  }

  revertStyle(ctx: CanvasRenderingContext2D) {
    if (this.oldFillColor) ctx.fillStyle = this.oldFillColor;
    if (this.oldStrokeColor) ctx.strokeStyle = this.oldStrokeColor;

    if (this.oldShadow) {
      ctx.shadowBlur = this.oldShadow.blur;
      ctx.shadowColor = this.oldShadow.color;
      ctx.shadowOffsetX = this.oldShadow.offsetX;
      ctx.shadowOffsetY = this.oldShadow.offsetY;
    }
  }
}
