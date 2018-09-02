import GameManager from "./GameManager";
import Player from "./Player";

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
export default class Wall extends cc.Component {


    public num: number;

    label: cc.Label;

    // onLoad () {}

    start () {
        this.label = this.node.getChildByName("label").getComponent(cc.Label);
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
        if (contact.getManifold().localNormal.y > -1) {
            return;
        }
        if (contact.colliderA.tag == 0) {
            let player = contact.colliderB.node.getComponent(Player);
            if (player != null && player.canHit()) {
                this.num--;
                this.label.string = this.num.toString();
                GameManager.instance.hit();
                player.hit();
            }
            if (this.num <= 0) {
                this.node.destroy();
            }
            else {
            }
        }
        else if (contact.colliderA.tag == 1) {
            // GameManager.instance.speed = 133;
        }
    }

    
    setColor() {
        let hp = GameManager.instance.snake.body.length;
        if (this.num < 5) {
            this.node.color = new cc.Color(47,189,75);
        }
        else if (this.num < hp && this.num < hp / 2) {
            this.node.color = new cc.Color(47,53,189);
        }
        else if (this.num < hp && this.num > hp / 2) {
            this.node.color = new cc.Color(189,189,47);
        }
        else if (this.num < hp * 1.5) {
            this.node.color = new cc.Color(189,47,161);
        }
        else if (this.num > hp * 2) {
            this.node.color = new cc.Color(189,47,47);
        }
        
    }
}
