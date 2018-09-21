import MessageBox from "./MessageBox";

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

let handler_pool:handler[] = [];
let handler_pool_size = 10;

@ccclass
export default class Utils {

    static writeLog: boolean = true;

    static openMessageBox(str: string, pos: cc.Vec2, parent: cc.Node) {
        cc.loader.loadRes("Prefab/MessageBox", (error: Error, resource: any) => {
            let ob: cc.Node = cc.instantiate(resource);
            ob.getComponent(MessageBox).init(str);
            parent.addChild(ob);
            ob.position = pos;
        });
    }

    static setNodeActive(_node: cc.Node, b: boolean) {
        if (_node.active != b) {
            _node.active = b;
        }
    }

    /**
     * 获取子节点上的组件
     * @param path 路径
     * @param parent 父节点
     * @param type 组件类型
     */
    static findChildComponent<T extends cc.Component>(path: string, parent: cc.Node,type: {prototype: T}) {
        let child = cc.find(path, parent);
        if (child == null || child == undefined) {
            this.log("can't find ", path);
            return null;
        }
        let resoult = child.getComponent(type);
        return resoult;
    }

    static log(message?: any, ...optionalParams: any[]) {
        if (this.writeLog) {
            console.log(message,optionalParams);
        }
    }
    
}
