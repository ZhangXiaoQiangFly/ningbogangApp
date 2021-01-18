import { Component, OnInit, ViewChild } from "@angular/core";
import { IonInfiniteScroll, NavController } from "@ionic/angular";
@Component({
  selector: "app-task-list",
  templateUrl: "./task-list.page.html",
  styleUrls: ["./task-list.page.scss"],
})
export class TaskListPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  constructor(private nav: NavController) {}

  ngOnInit() {}
  
  loadData(event) {
    setTimeout(() => {
      console.log("Done");
      event.target.complete();

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
    }, 500);
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }
  handclick(event) {
    this.nav.navigateRoot("/home");
    console.log(event);
  }
}
