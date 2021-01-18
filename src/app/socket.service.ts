import { HttpClient } from "@angular/common/http";
import { Injectable, OnDestroy, OnInit } from "@angular/core";




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
  constructor(private httpClient: HttpClient) {}
  getmessage(str: String) {
    console.log(str);
    return this.httpClient.get("http://apis.imooc.com/api");
  }
}
