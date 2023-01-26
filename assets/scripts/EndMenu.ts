import {
    _decorator, Component, Node, find, input, Input, EventKeyboard, KeyCode
} from 'cc';
import { GAME_STATE } from './GameState';
import { SceneTransition } from './SceneTransition';
const { ccclass, property } = _decorator;

@ccclass('EndMenu')
export class EndMenu extends Component {

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

    restart() {
        let STComp = find('CanvasUI/SceneTransition').getComponent(SceneTransition);

        GAME_STATE.CACHED_STATE = GAME_STATE.RUNNING;

        STComp.loadScene('Main');
    }

    back() {
        let STComp = find('CanvasUI/SceneTransition').getComponent(SceneTransition);

        GAME_STATE.CACHED_STATE = GAME_STATE.MAIN_MENU;

        STComp.loadScene('Main');
    }
}


