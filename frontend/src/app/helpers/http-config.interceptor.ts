import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { UserService } from '../user.service';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
  constructor(private userService: UserService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // set default "Content-Type" and "Accept" headers
    if (!req.headers.has('Content-Type')) {
        req = req.clone({
          setHeaders: { 'Content-Type': 'application/json' }
        });
    }

    if (!req.headers.has('Accept')) {
        req = req.clone({
          setHeaders: { Accept: 'application/json' }
        });
    }

    // add authorization header with bearer token if availiable
    if (this.userService.accessToken) {
        req = req.clone({
            setHeaders: { Authorization: `Bearer ${this.userService.accessToken.key}` }
        });
    }

    return next.handle(req);
  }
}
