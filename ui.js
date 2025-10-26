function getCellStatus(cellData, boardType) {
  if (cellData === "miss") return "miss";
  if (cellData === null) return "empty";

  if (cellData.ship) {
    if (cellData.wasHit) return "hit-ship";

    // הצג ספינה רק על הלוח של השחקן עצמו (זה המפתח למבחן!)
    if (boardType === "human") return "ship";

    return "empty"; // לוח מחשב: הסתר ספינה שלא נפגעה
  }

  return "empty";
}

export function renderBoard(containerElement, grid, type) {
  let board = containerElement.querySelector(".board");
  if (!board) {
    board = document.createElement("div");
    board.classList.add("board", `${type}-board`);
    board.dataset.type = type;
    containerElement.appendChild(board);
  }

  board.innerHTML = "";

  const size = Math.sqrt(grid.length);

  for (let i = 0; i < grid.length; i++) {
    const y = Math.floor(i / size);
    const x = i % size;

    const cell = document.createElement("div");
    cell.classList.add("cell");

    cell.dataset.x = x;
    cell.dataset.y = y;
    cell.dataset.index = i;

    const cellData = grid[i];
    const status = getCellStatus(cellData, type);

    cell.classList.add(status);

    board.appendChild(cell);
  }

  return board;
}

export function attachCellListeners(computerBoardElement, handleTurn) {
  if (computerBoardElement.dataset.type !== "computer") return;

  computerBoardElement.onclick = (event) => {
    const target = event.target;

    if (!target.classList.contains("cell")) return;

    const x = parseInt(target.dataset.x, 10);
    const y = parseInt(target.dataset.y, 10);

    handleTurn(x, y);
  };
}
