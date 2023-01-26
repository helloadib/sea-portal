import {
    _decorator, Component, Node, Prefab, UITransform, math, instantiate
} from 'cc';
import { GAME_STATE } from './GameState';
import { TIME_PROP } from './TimeProp';
const { ccclass, property } = _decorator;

@ccclass('SpawnerBG')
export class SpawnerBG extends Component {
    private initSpawnTimout: number = 8;
    private spawnTimout: number = this.initSpawnTimout;
    private spawnTOPassed: number = 0;
    private timeScaleTOPassed: number = 0;
    private road: Node;
    private roadWidth: number;
    private roadStart: number;
    private minSpawnTimeout: number = 0.5;
    private objectPool: Array<Node>[] = [];
    private objectBin: Array<Node>[] = [];

    @property([Prefab])
    objects: Prefab[];

    onLoad() {
        this.road = this.node.getParent().getChildByName('Road');
        this.roadWidth = this.road.getComponent(UITransform).width;
        this.roadStart = this.road.position.x;

        this.objects.forEach(this.addToObjectPool.bind(this));

        if (!this.road) {
            console.error('You have to choose a Road node for the Spawner node.');
        }
    }

    update(deltaTime: number) {
        if (GAME_STATE.CUR_STATE != GAME_STATE.PAUSED) {
            this.spawnTOPassed += deltaTime;
            if (this.spawnTOPassed >= this.spawnTimout) {
                this.spawnObj();
                this.spawnTOPassed = 0;
            }

            this.timeScaleTOPassed += deltaTime;
            if (this.timeScaleTOPassed >= TIME_PROP.TIME_SCALE_TIMEOUT) {
                this.increaseTimeScale();
                this.timeScaleTOPassed = 0;
            }
        }
    }

    spawnObj() {
        let selectedObjTypeIndex = math.randomRangeInt(0, this.objectPool.length);

        let obj = this.objectPool[selectedObjTypeIndex].shift();
        this.objectBin[selectedObjTypeIndex].push(obj);

        if (this.objectPool[selectedObjTypeIndex].length <= 0) {
            let binFirstObj = this.objectBin[selectedObjTypeIndex].shift()
            this.objectPool[selectedObjTypeIndex].push(binFirstObj);
        }

        let objHalfWidth = obj.getComponent(UITransform).width / 2;
        let objHalfHeight = obj.getComponent(UITransform).height / 2;
        let objPosX = math.randomRangeInt(this.roadStart + objHalfWidth, this.roadStart + this.roadWidth - objHalfWidth);
        let objPosY = 0 + objHalfHeight;

        obj.setPosition(objPosX, objPosY);
        this.node.addChild(obj);
    }

    increaseTimeScale() {
        if (this.spawnTimout / TIME_PROP.TIME_SCALE > this.minSpawnTimeout) {
            this.spawnTimout = this.initSpawnTimout / TIME_PROP.TIME_SCALE;
        }
    }

    addToObjectPool(value: Prefab, index: number, array: []) {
        let i: number = 0;
        let objArray: Node[] = [];

        while (i < 6) {
            let obj: Node = instantiate(value);
            objArray.push(obj);
            i++;
        }

        this.objectPool.push(objArray);
        this.objectBin.push([]);
    }
}

