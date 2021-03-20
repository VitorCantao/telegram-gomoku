// Dependencies
import { Board } from "./Board/board";
import { ActionHistory } from "../Action/action-history";
import { Rules } from "../Rules/rules";

// Types
import { ActionContext } from "../Action/action-context"

export class GameState
{
	public readonly rules: Rules;
	public readonly board: Board;
	public readonly history: ActionHistory;
    public actionContext: ActionContext = ActionContext.Default;

	constructor(rules: Rules, board: Board, history?: ActionHistory)
	{
		this.rules = rules;
        this.board = board;

        if (history)
            this.history = history;
        else
            this.history = new ActionHistory();
	}
}