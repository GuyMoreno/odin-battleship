import Player from "./Player.js";
import { STANDARD_FLEET_SIZES } from "./constants.js";
import Ship from "./Ship.js";
// 🔥 הוספת ייבוא הפונקציה checkGameOver לפתרון השגיאה
import { checkGameOver } from "./Gameboard.js";

// run once function to setup game with manual placement state
export function setupGame() {
  const playerHuman = new Player(false);
  const playerComputer = new Player(true);

  // מציב ספינות רנדומלית רק עבור המחשב. הלוח האנושי נשאר ריק למיקום ידני.
  placeShipsRandomly(playerComputer.gameboard);

  const currentPlayer = playerHuman;

  return {
    playerHuman,
    playerComputer,
    currentPlayer,
    gameOver: false,
    winner: null,

    // הסטייט להתחלה במצב מיקום ידני
    isPlacingShips: true,
    placementShipIndex: 0,
    placementOrientation: "horizontal",
    STANDARD_FLEET_SIZES: STANDARD_FLEET_SIZES,
  };
}

// manage a single turn for either player
// gets: game state object, x and y coordinates (if human)
export function playTurn(gameState, x = null, y = null) {
  // destructure game state from the object
  const { playerHuman, playerComputer, currentPlayer } = gameState;

  // Who is the enemy?
  const enemy = currentPlayer === playerHuman ? playerComputer : playerHuman;

  if (gameState.gameOver) {
    return gameState;
  }

  if (currentPlayer === playerHuman) {
    // human player attack with given coordinates
    currentPlayer.attack(enemy.gameboard, x, y);
  } else {
    // computer player attack randomly
    currentPlayer.randomAttack(enemy.gameboard);
  }

  // הפונקציה מיובאת כעת וניתן להשתמש בה
  const isGameOver = checkGameOver(enemy);

  const nextPlayer = enemy;

  return {
    ...gameState,
    currentPlayer: nextPlayer,
    gameOver: isGameOver,
    winner: isGameOver
      ? currentPlayer === playerHuman
        ? "Human"
        : "Computer"
      : null,
  };
}

function placeShipsRandomly(board) {
  const fleet = STANDARD_FLEET_SIZES.map(
    (shipData) => new Ship(shipData.length)
  );

  const boardSize = board.boardSize;

  fleet.forEach((ship) => {
    let placed = false;
    let attempts = 0;
    const MAX_ATTEMPTS = 1000;

    while (!placed && attempts < MAX_ATTEMPTS) {
      const x = Math.floor(Math.random() * boardSize);
      const y = Math.floor(Math.random() * boardSize);
      const orientation = Math.random() < 0.5 ? "horizontal" : "vertical";

      if (board.placeShip(ship, x, y, orientation)) {
        placed = true;
      }
      attempts++;
    }

    if (!placed) {
      console.error(
        `Placement FAILED for ship of length ${ship.length} after ${MAX_ATTEMPTS} attempts.`
      );
    }
  });
}
