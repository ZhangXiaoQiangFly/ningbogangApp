import { Injectable, OnDestroy, OnInit } from "@angular/core";
import { Network } from "@ionic-native/network/ngx";

import { Observable } from "rxjs";


@Injectable({
  providedIn: "root",
})
export class SocketService implements OnInit, OnDestroy {
  ws: WebSocket;

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
  constructor(private network: Network ) {
    
  }
  createObservableSocket(url: string): Observable<any> {
    this.ws = new WebSocket(url);
    return new Observable<any>((observable) => {
      this.ws.onmessage = (event) => observable.next(event.data);
      this.ws.onerror = (event) => observable.error(event);
      this.ws.onclose = (event) => observable.complete();
    });
  }
  sendMessage(message: string) {
    this.ws.send(message);
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
