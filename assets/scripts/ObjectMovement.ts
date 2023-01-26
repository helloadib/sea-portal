import { _decorator, Component, Node, CCFloat, game } from 'cc';
import { GAME_STATE } from './GameState';
import { Spawner } from './Spawner';
import { TIME_PROP } from './TimeProp';
const { ccclass, property } = _decorator;

@ccclass('ObjectMovement')
export class ObjectMovement extends Component {

    private posX: number;
    private posY: number;

    @property(CCFloat)
    movementSpeed: number = 128;

    start() {
        this.posX = this.node.position.x;
    }

    update(deltaTime: number) {
        if (GAME_STATE.CUR_STATE != GAME_STATE.PAUSED) {
            this.posY = this.node.position.y;

            this.posY -= this.movementSpeed * deltaTime * TIME_PROP.TIME_SCALE;
            this.node.setPosition(this.posX, this.posY);
        }
    }
}

