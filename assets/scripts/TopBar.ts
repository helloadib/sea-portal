import {
    _decorator, Component, Node, find, tween, Vec3, Tween, AnimationClip,
    Animation
} from 'cc';
import { GAME_STATE } from './GameState';
const { ccclass, property } = _decorator;

@ccclass('TopBar')
export class TopBar extends Component {

    private optionsButton: Node;
    private optionsButtonPos: Vec3 = new Vec3(0, -80, 0);
    private optionsMenu: Node;
    private playerNode: Node;

    onLoad() {
        this.optionsButton = this.node.getChildByName('OptionsButton');
        this.optionsMenu = find('CanvasUI/OptionsMenu');
        this.playerNode = find('Canvas/Player');

        if (GAME_STATE.CUR_STATE === GAME_STATE.MAIN_MENU) {
            this.showOptionsButton();
        }

        this.playerNode.on('StartGame', this.hideOptionsButton, this);
    }

    showOptionsButton() {
        if (GAME_STATE.CUR_STATE === GAME_STATE.MAIN_MENU) {
            this.optionsButtonPos.y = -80;
            tween(this.optionsButton).by(
                0.5,
                { position: this.optionsButtonPos },
                { easing: 'cubicOut' }
            ).start();
        }
    }

    hideOptionsButton() {
        this.optionsButtonPos.y = 80;
        tween(this.optionsButton).by(
            0.5,
            { position: this.optionsButtonPos },
            { easing: 'cubicIn' }
        ).start();
    }

    showOptionsMenu() {
        this.optionsMenu.active = true;
        this.optionsMenu.getComponent(Animation).getState('EndMenuIn').wrapMode = AnimationClip.WrapMode.Normal;
        this.optionsMenu.getComponent(Animation).play();

        this.hideOptionsButton();
    }
}


