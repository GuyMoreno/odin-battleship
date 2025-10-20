// import the classes
import Gameboard from "./Gameboard.js";
import Ship from "./Ship.js";

// use describe for organization
describe("Gameboard Class", () => {
  let testBoard;
  let testShip;
  const shipLength = 3;

  beforeEach(() => {
    testBoard = new Gameboard(10);
    testShip = new Ship(shipLength);
  });

  test("placeShip() stores ship at coordinates", () => {
    const placed = testBoard.placeShip(testShip, 0, 0, "horizontal");
    expect(placed).toBe(true);
  });

  test("receiveAttack() hits ship if present", () => {
    testBoard.placeShip(testShip, 0, 0, "horizontal");
    testBoard.receiveAttack(0, 0);
    expect(testShip.getHits()).toBe(1);
  });

  test("receiveAttack() records missed shot if no ship", () => {
    testBoard.receiveAttack(5, 5);
    expect(testBoard.getMissedAttacks()).toContainEqual({ x: 5, y: 5 });
  });

  test("allShipsSunk() returns false if not all sunk", () => {
    testBoard.placeShip(testShip, 0, 0, "horizontal");
    testBoard.receiveAttack(0, 0);
    expect(testBoard.allShipsSunk()).toBe(false);
  });

  test("allShipsSunk() returns true when all ships sunk", () => {
    const s1 = new Ship(5);
    const s2 = new Ship(3);
    testBoard.placeShip(s1, 0, 0, "horizontal");
    testBoard.placeShip(s2, 7, 9, "horizontal");
    testBoard.receiveAttack(0, 0);
    testBoard.receiveAttack(1, 0);
    testBoard.receiveAttack(2, 0);
    testBoard.receiveAttack(3, 0);
    testBoard.receiveAttack(4, 0);
    // s2
    testBoard.receiveAttack(7, 9);
    testBoard.receiveAttack(8, 9);
    testBoard.receiveAttack(9, 9);

    expect(testBoard.allShipsSunk()).toBe(true);
  });
});
