// Module specifically for Game Of Life (GOL) functions and types
// Usage: Use a TileMap to represent the universe state.
//        Insert tiles with smartSet() only
//        Use stepMap() to increment time.

import { clamp } from './Utility';
import { getAreaAround, Vec2 } from './VecClass';

export type Tile = {
  active: boolean;
  neighbors: number;
  pos: Vec2;
};

export type TileMap = Map<string, Tile>;

// If tile has neighbor count NOT in survive[], tile dies.
// if tile has neighbor count in birth, tile becomes alive.
export type Ruleset = {
  survive: number[];
  birth: number[];
};

// Conway's Game of Life ruleset, the most well known.
export const CGOL_RULESET = {
  survive: [2, 3],
  birth: [3],
};

// Explicitly for internal use. Sets a value in map.
function _setTile(map: TileMap, pos: Vec2, tile: Tile): void {
  map.set(pos.toString(), tile);
}

// Returns a tile from specified TileMap.
// Returns undefined if there is no data stored at that position.
export function getTile(map: TileMap, pos: Vec2): Tile | undefined {
  return map.get(pos.toString());
}

// Internal use. Gets the numerical difference representing a boolean change.
function _getChangeNumber(current: boolean, newActive: boolean): number {
  if (current == newActive) return 0;
  if (current == false) return 1;
  return -1;
}

// Internal use. Modifies existing or creates a new tile.
// Used to update specifically te neighbor value on a tile, efficiently.
function _changeNeighborCount(map: TileMap, pos: Vec2, change: number): void {
  if (change == 0) return;
  const tile = getTile(map, pos);
  if (tile == undefined && change > 0) {
    _setTile(map, pos, {
      active: false,
      neighbors: change,
      pos: pos,
    });
  } else if (tile) {
    tile.neighbors += change;
  }
}

// Use this function to insert/remove tiles.
// Dynamically updates neighbor count during insertion,
// speeding up time step performance.
// To insert, set active = true. To remove, set active = false.
export function smartSet(map: TileMap, pos: Vec2, active: boolean): void {
  const tile = getTile(map, pos);
  const change = _getChangeNumber(tile?.active ?? false, active);
  if (change == 0) return;
  const neighbors = getAreaAround(pos, 1, false);
  if (tile) tile.active = active;
  else _setTile(map, pos, { active: active, neighbors: 0, pos: pos });
  for (const neighborPos of neighbors) {
    _changeNeighborCount(map, neighborPos, change);
  }
}

// Use this function to increment time on a TileMap.
// The default ruleset is the most popular - Conway's Game of Life.
// Returns a new TileMap. Does not modify the given TileMap.
// TODO: Make more efficient by editing existing map instead of creating a new one.
export function stepMap(map: TileMap, rules: Ruleset = CGOL_RULESET): TileMap {
  const newMap: Map<string, Tile> = new Map();
  for (const tile of map.values()) {
    if (tile.active == false && tile.neighbors == 0) continue;
    else if (tile.active == false && rules.birth.includes(tile.neighbors)) {
      smartSet(newMap, tile.pos, true);
    } else if (tile.active && rules.survive.includes(tile.neighbors)) {
      smartSet(newMap, tile.pos, true);
    }
  }
  return newMap;
}

// Storing entire maps vs storing changes only and scrubbing through
// I'll go with storing the whole map, first.
export class UniverseHistory {
  history: TileMap[];
  currentIteration: number;
  maxHistory: number;
  // The index where history before is erased.
  pastCap: number;
  // Sick Prank: "Performance mode" disables the history function entirely.
  performanceMode: boolean;
  constructor(maxHistory: number = 100, performanceMode: boolean = false) {
    this.history = [];
    this.currentIteration = 0;
    this.performanceMode = false;
    this.maxHistory = maxHistory;
    this.pastCap = 0;
  }

  // Sets the number for the current iteration.
  // Defines where in time we are.
  setIteration(newIteration: number): TileMap {
    if (this.performanceMode) return this.history[0] ?? new Map();

    this.currentIteration = clamp(
      newIteration,
      this.pastCap,
      this.history.length
    );
    if (this.currentIteration - this.pastCap > this.maxHistory) {
      this.pastCap = this.currentIteration - this.maxHistory;
      this.destroyPast();
    }
    if (this.currentIteration == this.history.length) return new Map();
    return this.history[this.currentIteration];
  }

  // Sets the current iteration's map.
  setNow(map: TileMap) {
    if (this.performanceMode) {
      this.history[0] = map;
      return;
    }

    if (this.currentIteration >= this.history.length) this.history.push(map);
    else this.history[this.currentIteration] = map;
  }

  // Returns the current iteration's map
  getNow(): TileMap {
    if (this.performanceMode) return this.history[0];
    return this.history[this.currentIteration];
  }

  // Changes the current iteration by a specified number of steps.
  // Returns the new iteration.
  timeTravel(steps: number): TileMap {
    if (this.performanceMode) return this.history[0];

    const result = this.setIteration(this.currentIteration + steps);
    return result;
  }

  // Generates a new step and increments the iteration
  step(map?: TileMap, rules?: Ruleset) {
    map ??= this.getNow();
    this.timeTravel(1);
    const newMap = stepMap(map, rules);
    this.setNow(newMap);
    return newMap;
  }

  // Travels forward in time, steps the universe if at end of history.
  stepOrTravel(map?: TileMap, rules?: Ruleset): TileMap {
    if (this.performanceMode) return this.step(map, rules);

    if (this.currentIteration < this.history.length - 1) {
      return this.timeTravel(1);
    } else {
      return this.step(map, rules);
    }
  }

  // When the timeline is altered, we must make room for the new future.
  destroyFuture() {
    this.history = this.history.slice(0, this.currentIteration + 1);
  }

  // When the universe exists for long enough, people tend to forget after a while...
  destroyPast() {
    //this.history = this.history.slice(this.pastCap, this.currentIteration + 1);
    this.history = zeroSlice(this.history, this.pastCap, this.history.length);
  }
}

// Like slice, but fills array with undefined instead of trimming.
function zeroSlice(array: any[], start?: number, end?: number): any[] {
  start ??= 0;
  end ??= array.length;
  const diff = end - start;
  const zeroArray = Array(start).fill(undefined);
  const slicedArray = array.slice(start, end);
  const combinedArrays = zeroArray.concat(slicedArray);
  return combinedArrays;
}
