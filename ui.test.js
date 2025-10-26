// ui.test.js

import { renderBoard } from "./uiController.js";

describe("UI Rendering TDD", () => {
  test("renderBoard should create a 10x10 grid of cells", () => {
    const container = document.createElement("div");
    container.id = "test-board-container";
    document.body.appendChild(container);

    renderBoard(container, 10, "human");

    const board = container.querySelector(".board");
    expect(board).not.toBeNull();

    const cells = board.querySelectorAll(".cell");
    expect(cells.length).toBe(100);

    expect(cells[0].dataset.x).toBe("0");
    expect(cells[99].dataset.y).toBe("9");
  });
});
