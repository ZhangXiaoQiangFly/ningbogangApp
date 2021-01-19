import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskListPageRoutingModule } from './task-list-routing.module';

import { TaskListPage } from './task-list.page';
import { HeadsettingModule } from "../module/headsetting/headsetting.module";
@NgModule({
  imports: [
    HeadsettingModule,
    CommonModule,
    FormsModule,
    IonicModule,
    TaskListPageRoutingModule,
  ],
  declarations: [TaskListPage],
})
export class TaskListPageModule {}
