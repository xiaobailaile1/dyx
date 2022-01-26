import request from "@/request";
// 故障记录
const RECORD_URL = "market/devicerecord/";

// 获取故障设备列表
export const getList = (data) => {
  return request({
    type: "get",
    url: RECORD_URL,
    data: data,
  });
};

// 修改关联设备
export const putList = (id, data) => {
  return request({
    type: "put",
    url: `${RECORD_URL}${id}/`,
    data: data,
  });
};

export default class SocketService {
  static instance = null;
  static get Instance() {
    if (!this.instance) {
      this.instance = new SocketService();
    }
    return this.instance;
  }

  // 和服务端连接的socket对象
  ws = null;

  // 存储回调函数
  callBackMapping = {};

  // 标识是否连接成功
  connected = false;

  // 记录重试的次数
  sendRetryCount = 0;

  // 重新连接尝试的次数
  connectRetryCount = 0;

  //  定义连接服务器的方法
  connect() {
    // 连接服务器
    if (!window.WebSocket) {
      return console.log("您的浏览器不支持WebSocket");
    }
    this.ws = new WebSocket("ws://localhost:1234");
    // 连接成功的事件
    this.ws.onopen = () => {
      console.log("连接服务端成功");
      this.connected = true;
      // 重置重新连接的次数
      this.connectRetryCount = 0;
    };
    //   // 1.连接服务端失败
    //   // 2.当连接成功之后, 服务器关闭的情况(连接失败重连)
    this.ws.onclose = () => {
      this.connected = false;
      this.connectRetryCount++;
      setTimeout(() => {
        this.connect();
      }, 500 * this.connectRetryCount);
    };
    // 得到服务端发送过来的数据
    this.ws.onmessage = (msg) => {
      console.log("从服务端获取到了数据" + msg.data);
      // if (this.callBackMapping) {
      // this.callBackMapping.call(this, dataList)
      // }
    };
  }
  // 回调函数的注册
  registerCallBack(callBack) {
    console.log("回调函数的注册", callBack);
    this.callBackMapping = callBack;
  }

  // 取消某一个回调函数
  unRegisterCallBack(callBack) {
    console.log("取消某一个回调函数", callBack);
    this.callBackMapping = null;
  }

  // 发送数据的方法
  send(data) {
    // 判断此时此刻有没有连接成功
    if (this.connected) {
      this.sendRetryCount = 0;
      this.ws.send(data);
    } else {
      this.sendRetryCount++;
      setTimeout(() => {
        this.send(data);
      }, this.sendRetryCount * 500);
    }
  }
}
