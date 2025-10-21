import Ship from "./Ship.js";
import { BOARD_SIZE } from "./constants.js";

class Gameboard {
  // Private fields (encapsulation)
  #size;
  #grid;
  #missedAttacks = [];
  #ships = [];

  // /**
  //  * Initializes a new Gameboard instance.
  //  * @param {number} size
  //  */
  constructor(size = BOARD_SIZE) {
    this.#size = size;

    this.#grid = new Array(size * size).fill(null);
  }

  #coordsToIndex(x, y) {
    // check boundries 0-9
    if (x < 0 || x >= this.#size || y < 0 || y >= this.#size) {
      return -1; // -1 = error
    }
    // changes x,y to --> a number/index from 1-100
    // helps us get the exact index
    return y * this.#size + x;
  }

  placeShip(ship, startX, startY, orientation) {
    // 1. Validation Check (pre-flight check)
    for (let i = 0; i < ship.length; i++) {
      let x = startX;
      let y = startY;

      if (orientation === "horizontal") {
        x = startX + i;
      } else if (orientation === "vertical") {
        y = startY + i;
      }

      // entering a loop
      // checking every x / y
      // in order to check if out of bound or not
      const index = this.#coordsToIndex(x, y);

      // 2 errors option:
      // 1) no from 0-9 so returns -1
      // 2) the cell isn't null - so isn't availble for placement
      if (index === -1 || this.#grid[index] !== null) {
        return false; // Invalid placement
      }
    }

    // 2. Execution (Place the ship parts)
    for (let i = 0; i < ship.length; i++) {
      let x = startX;
      let y = startY;

      if (orientation === "horizontal") {
        x = startX + i;
      } else if (orientation === "vertical") {
        y = startY + i;
      }

      const index = this.#coordsToIndex(x, y);

      // here: we're replacing NULL val with new ship obj
      // inside every valid cell we save the relevant ship object
      this.#grid[index] = {
        ship: ship,
        // the index says which part of the ship
        index: i,
      };
    }
    // outside the loop we insert the ship for inspection
    this.#ships.push(ship);
    return true; // Placement successful
  }

  receiveAttack(x, y) {
    const index = this.#coordsToIndex(x, y);

    if (index === -1) {
      return false;
    }

    const cell = this.#grid[index];

    // Check if shot is illegal
    // (already hit or already missed)
    if (cell === "miss" || (cell !== null && cell.wasHit)) {
      return false;
    }

    // if cell isn't empty
    // if cell has ship inside
    if (cell && cell.ship) {
      // HIT SCENARIO: Call the ship's public method
      cell.ship.hit();
      cell.wasHit = true;
      return true;
    } else {
      // MISS SCENARIO: Mark the cell and record the coordinates
      this.#grid[index] = "miss";
      this.#missedAttacks.push({ x, y });
      return true;
    }
  }

  allShipsSunk() {
    // Check if any ships exist AND if ALL of them are sunk using Array.every()
    return this.#ships.length > 0 && this.#ships.every((ship) => ship.isSunk());
  }

  // --- Public Getters (Necessary for Testing and UI) ---

  getGrid() {
    return this.#grid;
  }

  getMissedAttacks() {
    return this.#missedAttacks;
  }

  // Expose the helper for external use (like in tests or the UI module)
  coordsToIndex(x, y) {
    return this.#coordsToIndex(x, y);
  }

  getShips() {
    return this.#ships;
  }
}

export default Gameboard;
