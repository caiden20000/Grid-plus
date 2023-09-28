import { normalizeCorners } from "./Utility";

// Represents a 2D vector. Used mainly for positional data.
export class Vec2 {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  clone(): Vec2 {
    const cloneVec = new Vec2(this.x, this.y);
    return cloneVec;
  }

  // Below functions do not modify the original, they return new vectors.

  multiply(num: number): Vec2 {
    const product = new Vec2(this.x * num, this.y * num);
    return product;
  }

  multiplyVec(vec: Vec2): Vec2 {
    const product = new Vec2(this.x * vec.x, this.y * vec.y);
    return product;
  }

  divide(num: number): Vec2 {
    const quotient = new Vec2(this.x / num, this.y / num);
    return quotient;
  }

  divideVec(vec: Vec2): Vec2 {
    const quotient = new Vec2(this.x / vec.x, this.y / vec.y);
    return quotient;
  }

  add(num: number): Vec2 {
    const sum = new Vec2(this.x + num, this.y + num);
    return sum;
  }

  addVec(vec: Vec2): Vec2 {
    const sum = new Vec2(this.x + vec.x, this.y + vec.y);
    return sum;
  }

  subtract(num: number): Vec2 {
    const difference = new Vec2(this.x - num, this.y - num);
    return difference;
  }

  subtractVec(vec: Vec2): Vec2 {
    const difference = new Vec2(this.x - vec.x, this.y - vec.y);
    return difference;
  }

  floor(): Vec2 {
    const flooredVec = new Vec2(Math.floor(this.x), Math.floor(this.y));
    return flooredVec;
  }

  shift(x: number, y: number): Vec2 {
    const shifted = new Vec2(this.x + x, this.y + y);
    return shifted;
  }

  toString(): string {
    const result = `(${this.x}, ${this.y})`;
    return result;
  }

  isEqual(vec: Vec2): boolean {
    return this.x == vec.x && this.y == vec.y;
  }

  static fromString(vecString: string): Vec2 {
    const numberArray = vecString.split(',');
    const newVec = new Vec2(
      parseInt(numberArray[0].slice(1)),
      parseInt(numberArray[1])
    );
    return newVec;
  }
}

export function getAreaAsArray(corner1: Vec2, corner2: Vec2): Vec2[] {
  const areaVecs = [];
  const normalized = normalizeCorners(corner1, corner2);
  const startCorner = normalized[0];
  const endCorner = normalized[1];

  const difference = endCorner.subtractVec(startCorner);
  let x = 0;
  let y = 0;
  do {
    x = 0;
    do {
      areaVecs.push(startCorner.shift(x, y));
      x++;
    } while (x <= difference.x);
    y++;
  } while (y <= difference.y);
  return areaVecs;
}

export function getAreaAround(
  pos: Vec2,
  distance: number,
  includeCenter: boolean = false
): Vec2[] {
  const vecs = [];
  // TODO
  for (let y = -distance; y <= distance; y++) {
    for (let x = -distance; x <= distance; x++) {
      if (y == 0 && x == 0 && includeCenter == false) continue;
      vecs.push(pos.shift(x, y));
    }
  }
  return vecs;
}
