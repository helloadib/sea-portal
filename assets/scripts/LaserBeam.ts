import {
    _decorator, Component, Node, Collider2D, Contact2DType, Animation,
    AnimationClip,
    ParticleSystem2D,
    find,
    instantiate,
    Prefab
} from 'cc';
import { COLL_GROUP } from './CollisionGroups';
import { GAME_STATE } from './GameState';
import { ObjectMovement } from './ObjectMovement';
const { ccclass, property } = _decorator;

@ccclass('LaserBeam')
export class LaserBeam extends Component {

    private collider: Collider2D;
    private animationCom: Animation;
    private particleComs: ParticleSystem2D[];
    private laserDuration: number = 5;
    private laserTimePassed: number = 0;
    private isActive: boolean = false;

    onLoad() {
        let playerNode = this.node.getParent();

        this.animationCom = this.node.getComponent(Animation);
        this.collider = this.node.getComponent(Collider2D);
        this.particleComs = this.node.getComponentsInChildren(ParticleSystem2D);

        playerNode.on('LaserPickup', this.shootLaser, this);
    }

    update(deltaTime: number) {
        if (this.isActive) {
            if (GAME_STATE.CUR_STATE === GAME_STATE.RUNNING) {
                this.laserTimePassed += deltaTime;
            }

            if (this.laserTimePassed >= this.laserDuration) {
                this.turnOffLaser();
            }
        }
    }

    shootLaser() {
        if (!this.isActive) {
            this.animationCom.off(Animation.EventType.FINISHED, this.disableListeners, this);
            this.animationCom.getState('LaserBeamShoot').wrapMode = AnimationClip.WrapMode.Normal;
            this.animationCom.play();

            this.particleComs.forEach((value) => {
                value.resetSystem();
            });
        }

        this.collider.on(Contact2DType.BEGIN_CONTACT, this.destroyObstacle, this);
        this.laserTimePassed = 0;
        this.isActive = true;
    }

    turnOffLaser() {
        this.isActive = false;
        this.animationCom.getState('LaserBeamShoot').wrapMode = AnimationClip.WrapMode.Reverse;
        this.animationCom.play();
        this.animationCom.on(Animation.EventType.FINISHED, this.disableListeners, this);
    }

    disableListeners() {
        this.collider.off(Contact2DType.BEGIN_CONTACT, this.destroyObstacle, this);
        this.animationCom.off(Animation.EventType.FINISHED, this.disableListeners, this);

        this.particleComs.forEach((value) => {
            value.stopSystem();
        });
    }

    destroyObstacle(self: Collider2D, other: Collider2D) {
        if (other.group === COLL_GROUP.OBSTACLE) {
            let explosion = other.node.getChildByName('Explosion');

            explosion.getComponent(Animation).play();
            other.node.getComponent(Animation).play('ObstacleFadeOut');
            other.destroy();
            find('Canvas/Camera').getComponent(Animation).play('CameraShake');
        }
    }
}


