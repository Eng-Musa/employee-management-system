import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private toastr: ToastrService, private snackbar: MatSnackBar) {}

  showErrorToastr(message: string) {
    this.toastr.error(message, 'Error', {
      timeOut: 2000, // Increased time to make it more visible
      extendedTimeOut: 1000, //Time to close after a user hovers over toast
      progressBar: true, // Add a progress bar
      progressAnimation: 'decreasing',
      positionClass: 'toast-top-right', // Corrected position class
      closeButton: false, // Add a close button
      newestOnTop: true, // Makes sure the newest toast appears on top
      tapToDismiss: true, // Allows dismissing on click
    });
  }

  showSuccessToastr(message: string) {
    this.toastr.success(message, 'Success', {
      timeOut: 3000, // Increased time to make it more visible
      extendedTimeOut: 1000, //Time to close after a user hovers over toast
      progressBar: true, // Add a progress bar
      progressAnimation: 'decreasing',
      positionClass: 'toast-top-right', // Corrected position class
      closeButton: false, // Add a close button
      newestOnTop: true, // Makes sure the newest toast appears on top
      tapToDismiss: true, // Allows dismissing on click
    });
  }

  showInfoToastr(message: string) {
    this.toastr.info(message, 'Info', {
      timeOut: 3000, // Increased time to make it more visible
      extendedTimeOut: 1000, //Time to close after a user hovers over toast
      progressBar: true, // Add a progress bar
      progressAnimation: 'decreasing',
      positionClass: 'toast-top-right', // Corrected position class
      closeButton: false, // Add a close button
      newestOnTop: true, // Makes sure the newest toast appears on top
      tapToDismiss: true, // Allows dismissing on click
    });
  }

  showWarnToastr(message: string) {
    this.toastr.warning(message, 'Warning', {
      timeOut: 3000, // Increased time to make it more visible
      extendedTimeOut: 1000, //Time to close after a user hovers over toast
      progressBar: true, // Add a progress bar
      progressAnimation: 'decreasing',
      positionClass: 'toast-top-right', // Corrected position class
      closeButton: false, // Add a close button
      newestOnTop: true, // Makes sure the newest toast appears on top
      tapToDismiss: true, // Allows dismissing on click
    });
  }

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
  danger(message: string) {
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
