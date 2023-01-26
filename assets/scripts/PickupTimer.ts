import {
    _decorator, Component, Node, Collider2D, Contact2DType
} from 'cc';
import { COLL_GROUP } from './CollisionGroups';
const { ccclass, property } = _decorator;
import { Pickup } from './Pickup';
import { TIME_PROP } from './TimeProp';

@ccclass('PickupLaser')
export class PickupLaser extends Component {
    start() {
        let collider = this.node.getComponent(Collider2D);

        collider.on(Contact2DType.BEGIN_CONTACT, this.pickUpTimer, this)
        this.node.addComponent(Pickup);
    }

    pickUpTimer(self: Collider2D, other: Collider2D) {
        if (other.group === COLL_GROUP.PLAYER) {
            TIME_PROP.TIME_SCALE -= 1;
            if (TIME_PROP.TIME_SCALE < 1) { TIME_PROP.TIME_SCALE = 1 }
            self.node.destroy();
        }
    }
}


