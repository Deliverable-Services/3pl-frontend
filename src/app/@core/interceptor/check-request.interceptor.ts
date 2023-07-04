import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastService } from "ng-devui";
import { AuthService } from '../services/auth.service';

@Injectable()
export class CheckRequestInterceptor implements HttpInterceptor {

  constructor(
    private toastService: ToastService,
    private auth: AuthService,
    private route: Router,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError((err: HttpErrorResponse) => {
      let error = '';
      if (err.status === 401) {
        const keysArray = Object.keys(err.error)
        const error = err.error[keysArray[0]];
        this.toastService.open({
          value: [
            { severity: 'error', content: 'Unauthorized Access!'},
          ],
          life: 2000,
        });
        this.auth.logout();
        this.route.navigate(['/', 'login']);
      }
      return throwError(error);
    })).pipe(map<HttpEvent<any>, any>((evt: HttpEvent<any>) => {
      return evt;
    }));;
  }
}
