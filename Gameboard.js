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

      this.#grid[index] = {
        ship: ship,
        index: i,
        wasHit: false, // 🔥 התיקון: מאתחלים את מצב הפגיעה
      };
    }
    this.#ships.push(ship);
    return true; // Placement successful
  }

  receiveAttack(x, y) {
    const index = this.#coordsToIndex(x, y);

    if (index === -1) {
      return false; // מחוץ לגבולות
    }

    const cell = this.#grid[index];

    // בדיקה אם המהלך לא חוקי (כבר נפגע או כבר החטאה)
    // הערה: בדיקת cell.wasHit תעבוד רק אם היא אותחלה ב-placeShip!
    if (cell === "miss" || (cell !== null && cell.wasHit)) {
      return false;
    }

    if (cell && cell.ship) {
      // HIT SCENARIO
      cell.ship.hit();
      cell.wasHit = true;
      return true;
    } else {
      // MISS SCENARIO
      this.#grid[index] = "miss";
      this.#missedAttacks.push({ x, y });
      return true;
    }
  }

  allShipsSunk() {
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
