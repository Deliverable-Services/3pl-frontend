import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpHeaders,
  HttpClient,
} from "@angular/common/http";
import { Observable, from, EMPTY } from "rxjs";
import { catchError, switchMap, finalize } from "rxjs/operators";
import { NavigationExtras, Router } from "@angular/router";
import { environment } from "src/environments/environment";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  baseApiUrl: string;
  private refreshTokenInProgress = false;

  constructor(private router: Router, private http: HttpClient) {
    this.baseApiUrl = environment.baseUrl;
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const sessionToken = localStorage.getItem("session-token");

    console.log('sessionToken', sessionToken);
    

    if (!this.refreshTokenInProgress && !sessionToken) {
      this.refreshTokenInProgress = true;

      return from(this.callAnotherApi()).pipe(
        switchMap(() => {
          const authReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${localStorage.getItem("jwt")}`,
              "X-Session-Token": `${localStorage.getItem("session-token")}`,
            },
          });
          return next.handle(authReq).pipe(
            catchError((error) => {
              // Handle error if needed
              return EMPTY; // Return an empty observable to suppress error propagation
            }),
            finalize(() => {
              this.refreshTokenInProgress = false; // Reset the flag after the request is finished
            })
          );
        })
      );
    } else {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          "X-Session-Token": `${sessionToken}`, // Use the existing session token
        },
      });
      return next.handle(authReq); // Continue with the original request
    }
  }

  async callAnotherApi(): Promise<void> {
    const apiEndpoint = `${localStorage.getItem('API_URL')}/api/v1/generate-session`;
    const jwtToken = localStorage.getItem("jwt");

    const requestOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${jwtToken}`,
      }),
    };

    try {
      const resp: any = await this.http
        .get(apiEndpoint, requestOptions)
        .toPromise(); // Convert Observable to Promise
      localStorage.setItem("session-token", resp.sessionToken);
    } catch (error) {
      // Handle error
      console.error("Failed to fetch session token:", error);
    }
  }
}
