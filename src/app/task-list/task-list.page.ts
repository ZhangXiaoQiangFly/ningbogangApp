import { Component, OnInit, ViewChild } from "@angular/core";
import { IonInfiniteScroll, NavController } from "@ionic/angular";
import { SocketService } from "./../socket.service";
@Component({
  selector: "app-task-list",
  templateUrl: "./task-list.page.html",
  styleUrls: ["./task-list.page.scss"],
})
export class TaskListPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  liIndex: any;
  instructlist: any;
  constructor(
    private nav: NavController,
    private socketService: SocketService
  ) {}

  ngOnInit() {
    this.instructlist = ["第一条", "第二条", "第一条", "第二条"];
  }

  loadData(event) {
    setTimeout(() => {
      console.log("Done");
      event.target.complete();
    }, 500);
  }

  handclick(item?: any, i?: number) {
    // this.nav.navigateRoot("/home");
    this.liIndex = i;
    console.log(item);
  }
}
