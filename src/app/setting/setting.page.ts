import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: "app-setting",
  templateUrl: "./setting.page.html",
  styleUrls: ["./setting.page.scss"],
})
export class SettingPage implements OnInit {
  constructor(private nav: NavController) {}

  ngOnInit() {}

  back() {
    this.nav.back(); 
  }
}
