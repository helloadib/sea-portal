import {
    _decorator, Component, Node, input, Input, EventTouch, UITransform,
    Collider2D, Contact2DType, find, Label, sys, Animation, AnimationClip,
    Sprite, Color, tween, Vec3, AudioSource, ParticleSystem2D,
} from 'cc';
import { COLL_GROUP } from './CollisionGroups';
import { GAME_STATE } from './GameState';
const { ccclass, property } = _decorator;

@ccclass('PlayerLogic')
export class PlayerLogic extends Component {

    private playerXStart: number;
    private playerXCur: number;
    private playerDistance: number;
    private playerY: number;
    private playerHalfWidth: number;

    private cursorXStart: number;
    private cursorXCur: number;
    private cursorDistance: number;

    private movementSpeed: number;

    private road: Node;
    private roadStart: number;
    private roadWidth: number;
    private roadEnd: number;

    private dragging: boolean = false;

    private portalX: number;
    private touchID: number;

    private portalStart: Node;
    private portalDestination: Node;
    private playerAnim: Animation;
    private portalDesAnim: Animation;
    private portalDesColor: Color = new Color(255, 255, 255, 255);

    onLoad() {
        this.road = this.node.getParent().getChildByName('Road');
        this.playerY = this.node.position.y;
        this.playerHalfWidth = this.node.getComponent(UITransform).contentSize.width / 2;
        this.roadStart = this.road.position.x + this.playerHalfWidth;
        this.roadWidth = this.road.getComponent(UITransform).contentSize.width;
        this.roadEnd = this.roadStart + this.roadWidth - (this.playerHalfWidth * 2);
        this.portalStart = this.node.getParent().getChildByName('PortalStart');
        this.portalDestination = this.node.getParent().getChildByName('PortalDestination');
        this.portalDesAnim = this.portalDestination.getComponent(Animation);
        this.playerAnim = this.node.getComponent(Animation);

        if (!this.road) {
            console.error('You have to choose a Road node for the Player node.');
        }
    }

    start() {
        let collider = this.node.getComponent(Collider2D);

        EventTouch.MAX_TOUCHES = 2;
        input.on(Input.EventType.TOUCH_START, this.startDragging, this);
        input.on(Input.EventType.TOUCH_END || Input.EventType.TOUCH_CANCEL, this.stopDragging, this);
        input.on(Input.EventType.TOUCH_START, this.showPortalDestination, this);
        input.on(Input.EventType.TOUCH_MOVE, this.dragPortalDestination, this);
        collider.on(Contact2DType.BEGIN_CONTACT, this.onCollisionEnter, this);
    }

    startDragging(event: EventTouch) {
        if (event.getAllTouches().length === 1) {
            this.dragging = true;
            input.on(Input.EventType.TOUCH_MOVE, this.dragPlayer, this);
            this.cursorXStart = event.touch.getUILocation().x;
            this.cursorXCur = event.touch.getUILocation().x;
            this.playerXStart = this.node.position.x;
            this.playerXCur = this.node.position.x;
            this.touchID = event.touch.getID();
        } else if (event.getAllTouches().length >= 2) {
            this.dragging = false;
            input.off(Input.EventType.TOUCH_MOVE, this.dragPlayer, this);

            this.portalStart.setPosition(this.playerXCur, this.playerY);
            this.portalStart.active = true;
            this.portalStart.getComponent(Animation).getState('PortalOpen').wrapMode = AnimationClip.WrapMode.Normal;
            this.portalStart.getComponent(Animation).play();
        }

        if (GAME_STATE.CUR_STATE === GAME_STATE.MAIN_MENU) {
            if (sys.localStorage.getItem('Tutorial') === 'Done') {
                GAME_STATE.CUR_STATE = GAME_STATE.RUNNING;
            } else {
                GAME_STATE.CUR_STATE = GAME_STATE.TUTORIAL;
            }

            this.node.emit('StartGame');
        }
    }

    dragPlayer(event: EventTouch) {
        if (event.getAllTouches().length === 1) {
            this.cursorXCur = event.touch.getUILocation().x;
        }
    }

