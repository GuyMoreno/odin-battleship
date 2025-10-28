import { setupGame, playTurn } from "./main.js";
import {
  renderBoard,
  attachCellListeners,
  renderPlacementControls,
  clearPreview, // מיובא כעת מ-ui.js
  renderPlacementPreview, // מיובא מ-ui.js עבור ריחוף
} from "./ui.js";
import Ship from "./Ship.js";

let gameState = null;

// פונקציה 1: שינוי כיוון הספינה
function togglePlacementOrientation() {
  const current = gameState.placementOrientation;
  gameState.placementOrientation =
    current === "horizontal" ? "vertical" : "horizontal";
  updateUI();
}

// פונקציה 2: טיפול בריחוף (מציג תצוגה מקדימה)
function handleCellHover(x, y, isEntering) {
  const {
    playerHuman,
    STANDARD_FLEET_SIZES,
    placementShipIndex,
    placementOrientation,
    isPlacingShips,
  } = gameState;

  if (!isPlacingShips) return; // רק אם אנו במצב מיקום

  clearPreview(); // ניקוי הריחוף הקודם (מיובא מ-ui.js)

  if (isEntering) {
    const shipLength = STANDARD_FLEET_SIZES[placementShipIndex].length;
    const currentShip = new Ship(shipLength); // יוצרים ספינה זמנית לבדיקה

    renderPlacementPreview(
      playerHuman.gameboard,
      currentShip,
      x,
      y,
      placementOrientation,
      isEntering
    );
  }
}

// פונקציה 3: טיפול בקליק על הלוח האנושי (מיקום)
function handlePlacementClick(x, y) {
  const {
    playerHuman,
    STANDARD_FLEET_SIZES,
    placementShipIndex,
    placementOrientation,
  } = gameState;

  // יצירת מופע חדש של ספינה
  const shipLength = STANDARD_FLEET_SIZES[placementShipIndex].length;
  const shipToPlace = new Ship(shipLength);

  // ניסיון מיקום על לוח המשחק האנושי
  const placementSuccessful = playerHuman.gameboard.placeShip(
    shipToPlace,
    x,
    y,
    placementOrientation
  );

  if (placementSuccessful) {
    const nextIndex = placementShipIndex + 1;
    clearPreview(); // ננקה את ה-preview לאחר מיקום מוצלח

    // בדיקה אם כל הספינות מוקמו
    if (nextIndex >= STANDARD_FLEET_SIZES.length) {
      gameState.isPlacingShips = false; // מעבר למצב משחק רגיל
    } else {
      gameState.placementShipIndex = nextIndex; // מעבר לספינה הבאה
    }

    updateUI();
  } else {
    // המיקום נכשל
    console.log("Invalid placement. Try again.");
  }
}

// פונקציה 4: עדכון ה-UI (כולל טיפול במצב מיקום)
function updateUI() {
  const {
    playerHuman,
    playerComputer,
    currentPlayer,
    gameOver,
    winner,
    isPlacingShips,
    STANDARD_FLEET_SIZES,
  } = gameState;

  const humanContainer = document.getElementById("human-board-container");
  const computerContainer = document.getElementById("computer-board-container");
  const messageElement = document.getElementById("message");
  const controlsContainer = document.getElementById("placement-controls");

  renderBoard(humanContainer, playerHuman.gameboard.getGrid(), "human");
  const computerBoardElement = renderBoard(
    computerContainer,
    playerComputer.gameboard.getGrid(),
    "computer"
  );
  const humanBoardElement = humanContainer.querySelector(".board");

  computerBoardElement.onclick = null;
  controlsContainer.innerHTML = ""; // מנקה את קונטיינר הכפתורים בכל רענון

  // 🔥 לוגיקה חדשה: מצב מיקום
  if (isPlacingShips) {
    humanBoardElement.classList.add("active");
    computerBoardElement.classList.remove("active");

    const currentShipData = STANDARD_FLEET_SIZES[gameState.placementShipIndex];
    messageElement.textContent = `Place the ${currentShipData.name} (Length ${currentShipData.length}). Orientation: ${gameState.placementOrientation}`;

    // 🔥 חיבור ה-handleCellHover עבור תצוגה מקדימה
    attachCellListeners(
      humanBoardElement,
      handlePlacementClick,
      handleCellHover
    );

    renderPlacementControls(
      controlsContainer,
      gameState.placementOrientation,
      togglePlacementOrientation
    );
  }

  // לוגיקת משחק רגיל (פועלת רק כש-isPlacingShips=false)
  else if (currentPlayer === playerHuman && !gameOver) {
    humanBoardElement.classList.remove("active");
    computerBoardElement.classList.add("active");
    attachCellListeners(computerBoardElement, handlePlayerTurn); // אין handleHover במצב ירי
    messageElement.textContent = "Your turn";
  } else if (!gameOver) {
    computerBoardElement.classList.remove("active");
    messageElement.textContent = "Computer's turn";
    setTimeout(handleComputerTurn, 1000);
  }

  if (gameOver) {
    messageElement.textContent = `Game Over! The winner is: ${winner}`;
    computerBoardElement.onclick = null;
  }
}

function handlePlayerTurn(x, y) {
  const newGameState = playTurn(gameState, x, y);

  gameState = newGameState;

  updateUI();
}

function handleComputerTurn() {
  const newGameState = playTurn(gameState);

  gameState = newGameState;

  updateUI();
}

function init() {
  gameState = setupGame();
  updateUI();
}

document.addEventListener("DOMContentLoaded", init);
