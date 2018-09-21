import ObjectPool from "./ObjectPool";
import Wall from "./Wall";
import GameManager from "./GameManager";
import CheckWall from "./CheckWall";
import FoodBall from "./FoodBall";
import PoolItem from "./PoolItem";

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

export class StartingPhase {
    ballCount: number = 3;
    intervalHeight: number = 5;
}
export class SecondPhase {
    intervalHeight: number = 3;
}

@ccclass
export default class SpawnManager extends cc.Component {


    startingPhase: StartingPhase = new StartingPhase();
    secondPhase: SecondPhase = new SecondPhase();
    barProbability: number;
    barragePeriodMax: number = 4;
    barragePeriodMin: number = 2;
    intervalHeightMax = 3;
    intervalHeightMin = 1;
    blockLineCountMax = 3;
    blockLineCountMin = 1;
    intervalBallProbability = 0.1;
    maxBallValue = 5;
    minBallValue = 1;
    maxBlockValue = 40;
    minBlockValue = 1;
    minBarrageBlockValueFactor = 0.5;
    minFirstAndLastBlockLineValueFactor = 0.25;


    column = 5;
    fullWall = 3;//每隔几波方块后，刷一道满方块
    spawnObjects: cc.Node[] = [];//所有刷的物体
    objects: cc.Node;
    background: cc.Node;
    windowTop: number;



    onLoad() {
        this.objects = cc.find("Canvas/Objects");
        this.background = cc.find("Canvas/background");
    }

    start() {

    }

    lateUpdate2() {

        for (let i = 0; i < this.spawnObjects.length; i++) {
            if (this.spawnObjects[i] != null && this.spawnObjects[i].isValid) {
                if (this.spawnObjects[i].y < this.background.y - 1000 && this.spawnObjects[i].active == true) {
                    let pool = this.spawnObjects[i].getComponent(PoolItem);
                    if (pool) {
                        if (!pool.inpool) {
                            pool.returnPool();
                        }
                    }
                    else {
                        this.spawnObjects[i].destroy();
                    }
                }

            }
        }
    }

    startSpawn() {
        this.lateUpdate2();
        // this.schedule(this.spawnWall, 1);
        this.spawnWall();
        this.spawnObjects = this.spawnObjects.filter(x => x.isValid == true);
    }

    spawnFirstWall() {
        //第一道墙,生成一道满墙，和前面两个食物
        this.windowTop = this.background.y + 1000;
        for (let i = 0; i < this.column; i++) {
            this.spawnStone(cc.v2(-300 + 150 * i, this.windowTop), Math.ceil(this.getRandomInt(1, 2)));
        }

        this.spawnFood(cc.v2(-300 + 150 * this.getRandomInt(0, 4), this.windowTop - 150), this.getRandomInt(1, 3));
        this.spawnFood(cc.v2(-300 + 150 * this.getRandomInt(0, 4), this.windowTop - 300), this.getRandomInt(2, 5));

        this.spawnCheckWall(cc.v2(0, this.windowTop));


        //第二道，随机墙
        this.windowTop = this.windowTop + 300;
        for (let i = 0; i < this.column; i++) {
            let createBlock = false;
            let r = this.getRandomInt(0, 2);
            if (r == 0) {
                createBlock = true;
            }
            if (createBlock) {
                this.spawnStone(cc.v2(-300 + 150 * i, this.windowTop), Math.ceil(this.getRandomInt(1, 2)));
            }
        }

        this.spawnCheckWall(cc.v2(0, this.windowTop));


        //第三道，随机墙
        this.windowTop = this.windowTop + 300;
        for (let i = 0; i < this.column; i++) {
            let createBlock = false;
            let r = this.getRandomInt(0, 2);
            if (r == 0) {
                createBlock = true;
            }
            if (createBlock) {
                this.spawnStone(cc.v2(-300 + 150 * i, this.windowTop), Math.ceil(this.getRandomInt(1, 2)));
            }
        }

        this.spawnCheckWall(cc.v2(0, this.windowTop));

        //第四道，随机墙
        this.windowTop = this.windowTop + 300;
        for (let i = 0; i < this.column; i++) {
            let createBlock = false;
            let r = this.getRandomInt(0, 2);
            if (r == 0) {
                createBlock = true;
            }
            if (createBlock) {
                this.spawnStone(cc.v2(-300 + 150 * i, this.windowTop), Math.ceil(this.getRandomInt(1, 2)));
            }
        }

        this.spawnCheckWall(cc.v2(0, this.windowTop));
    }

