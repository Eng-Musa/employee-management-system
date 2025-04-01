import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import {
  MatError,
  MatFormField,
  MatInputModule,
} from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AlertService } from '../../../services/alert.service';
import { MatButtonModule } from '@angular/material/button';
import { LoggedInPerson } from '../../view-profile/view-profile.component';

@Component({
  selector: 'app-change-pass',
  imports: [
    MatDialogModule,
    MatProgressBarModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormField,
    MatInputModule,
    MatIconModule,
    MatError,
    MatButtonModule,
  ],
  templateUrl: './change-pass.component.html',
  styleUrl: './change-pass.component.scss',
})
export class ChangePassComponent implements OnInit {
  loggedInPerson: LoggedInPerson = {
    name: 'Unknown',
    email: 'Unknown',
    password: 'Unknown',
    createdDate: 'Unknown',
    role: 'Unknown',
    phoneNumber: 'Unknown',
    lastLogin: 'Unknown',
    lastPasswordChange: 'Unknown',
  };

  passwordForm: FormGroup;
  loading = false;
  message: string = '';
  isSuccess: boolean = false;
  hide = true;
  lastPasswordChange: string = 'Unknown';

  constructor(
    public dialogRef: MatDialogRef<ChangePassComponent>,
    private fb: FormBuilder,
    private alertService: AlertService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          Validators.pattern(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,20}$'
          ),
        ],
      ],
    });
  }

  ngOnInit(): void {
    this.getLoggedInPerson();
  }

  onSubmit() {
    this.loading = true;
    this.isSuccess = false;
    this.message = '';
    setTimeout(() => {
      this.loading = false;
      if (this.passwordForm.valid && this.loggedInPerson) {
        const oldPassword = this.passwordForm.get('oldPassword')?.value;
        const password = this.passwordForm.get('password')?.value;
        console.log(this.passwordForm.value);
        console.table(this.loggedInPerson);
        if (this.loggedInPerson.password === password) {
          this.message = 'Old password cannot be same as new password';
        } else if (this.loggedInPerson.password !== oldPassword) {
          this.message = 'Wrong old password';
        } else {
          this.loggedInPerson.password = password;
          this.loggedInPerson.lastPasswordChange = new Date()
            .toISOString()
            .slice(0, 16);
          localStorage.setItem(
            'adminUser',
            JSON.stringify(this.loggedInPerson)
          );
          this.isSuccess = true;
          this.message = 'Password change successfull';
        }
      }
    }, 1000);
  }

  onCancel() {
    this.dialogRef.close();
  }

  getLoggedInPerson() {
    if (isPlatformBrowser(this.platformId)) {
      const storedUserStr = localStorage.getItem('adminUser');
      if (storedUserStr) {
        this.loggedInPerson = JSON.parse(storedUserStr) as LoggedInPerson;
        this.lastPasswordChange = this.getTimeDifference(
          this.loggedInPerson.lastPasswordChange
        );
      } else {
        this.alertService.showErrorToastr('No user found in localStorage.');
      }
    }
  }

  getTimeDifference(lastPasswordChange: string): string {
    // Parse the input date string
    const lastChangeDate = new Date(lastPasswordChange);
    const currentDate = new Date();

    // Calculate the difference in milliseconds
    const differenceInMilliseconds =
      currentDate.getTime() - lastChangeDate.getTime();

    // Convert milliseconds to seconds, minutes, hours, days, and so on
    const seconds = Math.floor(differenceInMilliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30); // Approximate months (30 days)
    const years = Math.floor(days / 365); // Approximate years (365 days)

    // Determine the relative time difference and return it
    if (years > 0) {
      return `${years} ${years === 1 ? 'year' : 'years'} ago`;
    } else if (months > 0) {
      return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    } else if (weeks > 0) {
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else if (days > 0) {
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else if (hours > 0) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (minutes > 0) {
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else {
      return 'Just now';
    }
  }
}
