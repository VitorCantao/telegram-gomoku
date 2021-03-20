import { Play } from "./play";
import { Action, ActionType } from "./action";
import { Pass } from "./pass";

export class ActionParser
{
    public static parse(obj: any): Action 
    {
        switch (obj.type)
        {
            case ActionType.Play:
                return new Play(obj.player, obj.coordinates);
            
            case ActionType.Pass:
                return new Pass(obj.player);
            
            default:
                throw "Invalid action type";
        }
    }
}
