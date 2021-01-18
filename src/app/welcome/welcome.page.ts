/**
 * 闪屏界面 处理第一屏幕操作逻辑
 */
import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import { HttpClient } from "@angular/common/http";
import { Geolocation } from "@ionic-native/geolocation/ngx";

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

  constructor(private geolocation: Geolocation, private nav: NavController) {}

  ngOnInit() {
    this.interval = setInterval(() => {
      this.time = this.time - 1;
      if (this.time === 0) {
        clearInterval(this.interval);
        //this.nav.navigateRoot('/home');
      }
    }, 1000);
  }

  openLogin() {
    clearInterval(this.interval);
    //this.getGeolocation();
    //this.nav.navigateRoot('/home');
    this.nav.navigateRoot("/tasklist");
  }

  getGeolocation() {
    this.geolocation
      .getCurrentPosition()
      .then(resp => {
        this.latitude = resp.coords.latitude;
        this.longitude = resp.coords.longitude;
        console.log(
          "latitude:" +
            resp.coords.latitude +
            "-------longitude:" +
            resp.coords.longitude
        );

        // resp.coords.latitude
        // resp.coords.longitude
      })
      .catch(error => {
        this.latitude = null;
        this.longitude = null;
        console.log("Error getting location", error);
      });

    let watch = this.geolocation.watchPosition();
    watch.subscribe(data => {
      console.log(data);
      this.data1 = data;
      this.i++;
      //获取经纬度的变化，进行位置传递，100ms内的变化只进行一次
      this.debounce(() => {
        //进行位置传递
      }, 100);
      // data can be a set of coordinates, or an error (if an error occurred).
      // data.coords.latitude
      // data.coords.longitude
    });
  }
  timeout = null;
  debounce(fn, wait) {
    if (this.timeout !== null) clearTimeout(this.timeout);
    this.timeout = setTimeout(fn, wait);
  }
}