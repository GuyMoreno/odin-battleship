// import the classes
import Gameboard from "./Gameboard.js";
import Ship from "./Ship.js";

// use describe for organization
describe("Gameboard Class Logic", () => {
  let board;
  let ship;

  // creates NEW board & ship BEFORE each test for clean slate tests
  beforeEach(() => {
    board = new Gameboard(10);
    ship = new Ship(3);
  });

  // --- Test A: allShipsSunk() returns false if not all ships are sunk ---
  test("A: allShipsSunk() returns false if any ship is not sunk", () => {
    board.placeShip(ship, [0, 0], "horizontal");
    board.receiveAttack([0, 0]);
    board.receiveAttack([0, 1]);
    expect(board.allShipsSunk()).toBe(false);
  });

  // --- Test B: allShipsSunk() returns true when all ships are sunk ---
  test("B: allShipsSunk() returns true when every ship has been sunk", () => {
    const shipB = new Ship(1);
    const shipC = new Ship(1);
    board.placeShip(shipB, [5, 5], "horizontal");
    board.placeShip(shipC, [6, 6], "horizontal");

    board.receiveAttack([5, 5]); // Hits ship B
    board.receiveAttack([6, 6]); // Hits ship C

    expect(board.allShipsSunk()).toBe(true);
  });

  // --- Test C: Ship Placement ---
  test("C: places a ship at specific coordinates", () => {
    const placed = board.placeShip(ship, [0, 0], "horizontal");
    expect(placed).toBe(true);
  });

  // --- Test D: Recording a Hit ---
  test("D: records a hit on a ship part", () => {
    board.placeShip(ship, [0, 0], "horizontal");
    board.receiveAttack([0, 1]);
    expect(ship.getHits()).toBe(1);
  });

  // --- Test E: Recording a Miss ---
  test("E: records a miss when no ship is at coordinates", () => {
    board.receiveAttack([5, 5]);
    expect(board.getMissedAttacks()).toContainEqual([5, 5]);
  });

  // --- Test F: Full Sink Check ---
  test("F: reports true after a single ship is completely sunk", () => {
    board.placeShip(ship, [0, 0], "horizontal");
    board.receiveAttack([0, 0]);
    board.receiveAttack([0, 1]);
    board.receiveAttack([0, 2]);
    expect(board.allShipsSunk()).toBe(true);
  });
});
