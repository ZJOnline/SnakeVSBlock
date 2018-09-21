import Player from "./Player";
import ObjectPool from "./ObjectPool";
import Snake from "./Snake";
import GameManager from "./GameManager";
import FoodBall from "./FoodBall";
import Wall from "./Wall";

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
export default class Scene extends cc.Component {
        
    static instance: Scene;
    spawnPoints: cc.Vec2[] = [];
    objects: cc.Node;
    inited: boolean = false;
    spawnObjects: cc.Node[] = [];

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Scene.instance = this;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        let pm = cc.director.getPhysicsManager();
        pm.enabled = true;
        // pm.debugDrawFlags = 5;
        this.objects = this.node.getChildByName("Objects");

    }

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    start () {
        this.spawnPoints[0] = new cc.Vec2(-125, 480);
        this.spawnPoints[1] = new cc.Vec2(0, 480);
        this.spawnPoints[2] = new cc.Vec2(125, 480);
    }

    update(dt) {
        // if (ObjectPool.instance.inited && !this.inited) {
        //     // this.initColumns();
        //     this.createSnake();
        //     // this.spawnFood();
        //     GameManager.instance.spawnManager.spawnFirstWall();
        //     this.inited = true;
        // }
    }

    spawnFood() {

        this.schedule(() => {
            let ob: cc.Node = cc.instantiate(ObjectPool.instance.pool["food"][0]);
            this.spawnObjects.push(ob);
            this.objects.addChild(ob);
            let index = Math.floor((Math.random() * 5));
            let fb = ob.addComponent(FoodBall);
            fb.num = Math.ceil(Math.random() * 10);
            ob.position = cc.v2(-150.5 + 75 * index, GameManager.instance.snake.node.y + 300);
        }, 5);

        this.schedule(() => {
            let ob: cc.Node = cc.instantiate(ObjectPool.instance.pool["stone"][0]);
            this.spawnObjects.push(ob);
            this.objects.addChild(ob);
            let index = Math.floor((Math.random() * 5));
            let fb = ob.addComponent(Wall);
            fb.num = Math.ceil(Math.random() * 10);
            ob.position = cc.v2(-150.5 + 75 * index, GameManager.instance.snake.node.y + 300);
        }, 5, cc.macro.REPEAT_FOREVER, 2);
        this.schedule(() => {
            let ob: cc.Node = cc.instantiate(ObjectPool.instance.pool["rail"][0]);
            this.spawnObjects.push(ob);
            this.objects.addChild(ob);
            let index = Math.floor((Math.random() * 4));
            ob.position = cc.v2(-112.5 + 75 * index, GameManager.instance.snake.node.y + 300);
            ob.scaleY = index + 1;
        }, 5, cc.macro.REPEAT_FOREVER, 2);
    }

    createSnake() {
        let snake_node: cc.Node = cc.find("Canvas/snake");
        let snake: Snake = snake_node.addComponent<Snake>(Snake);
        snake.initSnake();
        GameManager.instance.snake = snake;
    }

    gameDone() {
        this.unscheduleAllCallbacks();
        for (let i = 0; i < this.spawnObjects.length; i++) {
            this.spawnObjects[i].destroy();
        }
        this.spawnObjects = new Array<cc.Node>();
    }

    onKeyDown(event: cc.Event.EventKeyboard) {
        switch (event.keyCode) {
            case cc.macro.KEY.a:
                GameManager.instance.snakeGrowup(1);
                break;
            case cc.macro.KEY.d:
                GameManager.instance.setInvincible();
                break;
            case cc.macro.KEY.c:
                GameManager.instance.snake.mainPlayer.node.position = cc.v2(0, GameManager.instance.snake.mainPlayer.node.y + 20);
                break;
            case cc.macro.KEY.v:
                GameManager.instance.snake.mainPlayer.node.position = cc.v2(0, GameManager.instance.snake.mainPlayer.node.y - 20);
                break;
        }
    }
    
    onStartClick() {
        if (ObjectPool.instance.inited) {
            // this.initColumns();
            this.createSnake();
            // this.spawnFood();
            GameManager.instance.spawnManager.spawnFirstWall();
            GameManager.instance.gameStart();
        }
    }
}
