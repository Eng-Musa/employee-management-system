import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private toastr: ToastrService) {}

  showErrorToastr(message: string){
    this.toastr.error(message, 'Error', {
      timeOut: 2000, // Increased time to make it more visible
      extendedTimeOut: 1000, //Time to close after a user hovers over toast
      progressBar: true, // Add a progress bar
      progressAnimation: 'decreasing',
      positionClass: 'toast-top-center', // Corrected position class
      closeButton: false, // Add a close button
      newestOnTop: true, // Makes sure the newest toast appears on top
      tapToDismiss: true, // Allows dismissing on click
    });
  }

  showSuccessToastr(message: string){
    this.toastr.success(message, 'Success', {
      timeOut: 3000, // Increased time to make it more visible
      extendedTimeOut: 1000, //Time to close after a user hovers over toast
      progressBar: true, // Add a progress bar
      progressAnimation: 'decreasing',
      positionClass: 'toast-top-center', // Corrected position class
      closeButton: false, // Add a close button
      newestOnTop: true, // Makes sure the newest toast appears on top
      tapToDismiss: true, // Allows dismissing on click
    });
  }

  showInfoToastr(message: string){
    this.toastr.info(message, 'Info', {
      timeOut: 3000, // Increased time to make it more visible
      extendedTimeOut: 1000, //Time to close after a user hovers over toast
      progressBar: true, // Add a progress bar
      progressAnimation: 'decreasing',
      positionClass: 'toast-top-center', // Corrected position class
      closeButton: false, // Add a close button
      newestOnTop: true, // Makes sure the newest toast appears on top
      tapToDismiss: true, // Allows dismissing on click
    });
  }

  showWarnToastr(message: string){
    this.toastr.warning(message, 'Warning', {
      timeOut: 3000, // Increased time to make it more visible
      extendedTimeOut: 1000, //Time to close after a user hovers over toast
      progressBar: true, // Add a progress bar
      progressAnimation: 'decreasing',
      positionClass: 'toast-top-center', // Corrected position class
      closeButton: false, // Add a close button
      newestOnTop: true, // Makes sure the newest toast appears on top
      tapToDismiss: true, // Allows dismissing on click
    });
  }
}
