// Dependencies
import { Rules } from "./rules";
import { Play } from "../Action/play";
import { GameState } from "../Logic/game-state";

// Types
import { StoneColor } from "../Logic/user";
import { Coordinates } from "../Logic/Board/coordinates";
import { ActionType } from "../Action/action";
import { ActionContext } from "../Action/action-context";

export class GomokuRules implements Rules
{
	public readonly numberOfPlayers = 2;

	public getPlayerColor(playerNumber: number): StoneColor
	{
		switch(playerNumber)
		{
			case 1:
				return StoneColor.Black;
			case 2:
				return StoneColor.White;
			default:
				return StoneColor.Empty;
		}
	};

	public canPass(player: number, gameState: GameState): boolean 
	{
		return false;
	}

	public canMakeMove(gameState: GameState, player: number,
			coordinates: Coordinates): boolean 
	{
		if (gameState.actionContext == ActionContext.GameFinished)
			return false;
		
		let currentPointState = gameState.board.getState(coordinates);
		let lastMove = gameState.history.last();

		if (currentPointState == StoneColor.Empty)
		{
			// TODO: se colocar turno, mudar o código abaixo para usar turno
			if (lastMove == null)
				return player == 1;
			else
				return player != lastMove.player;
		}
		else
			return false;
	}

	public canMakeAnyMove(gameState: GameState, player: number): boolean
	{
		for (let row of gameState.board.points)
		{
			for (let point of row)
			{
				if (this.canMakeMove(gameState, player, point.coordinates))
					return true;
			}
		}

		return false;
	}
	
	public hasWon(gameState: GameState): boolean
	{
		return new WinChecker(gameState).check();
    }
    
    public hasDrawn(gameState: GameState): boolean
    {
        const playHistory = gameState.history.getOfType(ActionType.Play);

        return gameState.board.size >= playHistory.length;
    }
}

class WinChecker
{
	private gameState: GameState;
	private lastPlacedStone: Play;

	constructor(gameState: GameState)
	{
		this.gameState = gameState;
		this.lastPlacedStone = gameState.history.lastOfType(ActionType.Play) as Play;
	}

	public check(): boolean
    {
        const minPlaysRequiredForAWin = 9;

        const history = this.gameState.history;
        const playHistory = history.getOfType(ActionType.Play);

        if (playHistory.length < minPlaysRequiredForAWin)
            return false;

		return (this.countStonesInARow(+1,+0) >= 5 ||
				this.countStonesInARow(+1,+1) >= 5 ||
				this.countStonesInARow(+0,+1) >= 5 ||
				this.countStonesInARow(+1,-1) >= 5)
	}
	
	private countStonesInARow(xk: number, yk: number): number
	{
		let stoneCount = 1 + this.getEqualStonesInLine(xk, yk) + 
							this.getEqualStonesInLine(-xk, -yk);

		return stoneCount;
	}

	private getEqualStonesInLine(xk: number, yk: number): number
	{
		if (Math.abs(xk) > 1 || Math.abs(yk) > 1 || (yk == 0 && xk == 0)) 
			throw "Incorrect (Xk, Yk). Must be between 0 or 1!";

		let stoneCount = 0;

		let points = this.gameState.board.points;
		let x = this.lastPlacedStone.coordinates.x;
		let y = this.lastPlacedStone.coordinates.y;

		while (points[x + xk] && 
			points[x + xk][y + yk] &&
			points[x + xk][y + yk].state == points[x][y].state)
		{
			stoneCount++;
			xk += Math.sign(xk);
			yk += Math.sign(yk);
		}

		return stoneCount;
	}
}
