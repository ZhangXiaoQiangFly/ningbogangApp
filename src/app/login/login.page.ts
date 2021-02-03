/**
 * 登录界面
 */
import { Component, OnInit, OnDestroy, ElementRef } from "@angular/core";
import {
  NavController,
  AlertController,
  Platform,
  ToastController,
} from "@ionic/angular";

import { Subscription } from "rxjs";
import { Router } from "@angular/router";
import { SocketService } from "../socket.service";
// import {Storage} from '@ionic/storage';
declare let cordova: any;
declare var $: any;

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit, OnDestroy {
  operation = "4";
  operations = [
    { label: "1-Inventory", value: "1" },
    { label: "2-Operator", value: "2" },
    { label: "3-Hatch Clerk", value: "3" },
    { label: "4-Truck", value: "4" },
    { label: "5-Room Hatch", value: "5" },
  ];
  rdtIdPlaceholder: "RDT ID";
  rdtId = "";
  userID = "";
  placeholder = "请输入user-id";
  error: string = null;
  operating = false;
  messageSubscription: Subscription = null;
  backButton: any;
  showSelect = false;
  enoDisable = true;
  checkEdit = false;
  timer: any;
  updateCheck: any;
  delayLoad = false;
  delayTime = 20;
  delayLoadTimer: any;

  constructor(
    private nav: NavController,
    private alertController: AlertController,
    private platform: Platform,
    private router: Router,
    private elementRef: ElementRef,
    //private storage: Storage,
    private toast: ToastController,
    private socketService: SocketService
  ) {
    this.backButtonEvent();
  }

  ngOnInit() {
    this.init();
    const value = localStorage.getItem("rdtId");
    this.rdtId = value || "T01";
    /* 
     this.socketService.user.rdtId = value || 'T01'; */
  }
  init() {
    this.socketService
      .createObservableSocket("ws://121.40.165.18:8800")
      .subscribe(
        (rep) => {
          console.log("已连接 ws://121.40.165.18:8800");
          console.log(rep);
        },
        (error) => {
          console.log("出错");
        },        
        () => {
          console.log("结束了");
        },
        
      );
  }
  sendMessage(str: string) {
    this.socketService.sendMessage(str);
  }

  ngOnDestroy() {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
      this.messageSubscription = null;
    }

    if (this.backButton) {
      this.backButton.unsubscribe();
    }
  }

  /**
   * 登录
   */
  login() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    // 先校验用户id与设备号是否已经输入
    if (!this.userID) {
      this.error = "请输入用户ID";
      this.tipAlertConfirm(this.error);
      this.operating = false;
      return;
    }
    this.sendMessage(this.userID);
    //this.nav.navigateRoot("/tasklist");

    /*  this.timer = setTimeout(() => {
      this.operating = false;
      this.presentToast("连接超时，请重新登录");
    }, 5000); */
  }

  // 登录前记录user信息
  recordUser() {
    this.operating = false;
    this.socketService.user.userId = this.userID;

    localStorage.setItem("userId", this.userID);
  }

  // 延迟登录
  delayLoadButton() {
    this.delayLoadTimer = setInterval(() => {
      if (this.delayTime > 0) {
        this.delayTime = this.delayTime - 1;
      } else {
        clearInterval(this.delayLoadTimer);
        this.operating = false;
        this.delayLoad = false;
        this.delayTime = 20;
      }
    }, 1000);
  }

  // 安卓硬件退出
  backButtonEvent() {
    this.backButton = this.platform.backButton.subscribe(() => {
      if (this.router.url.indexOf("login") > -1) {
        this.quitAlertConfirm();
      }
    });
  }

  // 退出
  async quitAlertConfirm() {
    const alert = await this.alertController.create({
      header: "确定要退出应用吗？",
      buttons: [
        {
          text: "取消",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {
            console.log("Confirm cancel");
          },
        },
        {
          text: "确定",
          handler: () => {
            navigator["app"].exitApp();
          },
        },
      ],
    });

    await alert.present();
  }

  // 吐司提示
  async presentToast(msg: any, type?: string) {
    const toast = await this.toast.create({
      message: msg,
      duration: 3000,
      position: "top",
      color: type ? type : "dark",
    });
    toast.present();
  }

  // 校验提示
  async tipAlertConfirm(msg: string) {
    const alert = await this.alertController.create({
      header: msg,
      buttons: [
        {
          text: "确定",
          handler: () => {},
        },
      ],
    });

    await alert.present();
  }

  // 下拉框显隐
  toggleSelect() {
    this.showSelect = !this.showSelect;
  }

  // 下拉框显示值
  showSelection(value: string) {
    const oindex = Number(value) - 1;
    return this.operations[oindex].label;
  }

  // 下拉框选择
  chooseOption(item: any) {
    if (item.value !== "4") {
      return;
    } else {
      this.operation = item.value;
      this.showSelect = false;
    }
  }

  // 点击空白区域隐藏下拉框
  hideSelect() {
    if (this.showSelect) {
      this.showSelect = false;
    }
  }

  // 编辑设备号
  selectCheckbox() {
    this.enoDisable = this.checkEdit;
    if (!this.enoDisable) {
      this.elementRef.nativeElement.querySelector("#rdt").focus();
    }
  }
}
