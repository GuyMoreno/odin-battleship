import Player from "./Player.js";
import { STANDARD_FLEET_SIZES } from "./constants.js"; // גדלי הספינות שקבענו
import Ship from "./Ship.js";

const PRESET_PLACEMENTS = [
  // Carrier (5)
  { length: 5, x: 0, y: 0, orientation: "horizontal" },
  // Battleship (4)
  { length: 4, x: 0, y: 2, orientation: "horizontal" },
  // Cruiser (3)
  { length: 3, x: 0, y: 4, orientation: "horizontal" },
  // Submarine (3)
  { length: 3, x: 9, y: 0, orientation: "vertical" },
  // Destroyer (2)
  { length: 2, x: 7, y: 9, orientation: "horizontal" },
];

function placePresetShips(player, placements) {
  const board = player.gameboard;

  placements.forEach((data) => {
    const newShip = new Ship(data.length);

    board.placeShip(newShip, data.x, data.y, data.orientation);
  });
}

export function setupGame() {
  const playerHuman = new Player(false);
  const playerComputer = new Player(true);

  placePresetShips(playerHuman, PRESET_PLACEMENTS);
  placePresetShips(playerComputer, PRESET_PLACEMENTS);

  const currentPlayer = playerHuman;

  return {
    playerHuman,
    playerComputer,
    currentPlayer,
  };
}

function checkGameOver(player) {
  return player.gameboard.allShipsSunk();
}

export function playTurn(gameState, x = null, y = null) {
  const { playerHuman, playerComputer, currentPlayer } = gameState;
  const enemy = currentPlayer === playerHuman ? playerComputer : playerHuman;

  if (gameState.gameOver) {
    return gameState;
  }

  if (currentPlayer === playerHuman) {
    currentPlayer.attack(enemy.gameboard, x, y);
  } else {
    currentPlayer.randomAttack(enemy.gameboard);
  }

  const nextPlayer = enemy;
  const isGameOver = checkGameOver(enemy);

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
