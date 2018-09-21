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

const {ccclass, property} = cc._decorator;

@ccclass
export default class Backgound extends cc.Component {

    camera: cc.Node;
    snake_node: cc.Node
    scoreNode: cc.Node;

    
    offset_bg = 0;
    offset_camera = 0;
    offset_score = 0;

    // onLoad () {}

    start () {
        this.camera = cc.find("Canvas/Main Camera");
        this.snake_node = cc.find("Canvas/snake");
        this.scoreNode = cc.find("Canvas/score");
        this.offset_bg = this.snake_node.y - this.node.y;
        this.offset_camera = this.snake_node.y - this.camera.y;
        this.offset_score = this.camera.y - this.scoreNode.y;

        // console.log("屏幕高度：",screen.height);
    }

    update(dt) {
        // this.node.position = this.node.position.lerp(cc.v2(this.node.x, this.snake_node.y - this.offset_bg), dt * 10);
        // this.camera.position = this.camera.position.lerp(cc.v2(this.camera.x, this.snake_node.y - this.offset_camera), dt * 10);
        this.node.position = cc.v2(0, GameManager.instance.cameraPos);
        this.camera.position = cc.v2(0, GameManager.instance.cameraPos);
        this.scoreNode.position = cc.v2(this.scoreNode.x, this.camera.y - this.offset_score);
    }
}
