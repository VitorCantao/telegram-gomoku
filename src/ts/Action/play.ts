// Dependencies
import { Action, ActionType } from "./action"
import { GameState } from "../Logic/game-state";
import { EventBus } from "../Events/event-bus";

// Types
import { Coordinates } from "../Logic/Board/coordinates";
import { Event } from "../Events/events";
import { ActionContext } from "./action-context";

export class Play implements Action
{
	public readonly coordinates: Coordinates;
	public readonly player: number;
	
	public readonly type: ActionType = ActionType.Play;

	constructor(player: number, coordinates: Coordinates)
	{
		this.player = player;
		this.coordinates = coordinates;
	}

	public apply(gameState: GameState, incoming: boolean = false): void
	{
		this.applyStealthily(gameState);

		EventBus.instance.raise(Event.PlayMade,
			{ coordinates: this.coordinates, player: this.player, incoming })
	}

	/** Apply to gameState without triggering @onPlayMade event */
	public applyStealthily(gameState: GameState): void
	{
		let board = gameState.board;
		let color = gameState.rules.getPlayerColor(this.player);

		board.setState(this.coordinates, color);
		gameState.history.add(this);

		if (gameState.rules.hasWon(gameState))
			gameState.actionContext = ActionContext.GameFinished;
	}

	public isLegal(gameState: GameState): boolean
	{
		return gameState.rules.canMakeMove(gameState, this.player, this.coordinates);
	}
}