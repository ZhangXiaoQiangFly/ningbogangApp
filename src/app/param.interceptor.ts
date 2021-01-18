import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
} from "@angular/common/http";

import { tap } from "rxjs/operators";
@Injectable({
  providedIn: "root",
})
export class ParamInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // 对响应消息进行处理
    return next.handle(req).pipe(
      tap(
        event => {
          console.log(event);
        },
        error => {
          console.log(error.name);
        }
      )
    );
  }
}
