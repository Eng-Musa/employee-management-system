import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  /**
   * Saves a value to localStorage under the given key, only in the browser.
   * @param key The key under which to store the value.
   * @param value The value to store; it will be stringified.
   */
  public save<T>(key: string, value: T): void {
    if (!this.isBrowser) {
      // console.warn(
      //   `localStorage not available — skipping save for key "${key}"`
      // );
      return;
    }

    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error(
        `Error saving data to localStorage with key "${key}":`,
        error
      );
    }
  }

  /**
   * Retrieves and returns an object from localStorage by key, only in the browser.
   * @param key The key of the value to retrieve.
   * @returns The parsed object of type T, or null if not found, on error, or not in browser.
   */
  public retrieve<T>(key: string): T | null {
    if (this.isBrowser) {
      try {
        const serialized = localStorage.getItem(key);
        if (serialized === null) {
          console.warn(`No data found in localStorage for key "${key}"`);
          return null;
        }
        return JSON.parse(serialized) as T;
      } catch (error) {
        console.error(
          `Error retrieving or parsing data from localStorage for key "${key}":`,
          error
        );
        return null;
      }
    } else {
      //console.warn(`localStorage not available — cannot retrieve key "${key}"`);
      return null;
    }
  }

  /**
   * Save user's session details (email, login time, and role) to sessionStorage.
   * Uses the "Africa/Nairobi" timezone for loginTime.
   *
   * @param email - The user's email address.
   * @param role - The user's role.
   */
  saveToSessionStorage(email: string, role: string): void {
    const loginTime = new Date()
      .toLocaleString('en-US', { timeZone: 'Africa/Nairobi' })
      .slice(0, 16)
      .replace(',', '');

    if (this.isBrowser) {
      const loggedInPersion = {
        email: email,
        loginTime: loginTime,
        role: role,
      };
      sessionStorage.setItem('userSession', JSON.stringify(loggedInPersion));
    } else {
      console.error('SessionStorage is not available in this environment.');
    }
  }
}
