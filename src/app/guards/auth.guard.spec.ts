import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

describe('authGuard', () => {
  // Helper to execute the guard in the TestBed injection context
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  let authService: { isAuthenticated: jest.Mock };
  let router: { navigate: jest.Mock };

  // Create dummy ActivatedRouteSnapshot and RouterStateSnapshot objects.
  const dummyActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;
  const dummyRouterStateSnapshot = {} as RouterStateSnapshot;

  beforeEach(() => {
    authService = { isAuthenticated: jest.fn() };
    router = { navigate: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    });
  });

  test('should be instantiated', () => {
    expect(executeGuard).toBeTruthy();
  });

  test('returns true when user is authenticated', () => {
    // Arrange
    authService.isAuthenticated.mockReturnValue(true);

    // Act
    const result = executeGuard(
      dummyActivatedRouteSnapshot,
      dummyRouterStateSnapshot
    );

    // Assert
    expect(result).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  test('navigates to login and returns false when not authenticated', () => {
    // Arrange
    authService.isAuthenticated.mockReturnValue(false);

    // Act
    const result = executeGuard(
      dummyActivatedRouteSnapshot,
      dummyRouterStateSnapshot
    );

    // Assert
    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['login']);
  });
});
