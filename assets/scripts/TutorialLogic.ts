import {
    _decorator, Component, Node, input, Input, EventTouch, find, Label, Color,
    ParticleSystem2D, tween, Vec3, sys, Animation, AnimationClip
} from 'cc';
import { GAME_STATE } from './GameState';
import { PauseButton } from './PauseButton';
const { ccclass, property } = _decorator;

@ccclass('TutorialLogic')
export class TutorialLogic extends Component {

    private instructions: Node[];
    private touchID: Number;
    private disabledColor: Color = new Color(255, 255, 255, 64);
    private activeColor: Color = new Color(255, 255, 255, 255);
    private particleEndPos: Vec3 = new Vec3(480, 0, 0);
    private particleStartPos: Vec3 = new Vec3(0, -16, -1);
    private previousInst: Number;
    private animationComp: Animation;

    onLoad() {
        if (sys.localStorage.getItem('Tutorial') === 'Done' &&
            GAME_STATE.CUR_STATE != GAME_STATE.TUTORIAL) {
            this.node.active = false;
        } else {
            this.animationComp = this.node.getComponent(Animation);

            this.instructions = [
                this.node.getChildByName('Instruction1'),
                this.node.getChildByName('Instruction2'),
                this.node.getChildByName('Instruction3')
            ]
        }
    }

    start() {
        let playerNode = find('Canvas/Player');

        if (GAME_STATE.CUR_STATE === GAME_STATE.TUTORIAL) {
            this.showTutorial();
        } else if (GAME_STATE.CUR_STATE === GAME_STATE.MAIN_MENU) {
            playerNode.on(
                'StartGame',
                () => { this.scheduleOnce(this.showTutorial, 6) },
                this
            );
        }
    }

    showTutorial() {
        this.animationComp.play('TutorialIn');
        this.highlightCurrentInst(0);
        this.animationComp.on(Animation.EventType.FINISHED, this.initiateTutorial, this);
    }

    initiateTutorial() {
        this.node.getComponentInChildren(Animation).play();
        input.on(Input.EventType.TOUCH_START, this.startDragging, this);
        input.on(Input.EventType.TOUCH_END || Input.EventType.TOUCH_CANCEL, this.stopDragging, this);
        this.animationComp.off(Animation.EventType.FINISHED, this.initiateTutorial, this);
    }

    startDragging(event: EventTouch) {
        if (event.getAllTouches().length === 1) {
            this.highlightCurrentInst(1);

            this.touchID = event.touch.getID();;
        } else if (event.getAllTouches().length >= 2) {
            this.highlightCurrentInst(2);
        }
    }

    stopDragging(event: EventTouch) {
        if (event.getAllTouches().length === 0) {
            // console.log('Single is taken')

            this.highlightCurrentInst(0)
        } else if (event.getAllTouches().length === 1) {
            if (event.touch.getID() === this.touchID) {
                // console.log('First is taken');

                this.highlightCurrentInst(3);

                input.off(Input.EventType.TOUCH_START, this.startDragging, this);
                input.off(Input.EventType.TOUCH_END || Input.EventType.TOUCH_CANCEL, this.stopDragging, this);

                this.animationComp.getState('TutorialIn').wrapMode = AnimationClip.WrapMode.Reverse;
                this.animationComp.play();

                this.touchID = event.getAllTouches()[0].getID();

                GAME_STATE.CUR_STATE = GAME_STATE.RUNNING;
                sys.localStorage.setItem('Tutorial', 'Done');

                this.node.getParent().getChildByName('ScoreUI').active = true;
                this.node.getParent().getChildByName('SkipButtonContainer').active = false;
                this.node.getParent().getComponentInChildren(PauseButton).showPauseButton();

            } else {
                // console.log('Second is taken');

                this.highlightCurrentInst(1);
            }
        }
    }

    highlightCurrentInst(instIndex: number) {
        for (let i = 0; i < this.instructions.length; i++) {
            if (i === instIndex - 1 && this.previousInst === instIndex - 1) {
                let particleSystem = this.instructions[i].getChildByName('SuccessParticle')

                particleSystem.setPosition(this.particleStartPos);

                this.instructions[i].getComponentInChildren(ParticleSystem2D).resetSystem();

                tween(particleSystem).by(
                    0.21,
                    { position: this.particleEndPos }
                ).start();
            }

            if (i === instIndex) {
                this.instructions[i].getComponent(Label).color = this.activeColor;
                this.previousInst = i;
            } else {
                this.instructions[i].getComponent(Label).color = this.disabledColor;
            }
        }
    }
}


