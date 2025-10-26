// ui.test.js

import { setupGame } from "./main.js";
import { renderBoard } from "./ui.js"; // מייבאים מהקובץ המאוחד
import Gameboard from "./Gameboard.js";

describe("UI Rendering Full Status TDD", () => {
  test("renderBoard should display hit status and hide computer ship status", () => {
    const container = document.createElement("div");
    const humanBoard = new Gameboard(10);
    const computerBoard = new Gameboard(10);

    const compShip = computerBoard.getShips()[0]; // מניחים שיש ספינות
    computerBoard.placeShip(compShip, 5, 5, "horizontal");

    computerBoard.receiveAttack(0, 0);

    computerBoard.receiveAttack(5, 5);

    renderBoard(container, computerBoard.getGrid(), "computer");

    const missCell = container.querySelector('[data-x="0"][data-y="0"]');
    expect(missCell.classList.contains("miss")).toBe(true);

    const hitCell = container.querySelector('[data-x="5"][data-y="5"]');
    expect(hitCell.classList.contains("hit-ship")).toBe(true);

    const hiddenCell = container.querySelector('[data-x="6"][data-y="5"]');
    expect(hiddenCell.classList.contains("empty")).toBe(true);
    expect(hiddenCell.classList.contains("ship")).toBe(false);
  });
});
