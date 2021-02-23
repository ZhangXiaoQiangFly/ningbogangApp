/**
 * 主页面
 */
import { Component, OnInit, OnDestroy } from "@angular/core";
//import {SocketService} from '../socket.service';
import { Subscription } from "rxjs";
import { NavController, ToastController, Platform } from "@ionic/angular";
import { AlertController } from "@ionic/angular";
import { Router, ActivatedRoute, Params } from "@angular/router";
import * as smartmapx from "@smx/api";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { SocketService } from "./../socket.service";
import * as $ from "jquery";
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

  //确认到达
  confirmearrive = false;

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
  locationEngine: any;
  pathFinder: any;
  navigation: any;

  mapLoaded = false;
  runMarker: any;
  finding = false;
  routeLeg: any;
  map: any;
  fromMarker: any;
  toMarker: any;
  navigationControl: any;
  //剩余里程
  resmile: String;
  //预计时间
  restime: String;

  //导航规划完成
  roadGeojsonLoaded = false;

  html: any;

  constructor(
    /* private socketService: SocketService, */
    private geolocation: Geolocation,
    private toast: ToastController,
    private alertController: AlertController,
    private nav: NavController,
    private router: Router,
    private platform: Platform,
    private socketService: SocketService,
    public activeRoute: ActivatedRoute
  ) {
    //this.backButtonEvent();
    /*   this.activeRoute.queryParams.subscribe((params: Params) => {
     
      console.log(
        
        "longitude:" + params["longitude"] + "------latitude" + params["latitude"]
      );
    }); */
  }

  ngOnInit(): void {
    //this.getGeolocation();
    console.log(localStorage.getItem("longitude"));
    console.log(localStorage.getItem("latitude"));

    /*  smartmapx.mapbase = "http://dev.smartmapx.com"; */

    smartmapx.mapbase = "https://zgnav.npedi.com/";
    smartmapx.apikey =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYmYiOjE1MzcxODM1OTgsImRhdGEiOiJ7XCJsb2dpbl9uYW1lXCI6XCJyb290XCIsXCJnZW5kZXJcIjoyLFwidXNlcl9pZFwiOlwiZm1fc3lzdGVtX3VzZXJfcm9vdFwiLFwidXNlcl9uYW1lXCI6XCJyb290XCIsXCJ1c2VyX29yaWdpbl9pZFwiOlwiZm1fbG9jYWxcIixcInByb2R1Y3RfaWRcIjpcIlwiLFwiZXhwaXJlX3RpbWVcIjpcIlwiLFwic291cmNlX2lkXCI6XCJcIixcInR5cGVcIjpcIlwiLFwiY29ycF9pZFwiOlwiZm1fc3lzdGVtX2NvcnBcIn0iLCJleHAiOjQwOTI1OTkzNDksImp0aSI6ImFfNjhmZjBhZGY5OTcxNDQ0NThjNzViZWFiN2FjNTkzYWYifQ.W122WkT6QR4HZWbpalkpmirV9JWkDYcCkmNZoxCB_z8";
    this.map = new smartmapx.Map({
      container: "map",
      center: [122, 29.77462],
      zoom: 15,
      mapId: "de28d838-2e47-4474-a912-02211c09224f",
      /*  mapId: "map_id_1", */
    });
    this.navigationControl = new smartmapx.InfoControl({
      closeButton: false,
      html: "<h1>导航</h1>",
    });
    //this.map.addControl(this.navigationControl, "top-right");
    // 初始化路径计算服务
    this.locationEngine = new smartnavx.SimulateLocationEngine(null, 100);

    //this.locationEngine = new smartnavx.WeixinRemoteLocationEngine(null);

    this.map.on("load", () => {
      this.mapLoaded = true;

      this.map.loadImage("../../assets/image/0000009.png", (error, image) => {
        if (error) throw error;
        this.map.addImage("../../assets/image/0000009.png", image, {
          pixelRatio: 2,
        });
      });
     /*  this.map.addControl(
        new smartmapx.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
        })
      ,"bottom-left"); */
       var el = document.createElement("div");
       el.className = "marker";
       el.style.backgroundImage = "url(../assets/image/arrow.png)";
       el.style.backgroundSize = "20px 20px";
       el.style.width = "20px";
       el.style.height = "20px";
       this.runMarker = new smartmapx.Marker(el)
         .setLngLat([122.002555, 29.767972])
         .addTo(this.map);

      var roadGeoJSONUrl = "../../assets/road.geojson";

      $.getJSON(roadGeoJSONUrl, (data) => {
        this.pathFinder = new smartnavx.PathFinder({
          roadGeojson: data,
        });

        this.pathFinder.on("load", () => {
          console.log("success to load road geojson");
          this.roadGeojsonLoaded = true;
          if (this.roadGeojsonLoaded && this.mapLoaded) {
            this.firstRouting();
          }
        });
        this.pathFinder.on("error", (error) => {
          console.log(error);
        });
        this.navigation = new smartnavx.Navigation(
          this.pathFinder,
          this.locationEngine,
          {
            overspeedRoad: false,
            overspeedCheckInterval: 1000,
            overspeedContinuedCount: 3,
          }
        );

        this.navigation.hasWillEnterLastRoad = true;
        this.navigation.willEnterLastRoadDistance = 50;
      });

      this.map.addSource("road", {
        type: "geojson",
        data: roadGeoJSONUrl,
      });
      this.map.addLayer({
        id: "road",
        type: "line",
        source: "road",
        paint: {
          "line-color": "blue",
          "line-opacity": 0.8,
          "line-width": 2,
        },
      });
      this.map.addSource("routing", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });
      this.map.addSource("track", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });
      this.map.addLayer({
        id: "汽车导航_o",
        type: "line",
        source: "routing",
        layout: {
          visibility: "visible",
          "line-cap": "round",
          "line-join": "round",
        },
        paint: {
          "line-color": "rgba(14, 86, 38, 1)",
          "line-width": 9,
          "line-opacity": 1,
        },
      });
      this.map.addLayer({
        id: "汽车导航",
        type: "line",
        source: "routing",
        layout: {
          visibility: "visible",
          "line-cap": "round",
          "line-join": "round",
        },
        paint: {
          "line-color": "rgba(26, 184, 87, 1)",
          "line-width": 7,
          "line-opacity": 0.8,
        },
      });
      this.map.addLayer({
        id: "汽车导航_icon",
        type: "line",
        source: "routing",
        layout: {
          visibility: "visible",
          "line-cap": "round",
          "line-join": "round",
        },
        paint: {
          "line-color": "rgba(26, 184, 87, 1)",
          "line-width": 7,
          "line-opacity": 0.8,
          "line-pattern": "0000009",
        },
      });

      // 车辆形式轨迹
      this.map.addLayer({
        id: "行驶后_o",
        type: "line",
        source: "track",
        paint: {
          "line-color": "rgba(117, 129, 146, 1)",
          "line-width": 10,
          "line-opacity": 1,
        },
      });
      this.map.addLayer({
        id: "行驶后",
        type: "line",
        source: "track",
        paint: {
          "line-color": "rgba(184, 198, 211, 1)",
          "line-width": 8,
          "line-blur": 2,
        },
      });
      this.map.addLayer({
        id: "行驶后_icon",
        type: "line",
        source: "track",
        paint: {
          "line-color": "rgba(156, 171, 192, 1)",
          "line-width": 8,
          "line-blur": 2,
          "line-pattern": "0000009",
        },
      });

      this.fromMarker = new smartmapx.UnionMarker([122.002555, 29.767972]);
      this.fromMarker.addTo(this.map);
      this.fromMarker.setLabel(
        new smartmapx.Label(" 起点 ", {
          offset: [25, -5],
        })
      );
      this.fromMarker.enableDragging();
      this.fromMarker.on("dragend", this.dragend);

      this.toMarker = new smartmapx.UnionMarker([122.004975, 29.77044]);
      this.toMarker.addTo(this.map);
      this.toMarker.setLabel(
        new smartmapx.Label(" 终点 ", {
          offset: [25, -5],
        })
      );
      this.toMarker.enableDragging();
      this.toMarker.on("dragend", this.dragend);
    });

    /*     var navigationControl = new smartmapx.InfoControl({
      closeButton: false,
      html: "<h1>导航</h1>",
    });
    map.addControl(navigationControl, "top-right"); */
  }

  //第一次规划导航
  firstRouting() {
    setTimeout(() => {
      if (this.pathFinder) {
        this.dragend();
      } else {
        this.firstRouting();
      }
    }, 100);
  }

  dragend() {
    this.routing(this.fromMarker.getLngLat(), this.toMarker.getLngLat());
  }

  routing(fromPoint: { lng: any; lat: any }, toPoint: { lng: any; lat: any }) {
    this.pathFinder.find(
      [fromPoint.lng, fromPoint.lat],
      [toPoint.lng, toPoint.lat],
      (error, route) => {
        if (error) {
          console.log(error.message);
        } else {
          this.routeLeg = route.legs[0];
          this.setNavigationInfo(this.routeLeg);
          console.log(" routeLeg " + this.routeLeg);
        }
      }
    );
  }

  setNavigationInfo(routeLeg) {
    this.map.getSource("routing").setData(routeLeg.geometry);
    this.resmile = distanceDesc2(routeLeg.distance);
    this.restime = durationDesc(routeLeg.duration);
    let html = "";
    routeLeg.steps.forEach((step) => {
      if (step.maneuver.type === "depart") {
        html +=
          '<tr>向' +
          directionDesc(step.maneuver.bearing_after) +
          "出发</td><td>沿" +
          getRoadName(step.name) +
          "</td><td>行驶" +
          distanceDesc2(step.distance) +
          "</td></tr>";
      }
    });
    this.html = html;
   /*      this.map.fitBounds(this.turf.bbox(routeLeg.geometry), {
     padding: {
       top: 30,
       bottom: 20,
       left: 20,
       right: 20,
     },
   }); */
  }

  voicePlayer = new smartnavx.HtmlVoicePlayer();

  navigationListener = {
    startNavigation: (event) => {
      console.log("startNavigation", event);
      // 添加运行marker
      if (this.runMarker) {
        this.runMarker.remove();
      }

      var el = document.createElement("div");
      el.className = "marker";
      el.style.backgroundImage = "url(../assets/image/arrow.png)";
      el.style.backgroundSize = "20px 20px";
      el.style.width = "20px";
      el.style.height = "20px";
      this.runMarker = new smartmapx.Marker(el)
        .setLngLat(event.target.geometry.geometry.coordinates[0])
        .addTo(this.map);
    },

    locationUpdate: (event) => {
      // 更新地图上的点
      this.resmile = distanceDesc2(event.toDestinationDistance);
      this.restime = durationDesc(event.toDestinationTime);
      console.log(
        `剩余里程:${distanceDesc2(
          event.toDestinationDistance
        )}; 剩余时间:${durationDesc(event.toDestinationTime)}`
      );

      const location = event.location;
      const track = event.track;
      if (track) {
        this.map.getSource("track").setData(track);
      }
      const lngLat = [location.longitude, location.latitude];
      const heading = location.heading ? location.heading : 0;
      this.runMarker.setLngLat(lngLat);
      this.runMarker.setRotate(heading);
      this.map.easeTo({
        center: lngLat,
        bearing: heading,
        pitch: 30,
        offset: [0, 100],
      });
      // map.setBearing(location.heading);
      // map.setCenter(lngLat);
    },
    showTurn: (event) => {
      // 更新导航引导信息
      const step = event.target.step;
      let html;
      if (step.maneuver.type === "arrive") {
        const modifier = "straight";
        html =
          '<div><span class="' +
          turnToIcon(modifier) +
          '"></span>' +
          distanceDesc2(event.distance) +
          "抵达</div><div>目的地</div>";
      } else {
        /*  html =
          '<div><span class="' +
          turnToIcon(step.maneuver.modifier) +
          '"></span>' +
          distanceDesc2(event.distance) +
          driveRoadPretText(step) +
          "</div><div>" +
          getRoadName(step.name) +
          "</div>"; */
        html =
          '<div><span class="' +
          turnToIcon(step.maneuver.modifier) +
          '"></span>' +
          driveRoadPretText(step) +
          getRoadName(step.name) +
          "行驶" +
          distanceDesc2(event.distance);
        ("</div>");
      }
      this.html = html;
      //this.navigationControl.setHTML(html);
      //console.log("showTurn", event);
    },

    voiceTurn: (event) => {
      const voiceTurnGuidanceArray = event.target;
      const firstVoiceTurnGuidance = voiceTurnGuidanceArray[0];
      let content = "";
      if (firstVoiceTurnGuidance.step.maneuver.type === "depart") {
        content =
          "向" +
          directionDesc(firstVoiceTurnGuidance.step.maneuver.modifier) +
          "出发，行驶" +
          distanceDesc(firstVoiceTurnGuidance.nextStep);
      } else if (
        firstVoiceTurnGuidance.toTurnDistance <= 100 &&
        firstVoiceTurnGuidance.step.maneuver.type === "arrive"
      ) {
        // 即将抵达有专门事件，不播报
        return;
      } else {
        // 大于400米播报继续行驶
        if (firstVoiceTurnGuidance.toTurnDistance > 400) {
          content = "请";
          if (firstVoiceTurnGuidance.currentStep.name) {
            content += "沿" + firstVoiceTurnGuidance.currentStep.name;
          }
          content +=
            "继续行驶" + distanceDesc(firstVoiceTurnGuidance.toTurnDistance);
        } else {
          // 否则播报转弯
          content =
            "前方" + distanceDesc(firstVoiceTurnGuidance.toTurnDistance);
          if (firstVoiceTurnGuidance.step.maneuver.type !== "arrive") {
            content += turnDesc(firstVoiceTurnGuidance.step.maneuver.modifier);
            if (firstVoiceTurnGuidance.step.name)
              content +=
                "，" +
                driveRoadPretText(firstVoiceTurnGuidance.step) +
                firstVoiceTurnGuidance.step.name;
          }
        }
      }

      // 连续事件
      for (let i = 1; i < voiceTurnGuidanceArray.length; i++) {
        const voiceTurnGuidance = voiceTurnGuidanceArray[i];
        content +=
          "，随后" + turnDesc(voiceTurnGuidance.step.maneuver.modifier);
        if (voiceTurnGuidance.step.name)
          content +=
            "，" +
            driveRoadPretText(voiceTurnGuidance.step) +
            voiceTurnGuidance.step.name;
      }

      // 抵达事件
      if (
        firstVoiceTurnGuidance.toTurnDistance > 100 &&
        firstVoiceTurnGuidance.step.maneuver.type === "arrive"
      ) {
        content += "抵达目的地";
      }
      this.playVoice(content, true);
      console.log("voiceTurn", content, event);
    },

    overSpeed: (event) => {
      const content =
        "您已超速，车速" +
        event.drivingSpeed +
        "，当前路段限速" +
        event.limitSpeed;
      console.log(content);
      this.playVoice(content, false);
    },

    willEnterLastRoad: (event) => {
      console.log("willEnterLastRoad", event);
      const step = event.target.step;
      const name = step.name ? "目的地入口" : step.name + "入口";
      this.playVoice(
        "前方" + distanceDesc2(event.distance) + "进入" + name,
        false
      );
    },

    endNavigation: (event) => {
      this.playVoice("您已到达目的地，本次导航结束", false);
      //this.navigationControl.setHTML("<div>您已到达目的地，本次导航结束</div>");
      this.html = "<div>您已到达目的地，本次导航结束</div>";
      this.confirmearrive = true;
      console.log("endNavigation", event);
    },

    willEndNavigation: (event) => {
      console.log("即将抵达目的地！");
      this.playVoice("即将抵达目的地！", false);
    },
  };

  startNavigation() {
    this.map.setZoom(18);
    if (this.navigation) {
      this.navigation.stop();
    }

    if (this.locationEngine) {
      this.locationEngine.stop();
    }

    if (this.locationEngine.getProvider() === "simulator") {
      this.locationEngine.setRouteLeg(this.routeLeg);
    }

    this.navigation.start(this.routeLeg, this.navigationListener);
    const request = new smartnavx.LocationEngineRequest();
    request.interval = 500;
    this.locationEngine.start(request);

    this.playVoice(
      "开始导航，全程" +
        distanceDesc(this.routeLeg.distance) +
        "，大约需要" +
        durationDesc(this.routeLeg.duration),
      false
    );
  }
  stopNavigation() {
    if (this.navigation) {
      this.navigation.stop();
      this.voicePlayer.pause();
    }
  }
  playVoice(content: any, isNow: any) {
    if (isNow) {
      this.voicePlayer.playVoiceTextNow(content);
    } else {
      this.voicePlayer.addVoiceText(content);
    }
  }

  //获取经纬度信息

  getGeolocation() {
    this.geolocation
      .getCurrentPosition()
      .then((resp) => {
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

  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
      this.messageSubscription = null;
    }
  }

  //退出回到tasklist页面
  gotolist() {
    //this.AlertConfirm();
  }
  startnavi() {
    this.startNavigation();
  }

  stopnavi() {
    this.stopNavigation();
  }
  //确认到达
  confirmed() {
    this.nav.navigateRoot("/tasklist");
  }

  // 安卓硬件退出
  backButtonEvent() {
    this.platform.backButton.subscribe(() => {
      if (this.router.url.indexOf("home") > -1) {
        // this.backAlertConfirm();
      }
    });
  }
  // 退出提示
  async AlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "",
      message: "退出当前导航？",
      buttons: [
        {
          text: "取消",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {
            console.log("Confirm Cancel: blah");
          },
        },
        {
          text: "确定",
          handler: () => {
            this.nav.navigateRoot("/tasklist");
          },
        },
      ],
    });

    await alert.present();
  }
}

