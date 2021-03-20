// Dependencies
import { GameState } from "../Logic/game-state";
import { GomokuRules } from "./gomoku-rules";

// Types
import { StoneColor } from "../Logic/user";
import { ActionContext } from "../Action/action-context";

export class TESTGomokuRules extends GomokuRules
{
	public getPlayerColor(playerNumber: number): StoneColor
	{
		switch(playerNumber)
		{
			case 1:
				return StoneColor.White;
			case 2:
				return StoneColor.Black;
			default:
				return StoneColor.Empty;
		}
	};
	
	public canPass(player: number, gameState: GameState): boolean
    {
		if (gameState.actionContext == ActionContext.GameFinished) return false;

        const lastAction = gameState.history.last();
		return lastAction?.player != player
	}
}