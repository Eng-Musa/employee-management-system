import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { AuthService } from '../services/auth.service';

export const childrenAuthGuard: CanActivateChildFn = (childRoute, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const alertService = inject(AlertService);

  if (!authService.isAthenticated()) {
    router.navigate(['login']);
    alertService.showInfoToastr('Kindly login');
    return false;
  }else if (authService.isTokenExpired()){
    router.navigate(['login']);
    alertService.showInfoToastr('Session expired, kindly login')
    return false;
  }

  return true;
};
