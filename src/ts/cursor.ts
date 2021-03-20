// Dependencies
import { UIPoint } from "./UI/ui-point";
import { GameState } from "./Logic/game-state";
import { EventBus } from "./Events/event-bus";
import { Play } from "./Action/play"
import { Pass } from "./Action/pass";
import { localUser } from "./script";

// Types
import { StoneColor } from "./Logic/user";
import { Event } from "./Events/events"


export class Cursor
{
	private _selectedUIPoint: UIPoint | null;
	private _gameState: GameState;

	constructor(gameState: GameState)
	{
		this._gameState = gameState;
		this._selectedUIPoint = null;
		
        EventBus.instance.subscribe(Event.UIPointClicked,
            (data: UIPoint) => { this.onClick(data) });
        EventBus.instance.subscribe(Event.ConfirmButtonPressed,
			() => { this.onConfirm() });
		EventBus.instance.subscribe(Event.PassButtonPressed,
			() => { this.onPassButtonPressed() });
	}
	
	/** @event */
	private onClick(uiPoint: UIPoint): void
    {
        let play = new Play(localUser.player, uiPoint.coordinates);
        
        if (play.isLegal(this._gameState))
        {
            const rules = this._gameState.rules;
            let color = rules.getPlayerColor(localUser.player);    
            this.select(uiPoint, color);
        }
        else
            console.log("Not legal");
	}
	
	/** @event */
	private onConfirm(): void
    {
		if (this._selectedUIPoint == null) return;
		
		let stone = this._selectedUIPoint;
		this.deselect();
		
        let play = new Play(localUser.player, stone.coordinates);
        
		if (play.isLegal(this._gameState))
		{
			play.apply(this._gameState);
		}
        else
            console.log("Not legal");
    }
    
    /** @event */
	private onPassButtonPressed(): void
    {
		this.deselect();
		
        let pass = new Pass(localUser.player);
        
		if (pass.isLegal(this._gameState))
            pass.apply(this._gameState);
        else
            console.log("Not legal");
	}

	private deselect(): void
	{
		if (this._selectedUIPoint == null) return;
		
		this._selectedUIPoint.highlightOFF();
		this._selectedUIPoint = null;
	}
	
	private select(uiPoint: UIPoint, color: StoneColor): void
	{
		this.deselect();
		this._selectedUIPoint = uiPoint;
		this._selectedUIPoint.highlightON(color);
	}
}