    spawnWall() {
        // this.windowTop = this.windowTop + 140;
        let wallLine = this.fullWall == 0;
        let num = 0;
        let maxRail = 1;
        for (let i = 0; i < this.column - 1; i++) {

            let r = this.getRandomInt(0, 2);
            if (r == 0) {
                let r = this.getRandomInt(1, 3);
                let ob = this.spawnRail(cc.v2(-225 + 150 * i, this.windowTop + 75));
                ob.scaleY = r;
                if (maxRail < r) {
                    maxRail = r;
                }
            }
        }
        this.windowTop = this.windowTop + 150 * (maxRail + 1);
        let lessIndex = this.getRandomInt(0, 4);
        for (let i = 0; i < this.column; i++) {
            let createBlock = false;
            if (!wallLine) {
                let r = this.getRandomInt(0, 2);
                if (r == 0) {
                    createBlock = true;
                }
            }
            if (createBlock || wallLine) {
                num++;
                if (lessIndex == i) {

                    this.spawnStone(cc.v2(-300 + 150 * i, this.windowTop), this.getRandomInt(Math.round(GameManager.instance.snake.body.length * 0.5), GameManager.instance.snake.body.length));
                } else {
                    this.spawnStone(cc.v2(-300 + 150 * i, this.windowTop));
                }
            }
        }

        if (num == 0) {
            let index = this.getRandomInt(0, 4);
            this.spawnStone(cc.v2(-300 + 150 * index, this.windowTop));
        }

        this.spawnCheckWall(cc.v2(0, this.windowTop));

        let r = this.getRandomInt(0, 1);
        let r2 = this.getRandomInt(1, 10);
        if (r == 1 || wallLine) {
            this.spawnFood(cc.v2(-300 + 150 * this.getRandomInt(0, 4), this.windowTop - 150));
        }
        // else if (r2 == 1) {
        //     this.spawnDoubleBuff(cc.v2(-300 + 150 * this.getRandomInt(0, 4), this.windowTop - 150));
        // }

        this.fullWall--;
        if (wallLine) {
            this.fullWall = this.getRandomInt(2, 4);
        }
    }

    spawnStone(pos: cc.Vec2, num?: number) {

        let i = this.getRandomInt(1, 20);
        let ob;
        let fb;
        if (i == 5) {
            ob = this.getObjcet("starstone", pos);
            fb = ob.getComponent(Wall);
            fb.isStar = true;
            fb.poolName = "starstone";
        }
        else {
            ob = this.getObjcet("stone", pos);
            fb = ob.getComponent(Wall);
            fb.poolName = "stone";
        }

        fb.inpool = false;
        let hp = GameManager.instance.snake.body.length;
        if (num == undefined) {
            let maxNum = hp * 2;
            // fb.num = Math.ceil(Math.random() * maxNum);
            maxNum = Math.max(maxNum, this.maxBlockValue);
            fb.num = this.getRandomInt(1, maxNum);
        }
        else {
            fb.num = num;
        }
        fb.reinit();

    }

    spawnFood(pos: cc.Vec2, num?: number) {
        let ob: cc.Node = this.getObjcet("food", pos);
        let fb = ob.getComponent(FoodBall);
        fb.inpool = false;
        fb.poolName = "food";
        if (num == 0 || num == undefined) {
            fb.num = this.getRandomInt(1, 5);
        }
        else {
            fb.num = num;
        }
        fb.reinit();
    }

    spawnRail(pos: cc.Vec2) {
        let ob: cc.Node = this.getObjcet("rail", pos);
        let fb = ob.getComponent(PoolItem);
        fb.inpool = false;
        fb.poolName = "rail";
        return ob;
    }

    spawnFX(pos: cc.Vec2) {
        // let ob: cc.Node = this.createObjcet("ballFX", pos);
        let ob: cc.Node = this.getObjcet("ballFX", pos);
        ob.getComponent(cc.ParticleSystem).resetSystem();
        let fb = ob.getComponent(PoolItem);
        fb.inpool = false;
        fb.poolName = "ballFX";
    }

    spawnCheckWall(pos: cc.Vec2) {
        // let ob: cc.Node = this.createObjcet("ballFX", pos);
        let ob: cc.Node = this.getObjcet("checkwall", pos);
        let fb = ob.getComponent(PoolItem);
        fb.inpool = false;
        fb.poolName = "checkwall";
    }

    spawnDoubleBuff(pos: cc.Vec2) {
        // let ob: cc.Node = this.createObjcet("ballFX", pos);
        let ob: cc.Node = this.getObjcet("doubleFood", pos);
        let fb = ob.getComponent(PoolItem);
        fb.inpool = false;
        fb.poolName = "doubleFood";
    }

    createObjcet(name: string, pos: cc.Vec2): cc.Node {
        let ob: cc.Node = cc.instantiate(ObjectPool.instance.pool[name][0]);
        this.spawnObjects.push(ob);
        this.objects.addChild(ob);
        ob.position = pos;
        return ob;
    }



    getObjcet(name: string, pos: cc.Vec2): cc.Node {
        let ob: cc.Node = ObjectPool.instance.getObject(name);
        let r = this.spawnObjects.filter(x => x.uuid == ob.uuid);
        if (r.length == 0) {
            this.spawnObjects.push(ob);
        }
        if (ob.parent != this.objects) {
            ob.parent = this.objects;
        }
        ob.runAction(cc.sequence(cc.show(),cc.moveTo(0, pos)));
        return ob;
    }

    getRandomInt(min: number, max: number): number {
        let Range = max - min;
        let Rand = Math.random();
        return (min + Math.round(Rand * Range));
    }

    gameDone() {
        for (let i = 0; i < this.spawnObjects.length; i++) {
            if (this.spawnObjects[i] != null && this.spawnObjects[i].isValid) {
                let pool = this.spawnObjects[i].getComponent(PoolItem);
                if (pool) {
                    pool.returnPool();
                }
                else {
                    this.spawnObjects[i].destroy();
                }
            }
        }
        this.spawnObjects = new Array<cc.Node>();
    }
}
