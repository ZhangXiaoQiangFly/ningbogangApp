import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: "", redirectTo: "welcome", pathMatch: "full" },
  { path: "login", loadChildren: "./login/login.module#LoginPageModule" },
  {
    path: "welcome",
    loadChildren: "./welcome/welcome.module#WelcomePageModule",
  },
  {
    path: "home",
    loadChildren: () =>
      import("./home/home.module").then(m => m.HomePageModule),
  },
  {
    path: 'task-list',
    loadChildren: () => import('./task-list/task-list.module').then( m => m.TaskListPageModule)
  },
  {
    path: "tasklist",
    loadChildren: () =>
      import("./task-list/task-list.module").then(m => m.TaskListPageModule),
  },
  
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}