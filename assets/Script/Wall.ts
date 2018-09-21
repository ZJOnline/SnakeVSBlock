import GameManager from "./GameManager";
import Player from "./Player";
import PoolItem from "./PoolItem";
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
export default class Wall extends PoolItem {


    public num: number = 0;
    isStar = false;

    label: cc.Label;

    // onLoad () {}

    start() {
        this.label = this.node.getChildByName("label").getComponent(cc.Label);
        this.label.string = this.num.toString();
        this.setColor();
    }

    reinit() {
        if (this.label == null) {
            this.label = this.node.getChildByName("label").getComponent(cc.Label);
        }
        this.label.string = this.num.toString();
        this.setColor();
    }

    // update(dt) {

    // }


    onBeginContact(contact: cc.PhysicsContact, self: cc.PhysicsCollider, other: cc.PhysicsCollider) {
        this.updateCollision(contact);
    }

    onPreSolve(contact: cc.PhysicsContact, self: cc.PhysicsCollider, other: cc.PhysicsCollider) {
        this.updateCollision(contact);
    }

    updateCollision(contact: cc.PhysicsContact) {
        // if (this.inpool)
        //     return;
        if (contact.getManifold().localNormal.y > -1) {
            return;
        }
        let player = contact.colliderB.node.getComponent(Player);
        if (player != null && player.canHit()) {
            if (player != null && player.isInvincible()) {
                GameManager.instance.break(this.num);
                this.returnPool();
                return;
            }
            this.num--;
            this.label.string = this.num.toString();
            GameManager.instance.hit();
            player.hit();
        }
        if (this.num <= 0) {
            if (this.isStar) {
                GameManager.instance.setInvincible();
            }
            this.returnPool();
            // this.node.destroy();
        }
        else {
        }
    }


    setColor() {
        let hp = GameManager.instance.snake.body.length;
        if (this.num < 5) {
            this.node.color = new cc.Color(44,252,255);
        }
        else if (this.num < hp && this.num < hp / 2) {
            this.node.color = new cc.Color(255,220,9);
        }
        else if (this.num < hp && this.num > hp / 2) {
            this.node.color = new cc.Color(206,254,44);
        }
        else if (this.num < hp * 1.5) {
            this.node.color = new cc.Color(255,122,44);
        }
        else if (this.num > hp * 2) {
            this.node.color = new cc.Color(255,44,43);
        }

    }

    // returnPool() {
    //     if (!this.inpool) {
    //         let finished = cc.callFunc((n: cc.Node) => {
    //             if (n.active == false) {
    //                 n.active = true;
    //             }
    //             cc.log("returnPool finish: uuid= ",n.uuid," pos ", n.y);
    //         }, this, this.node);
    //         this.node.runAction(cc.sequence(cc.moveTo(0, cc.v2(2000, 2000)), finished));
    //         // this.node.runAction(cc.moveTo(0, cc.v2(2000, 2000)));
    //         ObjectPool.instance.pool[this.poolName].push(this.node);
    //         // this.node.active = false;
    //         this.inpool = true;
    //         this.background = cc.find("Canvas/background");
    //         cc.log("returnPool,pos is ", this.node.y," uuid = ", this.node.uuid, " background pos is ", this.background.y);
    //     }
    // }
}
