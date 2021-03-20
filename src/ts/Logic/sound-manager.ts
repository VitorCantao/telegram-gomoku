import { EventBus } from "../Events/event-bus"
import { Event } from "../Events/events"


export class SoundManager
{
    private stoneSoundURL: string = `https://firebasestorage.googleapis.com/v0/b/gomoku-telegram.appspot.com/o/stonePlacedSound.mp3?alt=media&token=9717b01d-0efc-4c3d-b371-973f3215a040`
    private stoneSound: HTMLAudioElement;

    constructor()
    {
        this.stoneSound = new Audio(this.stoneSoundURL);

        EventBus.instance.subscribe(Event.PlayMade, () => {
			this.onPlayMade()
		});
    }

    /** @event */
    private onPlayMade(): void { this.stoneSound.play(); }
}