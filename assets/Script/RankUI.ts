import Utils from "./Utils";
import WXTools, { MessageType } from "./wx/WXTools";
import GameManager from "./GameManager";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class RankUI extends cc.Component {

    backAction: Function = null;
    context: any = null;

    backBtn: cc.Node;
    horizon: cc.Node;

    score_txt: cc.Label;
    onLoad() {
        this.backBtn = cc.find("back", this.node);
        this.backBtn.on("click", this.onBack, this);
        this.horizon = cc.find("horizon", this.node);
        this.score_txt = Utils.findChildComponent("horizon/score", this.node, cc.Label);
        cc.find("horizon/ShowRank", this.node).on("click", this.onRankClick, this);
    }

    start() {

    }

    // update (dt) {}

    onBack() {

        WXTools.PostMsgToSub(MessageType.HideRank);
        // this.node.active = false;
        if (this.backAction != null) {
            this.backAction.call(this.context);
        }
        this.backAction = null;
        this.context = null;
    }

    showRank(type: number) {
        if (type == 1) {
            this.backBtn.active = true;
            this.horizon.active = false;
            WXTools.PostMsgToSub(MessageType.ShowRank, 1);
        }
        else if (type == 2) {
            this.backBtn.active = false;
            this.horizon.active = true;
            WXTools.PostMsgToSub(MessageType.ShowRank, 2);
        }
    }

    showHorizonRank() {
        this.backBtn.active = false;
        this.horizon.active = true;
    }

    setScore(_score: number) {
        this.score_txt.string = _score.toString();
    }

    onRankClick() {
        this.showRank(1);
        GameManager.instance.gameover.node.active = false;
        this.backAction = () => {
            this.showRank(2);
            GameManager.instance.gameover.node.active = true;
        }
    }
}
