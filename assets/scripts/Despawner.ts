import { _decorator, Component, Node, Collider2D, Contact2DType } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Despawner')
export class Despawner extends Component {
    start() {
        let collider = this.node.getComponent(Collider2D);
        
        collider.on(Contact2DType.END_CONTACT, this.despawnObj, this);
    }

    despawnObj(self: Collider2D, other: Collider2D) {
        other.node.destroy();
    }
}

