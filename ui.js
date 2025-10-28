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
// the board element
// function to handle the interaction
export function attachCellListeners(boardElement, handleClick, handleHover) {
  // ודא שאין מאזינים קודמים (מונע כפילויות)
  boardElement.onclick = null;
  boardElement.onmouseover = null;
  boardElement.onmouseout = null;

  boardElement.onclick = (event) => {
    const target = event.target;
    if (!target.classList.contains("cell")) return;

    // לוגיקה למניעת קליק חוזר במצב ירי
    if (
      (target.classList.contains("hit-ship") ||
        target.classList.contains("miss")) &&
      boardElement.dataset.type === "computer"
    ) {
      return;
    }

    const x = parseInt(target.dataset.x, 10);
    const y = parseInt(target.dataset.y, 10);
    handleClick(x, y); // קורא ל-handlePlacementClick או handlePlayerTurn
  };

  // הוספת אירועי ריחוף (רק ללוח האנושי)
  if (handleHover && boardElement.dataset.type === "human") {
    boardElement.onmouseover = (event) => {
      const target = event.target;
      // נבדוק שמרחפים מעל תא ולא מעל הלוח עצמו
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

  // נניח ש-gameboard עבר, ויש לו boardSize (מגיע מ-Gameboard.js)
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
      // 🔥 הוסר ה-break - ממשיכים לבדוק כדי שנסמן גם תאים לא חוקיים שיצאו מהגבול
    }

    // נמשיך רק אם לא יצאנו מגבולות הלוח בבדיקה הנוכחית
    if (x >= 0 && x < boardSize && y >= 0 && y < boardSize) {
      // השתמש ב-coordsToIndex מ-Gameboard (חייב להיות ציבורי)
      const index = gameboard.coordsToIndex(x, y);

      // בדיקה אם התא כבר תפוס על ידי ספינה קיימת
      const cellData = gameboard.getGrid()[index];
      if (cellData && cellData.ship) {
        isValidPlacement = false; // תא תפוס
      }
    }
  }

  // עכשיו נסמן את התאים על הלוח
  for (let i = 0; i < ship.length; i++) {
    let x = startX;
    let y = startY;

    if (orientation === "horizontal") {
      x = startX + i;
    } else if (orientation === "vertical") {
      y = startY + i;
    }

    // ודא שהקואורדינטות בתוך הטווח לפני שמנסים למצוא תא
    if (x < 0 || x >= boardSize || y < 0 || y >= boardSize) {
      continue; // דלג על תאים שמחוץ לגבולות
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

// ------------------------------------------------------------------

// 🔥 הוספת הפונקציה החסרה לרינדור כפתור הסיבוב
export function renderPlacementControls(container, orientation, toggleHandler) {
  container.innerHTML = "";

  const orientationEmoji = orientation === "horizontal" ? "↔️" : "↕️";

  const button = document.createElement("button");
  button.id = "toggle-orientation";

  // רק אימוג'י כיוון + אימוג'י סיבוב
  button.textContent = `${orientationEmoji} 🔄`;

  button.onclick = toggleHandler;

  container.appendChild(button);
}

export function clearPreview(containerId = "human-board-container") {
  const humanBoardElement = document
    .getElementById(containerId)
    .querySelector(".board");
  if (humanBoardElement) {
    // מנקה את שני סוגי ה-preview (חוקי ולא חוקי)
    humanBoardElement
      .querySelectorAll(".cell.preview-ship, .cell.invalid-preview")
      .forEach((cell) => {
        cell.classList.remove("preview-ship", "invalid-preview");
      });
  }
}
