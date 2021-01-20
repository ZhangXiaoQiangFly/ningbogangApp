import { Component, OnInit } from "@angular/core";
import { AlertController, NavController } from "@ionic/angular";

@Component({
  selector: "app-setting",
  templateUrl: "./setting.page.html",
  styleUrls: ["./setting.page.scss"],
})
export class SettingPage implements OnInit {
  constructor(
    private nav: NavController,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  back() {
    this.nav.back();
  }
  exit() {
    this.AlertConfirm();
  }
  // 退出提示
  async AlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "",
      message: "退出当前用户？",
      buttons: [
        {
          text: "取消",
          role: "cancel",
          cssClass: "secondary",
          handler: blah => {
            console.log("Confirm Cancel: blah");
          },
        },
        {
          text: "确定",
          handler: () => {
            this.nav.navigateRoot("/login");
          },
        },
      ],
    });

    await alert.present();
  }
}
