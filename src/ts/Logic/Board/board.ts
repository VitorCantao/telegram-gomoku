// Dependencies
import { Point } from "./point"

// Types
import { Coordinates } from './coordinates'
import { StoneColor } from "../user";

export class Board
{
	private _size: number;
	private readonly _points: Point[][];

	constructor(size: number)
	{
		this._size = size;
		this._points = this.createPoints();
	}
	
	public get size(): number { return this._size; }
    public get points(): Point[][] { return this._points; }

	public reset(): void
	{
		for (let x = 0; x < this._size; x++)
			for (let y = 0; y < this._size; y++)
				this._points[x][y].state = StoneColor.Empty;
	}

	public getState(coordinates: Coordinates): StoneColor
	{
		return this.points[coordinates.x][coordinates.y].state;
	}

	public setState(coordinates: Coordinates, playColor: StoneColor): void
	{
		this.points[coordinates.x][coordinates.y].state = playColor;
	}

	private createPoints(): Point[][]
	{
		let points: Point[][] = [];
		for (let x = 0; x < this._size; x++)
		{
			points[x] = []
			for (let y = 0; y < this._size; y++)
				points[x][y] = new Point(new Coordinates(x, y));
		}
		
		return points;
	}
}