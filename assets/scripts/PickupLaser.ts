import { _decorator, Component, Node, Collider2D, Contact2DType } from 'cc';
import { COLL_GROUP } from './CollisionGroups';
import { LaserBeam } from './LaserBeam';
const { ccclass, property } = _decorator;
import { Pickup } from './Pickup';

@ccclass('PickupLaser')
export class PickupLaser extends Component {
    start() {
        let collider = this.node.getComponent(Collider2D);

        collider.on(Contact2DType.BEGIN_CONTACT, this.pickUpLaser, this)
        this.node.addComponent(Pickup);
    }

    pickUpLaser(self: Collider2D, other: Collider2D) {
        if (other.group === COLL_GROUP.PLAYER) {
            other.node.emit('LaserPickup');
            self.node.destroy();
        }
    }
}


