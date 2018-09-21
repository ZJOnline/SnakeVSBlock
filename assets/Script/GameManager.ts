import Snake from "./Snake";
import GameOver from "./GameOver";
import SpawnManager from "./SpawnManager";
import PlayerDataManager from "./PlayerDataManager";
import Utils from "./Utils";
import RankUI from "./RankUI";
import Scene from "./Scene";
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
export default class GameManager extends cc.Component {

    public static instance: GameManager;
    spawnManager: SpawnManager;
    playDataManager: PlayerDataManager;
    rankDisplay: RankUI;

    public speed: number = 400;
    public speed_back: number = 400;
    public snake: Snake;
    cameraPos = 0;
    scoreNum = 0;

    scoreLabel: cc.Label;
    touchPreviousPos: cc.Vec2 = cc.Vec2.ZERO;
    touchCurrentPos: cc.Vec2 = cc.Vec2.ZERO;
    background: cc.Node;
    homepage: cc.Node;
    gameover: GameOver;

    //碰撞相关
    isHiting = false;
    delayTwoHits = 0.15;
    lastHit = 0;

    //道具相关
    invincible = false;
    invincible_time = 8;
    inDouble = false;
    inDouble_time = 10;

    //复活相关
    rebirthCnt = 1;
    lastHp = 5;

    highestScore = 0;
    // onLoad () {}

    start() {
        GameManager.instance = this;
        this.background = cc.find("Canvas/background");
        if (this.background) {
            this.background.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
            this.background.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
            this.background.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
            this.background.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        }
        this.spawnManager = this.node.addComponent(SpawnManager);
        this.playDataManager = this.node.getComponent(PlayerDataManager);
        this.scoreLabel = cc.find("Canvas/score").getComponent(cc.Label);
        this.scoreLabel.enabled = false;
        this.scoreLabel.node.zIndex = cc.macro.MAX_ZINDEX;
        this.rankDisplay = cc.find("Canvas/Rank").getComponent(RankUI);
        this.homepage = cc.find("Canvas/HomePage");

        // this.initWXLifeCycle();
    }

    onDestroy() {
        if (this.background) {
            this.background.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
            this.background.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
            this.background.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
            this.background.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

        }
    }

    public snakeGrowup(count: number) {
        if (this.snake) {
            if (this.inDouble) {
                count += count;
            }
            this.snake.createBalls(count);
        }
        this.lastHp = this.snake.hp;
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
        Utils.setNodeActive(this.homepage, false);
        WXTools.PostMsgToSub(MessageType.HideRank);
    }

    gameDone() {
        cc.loader.loadRes("Prefab/GameOver", (error: Error, resource: any) => {
            let ob: cc.Node = cc.instantiate(resource);
            Scene.instance.node.addChild(ob);
            this.gameover = ob.addComponent(GameOver);
            ob.position = this.background.position;
            ob.scale = 1;
        });
        // this.spawnManager.gameDone();
        this.scoreLabel.enabled = false;
        if (this.invincible) {
            
            this.invincible = false;
            this.snake.changeColor(false);
        }
        if (this.inDouble) {
            this.inDouble = false;
        }
        this.rankDisplay.node.y = this.background.y;
        this.rankDisplay.node.active = true;
        this.rankDisplay.showHorizonRank();
        this.rankDisplay.setScore(this.scoreNum);
    }

    restart() {
        this.spawnManager.gameDone();
        this.scheduleOnce(() => {
            
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

            if (this.gameover.isValid) {
                this.gameover.node.destroy();
            }
            this.rebirthCnt = 3;
            this.rankDisplay.node.active = false;
        }, 0.1);
        
    }

    returnHome() {
        this.spawnManager.gameDone();
        this.scheduleOnce(() => {
            
            this.background.position = cc.Vec2.ZERO;
            cc.find("Canvas/Main Camera").position = cc.Vec2.ZERO;
            this.snake.clearSnake();
            this.cameraPos = 0;

            this.scoreNum = 0;
            this.scoreLabel.string = this.scoreNum.toString();
            if (this.scoreLabel.enabled == true) {
                this.scoreLabel.enabled = false;
            }
            if (this.gameover.isValid) {
                this.gameover.node.destroy();
            }
            this.rebirthCnt = 1;
            this.rankDisplay.node.active = false;
            this.rankDisplay.node.position = cc.v2(0, 0);
            Utils.setNodeActive(this.homepage, true);
        }, 0.1);
        
    }

    rebirth() {
        this.snake.rebirth(this.lastHp);
        this.setInvincible();
        this.rebirthCnt--;
        this.rankDisplay.node.active = false;
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

    break(num: number) {
        this.isHiting = true;
        this.lastHit = this.delayTwoHits;
        this.scoreNum += num;
        this.scoreLabel.string = this.scoreNum.toString();
        if (this.scoreLabel.enabled == false) {
            this.scoreLabel.enabled = true;
        }
    }

    canHit() {
        return !this.isHiting;
    }

    setInvincible() {
        if (this.invincible) {
            return;
        }
        this.invincible = true;
        this.snake.changeColor(true);
        this.scheduleOnce(() => {
            this.invincible = false;
            this.snake.changeColor(false);
        }, this.invincible_time);
    }

    setDoubleState() {
        if (this.inDouble) {
            return;
        }
        this.inDouble = true;
        this.snake.mainPlayer.node.scale = 2;
        this.scheduleOnce(() => {
            this.inDouble = false;
            if (this.snake.mainPlayer != null && this.snake.mainPlayer.isValid) {
                this.snake.mainPlayer.node.scale = 1;
            }
        }, this.inDouble_time);
    }

    initWXLifeCycle() {
        let that = this;
        if (CC_WECHATGAME) {
            wx.onShow(res => {
                that.gameover.shareComplete();
            })
        }
    }
}
