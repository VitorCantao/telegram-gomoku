import { EventBus } from "../Events/event-bus";
import { Game } from "../Logic/game";
import { localUser } from "../script";

// Types
import { Event } from "../Events/events"
import { StoneColor } from "../Logic/user";

// Ideally should be a "decorator" for a button

// Assumes a "checkbox" element for a button, as per our visual design choices

const TXT_YOUR_TURN = "<br>Your turn!";
const TXT_NOT_YOUR_TURN = "<br>Wait..."

export class UIConfirmButton
{
	private element: HTMLInputElement;
	private game: Game;

	constructor(game: Game, element: HTMLInputElement)
	{
		this.game = game;
		this.element = element;

		EventBus.instance.subscribe(Event.PlayMade,
			(e: any) => { this.onConsequence(e) });
		EventBus.instance.subscribe(Event.PassMade,
			(e: any) => { this.onConsequence(e) });
		EventBus.instance.subscribe(Event.HistoryLoaded,
			(e: any) => { this.onConsequence(e) });
		EventBus.instance.subscribe(Event.ConfirmButtonPressed,
			(e: any) => { this.onConsequence(e) });
	}

	private onConsequence(event: any)
	{
		try
		{
			if (this.game.rules.canMakeAnyMove(this.game.state, localUser.player))
			{
				this.element.nextElementSibling.innerHTML = TXT_YOUR_TURN;
				this.turn(this.game.rules.getPlayerColor(localUser.player));
			}
			else
			{
				this.element.nextElementSibling.innerHTML = TXT_NOT_YOUR_TURN;
				this.turnOppositeOf(this.game.rules.getPlayerColor(localUser.player));
			}
		}
		catch
		{}
	}

	private turn(color: StoneColor)
	{
		if (color == StoneColor.Black)
			this.turnBlack();
		else if (color == StoneColor.White)
			this.turnWhite();
		else
			console.error("Button.ts: Unexpected color change request")
	}

	private turnOppositeOf(color: StoneColor)
	{
		if (color == StoneColor.Black)
			this.turnWhite();
		else if (color == StoneColor.White)
			this.turnBlack();
		else
			console.error("Button.ts: Unexpected color change request")
	}

	private turnBlack()
	{
		this.element.checked = false;
	}

	private turnWhite()
	{
		this.element.checked = true;
	}
}
