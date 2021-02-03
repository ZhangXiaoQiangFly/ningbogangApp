/**
 * 闪屏界面 处理第一屏幕操作逻辑
 */
import { SocketService } from "./../socket.service";
import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import { Geolocation } from "@ionic-native/geolocation/ngx"/*  */;


import { interval, Subscription } from "rxjs";

import { Network } from "@ionic-native/network/ngx";

@Component({
  selector: "app-welcome",
  templateUrl: "./welcome.page.html",
  styleUrls: ["./welcome.page.scss"],
})
export class WelcomePage implements OnInit {
  time = 3;
  latitude: any;
  longitude: any;
  data1: any;
  interval: any;
  i = 0;
  connect: any;

  //countDown$: Observable<any>;

  constructor(
    private geolocation: Geolocation,
    private nav: NavController,
    private socketService: SocketService
  ) {
  
   
  }


 
  ngOnInit() {
    this.getGeolocation();
    this.interval = setInterval(() => {
      this.time = this.time - 1;
      if (this.time === 0) {
        clearInterval(this.interval);
         this.nav.navigateRoot("/login");
      }
    }, 1000);
  }

  openLogin() {
    clearInterval(this.interval);
   

    //this.nav.navigateRoot('/home');
    this.nav.navigateRoot("/login");
  }
  //获取经纬度信息

  getGeolocation() {
    this.geolocation
      .getCurrentPosition()
      .then((resp) => {
        localStorage.setItem("latitude", resp.coords.latitude+"");
        localStorage.setItem("longitude", resp.coords.longitude + "");
        console.log(
          "latitude:" +
            resp.coords.latitude +
            "-------longitude:" +
            resp.coords.longitude
        );
      })
      .catch((error) => {
        console.log("Error getting location", error);
      });
    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      console.log("getGeolocation" + data);
      //获取经纬度的变化，进行位置传递，100ms内的变化只进行一次
      this.debounce(() => {
        //进行位置传递
      }, 100);
    });
  }
  timeout = null;
  debounce(fn, wait) {
    if (this.timeout !== null) clearTimeout(this.timeout);
    this.timeout = setTimeout(fn, wait);
  }
}