    showPortalDestination(event: EventTouch) {
        if (event.getAllTouches().length >= 2) {
            if (event.touch.getID() != this.touchID) {
                let portalDestinationX = event.touch.getUILocation().x - this.roadWidth / 2;

                this.portalDesColor.set(255, 255, 255, 64);
                this.portalDestination.getComponent(Sprite).color = this.portalDesColor;
                this.portalDesAnim.stop();
                this.portalDestination.setScale(1, 1, 1);
                this.portalDestination.setPosition(portalDestinationX, this.playerY);
                this.portalDestination.active = true;
            }
        }
    }

    dragPortalDestination(event: EventTouch) {
        if (event.getAllTouches().length >= 2) {
            if (event.touch.getID() != this.touchID) {
                let portalDestinationX = event.touch.getUILocation().x - this.roadWidth / 2;

                this.portalDestination.setPosition(portalDestinationX, this.playerY);
            }
        }
    }

    stopDragging(event: EventTouch) {
        if (event.getAllTouches().length === 0) {
            // console.log('Single is taken')

            this.dragging = false;
        } else if (event.getAllTouches().length === 1) {
            if (event.touch.getID() === this.touchID) {
                // console.log('First is taken');

                this.portalX = event.getAllTouches()[0].getUILocation().x - this.roadWidth / 2;

                this.cursorXStart = event.getAllTouches()[0].getUILocation().x;
                this.cursorXCur = event.getAllTouches()[0].getUILocation().x;
                this.playerXStart = this.portalX;
                this.playerXCur = this.portalX;

                this.touchID = event.getAllTouches()[0].getID();

                this.portalStart.getComponent(Animation).getState('PortalOpen').wrapMode = AnimationClip.WrapMode.Reverse;
                this.portalStart.getComponent(Animation).play();

                this.playerAnim.getState('PortalOpen').wrapMode = AnimationClip.WrapMode.Reverse;
                this.playerAnim.play('PortalOpen');

                this.portalDesColor.set(255, 255, 255, 255);
                this.portalDestination.getComponent(Sprite).color = this.portalDesColor;
                this.portalDestination.setPosition(this.portalX, this.playerY)
                this.portalDestination.active = true;
                this.portalDesAnim.getState('PortalOpen').wrapMode = AnimationClip.WrapMode.Normal;
                this.portalDesAnim.play();
                this.portalDesAnim.on(Animation.EventType.FINISHED, this.teleportPlayer, this);
            } else {
                // console.log('Second is taken');

                this.dragging = true;
                input.on(Input.EventType.TOUCH_MOVE, this.dragPlayer, this);

                this.portalDestination.active = false;

                this.portalStart.getComponent(Animation).getState('PortalOpen').wrapMode = AnimationClip.WrapMode.Reverse;
                this.portalStart.getComponent(Animation).play();
            }
        }
    }

    teleportPlayer() {
        this.portalDesAnim.off(Animation.EventType.FINISHED, this.teleportPlayer, this);

        this.node.setPosition(this.portalX, this.playerY);

        if (this.node.position.x < this.roadStart) {
            this.node.setPosition(this.roadStart, this.playerY);

        } else if (this.node.position.x > this.roadEnd) {
            this.node.setPosition(this.roadEnd, this.playerY);
        }

        this.playerAnim.getState('PortalOpen').wrapMode = AnimationClip.WrapMode.Normal;
        this.playerAnim.play('PortalOpen');
        this.playerAnim.on(Animation.EventType.FINISHED, this.destroyPortal, this);
    }

    destroyPortal() {
        this.dragging = true;
        input.on(Input.EventType.TOUCH_MOVE, this.dragPlayer, this);

        this.playerAnim.off(Animation.EventType.FINISHED, this.destroyPortal, this);

        this.portalDesAnim.getState('PortalOpen').wrapMode = AnimationClip.WrapMode.Reverse;
        this.portalDesAnim.play();
    }

