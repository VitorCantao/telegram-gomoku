// Types
import { Event } from "./events";

export class EventBus
{
	private static _instance: EventBus;

    /* Unfortunately, Typescript doesn't allow Enum as 
       index Signature, so here we use enum Event as a number */
	private listeners: { [event: number]: Function[] } = { }

	private keyCounter: number = 0;

	private keyToListener: { [key: number]: Function } = { }

	private constructor() { }

	public static get instance(): EventBus
	{
		if (!EventBus._instance)
	  		EventBus._instance = new EventBus();

		return EventBus._instance;
	}

	/** @return Key used for unsubscribing */
	public subscribe(event: Event, listener: Function): number
	{
		if (!this.listeners[event])
			this.listeners[event] = [];

		this.listeners[event].push(listener);
		this.keyToListener[this.keyCounter] = listener;
		return this.keyCounter++;
	}

	/** @param key This key is returned by the `subscribe` method */
	public unsubscribe(event: Event, key: number): void
	{
		if (!this.listeners[event])
			return;

		for (var i = 0; i < this.listeners[event].length; i++) 
		{
			if (this.listeners[event][i] === this.keyToListener[key]) 
			{
				this.listeners[event].splice(i, 1);
				break;
			}
		}
	}

	public raise(event: Event, params?: any): void
	{
		if (!this.listeners[event])
			return;

        console.log(Object.values(Event)[event], params) //TODO: Remove on distribution
        this.listeners[event].forEach((listener) => {
            try { listener(!!params ? params : {}); }
            catch (e) {
                console.warn("Callback doesn't exist anymore!");
                console.error(e); }
		});
	}

	public getListeners(event: Event): Function[]
	{
		return this.listeners[event];
	}
}