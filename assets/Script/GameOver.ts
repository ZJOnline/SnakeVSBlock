import GameManager from "./GameManager";
import Utils from "./Utils";
import WXTools, { MessageType } from "./wx/WXTools";
import { gen_handler } from "./Handler";
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
export default class GameOver extends cc.Component {

    restart: cc.Node;
    ad: cc.Node;
    share: cc.Node;
    home: cc.Node;

    rewardedVideoAd;

    inShare = false;

    onLoad() {
        this.restart = this.node.getChildByName("button_restart");
        this.restart.on("click", this.onClick, this);
        this.ad = this.node.getChildByName("button_ad");
        this.ad.on("click", this.onADClick, this);
        this.share = this.node.getChildByName("button_share");
        this.share.on("click", this.onShareClick, this);
        this.home = this.node.getChildByName("btn_home");
        this.home.on("click", this.onHomeClick, this);

        if (CC_WECHATGAME) {
            this.rewardedVideoAd = wx.createRewardedVideoAd({ adUnitId: 'xxxx' });
        }
        if (GameManager.instance.rebirthCnt <= 0) { 
            this.ad.active = false;
            this.share.active = false;
        }
    }

    start() {
        GameManager.instance.playDataManager.uploadScore(GameManager.instance.scoreNum);
        this.uploadScore();
        // GameManager.instance.playDataManager.showRank(true);

    }

    // update (dt) {}

    onClick() {
        GameManager.instance.restart();
        WXTools.PostMsgToSub(MessageType.HideRank);
        // this.node.destroy();
    }

    onRankClick() {
        if (CC_WECHATGAME) {

        }
    }

    // onRebirthClick() {
    //     if (GameManager.instance.rebirthCnt <= 0) {
    //         console.log("次数不足");
    //         Utils.openMessageBox("次数不足", this.node.position,this.node.parent);
    //         return;
    //     }
    //     if (this.coinCnt <= 0) {
    //         console.log("复活币不足");
    //         Utils.openMessageBox("复活币不足", this.node.position,this.node.parent);
    //         return;
    //     }
    //     GameManager.instance.rebirth();
    //     if (CC_WECHATGAME) {
    //         let that = this;
    //         wx.setStorage({
    //             key:"coin",
    //             data: that.coinCnt - 1,
    //             success: function () {
    //                 that.setCoin(that.coinCnt - 1);
    //             },
    //             fail: function () {
    //                 console.log("setStorage fail");
    //             }
    //           })
    //     }
    //     this.node.destroy();
    // }

    onShareClick() {

        if (GameManager.instance.rebirthCnt <= 0) {
            console.log("次数不足");
            Utils.openMessageBox("次数不足", this.node.position, this.node.parent);
            return;
        }

        if (CC_WECHATGAME) {
            let that = this;
            wx.shareAppMessage({
                title: '分享',
                success: function (res) {
                    console.log("share success");
                    that.shareSuccess();
                },
                fail: function (res) {
                    console.log("share fail");
                }
            });
            this.inShare = true;
        }
        // else {
        //     this.shareSuccess();
        // }
    }

    shareSuccess() {
        GameManager.instance.rebirth();
        this.node.destroy();
    }

    shareComplete() {
        console.log("shareComplete  ", this.inShare);
        if (this.inShare) {
            this.shareSuccess();
            this.inShare = false;
        }
    }

    onADClick() {
        if (CC_WECHATGAME) {
            let that = this;
        }
    }

    onHomeClick() {
        GameManager.instance.returnHome();
        WXTools.PostMsgToSub(MessageType.HideRank);
    }

    uploadScore() {
        if (GameManager.instance.scoreNum > GameManager.instance.highestScore) {
            WXTools.callWXCloudFunction("updateScore", gen_handler((res: any): void => {
                if (res.result.success) {
                    WXTools.callWXCloudFunction("getScore", gen_handler((res: any): void => {
                        if (!res.result.success && res.result.errMsg == "openid doesnot exist") {
                            console.log("getScore error");
                        }
                        else {
                            GameManager.instance.highestScore = res.result.data.score;
                        }
                    }, this));
                }
            }, this), {
                    score: GameManager.instance.scoreNum
                });
        }
    }
}
