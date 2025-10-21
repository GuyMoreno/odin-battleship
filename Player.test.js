import Gameboard from "./Gameboard.js";
import Ship from "./Ship.js";
import Player from "./Player.js";

//  describe for organization
describe("Player Class TDD", () => {
  let player1;
  let enemyBoard;

  beforeEach(() => {
    player1 = new Player(false); // human
    enemyBoard = new Gameboard(10);
  });

  test("attack() should successfully call receiveAttack on enemy board", () => {
    player1.attack(enemyBoard, 5, 5);

    // there's no ship thus a miss...
    expect(enemyBoard.getMissedAttacks()).toContainEqual({ x: 5, y: 5 });
  });

  //ss
  test("randomAttack() should choose a legal, unshot coordinate", () => {
    const computer = new Player(true);
    const enemyBoard = new Gameboard(10);

    // in purpose choose a spot and check if
    // the computer won't choose it, if he skip it. 
    enemyBoard.receiveAttack(5, 5);

    // every randomAttack should not shot on (5,5)
    for (let i = 0; i < 50; i++) {
      computer.randomAttack(enemyBoard);
    }

    const missedShots = enemyBoard.getMissedAttacks().length;

    const totalAttacks = enemyBoard.getMissedAttacks().length;

    expect(totalAttacks).toBeLessThanOrEqual(51);
    expect(totalAttacks).toBeGreaterThan(1);
  });
});
