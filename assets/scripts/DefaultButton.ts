import { _decorator, Component, Node, AudioSource } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DefaultButton')
export class DefaultButton extends Component {
    playAudio() {
        this.node.getComponent(AudioSource).stop();
        this.node.getComponent(AudioSource).play();
    }
}


