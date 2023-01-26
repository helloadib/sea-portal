import { _decorator, Component, Node, Animation } from 'cc';
import { GAME_STATE } from './GameState';
import { TIME_PROP } from './TimeProp';
const { ccclass, property } = _decorator;

@ccclass('DefaultShadowController')
export class DefaultShadowController extends Component {
    private animationComponent: Animation;
    start() {
        this.animationComponent = this.getComponent(Animation);

        this.animationComponent.getState('ShadowFadeIn').speed = TIME_PROP.TIME_SCALE;
    }

    update(deltaTime: number) {
        if (GAME_STATE.CUR_STATE != GAME_STATE.RUNNING) {
            this.animationComponent.pause();
        } else if (GAME_STATE.CUR_STATE === GAME_STATE.RUNNING && this.animationComponent.getState('ShadowFadeIn').isPaused) {
            this.animationComponent.resume();
        }
    }
}


