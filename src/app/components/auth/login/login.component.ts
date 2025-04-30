import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { constants } from '../../../environments/constants';
import { AlertService } from '../../../services/alert.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { LoggedInPerson } from '../../view-profile/view-profile.component';
import { Employee } from '../../admin/view-employee/view-employee.component';

@Component({
  selector: 'app-login',
  imports: [
    RouterModule,
    ReactiveFormsModule,
    CommonModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hide = signal(true);
  message = '';
  isSuccess = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    @Inject(PLATFORM_ID) private platformId: object,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.createAdmin();
  }

  clickEvent() {
    this.hide.set(!this.hide());
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.isSuccess = false;
      this.message = '';

      // Get users
      const storedAdmin = this.localStorageService.retrieve<LoggedInPerson>(
        constants.LOCAL_STORAGE_KEY_ADMIN
      );
      const storedEmployees = this.localStorageService.retrieve<Employee[]>(
        constants.LOCAL_STORAGE_KEY_EMPLOYEES
      );

      
      // Simulate a delay of 1 second
      setTimeout(() => {
        const email = this.loginForm.get('email')?.value;
        const password = this.loginForm.get('password')?.value;
        let authenticatedUser = null;

        if (storedAdmin) {
          if (
            storedAdmin.email === email &&
            storedAdmin.password === password
          ) {
            authenticatedUser = storedAdmin;
            this.router.navigate(['/dashboard/admin-home']);
            this.updateLastLogin();
          }
        }

        if (!authenticatedUser && storedEmployees) {
          authenticatedUser = storedEmployees.find(
            (emp: Employee) => emp.email === email && emp.password === password
          );
          if (authenticatedUser) {
            this.router.navigate(['/dashboard/home']);
            this.updateLastLogin();
          }
        }

        if (!authenticatedUser) {
          this.message = 'Invalid credentials provided.';
        }
        this.loading = false;
      }, 1000);
    } else {
      setTimeout(() => {
        this.loading = false;
        this.alertService.error(
          'Invalid form, fill required fields!'
        );
      }, 1000);
    }
  }

  createAdmin() {
    const existingAdminUser = this.localStorageService.retrieve<LoggedInPerson>(
      constants.LOCAL_STORAGE_KEY_ADMIN
    );
    if (!existingAdminUser) {
      const adminUser = {
        name: 'System Admin',
        email: 'admin@gmail.com',
        password: 'Admin@1234',
        createdDate: new Date()
          .toLocaleString('en-US', {
            timeZone: 'Africa/Nairobi',
          })
          .slice(0, 16)
          .replace(',', ''),
        role: 'admin',
        phoneNumber: '254 763 000 000',
        lastLogin: null,
        lastPasswordChange: new Date()
          .toLocaleString('en-US', {
            timeZone: 'Africa/Nairobi',
          })
          .slice(0, 16)
          .replace(',', ''),
      };
      this.localStorageService.save(constants.LOCAL_STORAGE_KEY_ADMIN, adminUser);
     // console.log('User created with createdDate and saved to localStorage.');
    } else {
     // console.log('User already exists in localStorage.');
    }
  }

  updateLastLogin(): void {
    const email = this.loginForm.get('email')?.value;
    const currentDate = new Date()
      .toLocaleString('en-US', { timeZone: 'Africa/Nairobi' })
      .slice(0, 16)
      .replace(',', '');

    const storedAdmin = this.localStorageService.retrieve<LoggedInPerson>(
      constants.LOCAL_STORAGE_KEY_ADMIN
    );
    if (storedAdmin) {
      if (storedAdmin.email === email) {
        storedAdmin.lastLogin = currentDate;
        this.localStorageService.save(
          constants.LOCAL_STORAGE_KEY_ADMIN,
          storedAdmin
        );
        this.localStorageService.saveToSessionStorage(
          storedAdmin.email,
          storedAdmin.role
        );
        return;
      }
    }

    const storedEmployees = this.localStorageService.retrieve<Employee[]>(
      constants.LOCAL_STORAGE_KEY_EMPLOYEES
    );
    if (storedEmployees) {
      const employeeIndex = storedEmployees.findIndex(
        (emp: Employee) => emp.email === email
      );
      if (employeeIndex !== -1) {
        storedEmployees[employeeIndex].lastLogin = currentDate;
        this.localStorageService.save(
          constants.LOCAL_STORAGE_KEY_EMPLOYEES,
          storedEmployees
        );
        this.localStorageService.saveToSessionStorage(
          storedEmployees[employeeIndex].email,
          storedEmployees[employeeIndex].role
        );
      } else {
        console.error('Employee not found for email: ' + email);
      }
    } else {
      console.error('No employees data found in localStorage.');
    }
  }
}
