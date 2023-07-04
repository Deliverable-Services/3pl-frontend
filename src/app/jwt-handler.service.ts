import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class JwtHandlerService {

  constructor(private router: Router) { }

  checkAndStoreJwtFromUrl(): void {
    const jwt = this.getJwtFromUrl();
    if (jwt) {
      localStorage.setItem('jwt', jwt);
      this.router.navigate(['/']); // Redirect to desired route after storing the JWT
    }
  }

  private getJwtFromUrl(): string | null {
    const url = window.location.href;
    const jwtRegex = /[?&]jwt=([^&#]*)/;
    const matches = url.match(jwtRegex);
    return matches ? matches[1] : null;
  }
}