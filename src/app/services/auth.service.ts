import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { platform } from 'os';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {}

  isAthenticated(): boolean {
    return (
      isPlatformBrowser(this.platformId) &&
      !!sessionStorage.getItem('userSession')
    );
  }

  isTokenExpired(): boolean {
    const sessionDataStr = sessionStorage.getItem('userSession');
    if (!sessionDataStr) {
      return true;
    }

    try {
      const sessionData = JSON.parse(sessionDataStr);
      const loginTime = new Date(sessionData.loginTime);
      const currentTimeS = new Date()
        .toLocaleString('en-US', {
          timeZone: 'Africa/Nairobi',
        })
        .slice(0, 16)
        .replace(',', '');
      const currentTime = new Date(currentTimeS);

      const elapsedMilliseconds = currentTime.getTime() - loginTime.getTime();
      const expirationThreshold = 5 * 60 * 1000;

      if (elapsedMilliseconds > expirationThreshold) {
        sessionStorage.removeItem('userSession');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error parsing session data:', error);
      sessionStorage.removeItem('userSession');
      return true;
    }
  }

  logout() {
    sessionStorage.removeItem('userSession');
    this.router.navigate(['login']);
  }

  getUserType(): string {
    const sessionDataStr = sessionStorage.getItem('userSession');

    // If no session data exists, return a default value.
    if (!sessionDataStr) {
      return '';
    }

    try {
      const sessionData = JSON.parse(sessionDataStr);
      if (
        sessionData &&
        typeof sessionData.role === 'string' &&
        sessionData.role.trim().length > 0
      ) {
        return sessionData.role;
      }
      return 'Unknown';
    } catch (error) {
      return 'Unknown';
    }
  }

  getLoggedInEmail(): string {
    const sessionDataStr = sessionStorage.getItem('userSession');

    // If no session data exists, return a default value.
    if (!sessionDataStr) {
      return '';
    }

    try {
      const sessionData = JSON.parse(sessionDataStr);
      if (
        sessionData &&
        typeof sessionData.role === 'string' &&
        sessionData.role.trim().length > 0
      ) {
        return sessionData.email;
      }
      return 'Unknown';
    } catch (error) {
      return 'Unknown';
    }
  }
}
