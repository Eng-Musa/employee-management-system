import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateChildFn, Router, RouterStateSnapshot } from '@angular/router';

import { childrenAuthGuard } from './children-auth.guard';
import { AlertService } from '../services/alert.service';
import { AuthService } from '../services/auth.service';

describe('childrenAuthGuard', () => {
  const executeGuard: CanActivateChildFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => childrenAuthGuard(...guardParameters));

  let authService: { isAuthenticated: jest.Mock, isTokenExpired: jest.Mock };
  let router: { navigate: jest.Mock };
  let alertServiceMock: Partial<AlertService>;

  const dummyActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;
  const dummyRouterStateSnapshot = {} as RouterStateSnapshot;

  beforeEach(() => {
    authService = { isAuthenticated: jest.fn(), isTokenExpired: jest.fn() };
    router = { navigate: jest.fn() };
    alertServiceMock = {information: jest.fn()};

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
        {provide: AlertService, useValue: alertServiceMock}
      ],
    });
  });

  test('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  test('returns true when user is authenticated', () => {
    authService.isAuthenticated.mockReturnValue(true);
    authService.isTokenExpired.mockReturnValue(false);

    const result = executeGuard(
      dummyActivatedRouteSnapshot,
      dummyRouterStateSnapshot
    );

    expect(result).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  test('navigates to login and returns false when not authenticated', ()=>{
    authService.isAuthenticated.mockReturnValue(false);
    

    const result = executeGuard(
      dummyActivatedRouteSnapshot,
      dummyRouterStateSnapshot
    );

    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['login']);
    expect(alertServiceMock.information).toHaveBeenCalledWith('Kindly login');
  });

  test('navigate to login and returns false when token is expired', ()=>{
    authService.isAuthenticated.mockReturnValue(true);
    authService.isTokenExpired.mockReturnValue(true);

    const result = executeGuard(
      dummyActivatedRouteSnapshot,
      dummyRouterStateSnapshot
    );

    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['login']);
    expect(alertServiceMock.information).toHaveBeenCalledWith('Session expired, kindly login');
  });
});
