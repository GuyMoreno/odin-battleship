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
    // these lines connects the cell data to the ui element
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
// the board element
// function to handle the interaction
export function attachCellListeners(boardElement, handleClick, handleHover) {
  boardElement.onclick = null;
  boardElement.onmouseover = null;
  boardElement.onmouseout = null;

  boardElement.onclick = (event) => {
    const target = event.target;
    // if we are not clicking on a cell, ignore
    if (!target.classList.contains("cell")) return;

    // if cell is already hit or missed on computer board, ignore
    if (
      (target.classList.contains("hit-ship") ||
        target.classList.contains("miss")) &&
      boardElement.dataset.type === "computer"
    ) {
      return;
    }

    // get x and y from data attributes in order to identify the cell
    const x = parseInt(target.dataset.x, 10);
    const y = parseInt(target.dataset.y, 10);
    handleClick(x, y);
  };

  // Hover handling for ship placement preview on human board
  if (handleHover && boardElement.dataset.type === "human") {
    boardElement.onmouseover = (event) => {
      const target = event.target;

      // if we are not hovering on a cell, ignore
      if (!target.classList.contains("cell")) return;
      const x = parseInt(target.dataset.x, 10);
      const y = parseInt(target.dataset.y, 10);
      handleHover(x, y, true); // isEntering = true
    };

    boardElement.onmouseout = (event) => {
      const target = event.target;
      if (!target.classList.contains("cell")) return;
      const x = parseInt(target.dataset.x, 10);
      const y = parseInt(target.dataset.y, 10);
      handleHover(x, y, false); // isEntering = false
    };
  }
}

export function renderPlacementPreview(
  gameboard,
  ship,
  startX,
  startY,
  orientation,
  isEntering
) {
  if (!isEntering) {
    return;
  }

  const boardSize = gameboard.boardSize;
  const humanBoardElement = document
    .getElementById("human-board-container")
    .querySelector(".board");
  if (!humanBoardElement) return;

  let isValidPlacement = true; // נניח שהמיקום חוקי

  for (let i = 0; i < ship.length; i++) {
    let x = startX;
    let y = startY;

    if (orientation === "horizontal") {
      x = startX + i;
    } else if (orientation === "vertical") {
      y = startY + i;
    }

    // בדיקה גסה של גבולות
    if (x < 0 || x >= boardSize || y < 0 || y >= boardSize) {
      isValidPlacement = false; // מחוץ לגבולות
    }

    if (x >= 0 && x < boardSize && y >= 0 && y < boardSize) {
      const index = gameboard.coordsToIndex(x, y);

      const cellData = gameboard.getGrid()[index];
      if (cellData && cellData.ship) {
        isValidPlacement = false; // תא תפוס
      }
    }
  }

  for (let i = 0; i < ship.length; i++) {
    let x = startX;
    let y = startY;

    if (orientation === "horizontal") {
      x = startX + i;
    } else if (orientation === "vertical") {
      y = startY + i;
    }

    if (x < 0 || x >= boardSize || y < 0 || y >= boardSize) {
      continue;
    }

    const cell = humanBoardElement.querySelector(
      `[data-x="${x}"][data-y="${y}"]`
    );
    if (cell) {
      if (isValidPlacement) {
        cell.classList.add("preview-ship");
      } else {
        cell.classList.add("invalid-preview");
      }
    }
  }
}

export function renderPlacementControls(container, orientation, toggleHandler) {
  container.innerHTML = "";

  const orientationEmoji = orientation === "horizontal" ? "↔️" : "↕️";

  const button = document.createElement("button");
  button.id = "toggle-orientation";

  button.textContent = `${orientationEmoji} 🔄`;

  button.onclick = toggleHandler;

  container.appendChild(button);
}

export function clearPreview(containerId = "human-board-container") {
  const humanBoardElement = document
    .getElementById(containerId)
    .querySelector(".board");
  if (humanBoardElement) {
    humanBoardElement
      .querySelectorAll(".cell.preview-ship, .cell.invalid-preview")
      .forEach((cell) => {
        cell.classList.remove("preview-ship", "invalid-preview");
      });
  }
}
