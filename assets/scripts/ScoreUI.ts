import { _decorator, Component, Node, Label, sys, ProgressBar } from 'cc';
import { GAME_STATE } from './GameState';
import { TIME_PROP } from './TimeProp';
const { ccclass, property } = _decorator;

@ccclass('ScoreUI')
export class ScoreUI extends Component {

    private scoreCur: number = 0;
    private scoreHigh: number = 0;

    private timeScale: number = 1;

    private timeOutPassed: number = 0;

    private progressBar: ProgressBar;

    onLoad() {
        this.progressBar = this.node.getComponentInChildren(ProgressBar);

        if (sys.localStorage.getItem('Tutorial') != 'Done' ||
            GAME_STATE.CUR_STATE === GAME_STATE.TUTORIAL) {
            this.node.active = false;
        }

        if (sys.localStorage.getItem('highScore')) {
            this.scoreHigh = parseInt(sys.localStorage.getItem('highScore'));

            this.node.getChildByPath('HighScoreContainer/HighScore').getComponent(Label).string = this.scoreHigh.toFixed();
        } else {
            this.node.getChildByName('HighScoreContainer').active = false;
            this.progressBar.barSprite = null;
        }
    }

    update(deltaTime: number) {
        if (GAME_STATE.CUR_STATE === GAME_STATE.RUNNING) {
            this.scoreCur += this.timeScale * deltaTime;
            this.node.getChildByPath('CurrentScoreContainer/CurrentScore').getComponent(Label).string = this.scoreCur.toFixed();

            this.progressBar.progress = this.scoreCur / this.scoreHigh;

            this.timeOutPassed += deltaTime;
            if (this.timeOutPassed >= TIME_PROP.TIME_SCALE_TIMEOUT) {
                this.increaseTimeScale();
                this.timeOutPassed = 0;
            }
        }
    }

    increaseTimeScale() {
        this.timeScale += TIME_PROP.TIME_SCALE_INCREMENT;
    }
}


