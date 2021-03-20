/** Maps to **CSS Style** */
export enum StoneColor
{
	Black = "black",
    White = "white",
    Empty = "none" // TODO: None = ""
};

export class User
{
	private _playerNumber: number = 0;

    public setPlayerNumber(number: number): void
    {
        this._playerNumber = number;

        if (this._playerNumber == 1 || this._playerNumber == 2)
            console.log("You are Player #" + this._playerNumber);
        else
            console.log("You are a spectator!");
    }
	public get player(): number { return this._playerNumber }
}