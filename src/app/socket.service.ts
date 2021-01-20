import { HttpClient } from "@angular/common/http";
import { Injectable, OnDestroy, OnInit } from "@angular/core";
import { Network } from "@ionic-native/network/ngx";

@Injectable({
  providedIn: "root",
})
export class SocketService implements OnInit, OnDestroy {
  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }
  ngOnDestroy(): void {
    throw new Error("Method not implemented.");
  }
  constructor(private httpClient: HttpClient, private network: Network) {}

  getmessage(str: String) {
    console.log(str);
    return this.httpClient.get("http://apis.imooc.com/api");
  }
  user = {
    
    userId: null,
  
    connect: true,
  };

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
