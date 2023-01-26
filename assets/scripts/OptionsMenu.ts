import { _decorator, Component, Node, Animation, AnimationClip, find, sys, EventKeyboard, input, Input, KeyCode } from 'cc';
import { GAME_STATE } from './GameState';
import { SceneTransition } from './SceneTransition';
import { TopBar } from './TopBar';
const { ccclass, property } = _decorator;

@ccclass('OptionsMenu')
export class OptionsMenu extends Component {

    private animComp: Animation;
    private topBar: TopBar;
    private eventBlocker: Node;
    private credits: Node;
    private optionsButton: boolean;

    onLoad() {
        this.animComp = this.node.getComponent(Animation);
        this.topBar = this.node.getParent().getComponentInChildren(TopBar);
        this.eventBlocker = this.node.getChildByName('EventBlocker');
        this.credits = this.node.getParent().getChildByName('Credits');
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
            this.back();
        }
    }

    playTutorial() {
        let STComp = find('CanvasUI/SceneTransition').getComponent(SceneTransition);

        GAME_STATE.CACHED_STATE = GAME_STATE.TUTORIAL;

        STComp.loadScene('Main');
    }

    showCredits() {
        this.optionsButton = false;

        this.credits.active = true;
        this.credits.getComponent(Animation).getState('EndMenuIn').wrapMode = AnimationClip.WrapMode.Normal;
        this.credits.getComponent(Animation).play();

        this.node.getComponent(Animation).getState('EndMenuIn').wrapMode = AnimationClip.WrapMode.Reverse;
        this.node.getComponent(Animation).play();
        this.animComp.on(Animation.EventType.FINISHED, this.disableMenu, this);
    }

    back() {
        this.optionsButton = true;

        this.eventBlocker.active = true;
        this.animComp.getState('EndMenuIn').wrapMode = AnimationClip.WrapMode.Reverse;
        this.animComp.play();
        this.animComp.on(Animation.EventType.FINISHED, this.disableMenu, this);
    }

    disableMenu() {
        this.eventBlocker.active = false;
        this.node.active = false;

        if (this.optionsButton === true) {
            this.topBar.showOptionsButton();
            this.animComp.off(Animation.EventType.FINISHED, this.disableMenu, this);
        } else {
            this.animComp.off(Animation.EventType.FINISHED, this.disableMenu, this);
        }
    }
}


