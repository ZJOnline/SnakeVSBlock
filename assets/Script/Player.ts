import GameManager from "./GameManager";
import BallMovement from "./BallMovement";

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
export default class Player extends cc.Component {

    public isHead: boolean = true;
    public parent: cc.Node;
    public parentPlayer: Player;
    public rigidbody: cc.RigidBody;
    public dir: cc.Vec2;
    public movement: BallMovement;

    background: cc.Node;
    col: cc.PhysicsCircleCollider;


    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.rigidbody = this.node.getComponent(cc.RigidBody);
        this.col = this.node.getComponent("cc.PhysicsCircleCollider");
        this.col.enabled = false;
    }

    start() {
        
    }

    update(dt) {
        if (this.isHead) {
            this.dir = this.rigidbody.linearVelocity;
        }
        else {
            this.dir = this.parentPlayer.node.position.sub(this.node.position).normalize();
        }
    }

    onDestroy() {
        GameManager.instance.spawnManager.spawnFX(this.node.position.add(cc.v2(0,20)));
    }

    setHead() {
        this.isHead = true;
        this.rigidbody.linearVelocity = cc.v2(0, GameManager.instance.speed);
        this.node.group = "head";
        this.movement.enabled = true;
        this.col.enabled = true;
    }

    setSpeed() {
        this.rigidbody.linearVelocity = cc.v2(this.rigidbody.linearVelocity.x, GameManager.instance.speed);
    }
    
    hit() {
        GameManager.instance.snake.hit2(this);
        // this.node.destroy();
    }

    canHit() {
        return (GameManager.instance.canHit() && GameManager.instance.snake.canHit(this));
    }
}
