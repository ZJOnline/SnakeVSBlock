import Player from "./Player";
import ObjectPool from "./ObjectPool";
import BallMovement from "./BallMovement";
import Scene from "./Scene";
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
export default class Snake extends cc.Component {

    num_text: cc.Label;
    mainPlayer: Player;
    body: Player[] = [];
    startCount: number = 5;
    canvas: cc.Node;
    space: number = 20;
    step: number = 2;
    pathPoints: cc.Vec2[] = [];
    hp: number = 0;
    originPos: cc.Vec2;

    needHit = false;
    playerHit: Player;

    onLoad() {
        this.num_text = this.node.getComponent(cc.Label);
        this.canvas = cc.find("Canvas");
        this.originPos = this.node.position;
    }

    restart() {
        this.node.position = this.originPos;
        for (let i = 0; i < this.body.length; i++) {
            this.body[i].destroy();
        }
        this.body = [];
        this.mainPlayer = null;
        this.pathPoints = [];
        // this.initSnake();
        this.scheduleOnce(() => {
            this.initSnake();
        });
    }

    start() {

    }

    update(dt) {
        if (this.needHit) {
            this.needHit = false;
            this.hit(null);
        }
        if (this.node.y > GameManager.instance.cameraPos) {
            GameManager.instance.cameraPos = this.node.y;
        }
    }

    lateUpdate() {
        this.updateSnake();
        if (this.mainPlayer != null && this.mainPlayer.node != null) {
            this.node.y = this.mainPlayer.node.y + 40;
            this.node.x = this.mainPlayer.node.x;
        }
    }

    initSnake() {
        this.createBalls(this.startCount);
        this.hp = this.startCount;
        this.num_text.string = this.hp.toString();
        this.num_text.enabled = true;
    }

    createBalls(count: number) {
        this.hp += count;
        this.num_text.string = this.hp.toString();
        for (let i = 0; i < count; i++) {
            let ob: cc.Node = cc.instantiate(ObjectPool.instance.pool["ball"][0]);
            this.canvas.addChild(ob);
            let player: Player = ob.addComponent(Player);
            let movement: BallMovement = ob.addComponent(BallMovement);
            player.movement = movement;

            if (this.mainPlayer == null) {
                player.isHead = true;
                ob.position = new cc.Vec2(this.node.x, this.node.y - 40);
                player.setSpeed();
                this.mainPlayer = player;
                this.mainPlayer.setHead();
                this.body.push(player);
                this.pathPoints.push(player.node.position);
                this.pathPoints.push(this.pathPoints[0]);
            }
            else if (this.body.length == 1) {
                player.isHead = false;
                movement.enabled = false;
                let dir: cc.Vec2 = cc.Vec2.UP;
                let pos = this.mainPlayer.node.position.sub(dir.mul(10));
                // ob.position = this.body[this.body.length-1].node.position;
                player.parentPlayer = this.mainPlayer;
                this.body.push(player);
            }
            else {
                player.isHead = false;
                movement.enabled = false;
                let dir: cc.Vec2 = this.body[this.body.length - 2].node.position
                    .sub(this.body[this.body.length - 1].node.position).normalize();
                let pos = this.body[this.body.length - 1].node.position.sub(dir.mul(20));
                // ob.position = this.body[this.body.length-1].node.position;
                player.parentPlayer = this.body[this.body.length - 1];
                this.body.push(player);
            }
        }
    }

