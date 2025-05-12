import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private snackbar: MatSnackBar) {}

  //snackbar to show success
  success(message: string) {
    this.snackbar.open(message, 'X', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: 'snackbar-success',
      duration: 3000,
    });
  }

  //snackbar to show an error
  error(message: string) {
    this.snackbar.open(message, 'X', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: 'snackbar-danger',
      duration: 3000,
    });
  }

  //snackbar to show a warning
  warning(message: string) {
    this.snackbar.open(message, 'X', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: 'snackbar-warning',
      duration: 3000,
    });
  }

  //snackbar to show a warning
  information(message: string) {
    this.snackbar.open(message, 'X', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: 'snackbar-info',
      duration: 3000,
    });
  }
}
