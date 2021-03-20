// Dependencies
import { Action, ActionType } from "./action";

export class ActionHistory
{
	private _actions: Action[] = [];

    public get actions(): readonly Action[]
    {
        return this._actions;
    }

	public last(): Action | null
	{
		if (this._actions.length > 0)
			return this._actions[this._actions.length - 1];
        
        return null;
	}

    public lastOfType(type: ActionType): Action | null
    {
		for (let i = this._actions.length - 1; i >= 0; i--)
		{
			if (this._actions[i].type == type)
				return this._actions[i];
        }
        
        return null;
    }
    
    public getOfType(type: ActionType): Action[]
    {
        let actions: Action[] = [];
        for (let i = this._actions.length - 1; i >= 0; i--)
		{
			if (this._actions[i].type == type)
				actions.push(this._actions[i]);
        }

        return actions;
    }

	public add(action: Action): void
	{
		this._actions.push(action);
	}

	public clear(): void
	{
		this._actions = [];
	}
}