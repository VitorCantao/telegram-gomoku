// Dependencies
import { User } from "./Logic/user";
import { Game } from "./Logic/game";
import { Cursor } from "./cursor";
import { Connection } from "./connection";
import { UIBoard } from "./UI/ui-board";
import { GomokuRules } from "./Rules/gomoku-rules";
import { SoundManager } from "./Logic/sound-manager";
import { UIPlayMarker } from "./UI/ui-play-marker";
import { UIUser } from "./UI/ui-users";
import { UIButtonMap } from "./UI/ui-button-map";

const SIZE = 13;

// TODO: Fazer tela de carregamento até terminar de colocar as peças do histórico no tabuleiro
// TODO: Fazer a janela não rolar em nenhuma direção (https://stackoverflow.com/questions/16637031/completely-disable-scrolling-of-webpage)

window.onload = () => {
    startGameClient();
}

export const localUser: User = new User();

function startGameClient(): void
{
    const game = new Game(SIZE, new GomokuRules());
    const uiBoard = new UIBoard(game.state.board);
	new UIButtonMap(game);
    new UIPlayMarker(uiBoard, game.state);
    new Cursor(game.state);
    new Connection(game);
    new UIUser();
    new SoundManager();
}
