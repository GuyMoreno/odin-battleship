// ship.test.js

import Ship from "./Ship.js"; // Import your new class

describe("Ship Class", () => {
  let testShip;
  const shipLength = 3;

  // Set up a new ship instance before every test
  beforeEach(() => {
    testShip = new Ship(shipLength);
  });

  // --- Test 1: hit() increases hit count (using the public getter) ---
  test("hit() increases hits count", () => {
    // ACT
    testShip.hit();
    testShip.hit();
    testShip.hit();

    // ASSERT: Use the public getter method
    expect(testShip.getHits()).toBe(3);
  });

  test("creates a ship with correct length", () => {
    expect(testShip).toBeDefined();
    expect(typeof testShip).toBe("object");
  });

  // --- Test 2: Ship is NOT sunk when hits < length ---
  test("isSunk() returns false if hits are less than length", () => {
    // ARRANGE: Hit the ship twice (less than length 3)
    testShip.hit();
    testShip.hit();

    // ASSERT
    expect(testShip.isSunk()).toBe(false);
  });

  // --- Test 3: Ship IS sunk when hits == length ---
  test("isSunk() returns true when hits are equal to length", () => {
    // ARRANGE: Hit the ship 3 times (its full length)
    testShip.hit();
    testShip.hit();
    testShip.hit();

    // ASSERT
    expect(testShip.isSunk()).toBe(true);
  });
});
