import { _decorator, Component, Node, Animation, AnimationClip, director, Button, Sprite, BlockInputEvents } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SceneTransition')
export class SceneTransition extends Component {

    private animComp: Animation;
    private nextScene: string;

    onLoad() {
        this.animComp = this.node.getComponent(Animation);

        this.node.getComponent(Sprite).enabled = true;
    }

    loadScene(scene: string) {
        this.node.getComponent(BlockInputEvents).enabled = true;
        this.nextScene = scene;
        this.animComp.on(Animation.EventType.FINISHED, this.onAnimationEnd, this);
        this.animComp.getState('SceneTransition').wrapMode = AnimationClip.WrapMode.Reverse;
        this.animComp.play();
    }

    onAnimationEnd() {
        director.loadScene(this.nextScene);
    }
}


