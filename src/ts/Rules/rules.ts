// Dependencies
import { GameState } from "../Logic/game-state";

// Types
import { StoneColor } from "../Logic/user";
import { Coordinates } from "../Logic/Board/coordinates";

export interface Rules
{
	readonly numberOfPlayers: number;
	getPlayerColor(playerNumber: number): StoneColor;
	canPass(player: number, gameState: GameState): boolean;
	canMakeMove(gameState: GameState,
			player: number,
			coordinates: Coordinates): boolean;
	canMakeAnyMove(gameState: GameState,
			player: number): boolean;
    hasWon(gameState: GameState): boolean;
    hasDrawn(gameState: GameState): boolean;
}
