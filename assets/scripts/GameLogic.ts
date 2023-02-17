import {
    _decorator, Component, Node, input, Input, KeyCode, EventKeyboard, game,
    find, director, Game, AudioSource, sys
} from 'cc';
import { Dialog } from './Dialog';
import { SETTINGS } from './GameSettings';
import { GAME_STATE } from './GameState';
import { PauseButton } from './PauseButton';
import { SkipButton } from './SkipButton';
const { ccclass, property } = _decorator;

@ccclass('GameLogic')
export class GameLogic extends Component {

    private overlayMenus: Node[];
    private pauseButton: PauseButton;

    onLoad() {
        const audios = this.node.getParent().getComponentsInChildren(AudioSource);
        const backgroundAudio = find('BackgroundAudio');

        GAME_STATE.CUR_STATE = GAME_STATE.CACHED_STATE;

        this.pauseButton = find('CanvasUI').getComponentInChildren(PauseButton);

        this.overlayMenus = [
            find('CanvasUI/EndMenu'),
            find('CanvasUI/PauseMenu'),
            find('CanvasUI/OptionsMenu'),
            find('CanvasUI/Credits'),
            find('CanvasUI/Dialog')
        ]

        if (sys.localStorage.getItem('Volume')) {
            let volume = parseFloat(sys.localStorage.getItem('Volume'));

            SETTINGS.VOLUME = volume;
        }

        for (let i = 0; i < audios.length; i++) {
            audios[i].volume = SETTINGS.VOLUME;
        }

        director.addPersistRootNode(backgroundAudio);
    }

    start() {
        input.on(Input.EventType.KEY_UP, this.back, this);
        game.on(Game.EVENT_HIDE, this.pauseButton.pauseGame, this.pauseButton);
    }

    back(event: EventKeyboard) {
        if (event.keyCode === KeyCode.MOBILE_BACK ||
            event.keyCode === KeyCode.ESCAPE) {
            if (this.checkOverlayMenus()) {
                return;
            } else if (GAME_STATE.CUR_STATE === GAME_STATE.MAIN_MENU) {
                const dialog = find('CanvasUI/Dialog').getComponent(Dialog);

                dialog.createDialog(
                    false,
                    'Do you want to exit the game?',
                    'Yes, Exit',
                    this.node,
                    'GameLogic',
                    'exitGame',
                    'No, Stay'
                );
            } else if (GAME_STATE.CUR_STATE === GAME_STATE.RUNNING) {
                this.pauseButton.pauseGame();
            } else if (GAME_STATE.CUR_STATE === GAME_STATE.TUTORIAL) {
                const skipButton = find('CanvasUI').getComponentInChildren(SkipButton);

                skipButton.skipTutorial();
            }
        }
    }

    checkOverlayMenus(): boolean {
        for (let i = 0; i < this.overlayMenus.length; i++) {
            if (this.overlayMenus[i].active === true) {
                return true;
            }
        }

        return false;
    }

    exitGame() {
        director.purgeDirector();
        director.end();
        game.end();
    }
}


