
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { WelcomePage } from "./welcome.page";

import { HeadsettingModule } from "../module/headsetting/headsetting.module";
const routes: Routes = [
  {
    path: "",
    component: WelcomePage,
  },
];

@NgModule({
  imports: [
    HeadsettingModule,
    CommonModule,
   
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  declarations: [WelcomePage],
})
export class WelcomePageModule {}
