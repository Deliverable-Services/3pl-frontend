import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { APP_INITIALIZER, NgModule } from "@angular/core";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { CoreModule } from "./@core/core.module";
import { SharedModule } from "./@shared/shared.module";
import { Observable, of } from "rxjs";
import { I18N } from "../config/language-config";
import { SetHeadersInterceptor } from "./@core/interceptor/SetHeaders.interceptor"; 
import { MyDatePipe } from "./@shared/pipe/date-pipe.pipe";
import { AuthInterceptor } from "./auth.interceptor";
import { CheckRequestInterceptor } from "./@core/interceptor/check-request.interceptor";
import { LocalService } from "./local.service";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";
import { NumbersOnlyDirective } from "./numbers-only.directive";
import { CommonModule } from '@angular/common';

const initEnv = (localService: LocalService) => {
  return () => {
    return new Promise<any>(function (resolve) {
      const envObservable = localService.getEnv();

      console.log(envObservable,'-------->');
      
      //const oauthObservable = oauthService.loadDiscoveryDocumentAndTryLogin();

      const merged = envObservable
        .pipe(map((result: any) => {
            const envUrl = result['API_URL'];
            console.log("result['API_URL']",result['API_URL']);
            
            if (null !== envUrl) {
              localStorage.setItem('API_URL', result['API_URL']);
              environment.baseUrl = result['API_URL'] + '/api/v1';
              environment.baseUrl2 = result['API_URL'] + '/api/v1';
              environment.baseUrl3 = result['API_URL'] + '/api/v1';
              environment.baseUrl4 = result['API_URL'] + '/api/v1';
            }
            console.log('params returned');

            return result;
          }),
        ).toPromise();

      resolve(merged);
    });
  };
};

class I18NLoader implements TranslateLoader {
  getTranslation(lang: "zh-cn" | "en-us" | "zh-tw"): Observable<Object> {
    return of(I18N[lang]);
  }
}

@NgModule({
  declarations: [AppComponent,NumbersOnlyDirective],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    CoreModule.forRoot(),
    SharedModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: I18NLoader,
      },
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: SetHeadersInterceptor, multi: true },
    { provide: APP_INITIALIZER, useFactory: initEnv, multi: true, deps: [LocalService] },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    { provide: HTTP_INTERCEPTORS, useClass: CheckRequestInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
