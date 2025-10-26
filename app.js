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
