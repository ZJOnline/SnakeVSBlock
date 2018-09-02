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
export default class Spawner extends cc.Component {

    beginLineBottom: number = 9.6;
    blockLineRemainingBeforeNextBarrage: number;
    cellSize: cc.Vec2 = cc.v2(2, 2);
    column: number = 5;
    currentBlockLineCountBetweenBarrage: number;
    currentIntervalHeight: number;
    currentLine: number;
    static instance: Spawner;
    lineRemainingBeforeNextBlockLine: number;
    secondPhase: boolean;
    startingPhase: boolean;
    startingPhaseBallCoordinates: Coordinates[] = [];
    startOffset: number;
    windowBottomOffset: number = -9.6;
    windowTopOffset: number = 9.6;

    onLoad() {
        Spawner.instance = this;
    }

    start() {

    }

    OnLoadGame()
    {
        this.startOffset = this.node.y;
        this.currentLine = 0;
        let sm = GameManager.instance.spawnManager;
        this.SelectNextIntervalHeight2(sm.startingPhase.intervalHeight);
        this.blockLineRemainingBeforeNextBarrage = 0;
        this.currentBlockLineCountBetweenBarrage = 0;
        this.startingPhase = true;
        this.secondPhase = false;
        let ballCount = sm.startingPhase.ballCount;
        let intervalHeight = sm.startingPhase.intervalHeight;
        let list = new Array<Coordinates>(); // ballitems coordinates list
        for (let i = 0; i < intervalHeight; i++)
        {
            for (let k = 0; k < this.column; k++)
            {
                list.push(new Coordinates(i, k));
            }
        }
        this.startingPhaseBallCoordinates = [];
        for (let j = 0; j < ballCount; j++)
        {
            let index = this.getRandomInt(0, list.length);
            let item = list[index];
            this.startingPhaseBallCoordinates.push(item);
            list.splice(index, 1);
        }
    }

    SelectNextBarrage()
    {
        let sm = GameManager.instance.spawnManager;
        this.currentBlockLineCountBetweenBarrage = this.getRandomInt(sm.barragePeriodMin, sm.barragePeriodMax + 1);
        this.blockLineRemainingBeforeNextBarrage = this.currentBlockLineCountBetweenBarrage + 1;
    }

    SelectNextIntervalHeight1()
    {
        let sm = GameManager.instance.spawnManager;
        this.SelectNextIntervalHeight2(this.getRandomInt(sm.intervalHeightMin, sm.intervalHeightMax + 1));
    }
    //set next interval height
    SelectNextIntervalHeight2(height:number)
    {
        this.currentIntervalHeight = height;
        this.lineRemainingBeforeNextBlockLine = this.currentIntervalHeight + 1;
    }

