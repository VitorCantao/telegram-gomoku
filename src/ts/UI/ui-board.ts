// Dependencies
import { Board } from "../Logic/Board/board";
import { UIPoint } from "./ui-point";
import { EventBus } from "../Events/event-bus";

// Types
import { Event } from "../Events/events"

const STONE_SCALE = 0.95;
const STONE_SHADOW_OFFSET_SCALE = 0.065;

export class UIBoard
{
	private board: Board;
	private squareQuantity: number;
	private board_field: HTMLElement | null;
	private _uiPoints: UIPoint[][];
	
	constructor(board: Board)
	{
		this.board = board;
		this.squareQuantity = this.board.size - 1;
		this.board_field = document.getElementById("b");

		this.populateWithHoshi();
		this.createSquares();
		this._uiPoints = this.createUIPoints();
	}

	public get uiPoints(): UIPoint[][] { return this._uiPoints; }

	public reset(): void
	{
		for (let i = 0; i < this.board.size; i++)
			for (let j = 0; j < this.board.size; j++)
				this._uiPoints[i][j].reset();
	}

	private createSquares(): void
	{
		for (let i = 0; i < this.squareQuantity ** 2; i++)
		{
			let newSquare = document.createElement("div");

			newSquare.setAttribute("class", "square");
			newSquare.style.width = 100 / this.squareQuantity + "%";
			newSquare.style.height = 100 / this.squareQuantity + "%";
		
			this.board_field?.appendChild(newSquare);
		}
	}

	private createUIPoints(): UIPoint[][]
	{
		let squareSize = 100 / this.squareQuantity;
		let buttonSize = squareSize * STONE_SCALE;
		let offset = buttonSize * STONE_SHADOW_OFFSET_SCALE;
		document.documentElement.style.setProperty('--shadow-offset', offset + 'vh');

		let uiPoints: UIPoint[][] = []
		for (let i = 0; i < this.board.size; i++)
		{
			uiPoints.push([]);
			for (let j = 0; j < this.board.size; j++)
			{
				let newButton = this.createPointButtonAt(i, j);

				let newUIPoint = new UIPoint(this.board.points[i][j], newButton);
				uiPoints[i].push(newUIPoint);

				newButton.addEventListener("click", () => {
					EventBus.instance.raise(Event.UIPointClicked, newUIPoint);
				}, false);

				this.board_field?.appendChild(newButton);
			}
		}

		return uiPoints;
	}

	private createPointButtonAt(x: number, y: number): HTMLDivElement
	{
		let squareSize = 100 / this.squareQuantity;
		let buttonSize = squareSize * STONE_SCALE;
		let circle = document.createElement("div");
		circle.setAttribute("class", "circle");

		circle.style.width = buttonSize + "%";
		circle.style.height = buttonSize + "%";

		circle.style.left = (squareSize * x) - (buttonSize / 2) + "%";
		circle.style.top = (squareSize * y) - (buttonSize / 2) + "%";

		return circle;
	}
	
	private createHoshi(x: number, y: number)
	{
		let squareSize = 100 / this.squareQuantity;
		let size = squareSize * 0.01675 * this.squareQuantity;

		let dot = document.createElement("div");
		dot.setAttribute("class", "square-dot");
		
		dot.style.width = size + "%";
		dot.style.height = size + "%";

		dot.style.left = (squareSize * x) - (size / 2) + "%";
		dot.style.top = (squareSize * y) - (size / 2) + "%";
		
		this.board_field?.appendChild(dot);
	}

	private populateWithHoshi()
	{
		// arbitrary placement, chosen mostly for aesthetics
		let a: number;
		if (this.board.size <= 2)
			return;
		else if (this.board.size <= 9)
			a = 2;
		else if (this.board.size <= 19)
			a = 3;
		else
			a = Math.floor(this.squareQuantity / 4);
		
		// corners
		let b = this.squareQuantity - a;
		this.createHoshi(a, a);
		this.createHoshi(b, a);
		this.createHoshi(a, b);
		this.createHoshi(b, b);

		// tengen
		let c = Math.floor(this.squareQuantity / 2);
		this.createHoshi(c, c);

		// sides
		if (this.board.size >= 19 && this.board.size % 2)
		{
			this.createHoshi(a, c);
			this.createHoshi(b, c);
			this.createHoshi(c, a);
			this.createHoshi(c, b);
		}
	}
	

}