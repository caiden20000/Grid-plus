import { clamp, lerp } from './Utility';

export class Color {
  // [0, 255]
  r: number;
  g: number;
  b: number;

  constructor(r: number, g: number, b: number) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  clone(): Color {
    const clonedColor = new Color(this.r, this.g, this.b);
    return clonedColor;
  }

  toHex(addHash: boolean = true): string {
    const rHex = this.r.toString(16);
    const gHex = this.g.toString(16);
    const bHex = this.b.toString(16);
    const combinedValues = (addHash ? '#' : '') + rHex + gHex + bHex;
    return combinedValues;
  }

  static fromHex(hexString: string): Color {
    hexString = hexString.trim();
    if (hexString.at(0) == '#') hexString = hexString.slice(1);
    const rHex = hexString.slice(0, 2);
    const gHex = hexString.slice(2, 4);
    const bHex = hexString.slice(4, 6);
    const r = parseInt(rHex, 16);
    const g = parseInt(gHex, 16);
    const b = parseInt(bHex, 16);
    const newColor = new Color(r, g, b);
    return newColor;
  }

  ////////////
  // Below utility functions do not modify the object
  // Instead, they return a new object.

  // Internal utility function to apply a function to all components.
  _map(func: (value: number) => number): Color {
    const newColor = new Color(0, 0, 0);
    newColor.r = func(this.r);
    newColor.g = func(this.g);
    newColor.b = func(this.b);
    return newColor;
  }

  clamp(min: number = 0, max: number = 255): Color {
    const clampedColor = this._map((x) => clamp(x, 0, 255));
    return clampedColor;
  }

  floor(): Color {
    const flooredColor = this._map((x) => Math.floor(x));
    return flooredColor;
  }

  ceil(): Color {
    const ceiledColor = this._map((x) => Math.ceil(x));
    return ceiledColor;
  }

  add(num: number): Color {
    const sumColor = this._map((x) => x + num);
    return sumColor;
  }

  multiply(num: number): Color {
    const productColor = this._map((x) => x * num);
    return productColor;
  }

  mix(blendColor: Color, ratio: number = 0.5): Color {
    const rMix = lerp(this.r, blendColor.r, ratio);
    const gMix = lerp(this.g, blendColor.g, ratio);
    const bMix = lerp(this.b, blendColor.b, ratio);
    const mixedColor = new Color(rMix, gMix, bMix);
    return mixedColor;
  }

  // Static predefined colors
  static RED = () => new Color(255, 0, 0);
  static GREEN = () => new Color(0, 255, 0);
  static BLUE = () => new Color(0, 0, 255);
  static WHITE = () => new Color(255, 255, 255);
  static BLACK = () => new Color(0, 0, 0);
}
