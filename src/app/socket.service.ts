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
  getmessage() {
    console.log("service中的log");
  }
}
