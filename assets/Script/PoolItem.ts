import ObjectPool from "./ObjectPool";

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
export default class PoolItem extends cc.Component {

    poolName: string;
    inpool = true;
    background: cc.Node;


    returnPool() {
        if (!this.inpool) {
            this.node.runAction(cc.sequence(cc.moveTo(0, cc.v2(2000, 2000)), cc.hide()));
            ObjectPool.instance.pool[this.poolName].push(this.node);
            this.inpool = true;
        }
    }
}
