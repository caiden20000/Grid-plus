import { Vec2 } from './VecClass';

export function clamp(num: number, min: number, max: number): number {
  const clampedNumber = Math.max(Math.min(max, num), min);
  return clampedNumber;
}

// Linear interpolation between x and y.
// If t=0, then lerp = x. If t=1, then lerp = y.
export function lerp(x: number, y: number, t: number): number {
  // const difference = y - x;
  // const increase = difference * t;
  // const result = x + increase;
  // return result;
  return x + (y - x) * t;
}

// Random number in range [min, max], inclusive.
export function random(min: number, max: number): number {
  return Math.round(Math.random() * (max - min) + min);
}

export function normalizeCorners(corner1: Vec2, corner2: Vec2): Vec2[] {
  const minX = Math.min(corner1.x, corner2.x);
  const minY = Math.min(corner1.y, corner2.y);
  const maxX = Math.max(corner1.x, corner2.x);
  const maxY = Math.max(corner1.y, corner2.y);
  const smallerCorner = new Vec2(minX, minY);
  const largerCorner = new Vec2(maxX, maxY);
  return [smallerCorner, largerCorner];
}
