// Dependencies
import { EventBus } from "./Events/event-bus";
import { Game } from "./Logic/game";
import { Play } from "./Action/play";
import { Pass } from "./Action/pass";
import { localUser } from "./script";
import { ActionHistory } from "./Action/action-history";
import { ActionParser } from "./Action/action-parser";

// Types
import { Coordinates } from "./Logic/Board/coordinates"
import { Event } from "./Events/events";
import { ConversionUtilities } from "../conversion-utilities";

type playObject = {
	coordinates: Coordinates,
	player: number, incoming: boolean
}

export class Connection
{
	private socket: WebSocket;

	private readonly _game: Game;

	constructor(readonly game: Game)
	{
		let url: string = 'wss://telegram-gomoku-server.herokuapp.com';
		this.socket = new WebSocket(url);
		this._game = game;

		this.initializeOnOpen();
		this.initializeOnError();

		EventBus.instance.subscribe(Event.PlayMade, (e: playObject) => {
			this.onPlayMade(e)
		});
		
		EventBus.instance.subscribe(Event.PassMade, (e: playObject) => {
			this.onPassMade(e)
		});
	}

	/** @event */
	private onPlayMade(e: playObject)
	{
		if (e.incoming)
			return;
		
		console.log("OnPlayMade:", e.player);
		let obj = {
			"type": "action",
			"action": new Play(e.player, e.coordinates)
		};
		
		this.socket.send(JSON.stringify(obj));
	}
	
	/** @event */
	private onPassMade(e: playObject)
	{
		if (e.incoming)
			return;
		
		console.log("OnPlayMade:", e.player);
		let obj = {
			"type": "action",
			"action": new Pass(e.player)
		};
		
		this.socket.send(JSON.stringify(obj));
	}
	
	private initializeOnOpen()
    {
		this.socket.onopen = () => { 
			this.socket.send(JSON.stringify({
				"type": "room_request",
				"data": ConversionUtilities.b64ToUtf8((window.location.search).substr(1)) // Decode base64. Must remove the first character "?"
			}));
			
			console.log('connected');
		}

		this.setUpSocketReceivingBehavior();
	}

	private initializeOnError()
	{
		this.socket.onerror = () => {
			document.getElementById('loader').classList.add("failure");
		}
	}

	private setUpSocketReceivingBehavior()
	{
		this.socket.onmessage = (e) => {
			try
			{
				console.log('Received:', e.data);
				const data = JSON.parse(e.data);

				switch(data.type)
				{
					case "action":
						this.handleAction(data.action);
						break;

					case "room_request_answer":
						this.handleRoomRequestAnswer(data);
						break;
					
					case "history":
						this.handleHistory(data.actionHistory);
						break;

					case "player2_connected":
						this.handleSecondPlayerConnected(data);
						break;
					
                    case "photos":
                        EventBus.instance.raise(Event.UsersPhotoUpdated, data);
                        break;
                    
                    case "connection_update":
                        EventBus.instance.raise(Event.ConnectionStatusUpdated, data);
                        break;
					
					default:
						console.warn("Received message of unknown type through websocket!", e.data);
						break;
				}
			}
			catch(err) { throw err; }
		};
	}

	private handleHistory(actions: object[]): void
	{
		console.log("Loading game state!", actions);

		let history = new ActionHistory();
		for (let action of actions)
		{
			history.add(ActionParser.parse(action));
		}

		this._game.loadGameStateFrom(history);
	}

	private handleRoomRequestAnswer(obj: any): void
	{
		console.log("Room request answered!");

        localUser.setPlayerNumber(obj.player_number);
        
        EventBus.instance.raise(Event.UsersNameUpdated, obj); //TODO: change to ConnectionAccepted?
		
        document.getElementById('loading-screen').remove();

         // TODO: testing animation. Refactor!
        document.getElementById("stripe").style.animation = "background 1s ease-out";
        document.getElementById("color-texts-top").style.animation = "swipe-left 1.25s ease-out";
        document.getElementById("color-texts-bottom").style.animation = "swipe-right 1.25s ease-out";

        let bottomPhoto: any = document.getElementsByClassName('user-photo')[1];
        bottomPhoto.style.height = "100%";
	}
	
	private handleSecondPlayerConnected(obj: any): void
	{
		document.getElementById("player_name_top").innerText = obj.player2_name;

		let image2: HTMLImageElement = document.getElementById("photo_top") as HTMLImageElement;
        image2.src = obj.url;

        // TODO: testing animation. Refactor!
        let bottomPhoto: any = document.getElementsByClassName('user-photo')[0];
        bottomPhoto.style.height = "100%";
	}

	private handleAction(obj: any): void
	{
		console.log("A new action has arrived!", obj);

		let action = ActionParser.parse(obj);
		if (!action.isLegal(this._game.state))
			console.error("Incoming action illegal!\n", action);
		
		action.apply(this._game.state, true);
	}
}