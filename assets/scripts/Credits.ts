import { _decorator, Component, Node, Animation, AnimationClip, input, Input, EventKeyboard, KeyCode } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Credits')
export class Credits extends Component {

    private animComp: Animation;
    private eventBlocker: Node;
    private optionsMenu: Node;

    onLoad() {
        this.animComp = this.node.getComponent(Animation);
        this.eventBlocker = this.node.getChildByName('EventBlocker');
        this.optionsMenu = this.node.getParent().getChildByName('OptionsMenu');
    }

    onEnable() {
        input.on(Input.EventType.KEY_UP, this.checkForInputKey, this);
        
        this.eventBlocker.active = true;
        this.animComp.on(Animation.EventType.FINISHED, this.disableEventBlocker, this);
    }

    onDisable() {
        input.off(Input.EventType.KEY_UP, this.checkForInputKey, this);
    }

    disableEventBlocker() {
        this.eventBlocker.active = false;
        this.animComp.off(Animation.EventType.FINISHED, this.disableEventBlocker, this);
    }

    checkForInputKey(event: EventKeyboard) {
        if (event.keyCode === KeyCode.MOBILE_BACK ||
            event.keyCode === KeyCode.ESCAPE) {
            this.back();
        }
    }

    back() {
        this.eventBlocker.active = true;
        this.animComp.getState('EndMenuIn').wrapMode = AnimationClip.WrapMode.Reverse;
        this.animComp.play();
        this.animComp.on(Animation.EventType.FINISHED, this.disableMenu, this);

        this.optionsMenu.active = true;
        this.optionsMenu.getComponent(Animation).getState('EndMenuIn').wrapMode = AnimationClip.WrapMode.Normal;
        this.optionsMenu.getComponent(Animation).play();
    }

    disableMenu() {
        this.animComp.off(Animation.EventType.FINISHED, this.disableMenu, this);
        this.eventBlocker.active = false;
        this.node.active = false;
    }
}


