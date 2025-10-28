import Ship from "./Ship.js";
import { BOARD_SIZE } from "./constants.js";

class Gameboard {
  // Private fields (encapsulation)
  #size;
  #grid;
  #missedAttacks = [];
  #ships = [];

  constructor(size = BOARD_SIZE) {
    this.#size = size;
    this.#grid = new Array(size * size).fill(null);
  }

  #coordsToIndex(x, y) {
    if (x < 0 || x >= this.#size || y < 0 || y >= this.#size) {
      return -1;
    }
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

      const index = this.#coordsToIndex(x, y);

      // אם מחוץ לגבולות (-1) או התא כבר תפוס (אינו null)
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

      // pass all the test
      // so replace NULL with ship
      // inside the cell:
      // object with 3 fields
      this.#grid[index] = {
        ship: ship,
        index: i,
        wasHit: false,
      };
    }
    this.#ships.push(ship);
    return true;
  }

  receiveAttack(x, y) {
    // change coords to index
    const index = this.#coordsToIndex(x, y);

    // check if index is valid
    if (index === -1) {
      return false;
    }

    // get the cell
    const cell = this.#grid[index];

    // if cell is "miss" or already hit
    // return false
    if (cell === "miss" || (cell !== null && cell.wasHit)) {
      return false;
    }

    // hit senario
    if (cell && cell.ship) {
      cell.ship.hit();
      cell.wasHit = true;
      return true;
      // else - miss scenario
    } else {
      this.#grid[index] = "miss";
      this.#missedAttacks.push({ x, y });
      return true;
    }
  }

  allShipsSunk() {
    // check if there is at least one ship
    // and if all ships are sunk

    return this.#ships.length > 0 && this.#ships.every((ship) => ship.isSunk());
  }

  // --- Public Getters ---
  getGrid() {
    return this.#grid;
  }

  getMissedAttacks() {
    return this.#missedAttacks;
  }

  coordsToIndex(x, y) {
    return this.#coordsToIndex(x, y);
  }

  getShips() {
    return this.#ships;
  }
  get boardSize() {
    return this.#size;
  }
}

export default Gameboard;
