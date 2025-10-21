import Gameboard from "./Gameboard.js";
import { BOARD_SIZE } from "./constants.js";

class Player {
  #gameboard;
  // true/false
  #isComputer;
  #shotsTaken = [];

  constructor(isComputer = false) {
    this.#gameboard = new Gameboard(BOARD_SIZE);
    this.#isComputer = isComputer;
  }

  attack(enemyBoard, x, y) {
    return enemyBoard.receiveAttack(x, y);
  }

  randomAttack(enemyBoard) {
    let x, y;
    let attackSuccess = false;

    // loop till find a valid move
    while (!attackSuccess) {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);

      if (enemyBoard.receiveAttack(x, y)) {
        attackSuccess = true;

        this.#shotsTaken.push({ x, y });

        return { x, y };
      }
    }
  }

  get gameboard() {
    return this.#gameboard;
  }
}

export default Player;
