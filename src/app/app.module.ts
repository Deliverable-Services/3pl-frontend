import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
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

class I18NLoader implements TranslateLoader {
  getTranslation(lang: "zh-cn" | "en-us" | "zh-tw"): Observable<Object> {
    return of(I18N[lang]);
  }
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
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
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
