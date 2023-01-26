import { _decorator, Component, Node, Animation } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Explosion')
export class Explosion extends Component {
    onLoad() {
        let animationCom = this.node.getComponent(Animation);

        animationCom.on(Animation.EventType.FINISHED, this.destroyObj, this);
    }

    destroyObj() {
        this.node.getParent().destroy();
    }
}


