import Scene from "./Scene";
import WXTools, { MessageType } from "./wx/WXTools";
import RankUI from "./RankUI";
import Utils from "./Utils";
import { gen_handler } from "./Handler";
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
export default class HomePage extends cc.Component {

    startBtn: cc.Node;
    rankBtn: cc.Node;
    rank: RankUI;
    highScore: cc.Label;

    start() {
        this.startBtn = cc.find("StartButton", this.node);
        this.startBtn.on("click", this.onStartClick, this);
        this.rankBtn = cc.find("rank", this.node);
        this.rankBtn.on("click", this.onRankClick, this);
        this.rank = cc.find("Canvas/Rank").getComponent(RankUI);
        this.highScore = Utils.findChildComponent("HighestScore/score", this.node, cc.Label);
        this.initHighScore();
    }

    onEnable() {
        if (GameManager.instance != null && GameManager.instance.highestScore != undefined) {
            this.highScore.string = GameManager.instance.highestScore.toString();
        }
    }

    // update (dt) {}

    onStartClick() {
        Scene.instance.onStartClick();
    }

    onRankClick() {
        this.node.active = false;
        this.rank.node.active = true;
        this.rank.showRank(1);
        this.rank.backAction = this.onRankCanel;
        this.rank.context = this;
    }

    onRankCanel() {
        console.log("haha   ", this.node.name);
        this.node.active = true;
        this.rank.node.active = false;
    }

    initHighScore() {
        let that = this;
        if (CC_WECHATGAME) {
            wx.cloud.init({
                env: 'snake-hit-block-8dca8b'
            });
        }
        WXTools.callWXCloudFunction("getScore", gen_handler((res: any): void => {
            console.log("getScore  callback", res.result);

            if (!res.result.success && res.result.errMsg == "openid doesnot exist") {
                that.highScore.string = "0";
                GameManager.instance.highestScore = 0;
            }
            else {
                that.highScore.string = res.result.data.score;
                GameManager.instance.highestScore = res.result.data.score;
            }
        }, this));
    }
}
