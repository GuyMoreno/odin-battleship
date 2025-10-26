import { setupGame, playTurn } from "./main.js";
import { renderBoard, attachCellListeners } from "./ui.js";

let gameState = null;

function updateUI() {
  const { playerHuman, playerComputer, currentPlayer, gameOver, winner } =
    gameState;

  const humanContainer = document.getElementById("human-board-container");
  const computerContainer = document.getElementById("computer-board-container");
  const messageElement = document.getElementById("message");

  renderBoard(humanContainer, playerHuman.gameboard.getGrid(), "human");

  const computerBoardElement = renderBoard(
    computerContainer,
    playerComputer.gameboard.getGrid(),
    "computer"
  );

  if (currentPlayer === playerHuman && !gameOver) {
    computerBoardElement.classList.add("active");
    attachCellListeners(computerBoardElement, handlePlayerTurn);
    messageElement.textContent = "התור שלך! לחץ על לוח המחשב.";
  } else if (!gameOver) {
    // תור המחשב (מפעיל אוטומטית)
    computerBoardElement.classList.remove("active");
    messageElement.textContent = "תור המחשב...";
    // מעביר תור מחשב לאחר השהיה קצרה (כדי לתת ל-UI זמן לרענן)
    setTimeout(handleComputerTurn, 1000);
  }

  // 5. בדיקת סיום משחק
  if (gameOver) {
    messageElement.textContent = `המשחק נגמר! המנצח הוא: ${winner}`;
    computerBoardElement.onclick = null; // מנטרל קליקים
  }
}

// פונקציית הבקר המטפלת בקליק אנושי
function handlePlayerTurn(x, y) {
  // 1. מריץ את לוגיקת המשחק
  const newGameState = playTurn(gameState, x, y);

  // 2. עדכון הסטייט הגלובלי
  gameState = newGameState;

  // 3. עדכון ה-UI
  updateUI();
}

// פונקציית הבקר המטפלת בתור המחשב
function handleComputerTurn() {
  // קריאה ל-playTurn ללא קואורדינטות (מפעיל randomAttack)
  const newGameState = playTurn(gameState);

  // עדכון הסטייט הגלובלי
  gameState = newGameState;

  // עדכון ה-UI והעברת התור לשחקן האנושי (אם המשחק נמשך)
  updateUI();
}

// פונקציית האתחול הראשית
function init() {
  gameState = setupGame();
  updateUI();
}

// התחל את המשחק כאשר ה-DOM מוכן
document.addEventListener("DOMContentLoaded", init);