function arriveTurnDesc(turnType) {
  if (turnType === "sharp right") {
    return "右后方";
  } else if (turnType === "right") {
    return "右侧";
  } else if (turnType === "slight right") {
    return "右前方";
  } else if (turnType === "straight") {
    return "前方";
  } else if (turnType === "slight left") {
    return "左前方";
  } else if (turnType === "left") {
    return "左侧";
  } else if (turnType === "sharp left") {
    return "左后方";
  } else if (turnType === "uturn") {
    return "后方";
  }
}
function directionDesc(angle) {
  if (angle > 120 && angle < 180) return "西南";
  if (angle > 40 && angle <= 120) return "西";
  if (angle > 20 && angle <= 40) return "西北";
  if ((angle >= 0 && angle <= 20) || (angle >= 340 && angle <= 360))
    return "北";
  if (angle > 320 && angle < 340) return "东北";
  if (angle > 240 && angle <= 320) return "东";
  if (angle > 180 && angle <= 240) return "东南";
  return "南";
}

function distanceDesc2(length) {
  length = Math.round(length);
  return length < 1000 ? length + "米" : fixNumber(length / 1000, 1) + "公里";
}
function distanceDesc(length) {
  if (length <= 15) return "马上";
  else if (length <= 150) return Math.round(length / 10) * 10 + "米";
  else if (length <= 250) return "200米";
  else if (length <= 350) return "300米";
  else if (length <= 450) return "400米";
  else if (length <= 550) return "500米";
  else if (length <= 650) return "600米";
  else if (length <= 750) return "700米";
  else if (length <= 850) return "800米";
  else if (length <= 950) return "900米";
  else if (length <= 1050) return "1公里";
  else {
    return fixNumber(length / 1000, 1) + "公里";
  }
}
function turnToIcon(turnType) {
  return "icon-" + String(turnType).replace(" ", "-");
}

function turnDesc(turnType) {
  if (turnType === "sharp right") {
    return "右后方转弯";
  } else if (turnType === "right") {
    return "右转";
  } else if (turnType === "slight right") {
    return "右前方转弯";
  } else if (turnType === "straight") {
    return "直行";
  } else if (turnType === "slight left") {
    return "左前方转弯";
  } else if (turnType === "left") {
    return "左转";
  } else if (turnType === "sharp left") {
    return "左后方转弯";
  } else if (turnType === "uturn") {
    return "调头";
  }
}
function fixNumber(value, length) {
  let result = value.toFixed(length);
  while (result.charAt(result.length - 1) === "0") {
    result = result.substring(0, result.length - 1);
  }
  return result.charAt(result.length - 1) === "."
    ? result.substring(0, result.length - 1)
    : result;
}
function durationDesc(duration) {
  if (duration <= 65) return "1分钟";

  const durationMin = duration / 60;
  if (durationMin < 60) return Math.round(durationMin) + "分钟";

  const durationHours = durationMin / 60;
  return fixNumber(durationHours, 1) + "小时";
}

function getRoadName(name) {
  return name || "无名道路";
}

function driveRoadPretText(step) {
  return step.maneuver.type === "continue" ? "继续沿" : "驶入";
}
