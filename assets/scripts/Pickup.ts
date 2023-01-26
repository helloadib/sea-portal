import { _decorator, Component, Node, Collider2D, Contact2DType, UITransform } from 'cc';
import { COLL_GROUP } from './CollisionGroups';
import { ObjectMovement } from './ObjectMovement';
const { ccclass, property } = _decorator;

@ccclass('Pickup')
export class Pickup extends Component {

    private collider: Collider2D;

    start() {
        this.collider = this.node.getComponent(Collider2D);

        this.collider.on(Contact2DType.BEGIN_CONTACT, this.onCollisionEnter, this);
        this.node.addComponent(ObjectMovement);
    }

    onCollisionEnter(self: Collider2D, other: Collider2D) {
        if (other.group === COLL_GROUP.OBSTACLE) {
            let otherHalfHeight = other.node.getComponent(UITransform).contentSize.height / 2;
            let selfHeight = this.node.getComponent(UITransform).contentSize.height;
            let moveDistance = otherHalfHeight + selfHeight * 2;
            let otherPosY = other.node.position.y;
            let otherPosX = other.node.position.x;

            other.node.setPosition(otherPosX, otherPosY + moveDistance);
            this.collider.off(Contact2DType.BEGIN_CONTACT, this.onCollisionEnter, this);
        }
    }
}

