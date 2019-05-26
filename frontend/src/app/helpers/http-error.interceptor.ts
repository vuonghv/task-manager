import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { UserService } from '../user.service';
import { environment as env } from '../../environments/environment';
import { catchError } from 'rxjs/operators';

const httpStatusUnauth = 401;

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(
    private userService: UserService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(catchError((error: HttpErrorResponse) => {
        if (error.status === httpStatusUnauth) {
          // When access token is expired or invalid, remove it from local storage
          this.userService.clearLoginSession();
        }

        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          // client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // server-side error
          errorMessage = `Error code: ${error.status}\nMessage: ${error.message}`;
        }

        // Push error to a remote monitor
        if (!env.production) {
          console.error(errorMessage);
        }
        return throwError(errorMessage);
    }));
  }
}
