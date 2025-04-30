import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { AuthService } from '../services/auth.service';

export const childrenAuthGuard: CanActivateChildFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const alertService = inject(AlertService);

  if (!authService.isAthenticated()) {
    router.navigate(['login']);
    alertService.information('Kindly login');
    return false;
  }else if (authService.isTokenExpired()){
    router.navigate(['login']);
    alertService.information('Session expired, kindly login')
    return false;
  }

  return true;
};
