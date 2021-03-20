import { GameState } from "../Logic/game-state";

export enum ActionType
{
	Play = 0,
	Pass = 1,
}

export interface Action
{
	readonly type: ActionType;
	readonly player: number;
	apply(gameState: GameState, incoming: boolean): void;
	applyStealthily(gameState: GameState): void;
	isLegal(gameState: GameState): boolean;
}
