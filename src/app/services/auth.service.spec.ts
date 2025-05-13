import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { expect } from '@jest/globals';

describe('AuthService', () => {
  let service: AuthService;
  let routerSpy: { navigate: jest.Mock };

  beforeEach(() => {
    routerSpy = { navigate: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpy },
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });

    service = TestBed.inject(AuthService);
    sessionStorage.clear();
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isTokenExpired', () => {
    afterEach(() => {
      sessionStorage.clear();
    });

    test('should return true if there is no session data', () => {
      sessionStorage.removeItem('userSession');
      expect(service.isTokenExpired()).toBe(true);
    });

    test('should return false if token is not expired', () => {
      const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
      sessionStorage.setItem(
        'userSession',
        JSON.stringify({ loginTime: twoMinutesAgo })
      );
      expect(service.isTokenExpired()).toBe(false);
    });

    test('should return true and remove session if token is expired', () => {
      const currentTimeStr = new Date()
        .toLocaleString('en-US', { timeZone: 'Africa/Nairobi' })
        .slice(0, 16)
        .replace(',', '');
      const currentTime = new Date(currentTimeStr);

      const sixMinutesAgoIso = new Date(
        currentTime.getTime() - 6 * 60 * 1000
      ).toISOString();

      sessionStorage.setItem(
        'userSession',
        JSON.stringify({ loginTime: sixMinutesAgoIso })
      );

      expect(service.isTokenExpired()).toBe(true);
      expect(sessionStorage.getItem('userSession')).toBeNull();
    });

    test('should return true, remove session, and log an error if session data is invalid', () => {
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      sessionStorage.setItem('userSession', 'invalid JSON');

      expect(service.isTokenExpired()).toBe(true);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error parsing session data:',
        expect.any(SyntaxError)
      );
      expect(sessionStorage.getItem('userSession')).toBeNull();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('logout', () => {
    test('should remove session data and navigate to "login"', () => {
      sessionStorage.setItem(
        'userSession',
        JSON.stringify({ loginTime: new Date().toISOString() })
      );
      service.logout();
      expect(sessionStorage.getItem('userSession')).toBeNull();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['login']);
    });
  });

  // Additional tests for non-critical methods
  describe('getUserType', () => {
    test('should return an empty string if no session data exists', () => {
      sessionStorage.removeItem('userSession');
      expect(service.getUserType()).toBe('');
    });

    test('should return the user role when valid session data exists', () => {
      const sessionData = {
        loginTime: new Date().toISOString(),
        role: 'Admin',
      };
      sessionStorage.setItem('userSession', JSON.stringify(sessionData));
      expect(service.getUserType()).toBe('Admin');
    });
  });

  describe('getLoggedInEmail', () => {
    test('should return an empty string if no session data exists', () => {
      sessionStorage.removeItem('userSession');
      expect(service.getLoggedInEmail()).toBe('');
    });

    test('should return the logged in email when valid session data exists', () => {
      const sessionData = {
        loginTime: new Date().toISOString(),
        role: 'User',
        email: 'user@example.com',
      };
      sessionStorage.setItem('userSession', JSON.stringify(sessionData));
      expect(service.getLoggedInEmail()).toBe('user@example.com');
    });
  });
});
