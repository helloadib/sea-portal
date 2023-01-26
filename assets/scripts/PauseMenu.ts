import {
    _decorator, Component, Node, AnimationClip, input, Input, tween, find,
    Animation,
    EventKeyboard,
    KeyCode
} from 'cc';
import { GAME_STATE } from './GameState';
import { PauseButton } from './PauseButton';
import { PlayerLogic } from './PlayerLogic';
const { ccclass, property } = _decorator;

@ccclass('PauseMenu')
export class PauseMenu extends Component {

    private playerLogic: PlayerLogic;
    private pauseButton: PauseButton;
    private animationComp: Animation;
    private eventBlocker: Node;

    onLoad() {
        this.playerLogic = find('Canvas/Player').getComponent(PlayerLogic);
        this.pauseButton = find('CanvasUI/PauseButtonContainer').getComponent(PauseButton);
        this.animationComp = this.node.getComponent(Animation);
        this.eventBlocker = this.node.getChildByName('EventBlocker');
    }

    onEnable() {
        input.on(Input.EventType.KEY_UP, this.checkForInputKey, this);
    }

    onDisable() {
        input.off(Input.EventType.KEY_UP, this.checkForInputKey, this);
    }

    checkForInputKey(event: EventKeyboard) {
        if (event.keyCode === KeyCode.MOBILE_BACK ||
            event.keyCode === KeyCode.ESCAPE) {
            this.resumeGame();
        }
    }

    resumeGame() {
        this.eventBlocker.active = true;
        this.animationComp.getState('EndMenuIn').wrapMode = AnimationClip.WrapMode.Reverse;
        this.animationComp.play();
        this.animationComp.on(Animation.EventType.FINISHED, this.disableMenu, this);
    }

    disableMenu() {
        this.animationComp.off(Animation.EventType.FINISHED, this.disableMenu, this);
        this.eventBlocker.active = false;
        this.node.active = false;

        GAME_STATE.CUR_STATE = GAME_STATE.RUNNING;

        this.pauseButton.showPauseButton();

        input.on(Input.EventType.TOUCH_START, this.playerLogic.startDragging, this.playerLogic);
        input.on(Input.EventType.TOUCH_END || Input.EventType.TOUCH_CANCEL, this.playerLogic.stopDragging, this.playerLogic);
        input.on(Input.EventType.TOUCH_MOVE, this.playerLogic.showPortalDestination, this.playerLogic);
    }
}


