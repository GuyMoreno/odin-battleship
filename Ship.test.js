import Ship from "./Ship.js";

test("Ship registers hits", () => {
  const ship = new Ship(3);
  ship.hit();
  expect(ship.hits).toBe(1);
});
test("Ship is sunk when hits reach length", () => {
  const ship = new Ship(2);
  ship.hit();
  ship.hit();
  expect(ship.isSunk()).toBe(true);
});

// ship.test.js

describe("Ship Factory", () => {
  // A standard ship object for testing
  let testShip;

  // Setup runs before each test to ensure a clean slate
  beforeEach(() => {
    // Creating a ship of length 3 (e.g., a Destroyer)
    testShip = createShip(3);
  });

  // --- Test 1: Hit function increases hit count ---
  test("hit() increases the number of hits", () => {
    // ARRANGE: Ship is already created in beforeEach
    // ACT: Call the hit function once
    testShip.hit();

    // ASSERT: Check that the number of hits is now 1
    expect(testShip.getHits()).toBe(1);
  });

  // --- Test 2: Ship is NOT sunk when hits < length ---
  test("isSunk() returns false if not enough hits received", () => {
    // ARRANGE: Ship is length 3.
    // ACT: Hit the ship twice
    testShip.hit();
    testShip.hit();

    // ASSERT: Ship should not be sunk yet
    expect(testShip.isSunk()).toBe(false);
  });

  // --- Test 3: Ship IS sunk when hits >= length ---
  test("isSunk() returns true when hits are equal to or greater than length", () => {
    // ARRANGE: Ship is length 3.
    // ACT: Hit the ship 3 times (its full length)
    testShip.hit();
    testShip.hit();
    testShip.hit();

    // ASSERT: Ship should now be sunk
    expect(testShip.isSunk()).toBe(true);
  });
});
