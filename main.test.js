import { setupGame, playTurn } from "./main.js";

describe("Game Setup TDD", () => {
  test("setupGame creates players and returns initial state", () => {
    const gameState = setupGame();

    expect(gameState.playerHuman).toBeDefined();
    expect(gameState.playerComputer).toBeDefined();

    const humanBoard = gameState.playerHuman.gameboard;
    const computerBoard = gameState.playerComputer.gameboard;

    expect(humanBoard.getShips()).toHaveLength(5);
    expect(computerBoard.getShips()).toHaveLength(5);

    expect(gameState.currentPlayer).toBe(gameState.playerHuman);
  });

  test("Ships are correctly placed on the board according to PRESET_PLACEMENTS", () => {
    const gameState = setupGame();
    const humanBoard = gameState.playerHuman.gameboard;

    const index00 = humanBoard.coordsToIndex(0, 0);
    const cellData = humanBoard.getGrid()[index00];

    expect(cellData).not.toBeNull();
    expect(cellData.index).toBe(0);
    expect(cellData.ship.length).toBe(5);
  });
});

describe("Game Flow TDD", () => {
  let gameState;

  beforeEach(() => {
    // אתחול המשחק לפני כל בדיקה
    gameState = setupGame();
  });

  test("playTurn should switch turns and process an attack", () => {
    const { playerHuman, playerComputer } = gameState;
    const humanBoard = playerHuman.gameboard;
    const computerBoard = playerComputer.gameboard;

    let nextState = playTurn(gameState, 1, 1);

    expect(nextState.currentPlayer).toBe(playerComputer);

    expect(computerBoard.getMissedAttacks()).toContainEqual({ x: 1, y: 1 });

    // --------------------------------------------------

    const stateAfterComputer = playTurn(nextState);

    expect(stateAfterComputer.currentPlayer).toBe(playerHuman);

    expect(humanBoard.getMissedAttacks().length).toBeGreaterThan(0);
  });
});
