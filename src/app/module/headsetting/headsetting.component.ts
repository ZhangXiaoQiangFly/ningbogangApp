import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { SocketService } from 'src/app/socket.service';

@Component({
  selector: "app-headsetting",
  templateUrl: "./headsetting.component.html",
  styleUrls: ["./headsetting.component.scss"],
})
export class HeadsettingComponent implements OnInit {
  constructor(
    private socketService: SocketService,
    private nav: NavController
  ) {}

  ngOnInit() {
    this.socketService.getnetmessage();
  }
  gotosetting() {
    this.nav.navigateRoot("/setting");
  }
}
