
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from "@ionic/angular";
import {HeadsettingComponent} from './headsetting.component'

@NgModule({
  declarations: [HeadsettingComponent],
  imports: [CommonModule, IonicModule],
  exports: [HeadsettingComponent],
})
export class HeadsettingModule {}
