
import { Injectable, OnDestroy, OnInit } from "@angular/core";
import { Network } from "@ionic-native/network/ngx";
/* import { Socket } from "@smx/ng-socket-io"; */

@Injectable({
  providedIn: "root",
})
export class SocketService implements OnInit, OnDestroy {
  user = {
    rdtId: null,
    userId: null,
    loginType: null,
    available: "N",
    infoNum: 0,
    gps: "nogps",
    connect: true,
  };
  phone = {
    setNo: null,
    version: null,
    imei: null,
  };
  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }
  ngOnDestroy(): void {
    throw new Error("Method not implemented.");
  }
  constructor(
  
    private network: Network,
   /*  private socket: Socket */
  ) {
  /*      this.socket.on("disconnect", () => {});
    this.socket.on("reconnect", () => {}); */
  }




  connect: any;
  //第一次判断网络状态
  checkNetwork() {
    let newVariable: any;
    newVariable = window.navigator;
    var networkState = newVariable.connection.type;
  }

  getnetmessage() {
    this.network.onDisconnect().subscribe(() => {
      this.connect = "离线";
      return false;
    });

    this.network.onConnect().subscribe(() => {
      this.connect = "在线";

      return true;
    });

    let newVariable: any;
    newVariable = window.navigator;
    var networkState = newVariable.connection.type;
    if (networkState != "none") {
      this.connect = "在线";
    }
  }

  
}
