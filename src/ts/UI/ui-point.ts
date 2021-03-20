// Dependencies
import { EventBus } from "../Events/event-bus";
import { Point } from "../Logic/Board/point";

// Types
import { Coordinates } from "../Logic/Board/coordinates";
import { StoneColor } from "../Logic/user";
import { Event } from "../Events/events";

export class UIPoint
{
	private readonly _point: Point;
	private readonly _element: Element;
	
	constructor(readonly point: Point, readonly element: Element)
	{
		this._point = point;
		this._element = element;
		
		EventBus.instance.subscribe(Event.PlayMade,
			(e: { coordinates: Coordinates }) => { this.onPlayMade(e); }
		);

		EventBus.instance.subscribe(Event.HistoryLoaded,
			() => { this.onHistoryLoaded(); }
		);
	}

	public reset(): void
	{
		this._element.classList.remove("transparent");
		this._element.classList.remove(StoneColor.Black.toString());
		this._element.classList.remove(StoneColor.White.toString());
	}
    
    public get coordinates(): Coordinates
    {
        return this._point.coordinates;
    }

    public get htmlElement(): Element
    {
        return this._element;
    }

	/** @event */
	private onPlayMade(e: { coordinates: Coordinates  })
	{
		if (e.coordinates.x == this._point.coordinates.x &&
			e.coordinates.y == this._point.coordinates.y)
		{
			this.refreshStoneColor();
		}
	}

	/** @event */
	private onHistoryLoaded()
	{
		this.refreshStoneColor();
	}

	public highlightON(playerColor: StoneColor): void
	{
		this._element.classList.add("transparent");
		this._element.classList.add(playerColor);
	}
	
	public highlightOFF(): void
	{
		this.refreshStoneColor();
	}
	
	private refreshStoneColor(): void
	{
		this.reset();
	
		if (this._point.state != StoneColor.Empty)  
			this._element.classList.add(this._point.state.toString());
	}
}