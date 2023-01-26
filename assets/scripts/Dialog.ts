import {
    _decorator, Component, Node, Button, RichText, Label, Animation,
    AnimationClip,
    EventKeyboard,
    input,
    Input,
    KeyCode
} from 'cc';
import { GAME_STATE } from './GameState';
const { ccclass, property } = _decorator;

@ccclass('Dialog')
export class Dialog extends Component {

    private buttons: Button[];
    private message: RichText;
    private animComp: Animation;
    private eventBlocker: Node;

    onLoad() {
        this.buttons = this.node.getComponentsInChildren(Button);
        this.message = this.node.getComponentInChildren(RichText);
        this.animComp = this.node.getComponent(Animation);
        this.eventBlocker = this.node.getChildByName('EventBlocker');
    }

    onEnable() {
        input.on(Input.EventType.KEY_UP, this.checkForInputKey, this);
    }

    onDisable() {
        input.off(Input.EventType.KEY_UP, this.checkForInputKey, this);
    }

    checkForInputKey(event: EventKeyboard) {
        if (event.keyCode === KeyCode.MOBILE_BACK ||
            event.keyCode === KeyCode.ESCAPE) {
            this.rejectDialog();
        }
    }

    createDialog(
        isPaused: boolean,
        message: string,
        button1: string,
        target1: Node,
        component1: string,
        handler1: string,
        button2?: string,
        target2?: Node,
        component2?: string,
        handler2?: string
    ) {
        GAME_STATE.CACHED_STATE = GAME_STATE.CUR_STATE;

        if (isPaused) {
            GAME_STATE.CUR_STATE = GAME_STATE.PAUSED;
        }

        this.node.active = true;

        this.message.string = message;

        this.buttons[0].node.getComponentInChildren(Label).string = button1;
        this.buttons[0].clickEvents[0].target = target1;
        this.buttons[0].clickEvents[0].component = component1;
        this.buttons[0].clickEvents[0]._componentName = component1;
        this.buttons[0].clickEvents[0].handler = handler1;

        this.buttons[1].node.getComponentInChildren(Label).string = button2 || 'No';
        this.buttons[1].clickEvents[0].target = target2 || this.node;
        this.buttons[1].clickEvents[0].component = component2 || 'Dialog';
        this.buttons[1].clickEvents[0]._componentName = component2 || 'Dialog';
        this.buttons[1].clickEvents[0].handler = handler2 || 'rejectDialog';

        this.animComp.getState('EndMenuIn').wrapMode = AnimationClip.WrapMode.Normal;
        this.animComp.play();
    }

    rejectDialog() {
        this.eventBlocker.active = true;
        this.animComp.getState('EndMenuIn').wrapMode = AnimationClip.WrapMode.Reverse;
        this.animComp.on(Animation.EventType.FINISHED, this.disableDialog, this);
        this.animComp.play();
    }

    disableDialog() {
        this.animComp.off(Animation.EventType.FINISHED, this.disableDialog, this);

        GAME_STATE.CUR_STATE = GAME_STATE.CACHED_STATE;

        this.eventBlocker.active = false;
        this.node.active = false;
    }
}