    update(dt) {
        return;
        let sm = GameManager.instance.spawnManager;
        let windowTop = this.node.y + this.windowTopOffset;
        let num = (this.column - 1) * this.cellSize.y;
        let num2 = -num * 0.5;
        while (true)
        {
            let beginLineBottom = (this.beginLineBottom + this.startOffset) + (this.currentLine * this.cellSize.y);
            if (windowTop < beginLineBottom)
            {
                return;
            }
            let num3 = beginLineBottom + (this.cellSize.y * 0.5);
            let bCreateBlockLine = false;
            let bCreateBarrage = false;
            this.lineRemainingBeforeNextBlockLine--;
            if (this.lineRemainingBeforeNextBlockLine <= 0)
            {
                bCreateBlockLine = true;
                this.SelectNextIntervalHeight1();
                this.blockLineRemainingBeforeNextBarrage--;
                if (this.blockLineRemainingBeforeNextBarrage <= 0)
                {
                    bCreateBarrage = true;
                    this.SelectNextBarrage();
                }
            }
            let set = new Array<number>();
            if (bCreateBlockLine && !bCreateBarrage)
            {
                let blocklinecount = this.getRandomInt(sm.blockLineCountMin, sm.blockLineCountMax + 1);
                let list = new Array<number>(); //block list
                for (let j = 0; j < this.column; j++)
                {
                    list.push(j);
                }
                //get block index
                for (let k = 0; k < blocklinecount; k++)
                {
                    let index = this.getRandomInt(0, list.length);
                    let num4 = list[index];
                    set.push(num4);
                    list.splice(index);
                    list.splice(num4 - 1);
                    list.splice(num4 + 1);
                    if (list.length <= 0)
                    {
                        break;
                    }
                }
            }
            let flag = false;//if is the first blockline or the last blockline
            let column = -1;
            if (bCreateBarrage)
            {
                column = this.getRandomInt(0, this.column); // chose min value block in barrage
            }
            else if (bCreateBlockLine && ((this.blockLineRemainingBeforeNextBarrage == 1) || ((this.currentBlockLineCountBetweenBarrage - this.blockLineRemainingBeforeNextBarrage) == 0)))
            {
                flag = true;
            }
            for (let i = 0; i < this.column; i++)
            {
                let zero = cc.Vec2.ZERO
                zero.x = num2 + (i * this.cellSize.x);
                zero.y = num3;
                let bCreateBlock = false;
                let bCreateBallItem = false;
                if (bCreateBarrage)
                {
                    bCreateBlock = true;
                }
                else if (this.startingPhase)
                {
                    let result = this.startingPhaseBallCoordinates.filter(x => x.i == this.currentLine && x.j == i);
                    if (result.length > 0) {
                        bCreateBallItem = true;
                    }
                }
                else if (!this.secondPhase)
                {
                    if (bCreateBlockLine)
                    {
                        let result = set.filter(x => x == i);
                        if (result.length > 0)
                        {
                            bCreateBlock = true;
                        }
                        else if (this.getRandomFloat(0, 1) <= sm.intervalBallProbability)
                        {
                            bCreateBallItem = true;
                        }
                    }
                    else if (this.getRandomFloat(0, 1) <= sm.intervalBallProbability)
                    {
                        bCreateBallItem = true;
                    }
                }
                if (bCreateBlock)
                {
                    let minBlockValue = sm.minBlockValue;
                    let maxBlockValue = sm.maxBlockValue;
                    //if this block is the smallest block in barrage ,or the first block or the last bolck in blockline, or in starting phase
                    if ((bCreateBarrage && (column == i)) || (flag || this.startingPhase))
                    {
                        let minFirstAndLastBlockLineValueFactor;
                        if (flag)
                        {
                            minFirstAndLastBlockLineValueFactor = sm.minFirstAndLastBlockLineValueFactor;
                        }
                        else
                        {
                            minFirstAndLastBlockLineValueFactor = sm.minBarrageBlockValueFactor;
                        }
                        let b = Math.round(GameManager.instance.snake.body.length * minFirstAndLastBlockLineValueFactor);
                        minBlockValue = Math.min(minBlockValue, b);
                        maxBlockValue = Math.min(maxBlockValue, b);
                    }
                    if (maxBlockValue > 0)
                    {
                        // Block block = BlockFactory.Instance.CreateBlock();
                        // block.Value = UnityEngine.Random.Range(minBlockValue, maxBlockValue + 1);
                        // block.transform.position = zero;
                    }
                }
                //create ballitem
                if (bCreateBallItem && !this.secondPhase)
                {
                    // BallItem item = BallItemFactory.Instance.CreateBallItem();
                    // item.Value = UnityEngine.Random.Range(instance.minBallValue, instance.maxBallValue + 1);
                    // item.transform.position = zero;
                }
                //create bar
                if (((bCreateBlockLine && !this.startingPhase) && (!this.secondPhase && (i < (this.column - 1)))) && (Math.random() <= sm.barProbability))
                {
                    // Bar bar = BarFactory.Instance.CreateBar();
                    // bar.Height = this.currentIntervalHeight * this.cellSize.y;
                    // Vector3 vector3 = zero + new Vector3(0.5f * (this.cellSize.x + bar.Width), 0.5f * (this.cellSize.y + bar.Height), 0f);
                    // bar.transform.position = vector3;
                }
            }
            if (this.startingPhase)
            {
                if (bCreateBarrage)
                {
                    this.startingPhase = false;
                    this.secondPhase = true;
                    this.SelectNextIntervalHeight2(sm.secondPhase.intervalHeight);
                }
            }
            else if (this.secondPhase && bCreateBlockLine)
            {
                this.secondPhase = false;
            }
            this.currentLine++;
        }
    }
    
    
    getRandomInt(min: number, max: number): number {
        var Range = max - min;
        var Rand = Math.random();
        return (min + Math.round(Rand * Range));
    }

    getRandomFloat(min: number, max: number): number {
        var Range = max - min;
        var Rand = Math.random();
        return (min + Rand * Range);
    }

}
class Coordinates {

    i: number;
    j: number;

    constructor(i: number, j: number) {
        this.i = i;
        this.j = j;
    }

    Equals(obj: any) {
        if (obj == null) {
            return false;
        }
        let coordinates = obj as Coordinates;
        if (coordinates == null) {
            return false;
        }
        return ((this.i == coordinates.i) && (this.j == coordinates.j));
    }

    GetHashCode() {
        return (this.i ^ this.j);
    }
}
