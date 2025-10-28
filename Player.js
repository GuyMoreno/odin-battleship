import Gameboard from "./Gameboard.js";
import { BOARD_SIZE } from "./constants.js";

class Player {
  #gameboard;
  // true/false
  #isComputer;
  // array of objects with x,y coords
  // to keep track of shots taken of computer player
  #shotsTaken = [];

  constructor(isComputer = false) {
    // each player has their own gameboard
    this.#gameboard = new Gameboard(BOARD_SIZE);
    this.#isComputer = isComputer;
  }

  // human player attacks at given x,y
  attack(enemyBoard, x, y) {
    return enemyBoard.receiveAttack(x, y);
  }

  // computer player attacks randomly
  randomAttack(enemyBoard) {
    let x, y;
    let attackSuccess = false;

    // loop till find a valid move
    while (!attackSuccess) {
      // looking for a rand num 0-9
      // for x, y cordi
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);

      // if reciveAttack returns true:
      if (enemyBoard.receiveAttack(x, y)) {
        attackSuccess = true;

        this.#shotsTaken.push({ x, y });

        // return the coords of the successful attack
        // for possible UI use
        return { x, y };
      }
    }
  }

  // getter for gameboard
  // to allow access from outside
  // for updating UI
  get gameboard() {
    return this.#gameboard;
  }
}

export default Player;
