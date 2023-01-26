import {
    _decorator, Component, Node, Prefab, UITransform, math, instantiate
} from 'cc';
import { GAME_STATE } from './GameState';
import { TIME_PROP } from './TimeProp';
const { ccclass, property } = _decorator;

@ccclass('Spawner')
export class Spawner extends Component {
    private initSpawnTimout: number = 4;
    private spawnTimout: number = this.initSpawnTimout;
    private pickupRarityControl: number = 0;
    private road: Node;
    private roadWidth: number;
    private roadStart: number;
    private minSpawnTimeout: number = 0.25;
    private minPickupDistance: number = 6;
    private timeScaleTOPassed: number = 0;
    private spawnTOPassed: number = 0;

    @property([Prefab])
    obstacles: Prefab[];

    @property([Prefab])
    pickups: Prefab[];

    onLoad() {
        TIME_PROP.TIME_SCALE = 1;

        this.road = this.node.getParent().getChildByName('Road');
        this.roadWidth = this.road.getComponent(UITransform).width;
        this.roadStart = this.road.position.x;

        if (!this.road) {
            console.error('You have to choose a Road node for the Spawner node.');
        }
    }

    update(deltaTime: number) {
        if (GAME_STATE.CUR_STATE === GAME_STATE.RUNNING) {
            this.spawnTOPassed += deltaTime;
            if (this.spawnTOPassed >= this.spawnTimout) {
                this.selectObj();
                this.spawnTOPassed = 0;
            }

            this.timeScaleTOPassed += deltaTime;
            if (this.timeScaleTOPassed >= TIME_PROP.TIME_SCALE_TIMEOUT) {
                this.increaseTimeScale();
                this.timeScaleTOPassed = 0;
            }
        }
    }

    selectObj() {
        let randomChance = Math.random();

        if (randomChance <= 0.1 && this.pickupRarityControl >= this.minPickupDistance) {
            if (randomChance >= 0.025) {
                this.spawnObj(this.obstacles);
            }
            this.spawnObj(this.pickups);
            this.pickupRarityControl = 0;
        } else {
            this.spawnObj(this.obstacles);
            this.pickupRarityControl++;
        }
    }

    spawnObj(objType: Prefab[]) {
        let selectedObjIndex = math.randomRangeInt(0, objType.length);
        let obj = instantiate(objType[selectedObjIndex]);
        let objHalfWidth = obj.getComponent(UITransform).width / 2;
        let objHalfHeight = obj.getComponent(UITransform).height / 2;
        let objPosX = math.randomRangeInt(this.roadStart + objHalfWidth, this.roadStart + this.roadWidth - objHalfWidth);
        let objPosY = 0 + objHalfHeight;

        obj.setPosition(objPosX, objPosY);
        this.node.addChild(obj);
    }

    increaseTimeScale() {
        TIME_PROP.TIME_SCALE += TIME_PROP.TIME_SCALE_INCREMENT;
        if (this.initSpawnTimout / TIME_PROP.TIME_SCALE > this.minSpawnTimeout) {
            this.spawnTimout = this.initSpawnTimout / TIME_PROP.TIME_SCALE;
        }
    }
}

