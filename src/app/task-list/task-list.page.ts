import { Component, OnInit, ViewChild } from "@angular/core";
import { IonInfiniteScroll, NavController } from "@ionic/angular";
import { SocketService } from "./../socket.service";
import { Geolocation } from "@ionic-native/geolocation/ngx";

@Component({
  selector: "app-task-list",
  templateUrl: "./task-list.page.html",
  styleUrls: ["./task-list.page.scss"],
})
export class TaskListPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  liIndex: any;
  instructlist: any;
  isFixed = false;
  latitude: any;
  longitude:any;

  constructor(
    private nav: NavController,
    private socketService: SocketService,
    private geolocation: Geolocation
  ) {}

  ngOnInit() {
    this.instructlist = [
      "第一条",
      "第二条",
      "第一条",
      "第二条",
      "第一条",
      "第二条",
      "第一条",
      "第二条",
    ];
    this.geolocation
      .getCurrentPosition()
      .then((resp) => {
        this.longitude = resp.coords.longitude;
        this.latitude = resp.coords.latitude;
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
  }

  loadData(event) {
    setTimeout(() => {
      console.log("Done");
      event.target.complete();
    }, 500);
  }

  handclick(item?: any, i?: number) {
    this.liIndex = i;
    console.log(item);
    this.nav.navigateRoot("/home", {
      queryParams: {
        latitude: "39",
        longitude:"119",
      },
    });
  }
}
