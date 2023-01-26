import {
    _decorator, Component, Node, tween, Vec3, find, Animation, sys
} from 'cc';
import { Dialog } from './Dialog';
import { GAME_STATE } from './GameState';
import { SceneTransition } from './SceneTransition';
const { ccclass, property } = _decorator;

@ccclass('SkipButton')
export class SkipButton extends Component {

    private button: Node;
    private playerNode: Node;
    private buttonPos: Vec3 = new Vec3(0, -80, 0);

    onLoad() {
        this.button = this.node.getChildByName('SkipButton')
        this.playerNode = find('Canvas/Player');

        if (GAME_STATE.CUR_STATE === GAME_STATE.TUTORIAL) {
            this.showButton();
        } else {
            this.playerNode.on('StartGame', this.showButton, this);
        }
    }

    showButton() {
        if (GAME_STATE.CUR_STATE === GAME_STATE.TUTORIAL) {
            this.buttonPos.y = -80;
            tween(this.button).by(
                0.5,
                { position: this.buttonPos },
                { easing: 'cubicOut' }
            ).start();
        }
    }

    skipTutorial() {
        const dialog = find('CanvasUI/Dialog').getComponent(Dialog);

        dialog.createDialog(
            false,
            'Do you want to skip the tutorial?',
            'Yes, Skip',
            this.node,
            'SkipButton',
            'confirmSkipTutorial',
            'No, Stay'
        );
    }

    confirmSkipTutorial() {
        let STComp = find('CanvasUI/SceneTransition').getComponent(SceneTransition);

        GAME_STATE.CACHED_STATE = GAME_STATE.MAIN_MENU;
        sys.localStorage.setItem('Tutorial', 'Done');

        STComp.loadScene('Main');
    }
}


