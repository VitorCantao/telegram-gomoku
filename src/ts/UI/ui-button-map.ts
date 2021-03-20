import { EventBus } from "../Events/event-bus";
import { Game } from "../Logic/game";

// Types
import { Event } from "../Events/events"
import { UIConfirmButton } from "./ui-button-confirm";

export class UIButtonMap
{
	private readonly game: Game;

	private confirmButton: UIConfirmButton

	constructor(game: Game)
	{
		this.game = game;
		this.setUpConfirmButton();
		this.setUpPassButton();
	}

	private setUpConfirmButton() 
	{
		let element = document.getElementById("c") as HTMLInputElement;
		element?.addEventListener("click", () => {
			EventBus.instance.raise(Event.ConfirmButtonPressed)
		});
		this.confirmButton = new UIConfirmButton(this.game, element);
	}

	private setUpPassButton()
	{
		let passButton = document.getElementById("p");
		passButton?.addEventListener("click", () => {
			EventBus.instance.raise(Event.PassButtonPressed);
		});
	}
}