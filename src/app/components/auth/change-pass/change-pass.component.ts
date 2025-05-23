import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import {
  MatError,
  MatFormField,
  MatInputModule,
} from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { constants } from '../../../environments/constants';
import { AlertService } from '../../../services/alert.service';
import { AuthService } from '../../../services/auth.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import {
  Employee,
  LoggedInPerson,
} from '../../view-profile/view-profile.component';

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
  message = '';
  isSuccess = false;
  hide = true;
  lastPasswordChange = 'Unknown';

  constructor(
    public dialogRef: MatDialogRef<ChangePassComponent>,
    private fb: FormBuilder,
    private alertService: AlertService,
    private authService: AuthService,
    private localStorageService: LocalStorageService
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
        if (this.loggedInPerson.password === password) {
          this.message = 'Old password cannot be same as new password';
          return;
        } else {
          if (this.authService.getUserType() === 'admin') {
            if (this.loggedInPerson.password !== oldPassword) {
              this.message = 'Wrong old password';
              return;
            }
            this.loggedInPerson.password = password;
            this.loggedInPerson.lastPasswordChange = new Date()
              .toLocaleString('en-US', {
                timeZone: 'Africa/Nairobi',
              })
              .slice(0, 16)
              .replace(',', '');

            this.localStorageService.save(
              constants.LOCAL_STORAGE_KEY_ADMIN,
              this.loggedInPerson
            );
            this.isSuccess = true;
            this.message = 'Password change successfull. Logging out...';
            setTimeout(() => {
              this.dialogRef.close();
              this.authService.logout();
            }, 500);
          } else {
            if (this.loggedInEmployee.password !== oldPassword) {
              this.message = 'Wrong old password';
              return;
            } else if (this.loggedInEmployee.password === password) {
              this.message = 'Old password cannot be same as new password';
              return;
            }

            this.loggedInEmployee.password = password;
            this.loggedInEmployee.lastPasswordChange = new Date()
              .toLocaleString('en-US', {
                timeZone: 'Africa/Nairobi',
              })
              .slice(0, 16)
              .replace(',', '');

            const index = this.employees?.findIndex(
              (emp: Employee) => emp.email === this.loggedinEmail
            );
            if (index !== -1 && index !== undefined && this.employees) {
              this.employees[index] = this.loggedInEmployee;
            }

            this.localStorageService.save(
              constants.LOCAL_STORAGE_KEY_EMPLOYEES,
              this.employees
            );
            this.isSuccess = true;
            this.message = 'Password change successfull.Logging out...';
            setTimeout(() => {
              this.dialogRef.close();
              this.authService.logout();
            }, 1000);
          }
        }
      }
    }, 1000);
  }

  onCancel() {
    this.dialogRef.close();
  }

  employees: Employee[] = [];
  loggedInEmployee: Employee = {
    id: 0,
    name: '',
    email: '',
    phoneNumber: '',
    department: '',
    role: '',
    startDate: '',
    status: '',
    createdDate: '',
    lastLogin: '',
    lastPasswordChange: '',
    password: '',
  };
  loggedinEmail = '';
  getLoggedInPerson() {
    if (this.authService.getUserType() === 'admin') {
      const retrievedPerson = this.localStorageService.retrieve<LoggedInPerson>(
        constants.LOCAL_STORAGE_KEY_ADMIN
      );

      if (retrievedPerson) {
        this.loggedInPerson = retrievedPerson;
      } else {
        this.alertService.error('No admin user found in local storage.');
      }
      if (this.loggedInPerson) {
        this.lastPasswordChange = this.getTimeDifference(
          this.loggedInPerson.lastPasswordChange
        );
      }
    } else {
      this.loggedinEmail = this.authService.getLoggedInEmail();
      const retrievedData = this.localStorageService.retrieve<Employee[]>(
        constants.LOCAL_STORAGE_KEY_EMPLOYEES
      );
      if (retrievedData) {
        this.employees = retrievedData;
      }
      if (this.employees) {
        const retrievedData = this.employees.find(
          (emp: Employee) => emp.email === this.loggedinEmail
        );

        if (retrievedData) {
          this.loggedInEmployee = retrievedData;
        }

        if (this.loggedInEmployee.lastPasswordChange === 'Never') {
          this.lastPasswordChange = 'Never';
        } else {
          this.lastPasswordChange = this.getTimeDifference(
            this.loggedInEmployee.lastPasswordChange
          );
        }
      }
    }
  }

  getTimeDifference(lastPasswordChange: string): string {
    const lastChangeDate = new Date(lastPasswordChange);
    const currentDate = new Date();

    const differenceInMilliseconds =
      currentDate.getTime() - lastChangeDate.getTime();

    // Convert milliseconds to seconds, minutes, hours, days, and so on
    const seconds = Math.floor(differenceInMilliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

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
