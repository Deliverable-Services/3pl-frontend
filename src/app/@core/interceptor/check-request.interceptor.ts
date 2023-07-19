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
import { AuthService } from '../services/auth.service';
import { DialogService } from 'ng-devui';
import { ProductsFormComponent } from 'src/app/pages/product/products/products-form/products-form.component';

@Injectable()
export class CheckRequestInterceptor implements HttpInterceptor {

  constructor(
    private auth: AuthService,
    private route: Router,
    private dialogService: DialogService,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError((err: HttpErrorResponse) => {
      let error = '';
      if(err.status === 500 && err?.error?.detail && err?.error?.path && err?.error?.path?.includes('product')) {
        let showAlertPopUp = this.dialogService.open({
          id: 'manage-confirmation',
          width: '350px',
          maxHeight: '600px',
          title: 'ERROR!',
          backdropCloseable: false,
          content: err?.error?.detail,
          showCloseBtn: false,
          dialogtype: 'failed',
          onClose: () => {
          },
          buttons: [
            {
              cssClass: 'primary',
              text: 'Ok',
              handler: ($event: Event) => {
                showAlertPopUp.modalInstance.hide();
              },
            }
          ],
        });
      }
      if (err.status === 401) {
        const keysArray = Object.keys(err.error)
        const error = err.error[keysArray[0]];
        const dProperties = this.dialogService.open({
          id: 'unauthorized-access',
          width: '350px',
          maxHeight: '600px',
          title: 'Unauthorized Access',
          content: "Sorry! You can't proceed further.",
          backdropCloseable: false,
          showCloseBtn: false,
          dialogtype: 'failed',
          onClose: () => {
            this.auth.logout();
            this.route.navigate(['/', 'login']);
          },
          buttons: [
            {
              cssClass: 'danger',
              text: 'Ok',
              handler: ($event: Event) => {
                dProperties.modalInstance.hide();
              },
            },
          ],
        });
      }
      return throwError(error);
    })).pipe(map<HttpEvent<any>, any>((evt: HttpEvent<any>) => {
      return evt;
    }));;
  }
}
