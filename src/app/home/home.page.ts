/**
 * 主页面
 */
import { Component, OnInit, OnDestroy } from "@angular/core";
//import {SocketService} from '../socket.service';
import { Subscription } from "rxjs";
import { NavController, ToastController, Platform } from "@ionic/angular";
import { AlertController } from "@ionic/angular";
import { Router } from "@angular/router";
import * as smartmapx from "@smx/api";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { SocketService } from "./../socket.service";
declare let cordova: any;

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements OnInit, OnDestroy {
  messageSubscription: Subscription = null;

  data = [];

  reachBtnDiable = true;
  reachBtnStatus = 0;
  infoItem: any;
  checkOtherInfo = true;
  liIndex: any;

  // 激活/模式/排序
  workStatus = {
    active: false,
    activeDisable: false,
    mode: "S", // S-单循环 D-双循环
    order: "#",
  };
  goTo: any;
  exitDisable = false;
  backDisable = false;
  timer: any;
  quitStatus: any;
  speakArray = [];
  inSpeaking = false;

  constructor(
    /* private socketService: SocketService, */
    private geolocation: Geolocation,
    private toast: ToastController,
    private alertController: AlertController,
    private nav: NavController,
    private router: Router,
    private platform: Platform,
    private socketService: SocketService
  ) {
    this.backButtonEvent();
  }

  ngOnInit(): void {
    smartmapx.mapbase = "http://dev.smartmapx.com";
    smartmapx.apikey =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYmYiOjE1MzcxODM1OTgsImRhdGEiOiJ7XCJsb2dpbl9uYW1lXCI6XCJyb290XCIsXCJnZW5kZXJcIjoyLFwidXNlcl9pZFwiOlwiZm1fc3lzdGVtX3VzZXJfcm9vdFwiLFwidXNlcl9uYW1lXCI6XCJyb290XCIsXCJ1c2VyX29yaWdpbl9pZFwiOlwiZm1fbG9jYWxcIixcInByb2R1Y3RfaWRcIjpcIlwiLFwiZXhwaXJlX3RpbWVcIjpcIlwiLFwic291cmNlX2lkXCI6XCJcIixcInR5cGVcIjpcIlwiLFwiY29ycF9pZFwiOlwiZm1fc3lzdGVtX2NvcnBcIn0iLCJleHAiOjQwOTI1OTkzNDksImp0aSI6ImFfNjhmZjBhZGY5OTcxNDQ0NThjNzViZWFiN2FjNTkzYWYifQ.W122WkT6QR4HZWbpalkpmirV9JWkDYcCkmNZoxCB_z8";
    var map = new smartmapx.Map({
      container: "map",
      mapId: "map_id_1",
      center: [116.39738, 39.90579],
      zoom: 10,
    });
  }

  getGeolocation() {
    this.geolocation
      .getCurrentPosition()
      .then(resp => {
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
        console.log("Error getting location", error);
      });

    let watch = this.geolocation.watchPosition();
    watch.subscribe(data => {
      console.log(data);

      // data can be a set of coordinates, or an error (if an error occurred).
      // data.coords.latitude
      // data.coords.longitude
    });
  }

  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
      this.messageSubscription = null;
    }
  }

  // 安卓硬件退出
  backButtonEvent() {
    this.platform.backButton.subscribe(() => {
      if (this.router.url.indexOf("home") > -1) {
        // this.backAlertConfirm();
      }
    });
  }
}
