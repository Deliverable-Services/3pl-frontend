import { Injectable } from "@angular/core";
import { NavigationExtras, Router } from "@angular/router";
import { HttpHeaders, HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
@Injectable({
  providedIn: "root",
})
export class JwtHandlerService {
  baseApiUrl: string;
  headers = new HttpHeaders({ "Content-Type": "application/json" });
  constructor(private router: Router, private http: HttpClient) {
    this.baseApiUrl = environment.baseUrl;
  }

  async checkAndStoreJwtFromUrl(): Promise<any> {
    const jwt = this.getJwtFromUrl();
    if (jwt) {
      localStorage.setItem("jwt", jwt);
      this.router.navigate(["/product/category"]); // Redirect to desired route after storing the JWT
      // await this.callAnotherApi();
    }
  }

  //  async callAnotherApi(): Promise<any> {
  //   const apiEndpoint = `${this.baseApiUrl}/generate-session`;  
  //   // Get the JWT token from localStorage
  //   const jwtToken = localStorage.getItem('jwt');
  //   // Create headers with the JWT token
  //   const requestOptions = {
  //     headers: new HttpHeaders({
  //       Authorization: `Bearer ${jwtToken}` // Add the JWT token to the Authorization header
  //     })
  //   };  
  //   // Make the HTTP request
  //   this.http.get(apiEndpoint, requestOptions).subscribe((resp:any) =>{
  //     localStorage.setItem("session-token", resp.sessionToken);
  //   });
  // }
  private getJwtFromUrl(): string | null {
    const url = window.location.href;
    const jwtRegex = /[?&]jwt=([^&#]*)/;
    const matches = url.match(jwtRegex);
    return matches ? matches[1] : null;
  }
}