    update(deltaTime: number) {
        if (this.dragging) {
            this.playerXCur = this.node.position.x;
            this.cursorDistance = this.cursorXCur - this.cursorXStart;
            this.playerDistance = this.playerXCur - this.playerXStart;

            this.movementSpeed = (this.cursorDistance - this.playerDistance) * 16;

            // if (this.prevMovementSpeed) {
            //     if (this.movementSpeed > 0 && this.prevMovementSpeed > this.movementSpeed) {
            //         this.movementSpeed = this.prevMovementSpeed;
            //     } else if (this.movementSpeed < 0 && this.prevMovementSpeed < this.movementSpeed) {
            //         this.movementSpeed = this.prevMovementSpeed;
            //     }
            // }

            // this.prevMovementSpeed = this.movementSpeed;

            this.playerXCur += this.movementSpeed * deltaTime;

            this.node.setPosition(this.playerXCur, this.playerY);

            if (this.node.position.x < this.roadStart) {
                this.node.setPosition(this.roadStart, this.playerY);
                this.cursorXStart = this.cursorXCur;
                this.playerXStart = this.playerXCur;
            } else if (this.node.position.x > this.roadEnd) {
                this.node.setPosition(this.roadEnd, this.playerY);
                this.cursorXStart = this.cursorXCur;
                this.playerXStart = this.playerXCur;
            }
        }
    }

    onCollisionEnter(self: Collider2D, other: Collider2D) {
        if (other.group === COLL_GROUP.OBSTACLE) {
            const endMenu = find('CanvasUI/EndMenu');
            const endMenuLblCur = endMenu.getChildByName('CurrentScoreLabel').getComponent(Label);
            const endMenuLblHigh = endMenu.getChildByName('HighScoreLabel').getComponent(Label);
            const endMenuScrCur = endMenu.getChildByName('CurrentScore').getComponent(Label);
            const endMenuScrHigh = endMenu.getChildByName('HighScore').getComponent(Label);
            const scoreUI = find('CanvasUI/ScoreUI');
            let scoreCur = scoreUI.getChildByPath('CurrentScoreContainer/CurrentScore').getComponent(Label).string;
            let scoreHigh = scoreUI.getChildByPath('HighScoreContainer/HighScore').getComponent(Label).string;
            const obsExplosion = other.node.getChildByName('Explosion');
            const plyrExplosion = this.node.getChildByName('Explosion');
            const pauseButton = find('CanvasUI/PauseButtonContainer/PauseButton');
            const plyrParticles = this.node.getComponentsInChildren(ParticleSystem2D);
            // const engineAudio = this.node.getComponent(AudioSource);

            // tween(engineAudio).to(1, { volume: 0.0 }).start();

            obsExplosion.getComponent(Animation).play();
            plyrExplosion.getComponent(Animation).play();
            plyrExplosion.getComponent(AudioSource).play();
            other.node.getComponent(Animation).play('ObstacleFadeOut');
            this.playerAnim.play('PlayerFadeOut');
            other.destroy();
            find('Canvas/Camera').getComponent(Animation).play('CameraShake');

            for (let i = 0; i < plyrParticles.length; i++) {
                plyrParticles[i].stopSystem();
            }

            endMenuScrCur.string = scoreCur;
            endMenuScrHigh.string = scoreHigh;

            if (parseInt(scoreHigh) === 0) {
                endMenuScrHigh.enabled = false;
                endMenuLblHigh.enabled = false;
            }

            if (parseInt(scoreCur) > parseInt(scoreHigh)) {
                scoreHigh = scoreCur;
                sys.localStorage.setItem('highScore', scoreHigh);

                endMenuLblCur.string = 'New High Score';
                endMenuLblHigh.string = 'Previous High Score';
            }

            scoreUI.getComponent(Animation).getState('ScoreUIIn').wrapMode = AnimationClip.WrapMode.Reverse;
            scoreUI.getComponent(Animation).play();

            endMenu.active = true;
            endMenu.getComponent(Animation).play();

            GAME_STATE.CUR_STATE = GAME_STATE.PAUSED;

            input.off(Input.EventType.TOUCH_START, this.startDragging, this);
            input.off(Input.EventType.TOUCH_MOVE, this.dragPlayer, this);
            input.off(Input.EventType.TOUCH_END || Input.EventType.TOUCH_CANCEL, this.stopDragging, this);
            input.off(Input.EventType.TOUCH_MOVE, this.showPortalDestination, this);

            tween(pauseButton).by(0.5, { position: new Vec3(0, -80, 0) }, { easing: 'cubicOut' }).start();
        }
    }
}
