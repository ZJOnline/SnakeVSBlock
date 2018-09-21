// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class MessageBox extends cc.Component {

    @property(cc.Label)
    content: cc.Label = null;

    @property(cc.Button)
    ok: cc.Button = null;

    @property(cc.Button)
    close: cc.Button = null;

    start () {
        this.ok.node.on("click", this.onOKClick, this);
    }

    init(str: string) {
        this.content.string = str;
    }

    onOKClick() {
        this.node.destroy();
    }
}