    updateSnake() {
        if (this.body.length <= 0) {
            return;
        }
        if (this.pathPoints.length > 0) {
            this.pathPoints[0] = this.mainPlayer.node.position;
            if (this.pathPoints.length == 1) {
                this.pathPoints.push(this.pathPoints[0]);
            }
            else {
                let v_dis: cc.Vec2 = this.pathPoints[0].sub(this.pathPoints[1]);
                if (v_dis.magSqr() >= this.step * this.step) {
                    this.pathPoints.splice(1, 0, this.pathPoints[0]);
                }
            }
            let num = 1;
            let spacing = this.space;
            let index = 0;
            while ((index < (this.pathPoints.length - 1)) && (num < this.body.length)) {
                let v2: cc.Vec2 = this.pathPoints[index];
                let v3: cc.Vec2 = this.pathPoints[index + 1];
                let v4: cc.Vec2 = v3.sub(v2);
                let magnitude = v4.mag();
                if (magnitude > 0) {
                    let v6: cc.Vec2 = v3.sub(v2);
                    let normalized: cc.Vec2 = v6.normalize();
                    let v7: cc.Vec2 = v2;
                    while ((spacing <= magnitude) && (num < this.body.length)) {
                        v7.addSelf(normalized.mul(spacing));
                        magnitude -= spacing;
                        this.body[num].node.position = v7;
                        num++;
                        spacing = this.space;
                    }
                    spacing -= magnitude;
                }
                index++;
            }
            let v8: cc.Vec2 = this.pathPoints[this.pathPoints.length - 1];
            for (let i = num; i < this.body.length; i++) {
                this.body[num].node.position = v8;
            }
            index++;
            if (index < this.pathPoints.length) {
                this.pathPoints.splice(index, this.pathPoints.length - index);
            }
        }

    }

    killBall() {

        let head: Player;

        // this.updateSnake();
        // let zero = cc.Vec2.ZERO;
        // if (this.body.length > 0) {
        //     zero = this.body[0].node.position;
        //     head = this.body.shift();
        // }
        // if (this.body.length <= 0) {
        //     console.log("game over");
        // }
        // else {
        //     let v2 = this.body[0].node.position;
        //     let v4 = zero.sub(v2);
        //     let normailzed = v4.normalize();
        //     let count = 0;
        //     for (let i = 0; i < this.pathPoints.length; i++){
        //         if (v2.sub(this.pathPoints[i]).dot(normailzed) >= 0) {
        //             break;
        //         }
        //         count = i;
        //     }
        //     this.pathPoints.splice(0, count);
        //     v2.x = zero.x;
        //     this.body[0].setHead();
        //     this.mainPlayer = this.body[0];
        //     console.log(this.body.length);
        //     this.mainPlayer.node.position = v2;
        //     this.pathPoints[0] = v2;
        //     this.updateSnake();

        // }


        if (this.body.length == 1) {
            head = this.body.shift();
            head.node.destroy();
            GameManager.instance.gameDone();
            //Scene.instance.gameDone();
            return;
        }
        head = this.body.shift();
        this.body[0].setHead();
        this.mainPlayer = this.body[0];
        head.node.destroy();
        this.hp--;
        this.num_text.string = this.hp.toString();
    }

    hit2(player: Player) {
        this.needHit = true;
        this.playerHit = player;
    }

    hit(player: Player) {
        player = this.playerHit;
        if (!this.canHit(player)) {
            return false;
        }
        let head: Player;
        this.updateSnake();
        let zero = cc.Vec2.ZERO;
        if (this.body.length > 1) {
            zero = this.body[0].node.position;
            head = this.body.shift();
        } else {
            this.hp--;
            this.num_text.string = this.hp.toString();
            head = this.body.shift();
            head.node.destroy();
            GameManager.instance.gameDone();
            this.num_text.enabled = false;
            return;
        }
        let v2 = this.body[0].node.position;
        let v4 = zero.sub(v2);
        let normailzed = v4.normalize();
        let count = 0;
        for (let i = 0; i < this.pathPoints.length; i++) {
            if (v2.sub(this.pathPoints[i]).dot(normailzed) >= 0) {
                break;
            }
            count = i;
        }
        this.pathPoints.splice(0, count);
        v2.x = zero.x;

        this.mainPlayer.node.position = v2;
        // this.mainPlayer.node.runAction(cc.moveTo(0, v2));
        this.pathPoints[0] = v2;
        this.updateSnake();
        this.body[0].setHead();
        this.mainPlayer = this.body[0];

        
        this.hp--;
        this.num_text.string = this.hp.toString();
        head.node.destroy();
    }

    canHit(player: Player) {
        if (player != this.mainPlayer) {
            return false;
        }
        return true;
    }
}
