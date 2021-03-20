// Dependencies
import { EventBus } from "../Events/event-bus";
import { UIBoard } from "./ui-board";
import { GameState } from "../Logic/game-state";
import { Play } from "../Action/play";

// Types
import { ActionType } from "../Action/action";
import { Coordinates } from "../Logic/Board/coordinates"
import { Event } from "../Events/events";

export class UIPlayMarker
{
    private _uiBoard: UIBoard;
    private _gameState: GameState;
    
	private element: HTMLDivElement;
	
	constructor(readonly uiBoard: UIBoard, readonly gameState: GameState)
    {
        this._gameState = gameState;
        this._uiBoard = uiBoard;

		this.initializeElement();
		
		EventBus.instance.subscribe(Event.PlayMade,
			(e: { coordinates: Coordinates }) => { this.onPlayMade(e); });
		
		EventBus.instance.subscribe(Event.PassMade,
			() => { this.onPassMade(); });
		
		EventBus.instance.subscribe(Event.HistoryLoaded,
			() => { this.onHistoryLoaded(); });
	}
	
    private initializeElement(): void
    {
        this.element = document.createElement("div");
        this.element.setAttribute("class", "circle-mark");
        this.hide();
    }

	/** @event */
	private onHistoryLoaded(): void
	{
		let lastAction = this._gameState.history.last();
		if (lastAction == null)
		{
			this.hide();
		}
		else if (lastAction.type == ActionType.Play)
        {
            let play = lastAction as Play;

			this.moveTo(play.coordinates);
			this.show();
		}

		this.show();
	}

	/** @event */
	private onPlayMade(e: { coordinates: Coordinates }): void
    {
		this.moveTo(e.coordinates);
		this.show();
	}

    /** @event */
	private onPassMade(): void
	{
		this.hide();
	}
	
	private moveTo(coordinates: Coordinates): void 
	{
		let x = coordinates.x;
		let y = coordinates.y;
		
		let uiPoint = this._uiBoard.uiPoints[x][y];
        uiPoint.element.appendChild(this.element);
	}
	
	private show(): void
	{
		this.element.setAttribute("display", "initial");
	}

	private hide(): void
	{
		this.element.setAttribute("display", "none");
	}
}