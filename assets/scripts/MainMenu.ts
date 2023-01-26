import { _decorator, Component, Node, Animation, AnimationClip } from 'cc';
import { GAME_STATE } from './GameState';
const { ccclass, property } = _decorator;

@ccclass('MainMenu')
export class MainMenu extends Component {

    private animationComp: Animation;

    start() {
        this.animationComp = this.node.getComponent(Animation);

        if (GAME_STATE.CUR_STATE === GAME_STATE.MAIN_MENU) {
            let playerNode = this.node.getParent().getChildByName('Player');

            this.animationComp.play('MainMenuIn');
            playerNode.on('StartGame', this.hideMainMenu, this);
        }
    }

    hideMainMenu() {
        this.animationComp.play('MainMenuOut');
    }

    update(deltaTime: number) {
        if (GAME_STATE.CUR_STATE === GAME_STATE.PAUSED &&
            this.animationComp.getState('MainMenuOut').isPlaying) {
            this.animationComp.pause();
        } else if (this.animationComp.getState('MainMenuOut').isPaused) {
            this.animationComp.resume();
        }
    }
}


