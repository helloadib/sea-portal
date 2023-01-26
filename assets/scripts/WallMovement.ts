import { _decorator, Component, Node, Animation } from 'cc';
import { GAME_STATE } from './GameState';
import { TIME_PROP } from './TimeProp';
const { ccclass, property } = _decorator;

@ccclass('WallMovement')
export class WallMovement extends Component {

    private animationComponent: Animation;

    onLoad() {
        this.animationComponent = this.getComponent(Animation);
    }

    update(deltaTime: number) {
        if (GAME_STATE.CUR_STATE != GAME_STATE.PAUSED) {
            this.animationComponent.getState('WallMovement').speed = TIME_PROP.TIME_SCALE;

            if (this.animationComponent.getState('WallMovement').isPaused) {
                this.animationComponent.resume();
            }
        } else {
            if (this.animationComponent.getState('WallMovement').isPlaying) {
                this.animationComponent.pause();
            }
        }
    }
}


