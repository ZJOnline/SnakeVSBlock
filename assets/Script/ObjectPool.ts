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
export default class ObjectPool extends cc.Component {


    public pool: { [key: string]: Array<cc.Node> } = {};
    public static instance: ObjectPool = null;
    public inited: boolean = false;

    onLoad() {
        this.init();
        ObjectPool.instance = this;
    }

    start() {

    }

    init() {

        this.pool["ball"] = new Array<cc.Node>();
        cc.loader.loadRes("Prefab/food", (error: Error, resource: any) => {
            this.pool["food"] = new Array<cc.Node>();
            for (let i = 0; i < 10; i++) {
                let ob: cc.Node = cc.instantiate(resource);
                ob.position = new cc.Vec2(2000, 2000);
                this.pool["food"].push(ob);
            }
        });
        cc.loader.loadRes("Prefab/ballFX", (error: Error, resource: any) => {
            this.pool["ballFX"] = new Array<cc.Node>();
            for (let i = 0; i < 10; i++) {
                let ob: cc.Node = cc.instantiate(resource);
                ob.position = new cc.Vec2(2000, 2000);
                ob.getComponent(cc.ParticleSystem).stopSystem();
                this.pool["ballFX"].push(ob);
            }
        });
        cc.loader.loadRes("Prefab/stone", (error: Error, resource: any) => {

            this.pool["stone"] = new Array<cc.Node>();
            for (let i = 0; i < 15; i++) {
                let ob: cc.Node = cc.instantiate(resource);
                ob.position = new cc.Vec2(2000, 3000);
                this.pool["stone"].push(ob);
            }

        });
        cc.loader.loadRes("Prefab/rail", (error: Error, resource: any) => {

            this.pool["rail"] = new Array<cc.Node>();
            for (let i = 0; i < 10; i++) {
                let ob: cc.Node = cc.instantiate(resource);
                ob.position = new cc.Vec2(2000, 2000);
                this.pool["rail"].push(ob);
            }
        });
        cc.loader.loadRes("Prefab/wall", (error: Error, resource: any) => {

            this.pool["checkwall"] = new Array<cc.Node>();
            for (let i = 0; i < 5; i++) {
                let ob: cc.Node = cc.instantiate(resource);
                ob.position = new cc.Vec2(2000, 2000);
                this.pool["checkwall"].push(ob);
            }
        });
        cc.loader.loadRes("Prefab/starstone", (error: Error, resource: any) => {

            this.pool["starstone"] = new Array<cc.Node>();
            for (let i = 0; i < 2; i++) {
                let ob: cc.Node = cc.instantiate(resource);
                ob.position = new cc.Vec2(2000, 2000);
                this.pool["starstone"].push(ob);
            }
        });
        cc.loader.loadRes("Prefab/doubleFood", (error: Error, resource: any) => {

            this.pool["doubleFood"] = new Array<cc.Node>();
            for (let i = 0; i < 2; i++) {
                let ob: cc.Node = cc.instantiate(resource);
                ob.position = new cc.Vec2(2000, 2000);
                this.pool["doubleFood"].push(ob);
            }
        });
        cc.loader.loadRes("Prefab/ball", (error: Error, resource: any) => {
            let ob: cc.Node = cc.instantiate(resource);
            this.node.addChild(ob);
            ob.position = new cc.Vec2(5000, 2000);
            this.pool["ball"] = new Array<cc.Node>(ob);
            this.inited = true;
        });
    }

    getObject(name: string): cc.Node {
        if (this.pool[name].length > 0) {
            if (this.pool[name].length > 1) {
                let ob = this.pool[name].shift();
                if (ob.isValid) {
                    ob.active = true;
                    return ob;
                }
                else {
                    console.log("error");
                }
            }
            else {
                let ob: cc.Node = cc.instantiate(this.pool[name][0]);
                ob.position = new cc.Vec2(2000, 2000);
                return ob;
            }
        }
        return null;
    }

    // update (dt) {}
}
