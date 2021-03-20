// Types
import { StoneColor } from "../user"
import { Coordinates } from "./coordinates"

export class Point
{
	private readonly _coordinates: Coordinates;
	private _state: StoneColor;

	constructor(coordinates: Coordinates)
	{
		this._state = StoneColor.Empty;
		this._coordinates = coordinates;
	}

	public get coordinates() { return this._coordinates; }

	public set state(state: StoneColor) { this._state = state; }
	public get state() { return this._state }
}
