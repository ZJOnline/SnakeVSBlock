import WXTools, { MessageType } from "./wx/WXTools";

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
export default class PlayerDataManager extends cc.Component {

    @property(cc.Node)
    display: cc.Node = null;

    

    start() {
        if (CC_WECHATGAME) {

            WXTools.CreateGameClueBtn();

            // let button = wx.createUserInfoButton({
            //     type: 'text',
            //     text: '获取用户信息',
            //     style: {
            //         left: 10,
            //         top: 76,
            //         width: 200,
            //         height: 40,
            //         lineHeight: 40,
            //         backgroundColor: '#ff0000',
            //         color: '#ffffff',
            //         textAlign: 'center',
            //         fontSize: 16,
            //         borderRadius: 4
            //     }
            // })
            // button.onTap((res) => {
            //     console.log(res);
            // });
            // wx.login({
            //     success: function (res) {
            //         console.log("login success : ", res.code);
            //         // wx.getUserInfo({
            //         //     withCredentials: true,
            //         //     success: function (res) {
            //         //         console.log("login success : ", res);
            //         //         console.log('success: ', res.rawData);
            //         //         var userInfo = res.userInfo;
            //         //         let nickName = userInfo.nickName;
            //         //         let avatarUrl = userInfo.avatarUrl;
            //         //         wx.postMessage({
            //         //             nickName: nickName,
            //         //             avatarUrl: avatarUrl
            //         //         });
            //         //     },
            //         // })
            //     },
            //     fail: function (res) {
            //         console.log("fail");
            //     }
            // });
        }
        // WXTools.WXLogin();
        // WXTools.WXGetUserInfo(false);
        // wxRankList.instance.node.active = true;
    }


    uploadScore(score: number) {

        WXTools.PostMsgToSub(MessageType.UploadScore, score);
    }

    showRank(b: boolean) {
        if (this.display.active != b) {
            this.display.active = b;
        }
    }
}
