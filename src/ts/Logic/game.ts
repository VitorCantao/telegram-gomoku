// Dependencies
import { Board } from "./Board/board";
import { ActionHistory } from "../Action/action-history";
import { GameState } from "./game-state";
import { Rules } from "../Rules/rules";
import { EventBus } from "../Events/event-bus";

// Types
import { Event } from "../Events/events";

export class Game
{
	private _state: GameState;
	
	constructor(boardSize: number, rules: Rules)
	{
		let board = new Board(boardSize);
		
		this._state = new GameState(rules, board);

		EventBus.instance.subscribe(Event.PlayMade,
			() => { this.onPlayMade(); }
		); // TODO: Talvez fique dessincronizado 
	}
	
    public get state(): GameState { return this._state; }
    public get rules(): Rules { return this._state.rules }
	public loadGameStateFrom(history: ActionHistory)
	{
		history.actions.forEach(x => x.applyStealthily(this._state));
		
		EventBus.instance.raise(Event.HistoryLoaded);
	}

	/** @event */
	private onPlayMade(): void
	{
        let hasWon = this.state.rules.hasWon(this.state);
        let hasDrawn = this.state.rules.hasDrawn(this.state);
		
        if (hasWon)
            EventBus.instance.raise(Event.Won);
        else if (hasDrawn)
            EventBus.instance.raise(Event.Drawn);
	}
}