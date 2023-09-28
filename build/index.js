var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
define("Utility", ["require", "exports", "VecClass"], function (require, exports, VecClass_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.normalizeCorners = exports.random = exports.lerp = exports.clamp = void 0;
    function clamp(num, min, max) {
        const clampedNumber = Math.max(Math.min(max, num), min);
        return clampedNumber;
    }
    exports.clamp = clamp;
    // Linear interpolation between x and y.
    // If t=0, then lerp = x. If t=1, then lerp = y.
    function lerp(x, y, t) {
        // const difference = y - x;
        // const increase = difference * t;
        // const result = x + increase;
        // return result;
        return x + (y - x) * t;
    }
    exports.lerp = lerp;
    // Random number in range [min, max], inclusive.
    function random(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }
    exports.random = random;
    function normalizeCorners(corner1, corner2) {
        const minX = Math.min(corner1.x, corner2.x);
        const minY = Math.min(corner1.y, corner2.y);
        const maxX = Math.max(corner1.x, corner2.x);
        const maxY = Math.max(corner1.y, corner2.y);
        const smallerCorner = new VecClass_1.Vec2(minX, minY);
        const largerCorner = new VecClass_1.Vec2(maxX, maxY);
        return [smallerCorner, largerCorner];
    }
    exports.normalizeCorners = normalizeCorners;
});
define("VecClass", ["require", "exports", "Utility"], function (require, exports, Utility_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getAreaAround = exports.getAreaAsArray = exports.Vec2 = void 0;
    // Represents a 2D vector. Used mainly for positional data.
    class Vec2 {
        x;
        y;
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
        clone() {
            const cloneVec = new Vec2(this.x, this.y);
            return cloneVec;
        }
        // Below functions do not modify the original, they return new vectors.
        multiply(num) {
            const product = new Vec2(this.x * num, this.y * num);
            return product;
        }
        multiplyVec(vec) {
            const product = new Vec2(this.x * vec.x, this.y * vec.y);
            return product;
        }
        divide(num) {
            const quotient = new Vec2(this.x / num, this.y / num);
            return quotient;
        }
        divideVec(vec) {
            const quotient = new Vec2(this.x / vec.x, this.y / vec.y);
            return quotient;
        }
        add(num) {
            const sum = new Vec2(this.x + num, this.y + num);
            return sum;
        }
        addVec(vec) {
            const sum = new Vec2(this.x + vec.x, this.y + vec.y);
            return sum;
        }
        subtract(num) {
            const difference = new Vec2(this.x - num, this.y - num);
            return difference;
        }
        subtractVec(vec) {
            const difference = new Vec2(this.x - vec.x, this.y - vec.y);
            return difference;
        }
        floor() {
            const flooredVec = new Vec2(Math.floor(this.x), Math.floor(this.y));
            return flooredVec;
        }
        shift(x, y) {
            const shifted = new Vec2(this.x + x, this.y + y);
            return shifted;
        }
        toString() {
            const result = `(${this.x}, ${this.y})`;
            return result;
        }
        isEqual(vec) {
            return this.x == vec.x && this.y == vec.y;
        }
        static fromString(vecString) {
            const numberArray = vecString.split(',');
            const newVec = new Vec2(parseInt(numberArray[0].slice(1)), parseInt(numberArray[1]));
            return newVec;
        }
    }
    exports.Vec2 = Vec2;
    function getAreaAsArray(corner1, corner2) {
        const areaVecs = [];
        const normalized = (0, Utility_1.normalizeCorners)(corner1, corner2);
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
    exports.getAreaAsArray = getAreaAsArray;
    function getAreaAround(pos, distance, includeCenter = false) {
        const vecs = [];
        // TODO
        for (let y = -distance; y <= distance; y++) {
            for (let x = -distance; x <= distance; x++) {
                if (y == 0 && x == 0 && includeCenter == false)
                    continue;
                vecs.push(pos.shift(x, y));
            }
        }
        return vecs;
    }
    exports.getAreaAround = getAreaAround;
});
define("CameraClass", ["require", "exports", "VecClass"], function (require, exports, VecClass_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Camera = void 0;
    // Represents the view of a grid.
    // Controls where the grid is and how big it is on screen.
    class Camera {
        // Where the center of the camera is pointing.
        // Note: This is the position of the camera in the grid.
        pos;
        // How many pixels a grid square takes up.
        _scale;
        // (min, max) for scale.
        scaleConstraints;
        constructor(pos = new VecClass_2.Vec2(0, 0), scale = 2) {
            this.pos = pos;
            this._scale = scale;
            this.scaleConstraints = new VecClass_2.Vec2(1, 100);
        }
        set scale(newScale) {
            this._scale = newScale;
            if (this._scale < this.scaleConstraints.x)
                this._scale = this.scaleConstraints.x;
            if (this._scale > this.scaleConstraints.y)
                this._scale = this.scaleConstraints.y;
            if (this._scale == 0)
                this._scale = 1;
        }
        get scale() {
            return this._scale;
        }
        // In grid coordinates
        getTopLeft(screenSize) {
            const cameraTopLeft = this.pos.subtractVec(screenSize.divide(2 * this.scale));
            return cameraTopLeft;
        }
    }
    exports.Camera = Camera;
});
define("ColorClass", ["require", "exports", "Utility"], function (require, exports, Utility_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Color = void 0;
    class Color {
        // [0, 255]
        r;
        g;
        b;
        constructor(r, g, b) {
            this.r = r;
            this.g = g;
            this.b = b;
        }
        clone() {
            const clonedColor = new Color(this.r, this.g, this.b);
            return clonedColor;
        }
        toHex(addHash = true) {
            const rHex = this.r.toString(16);
            const gHex = this.g.toString(16);
            const bHex = this.b.toString(16);
            const combinedValues = (addHash ? '#' : '') + rHex + gHex + bHex;
            return combinedValues;
        }
        static fromHex(hexString) {
            hexString = hexString.trim();
            if (hexString.at(0) == '#')
                hexString = hexString.slice(1);
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
        _map(func) {
            const newColor = new Color(0, 0, 0);
            newColor.r = func(this.r);
            newColor.g = func(this.g);
            newColor.b = func(this.b);
            return newColor;
        }
        clamp(min = 0, max = 255) {
            const clampedColor = this._map((x) => (0, Utility_2.clamp)(x, 0, 255));
            return clampedColor;
        }
        floor() {
            const flooredColor = this._map((x) => Math.floor(x));
            return flooredColor;
        }
        ceil() {
            const ceiledColor = this._map((x) => Math.ceil(x));
            return ceiledColor;
        }
        add(num) {
            const sumColor = this._map((x) => x + num);
            return sumColor;
        }
        multiply(num) {
            const productColor = this._map((x) => x * num);
            return productColor;
        }
        mix(blendColor, ratio = 0.5) {
            const rMix = (0, Utility_2.lerp)(this.r, blendColor.r, ratio);
            const gMix = (0, Utility_2.lerp)(this.g, blendColor.g, ratio);
            const bMix = (0, Utility_2.lerp)(this.b, blendColor.b, ratio);
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
    exports.Color = Color;
});
// Module specifically for Game Of Life (GOL) functions and types
// Usage: Use a TileMap to represent the universe state.
//        Insert tiles with smartSet() only
//        Use stepMap() to increment time.
define("GOL", ["require", "exports", "Utility", "VecClass"], function (require, exports, Utility_3, VecClass_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UniverseHistory = exports.stepMap = exports.smartSet = exports.getTile = exports.CGOL_RULESET = void 0;
    // Conway's Game of Life ruleset, the most well known.
    exports.CGOL_RULESET = {
        survive: [2, 3],
        birth: [3],
    };
    // Explicitly for internal use. Sets a value in map.
    function _setTile(map, pos, tile) {
        map.set(pos.toString(), tile);
    }
    // Returns a tile from specified TileMap.
    // Returns undefined if there is no data stored at that position.
    function getTile(map, pos) {
        return map.get(pos.toString());
    }
    exports.getTile = getTile;
    // Internal use. Gets the numerical difference representing a boolean change.
    function _getChangeNumber(current, newActive) {
        if (current == newActive)
            return 0;
        if (current == false)
            return 1;
        return -1;
    }
    // Internal use. Modifies existing or creates a new tile.
    // Used to update specifically te neighbor value on a tile, efficiently.
    function _changeNeighborCount(map, pos, change) {
        if (change == 0)
            return;
        const tile = getTile(map, pos);
        if (tile == undefined && change > 0) {
            _setTile(map, pos, {
                active: false,
                neighbors: change,
                pos: pos,
            });
        }
        else if (tile) {
            tile.neighbors += change;
        }
    }
    // Use this function to insert/remove tiles.
    // Dynamically updates neighbor count during insertion,
    // speeding up time step performance.
    // To insert, set active = true. To remove, set active = false.
    function smartSet(map, pos, active) {
        const tile = getTile(map, pos);
        const change = _getChangeNumber(tile?.active ?? false, active);
        if (change == 0)
            return;
        const neighbors = (0, VecClass_3.getAreaAround)(pos, 1, false);
        if (tile)
            tile.active = active;
        else
            _setTile(map, pos, { active: active, neighbors: 0, pos: pos });
        for (const neighborPos of neighbors) {
            _changeNeighborCount(map, neighborPos, change);
        }
    }
    exports.smartSet = smartSet;
    // Use this function to increment time on a TileMap.
    // The default ruleset is the most popular - Conway's Game of Life.
    // Returns a new TileMap. Does not modify the given TileMap.
    // TODO: Make more efficient by editing existing map instead of creating a new one.
    function stepMap(map, rules = exports.CGOL_RULESET) {
        const newMap = new Map();
        for (const tile of map.values()) {
            if (tile.active == false && tile.neighbors == 0)
                continue;
            else if (tile.active == false && rules.birth.includes(tile.neighbors)) {
                smartSet(newMap, tile.pos, true);
            }
            else if (tile.active && rules.survive.includes(tile.neighbors)) {
                smartSet(newMap, tile.pos, true);
            }
        }
        return newMap;
    }
    exports.stepMap = stepMap;
    // Storing entire maps vs storing changes only and scrubbing through
    // I'll go with storing the whole map, first.
    class UniverseHistory {
        history;
        currentIteration;
        maxHistory;
        // The index where history before is erased.
        pastCap;
        // Sick Prank: "Performance mode" disables the history function entirely.
        performanceMode;
        constructor(maxHistory = 100, performanceMode = false) {
            this.history = [];
            this.currentIteration = 0;
            this.performanceMode = false;
            this.maxHistory = maxHistory;
            this.pastCap = 0;
        }
        // Sets the number for the current iteration.
        // Defines where in time we are.
        setIteration(newIteration) {
            if (this.performanceMode)
                return this.history[0] ?? new Map();
            this.currentIteration = (0, Utility_3.clamp)(newIteration, this.pastCap, this.history.length);
            if (this.currentIteration - this.pastCap > this.maxHistory) {
                this.pastCap = this.currentIteration - this.maxHistory;
                this.destroyPast();
            }
            if (this.currentIteration == this.history.length)
                return new Map();
            return this.history[this.currentIteration];
        }
        // Sets the current iteration's map.
        setNow(map) {
            if (this.performanceMode) {
                this.history[0] = map;
                return;
            }
            if (this.currentIteration >= this.history.length)
                this.history.push(map);
            else
                this.history[this.currentIteration] = map;
        }
        // Returns the current iteration's map
        getNow() {
            if (this.performanceMode)
                return this.history[0];
            return this.history[this.currentIteration];
        }
        // Changes the current iteration by a specified number of steps.
        // Returns the new iteration.
        timeTravel(steps) {
            if (this.performanceMode)
                return this.history[0];
            const result = this.setIteration(this.currentIteration + steps);
            return result;
        }
        // Generates a new step and increments the iteration
        step(map, rules) {
            map ??= this.getNow();
            this.timeTravel(1);
            const newMap = stepMap(map, rules);
            this.setNow(newMap);
            return newMap;
        }
        // Travels forward in time, steps the universe if at end of history.
        stepOrTravel(map, rules) {
            if (this.performanceMode)
                return this.step(map, rules);
            if (this.currentIteration < this.history.length - 1) {
                return this.timeTravel(1);
            }
            else {
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
    exports.UniverseHistory = UniverseHistory;
    // Like slice, but fills array with undefined instead of trimming.
    function zeroSlice(array, start, end) {
        start ??= 0;
        end ??= array.length;
        const diff = end - start;
        const zeroArray = Array(start).fill(undefined);
        const slicedArray = array.slice(start, end);
        const combinedArrays = zeroArray.concat(slicedArray);
        return combinedArrays;
    }
});
define("StyleClass", ["require", "exports", "ColorClass"], function (require, exports, ColorClass_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Style = void 0;
    // Class to represent the styles of drawing on a canvas.
    // Includes functions to set and undo a style.
    class Style {
        fillColor;
        strokeColor;
        oldFillColor;
        oldStrokeColor;
        shadow;
        oldShadow;
        constructor(fillColor = ColorClass_1.Color.RED(), strokeColor, shadow) {
            this.fillColor = fillColor;
            this.strokeColor = strokeColor ?? fillColor;
            this.shadow = shadow;
        }
        static WHITE = () => new Style(ColorClass_1.Color.WHITE(), ColorClass_1.Color.WHITE());
        static BLACK = () => new Style(ColorClass_1.Color.BLACK(), ColorClass_1.Color.BLACK());
        applyStyle(ctx) {
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
        revertStyle(ctx) {
            if (this.oldFillColor)
                ctx.fillStyle = this.oldFillColor;
            if (this.oldStrokeColor)
                ctx.strokeStyle = this.oldStrokeColor;
            if (this.oldShadow) {
                ctx.shadowBlur = this.oldShadow.blur;
                ctx.shadowColor = this.oldShadow.color;
                ctx.shadowOffsetX = this.oldShadow.offsetX;
                ctx.shadowOffsetY = this.oldShadow.offsetY;
            }
        }
    }
    exports.Style = Style;
});
define("SquareClass", ["require", "exports", "StyleClass"], function (require, exports, StyleClass_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Square = void 0;
    // Represents an object on a grid.
    // Does not store its own position.
    class Square {
        // The base square color
        style;
        constructor(style = new StyleClass_1.Style()) {
            this.style = style;
        }
        draw(ctx, pos, scale) {
            this.style.applyStyle(ctx);
            ctx.fillRect(pos.x, pos.y, scale, scale);
            this.style.revertStyle(ctx);
        }
    }
    exports.Square = Square;
});
define("GridClass", ["require", "exports", "VecClass", "StyleClass"], function (require, exports, VecClass_4, StyleClass_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Grid = void 0;
    // Graphical grid on a canvas.
    // Grid coordinates start at 0, 0 for top left square.
    class Grid {
        // Map of Square objects on the grid.
        squares;
        style;
        lineWidth;
        constructor(style, lineWidth = 0.5) {
            this.squares = new Map();
            this.style = style ?? StyleClass_2.Style.BLACK();
            this.lineWidth = lineWidth;
        }
        clearGrid() {
            this.squares = new Map();
        }
        setSquare(pos, square) {
            this.squares.set(this._posToKey(pos), square);
            return true;
        }
        getSquare(pos) {
            const square = this.squares.get(this._posToKey(pos));
            return square;
        }
        // Returns the grid square that corrosponds to the position on screen.
        screenPosToGridPos(screenPos, screenSize, camera) {
            // camera.pos is the _center_ of the viewport
            const cameraTopLeft = camera.getTopLeft(screenSize);
            const normalGridPos = screenPos.divide(camera.scale);
            const offsetGridPos = normalGridPos.addVec(cameraTopLeft);
            const flooredResult = offsetGridPos.floor();
            return flooredResult;
        }
        // We cannot use Vec2 directly for map key,
        // each Object has unique hash.
        _posToKey(pos) {
            //const key = `${pos.x},${pos.y}`;
            const key = pos.toString();
            return key;
        }
        _keyToPos(key) {
            // const numberArray = key.split(',');
            // const pos = new Vec2(parseInt(numberArray[0]), parseInt(numberArray[1]));
            const pos = VecClass_4.Vec2.fromString(key);
            return pos;
        }
        // TODO: Camera means center of screen, not top left corner
        // Change all rendering to adhere to that fact.
        drawGrid(ctx, screenSize, camera, lineWidth = this.lineWidth) {
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
                this._drawVerticalLine(ctx, screenSize, i * camera.scale + verticalLineOffset);
            }
            for (let i = 0; i < numberOfHorizontalLines; i++) {
                this._drawHorizontalLine(ctx, screenSize, i * camera.scale + horizontalLineOffset);
            }
            this.style.revertStyle(ctx);
            ctx.lineWidth = oldLineWidth;
        }
        drawSquares(ctx, screenSize, camera) {
            // padding is for culling, how many grid pos out of screen to still draw
            const padding = 1;
            const cameraTopLeft = camera.getTopLeft(screenSize);
            const cameraBottomRight = cameraTopLeft.addVec(screenSize.divide(camera.scale));
            // TODO: Culling
            for (const entry of this.squares.entries()) {
                const square = entry[1];
                if (square == undefined)
                    continue;
                const pos = this._keyToPos(entry[0]);
                // Culling: If square is off screen, don't draw it.
                if (pos.x < cameraTopLeft.x - padding ||
                    pos.x > cameraBottomRight.x + padding ||
                    pos.y < cameraTopLeft.y - padding ||
                    pos.y > cameraBottomRight.y + padding) {
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
        drawSquaresLessEfficiently(ctx, screenSize, camera) {
            const padding = 1;
            const cameraTopLeft = camera.getTopLeft(screenSize);
            const cameraBottomRight = cameraTopLeft.addVec(screenSize.divide(camera.scale));
            for (let x = cameraTopLeft.x - padding; x < cameraBottomRight.x + padding; x++) {
                for (let y = cameraTopLeft.y - padding; y < cameraBottomRight.y + padding; y++) {
                    const pos = new VecClass_4.Vec2(x, y);
                    const square = this.getSquare(pos);
                    if (square) {
                        const drawPos = pos.subtractVec(cameraTopLeft).multiply(camera.scale);
                        square.draw(ctx, drawPos, camera.scale);
                    }
                }
            }
        }
        isPosOnScreen(pos, screenSize, camera) {
            const padding = 1;
            const cameraTopLeft = camera.getTopLeft(screenSize);
            const cameraBottomRight = cameraTopLeft.addVec(screenSize.divide(camera.scale));
            if (pos.x < cameraTopLeft.x - padding ||
                pos.x > cameraBottomRight.x + padding)
                return false;
            if (pos.y < cameraTopLeft.y - padding ||
                pos.y > cameraBottomRight.y + padding)
                return false;
            return true;
        }
        _drawLine(ctx, startPos, endPos) {
            ctx.beginPath();
            ctx.moveTo(startPos.x, startPos.y);
            ctx.lineTo(endPos.x, endPos.y);
            ctx.closePath();
            ctx.stroke();
        }
        _drawHorizontalLine(ctx, screenSize, yPos) {
            this._drawLine(ctx, new VecClass_4.Vec2(0, yPos), new VecClass_4.Vec2(screenSize.x, yPos));
        }
        _drawVerticalLine(ctx, screenSize, xPos) {
            this._drawLine(ctx, new VecClass_4.Vec2(xPos, 0), new VecClass_4.Vec2(xPos, screenSize.y));
        }
    }
    exports.Grid = Grid;
});
// Utility functions to easily integrate controls to a canvas.
define("Interactions", ["require", "exports", "SquareClass", "VecClass"], function (require, exports, SquareClass_1, VecClass_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.applyPlacementControls = exports.squarePlacement = exports.abstractPlacement = exports.mouseScrollZoomCamera = exports.mouseDragCamera = exports.applyMouseCameraControls = void 0;
    const defaultOptions = {};
    function applyMouseCameraControls(canvas, camera, options = defaultOptions) {
        // Prevent context menu on right click
        canvas.addEventListener('contextmenu', (event) => {
            event.preventDefault();
        });
        // Prevent middle click scroll circle
        canvas.addEventListener('mousedown', (event) => {
            if (event.buttons == 4)
                event.preventDefault();
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
    exports.applyMouseCameraControls = applyMouseCameraControls;
    // Bind to "mousemove" event
    function mouseDragCamera(event, camera) {
        if (event.buttons == 4 || (event.buttons == 1 && event.shiftKey)) {
            // Middle click
            const deltaMovement = new VecClass_5.Vec2(event.movementX, event.movementY);
            const deltaGridMovement = deltaMovement.divide(camera.scale);
            camera.pos = camera.pos.subtractVec(deltaGridMovement);
        }
    }
    exports.mouseDragCamera = mouseDragCamera;
    // bind to "wheel" event
    function mouseScrollZoomCamera(event, camera, zoomRatio = 0.005) {
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
    exports.mouseScrollZoomCamera = mouseScrollZoomCamera;
    // Passes Vec2's to callback function so you can use it for other grid systems.
    // Second callback argument is true for adding, false for subtracting.
    // callback(gridPosition: Vec2, adding: boolean);
    function abstractPlacement(event, grid, screenSize, camera, callback, options = undefined) {
        // Typescript doesn't like this version.
        // options = {
        //   additiveButtons: options?.additiveButtons ?? [1],
        //   subtractiveButtons: options?.subtractiveButtons ?? [2],
        //   disableOnShift: options?.disableOnShift ?? true,
        // };
        if (options == undefined)
            options = {};
        if (options.additiveButtons == undefined)
            options.additiveButtons = [1];
        if (options.subtractiveButtons == undefined)
            options.subtractiveButtons = [2];
        if (options.disableOnShift == undefined)
            options.disableOnShift == true;
        if (options.additiveButtons
            .concat(options.subtractiveButtons)
            .includes(event.buttons)) {
            const clickPos = new VecClass_5.Vec2(event.offsetX, event.offsetY);
            const gridPos = grid.screenPosToGridPos(clickPos, screenSize, camera);
            // If left click + drag, place square
            if (options.additiveButtons.includes(event.buttons) &&
                (event.shiftKey && options.disableOnShift) == false) {
                callback(gridPos, true);
            }
            // If right click + drag, remove square
            if (options.subtractiveButtons.includes(event.buttons)) {
                callback(gridPos, false);
            }
        }
    }
    exports.abstractPlacement = abstractPlacement;
    function squarePlacement(event, grid, screenSize, camera, square = new SquareClass_1.Square(), options = undefined) {
        abstractPlacement(event, grid, screenSize, camera, (gridPos, adding) => {
            const insertingObject = adding ? square : undefined;
            grid.setSquare(gridPos, insertingObject);
        }, options);
    }
    exports.squarePlacement = squarePlacement;
    function applyPlacementControls(canvas, grid, screenSize, camera, callback, options = undefined) {
        const mousePlacement = (event) => {
            abstractPlacement(event, grid, screenSize, camera, callback, options);
        };
        canvas.addEventListener('mousemove', mousePlacement);
        canvas.addEventListener('mousedown', mousePlacement);
    }
    exports.applyPlacementControls = applyPlacementControls;
});
// Conway's Game Of Life
// This Code Not Property of Conway
define("GameOfLife", ["require", "exports", "CameraClass", "VecClass", "SquareClass", "Interactions", "StyleClass", "ColorClass", "GridClass", "GOL"], function (require, exports, CameraClass_1, VecClass_6, SquareClass_2, Interactions_1, StyleClass_3, ColorClass_2, GridClass_1, GOL) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.initGame = void 0;
    GOL = __importStar(GOL);
    var globalNumberOfGOLInstances = 0;
    function initGame(appId) {
        const appDiv = document.getElementById(appId);
        const canvasID = 'gol-canvas' + globalNumberOfGOLInstances;
        appDiv.innerHTML = `
  <div id="${canvasID}-container" style="width:100%;height:100%;">
  <canvas id="${canvasID}" tabindex="0"></canvas>
  </div>`;
        const canvasContainer = document.getElementById(canvasID + '-container');
        const canvas = document.getElementById(canvasID);
        const ctx = canvas.getContext('2d');
        globalNumberOfGOLInstances++;
        // Get canvas height & width from parent container
        const screenSize = new VecClass_6.Vec2(canvasContainer.clientWidth, canvasContainer.clientHeight);
        canvas.height = screenSize.y;
        canvas.width = screenSize.x;
        canvas.style.border = '1px solid black';
        canvas.style.background = 'black';
        // Some constants
        const simSpeed = 2; // ms per step
        const fps = 60; // frams per second
        // Main objects for the scene
        let grid = new GridClass_1.Grid();
        let GOLMap = new Map();
        const camera = new CameraClass_1.Camera();
        const whiteSquareWithGlow = new StyleClass_3.Style(ColorClass_2.Color.WHITE(), ColorClass_2.Color.WHITE(), {
            blur: 5,
            color: '#FFFFFF',
            offsetX: 0,
            offsetY: 0,
        });
        const whiteSquareWithoutGlow = new StyleClass_3.Style(ColorClass_2.Color.WHITE(), ColorClass_2.Color.WHITE());
        // Glow square uses shadows
        // Shadows seem to make very laggy when many squares.
        // Only choose glowy squares if you really like it
        const defaultSquareStyle = whiteSquareWithoutGlow;
        // TODO: Why does multiplying by 0.5 result in black?
        grid.style = new StyleClass_3.Style(ColorClass_2.Color.WHITE().multiply(0.6));
        grid.lineWidth = 0.04;
        const universe = new GOL.UniverseHistory(100, false);
        let hasBeenModifiedThisStep = false;
        /////
        // Add event listeners
        ////////////
        (0, Interactions_1.applyPlacementControls)(canvas, grid, screenSize, camera, (gridPos, adding) => {
            hasBeenModifiedThisStep = true;
            const square = new SquareClass_2.Square(defaultSquareStyle);
            grid.setSquare(gridPos, adding ? square : undefined);
            GOL.smartSet(GOLMap, gridPos, adding);
        });
        (0, Interactions_1.applyMouseCameraControls)(canvas, camera);
        const stepMap = function () {
            if (hasBeenModifiedThisStep) {
                universe.setNow(GOLMap);
                // Changing the present changes the future
                universe.destroyFuture();
                // If modified, have to generate new future from scratch
                GOLMap = universe.step();
            }
            else {
                // If mas is unmodified and in the past, just load predetermined future
                GOLMap = universe.stepOrTravel();
            }
            hasBeenModifiedThisStep = false;
        };
        const reverseStepMap = function () {
            if (hasBeenModifiedThisStep)
                universe.setNow(GOLMap);
            GOLMap = universe.timeTravel(-1);
            hasBeenModifiedThisStep = false;
        };
        const keyMap = new Map();
        canvas.addEventListener('keydown', (event) => keyMap.set(event.key, true));
        canvas.addEventListener('keyup', (event) => keyMap.set(event.key, false));
        // For fast stepping
        setInterval(() => {
            if (keyMap.get('ArrowRight'))
                stepMap();
            //if (keyMap.get('ArrowLeft')) reverseStepMap();
        }, simSpeed);
        // For single stepping
        canvas.addEventListener('keydown', (event) => {
            if (event.key == ' ') {
                // Prevent scrolling down the page on space press
                event.preventDefault();
                stepMap();
            }
            if (event.key == 'ArrowRight')
                event.preventDefault();
            if (event.key == 'ArrowLeft') {
                event.preventDefault();
                reverseStepMap();
            }
        });
        camera.scale = 15;
        setInterval(() => {
            clearCanvas(ctx, screenSize);
            grid.clearGrid();
            mapToGrid(GOLMap, grid, new SquareClass_2.Square(defaultSquareStyle));
            grid.drawGrid(ctx, screenSize, camera);
            grid.drawSquares(ctx, screenSize, camera);
        }, 1000 / fps);
    }
    exports.initGame = initGame;
    function clearCanvas(ctx, screenSize) {
        ctx.clearRect(0, 0, screenSize.x, screenSize.y);
    }
    function mapToGrid(map, grid, square) {
        for (const tile of map.values()) {
            grid.setSquare(tile.pos, tile.active ? square : undefined);
        }
    }
});
define("index", ["require", "exports", "GameOfLife"], function (require, exports, GOL) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    GOL = __importStar(GOL);
    const appDiv = document.getElementById('gol-app');
    GOL.initGame('gol-app');
});
