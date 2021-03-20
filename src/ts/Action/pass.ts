import { Action, ActionType } from "./action";
import { GameState } from "../Logic/game-state"
import { Event } from "../Events/events";
import { EventBus } from "../Events/event-bus"
import { ActionContext } from "./action-context";

export class Pass implements Action
{
	public readonly type: ActionType = ActionType.Pass;
	public readonly player: number;
	
	constructor(player: number)
	{
		this.player = player;
	}

	apply(gameState: GameState, incoming: boolean = false): void
	{
		this.applyStealthily(gameState);

		EventBus.instance.raise(Event.PassMade,
			{ player: this.player, incoming })
	}
	
	applyStealthily(gameState: GameState): void
	{
		gameState.history.add(this);
		
		if (gameState.rules.hasWon(gameState))
			gameState.actionContext = ActionContext.GameFinished;
	}

	isLegal(gameState: GameState): boolean
	{
		return gameState.rules.canPass(this.player, gameState);
	}
}