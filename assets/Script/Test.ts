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
export default class NewClass extends cc.Component {



    onLoad() {
        let pm = cc.director.getPhysicsManager();
        pm.enabled = true;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    start() {

        cc.moveTo(10, cc.v2(this.node.x - 100, this.node.y + 100));
    }

    // update (dt) {}

    onBeginContact(contact: cc.PhysicsContact, self: cc.PhysicsCollider, other: cc.PhysicsCollider) {
        // this.node.position = cc.v2(this.node.x - 100, this.node.y);
        //this.node.runAction( cc.moveTo(0, cc.v2(this.node.x - 100, this.node.y + 100)));
    }

    onKeyDown(event: cc.Event.EventKeyboard) {
        switch (event.keyCode) {
            case cc.macro.KEY.a:
                cc.moveTo(10, cc.v2(this.node.x - 100, this.node.y + 100));
                break;
            case cc.macro.KEY.v:
                cc.director.emit("test");
                break;
        }
    }

}
