import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { SocketService } from "./socket.service";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { ParamInterceptor } from "./param.interceptor";

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,HttpClientModule],
  providers: [
    SocketService,
    StatusBar,
    SplashScreen,
    Geolocation,
    //配置拦截器   
    { provide: HTTP_INTERCEPTORS, useClass: ParamInterceptor, multi: true },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
