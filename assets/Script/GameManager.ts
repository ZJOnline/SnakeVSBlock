import Snake from "./Snake";
import GameOver from "./GameOver";
import SpawnManager from "./SpawnManager";

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
export default class GameManager extends cc.Component {

    public static instance: GameManager;
    spawnManager: SpawnManager;

    public speed: number = 135;
    public speed_hit: number = 100;
    public snake: Snake;
    cameraPos = 0;
    scoreNum = 0;

    scoreLabel: cc.Label;
    touchPreviousPos: cc.Vec2 = cc.Vec2.ZERO;
    touchCurrentPos: cc.Vec2 = cc.Vec2.ZERO;
    background: cc.Node;
    
    isHiting = false;
    delayTwoHits = 0.15;
    lastHit = 0;
    // onLoad () {}

    start () {
        GameManager.instance = this;
        this.background = cc.find("Canvas/background");
        if (this.background) {
            this.background.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
            this.background.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
            this.background.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
            this.background.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        }
        this.spawnManager = this.node.addComponent(SpawnManager);
        this.scoreLabel = cc.find("Canvas/score").getComponent(cc.Label);
        this.scoreLabel.enabled = false;
        this.scoreLabel.node.zIndex = cc.macro.MAX_ZINDEX;
    }

    onDestroy() {
        if (this.background) {
            this.background.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
            this.background.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
            this.background.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
            this.background.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

        }
    }

    public snakeGrowup(count:number) {
        if (this.snake) {
            this.snake.createBalls(count);
        }
    }

    killBall() {
        if (this.snake) {
            this.snake.killBall();
        }
    }

    gameStart() {
        this.scoreNum = 0;
        this.scoreLabel.string = this.scoreNum.toString();
        if (this.scoreLabel.enabled == false) {
            this.scoreLabel.enabled = true;
        }
    }

    gameDone() {
        cc.loader.loadRes("Prefab/GameOver", (error: Error, resource: any) => {
            let ob: cc.Node = cc.instantiate(resource);
            this.node.addChild(ob);
            ob.addComponent(GameOver);
            ob.position = this.background.position;
            ob.scale = 1;
        });
        this.spawnManager.gameDone();
        this.scoreLabel.enabled = false;
    }

    restart() {
        this.background.position = cc.Vec2.ZERO;
        cc.find("Canvas/Main Camera").position = cc.Vec2.ZERO;
        this.snake.restart();
        this.spawnManager.spawnFirstWall();
        this.cameraPos = 0;

        this.scoreNum = 0;
        this.scoreLabel.string = this.scoreNum.toString();
        if (this.scoreLabel.enabled == false) {
            this.scoreLabel.enabled = true;
        }
    }

    update(dt) {
        
        if (this.isHiting) {
            this.lastHit -= dt;
            if (this.lastHit <= 0) {
                this.isHiting = false;
            }
        }
    }


    onTouchStart(event: cc.Event.EventTouch) {
        // console.log("start");
        this.touchPreviousPos = event.getStartLocation();
        this.touchCurrentPos = event.getStartLocation();

        // console.log(this.touchCurrentPos.x, "---", this.touchPreviousPos.x)
    }

    onTouchMove(event: cc.Event.EventTouch) {

        this.touchCurrentPos = event.getLocation();


    }

    onTouchEnd(event: cc.Event.EventTouch) {

    }

    
    hit() {
        this.isHiting = true;
        this.lastHit = this.delayTwoHits;
        this.scoreNum++;
        this.scoreLabel.string = this.scoreNum.toString();
        if (this.scoreLabel.enabled == false) {
            this.scoreLabel.enabled = true;
        }
    }

    canHit() {
        return !this.isHiting;
    }
}
