import Ship from "./Ship.js";
import { BOARD_SIZE } from "./constants.js";

class Gameboard {
  // Private fields (encapsulation)
  #size;
  // private grid represented as a flat array
  // will pupulate 100 cells with null initially
  // later cells can hold ship objects or "miss" strings
  // each cell can also hold an object with ship reference and hit status
  #grid;
  // array to hold missed attacks in order to render them later
  #missedAttacks = [];
  // array to hold placed ships
  #ships = [];

  constructor(size = BOARD_SIZE) {
    this.#size = size;
    // we start with an empty grid of nulls
    this.#grid = new Array(size * size).fill(null);
  }

  // Private helper to convert coordinates to a flat array index
  #coordsToIndex(x, y) {
    if (x < 0 || x >= this.#size || y < 0 || y >= this.#size) {
      return -1;
    }
    return y * this.#size + x;
  }

  // funct that tries to place a ship on the board
  placeShip(ship, startX, startY, orientation) {
    // 1. Validation Check (pre-flight check)
    // loop through every part of the ship
    // and check if placement is valid..
    for (let i = 0; i < ship.length; i++) {
      let x = startX;
      let y = startY;

      if (orientation === "horizontal") {
        x = startX + i;
      } else if (orientation === "vertical") {
        y = startY + i;
      }

      const index = this.#coordsToIndex(x, y);

      // If out of bounds (-1) or cell is already occupied (is not null)
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

      // if we reach here, we can safely place the ship part
      //Replace NULL with ship object
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

    // hit scenario
    // if cell isn't null and has a ship
    if (cell && cell.ship) {
      cell.ship.hit();
      cell.wasHit = true;
      return true;
      // else - miss scenario
    } else {
      this.#grid[index] = "miss";
      // save missed attack coords for rendering later
      this.#missedAttacks.push({ x, y });
      return true;
    }
  }

  allShipsSunk() {
    // returns true if all ships have been sunk
    return this.#ships.length > 0 && this.#ships.every((ship) => ship.isSunk());
  }

  // --- Public Getters ---
  getGrid() {
    return this.#grid;
  }

  getMissedAttacks() {
    return this.#missedAttacks;
  }

  // Exposed helper for the UI module (for hover preview)
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

// ---------------------------------------------------
// 🔥 EXPORTED FUNCTION REQUIRED BY main.js
// ---------------------------------------------------

/**
 * Checks if the game is over by verifying if all ships on the player's board are sunk.
 * The player object passed here should be the 'enemy' from the perspective of the attacker.
 * @param {Player} player The player object whose board needs checking.
 * @returns {boolean} True if all ships are sunk, meaning the game is over.
 */
export function checkGameOver(player) {
  // Since player is the enemy, we check if all their ships are sunk.
  return player.gameboard.allShipsSunk();
}

export default Gameboard;
