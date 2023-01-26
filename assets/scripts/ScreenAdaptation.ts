import { _decorator, Component, Node, view, ResolutionPolicy } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ScreenAdaptation')
export class ScreenAdaptation extends Component {
    start() {
        this.AdaptScreen();
    }

    AdaptScreen() {
        let deviceResolution = view.getViewportRect();
        let deviceRatio = deviceResolution.width / deviceResolution.height;
        let canvasResolution = view.getDesignResolutionSize();
        let canvasRatio = canvasResolution.width / canvasResolution.height;

        if (deviceRatio > canvasRatio) {
            view.setResolutionPolicy(ResolutionPolicy.FIXED_HEIGHT);
        } else {
            view.setResolutionPolicy(ResolutionPolicy.FIXED_WIDTH);
        }
    }
}

