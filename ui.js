// ui.js
// file that helps us show the game board and handle user interactions

// this func gets:
// the data for a cell and the type of board (human or computer)

// it returns a string that tells us what to show on the screen for that cell
function getCellStatus(cellData, boardType) {
  if (cellData === "miss") return "miss";
  if (cellData === null) return "empty";

  // Is there a ship in this cell?
  if (cellData.ship) {
    if (cellData.wasHit) return "hit-ship";

    if (boardType === "human") return "ship";

    // For computer board, do not reveal ships
    return "empty";
  }

  return "empty";
}

// this func draws the game board
// all the cells

// the func gets: div, grid data, and type of board
export function renderBoard(containerElement, grid, type) {
  // check if board already exists
  let board = containerElement.querySelector(".board");
  // if not, create it
  if (!board) {
    board = document.createElement("div");
    board.classList.add("board", `${type}-board`);
    board.dataset.type = type;
    containerElement.appendChild(board);
  }

  board.innerHTML = "";

  // use sqrt = 100 -> 10
  const size = Math.sqrt(grid.length);

  // check each cell in the grid
  //
  for (let i = 0; i < grid.length; i++) {
    const y = Math.floor(i / size);
    const x = i % size;

    // create a div for each cell
    const cell = document.createElement("div");
    // add class "cell" to each cell
    cell.classList.add("cell");

    // set data attributes for x, y, and index
    // for future reference to identify the cell
    cell.dataset.x = x;
    cell.dataset.y = y;
    cell.dataset.index = i;

    const cellData = grid[i];
    // get the status of the cell
    const status = getCellStatus(cellData, type);

    // add the status as a class to the cell
    cell.classList.add(status);

    board.appendChild(cell);
  }

  // show the new board
  return board;
}

// gets 2 parameters:
// the computer board element
// function to handle the turn
export function attachCellListeners(computerBoardElement, handleTurn) {
  // make sure it's the computer board
  if (computerBoardElement.dataset.type !== "computer") return;

  computerBoardElement.onclick = (event) => {
    const target = event.target;

    if (!target.classList.contains("cell")) return;

    // prevent clicking on a cell that was already attacked
    if (
      target.classList.contains("hit-ship") ||
      target.classList.contains("miss")
    )
      return;

    const x = parseInt(target.dataset.x, 10);
    const y = parseInt(target.dataset.y, 10);

    handleTurn(x, y);
  };
}
