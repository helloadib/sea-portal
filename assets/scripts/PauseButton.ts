import {
    _decorator, Component, Node, tween, Vec3, find, input, Input, Animation,
    AnimationClip
} from 'cc';
import { GAME_STATE } from './GameState';
import { PlayerLogic } from './PlayerLogic';
const { ccclass, property } = _decorator;

@ccclass('PauseButton')
export class PauseButton extends Component {

    private pauseButton: Node;
    private playerNode: Node;
    private pauseButtonPos: Vec3 = new Vec3(0, 80, 0);
    private pauseMenu: Node;

    onLoad() {
        this.pauseButton = this.node.getChildByName('PauseButton')
        this.playerNode = find('Canvas/Player');
        this.pauseMenu = find('CanvasUI/PauseMenu');

        if (GAME_STATE.CUR_STATE === GAME_STATE.RUNNING) {
            this.showPauseButton();
        } else {
            this.playerNode.on('StartGame', this.showPauseButton, this);
        }
    }

    showPauseButton() {
        if (GAME_STATE.CUR_STATE === GAME_STATE.RUNNING) {
            this.pauseButtonPos.y = 80;
            tween(this.pauseButton).by(
                0.5,
                { position: this.pauseButtonPos },
                { easing: 'cubicOut' }
            ).start();
        }
    }

    pauseGame() {
        if (GAME_STATE.CUR_STATE === GAME_STATE.RUNNING) {
            const playerLogic = this.playerNode.getComponent(PlayerLogic);

            GAME_STATE.CUR_STATE = GAME_STATE.PAUSED;

            input.off(Input.EventType.TOUCH_START, playerLogic.startDragging, playerLogic);
            input.off(Input.EventType.TOUCH_MOVE, playerLogic.dragPlayer, playerLogic);
            input.off(Input.EventType.TOUCH_END || Input.EventType.TOUCH_CANCEL, playerLogic.stopDragging, playerLogic);
            input.off(Input.EventType.TOUCH_MOVE, playerLogic.showPortalDestination, playerLogic);

            this.pauseMenu.active = true;
            this.pauseMenu.getComponent(Animation).getState('EndMenuIn').wrapMode = AnimationClip.WrapMode.Normal;
            this.pauseMenu.getComponent(Animation).play();

            this.pauseButtonPos.y = -80;
            tween(this.pauseButton).by(0.5, { position: this.pauseButtonPos }, { easing: 'cubicOut' }).start();
        }
    }
}


