import { localUser } from "../script";
import { EventBus } from "../Events/event-bus";
import { Event } from "../Events/events";

enum Status
{
    "Online" = 1,
    "Offline" = 0
}

type statusObject = {
	player1_status: number | Status,
    player2_status: number | Status
}

type photosObject = {
    url1: string,
    url2: string
}

type namesObject = {
    player1_name: string,
    player2_name: string
}

export class UIUser
{
    private player1Text: string;
    private player2Text: string;

    constructor()
    {
        EventBus.instance.subscribe(Event.ConnectionStatusUpdated, (e: statusObject) => {
            this.onPlayerStatusUpdate(e);
        });
        
        EventBus.instance.subscribe(Event.UsersPhotoUpdated, (e: photosObject) => {
            this.onPhotosReceived(e);
        });
        
        EventBus.instance.subscribe(Event.UsersNameUpdated, (e: namesObject) => {
            this.onNamesReceived(e);
	 	});
    }
    
    /** @event */
    private onPlayerStatusUpdate(e: statusObject): void
    {
        const player1ID: HTMLElement = document.getElementById("player_id_" + this.player1Text);
        player1ID.innerText = Status[e.player1_status];

        const player2ID: HTMLElement = document.getElementById("player_id_" + this.player2Text);
        player2ID.innerText = Status[e.player2_status];
    }

    /** @event */
    private onPhotosReceived(e: photosObject): void
    {
        let image1: HTMLImageElement = document.getElementById("photo_" + this.player1Text) as HTMLImageElement;
        let image2: HTMLImageElement = document.getElementById("photo_" + this.player2Text) as HTMLImageElement;

        image1.src = e.url1;

        if (e.url2 != "")
            image2.src = e.url2;
    }

    /** @event */
    private onNamesReceived(e: namesObject): void
    {
        this.InitializeTexts();

        const player1Name: HTMLElement = document.getElementById("player_name_" + this.player1Text);
        const player2Name: HTMLElement = document.getElementById("player_name_" + this.player2Text);

        player1Name.innerText = e.player1_name;
        if (e.player2_name)
            player2Name.innerText = e.player2_name;
    }

    private InitializeTexts(): void
    {
        if (localUser.player == 1)
        {
            this.player1Text = "bottom";
            this.player2Text = "top";

            // ------------ //
            document.getElementById("color-texts-bottom").style.color = "var(--black)";
            document.getElementById("color-texts-top").style.color = "var(--white)";

            document.getElementById("color-bottom").innerText = "BLACKS";
            document.getElementById("color-top-1").innerText = "W";
            document.getElementById("color-top-2").innerText = "HITES";
        }
        else if (localUser.player == 2)
        {
            this.player1Text = "top";
            this.player2Text = "bottom";

            // ------------ //
            document.getElementById("color-texts-bottom").style.color = "var(--white)";
            document.getElementById("color-texts-top").style.color = "var(--black)";

            document.getElementById("color-bottom").innerText = "WHITES";
            document.getElementById("color-top-1").innerText = "B";
            document.getElementById("color-top-2").innerText = "LACKS";
        }
        else
        {
            throw new Error(`Invalid localUser player number (${localUser.player})!`);
        }
    }
}
