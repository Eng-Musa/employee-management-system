import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AlertService } from '../../../services/alert.service';
import { Router, RouterModule } from '@angular/router';

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
  message: string = '';
  isSuccess: boolean = false;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.createAdmin();
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.isSuccess = false;
      this.message = '';

      if (isPlatformBrowser(this.platformId)) {
        // Retrieve the stored admin and employees from localStorage
        const storedAdminStr = localStorage.getItem('adminUser');
        const storedEmployeesStr = localStorage.getItem('employees');

        // Simulate a delay of 1 second
        setTimeout(() => {
          const email = this.loginForm.get('email')?.value;
          const password = this.loginForm.get('password')?.value;

          // Initialize a variable to hold the authenticated user
          let authenticatedUser = null;

          // First, check if there's an admin user and if the credentials match
          if (storedAdminStr) {
            const storedAdmin = JSON.parse(storedAdminStr);
            if (
              storedAdmin.email === email &&
              storedAdmin.password === password
            ) {
              authenticatedUser = storedAdmin;
              this.router.navigate(['/dashboard/admin-home']);
              this.updateLastLogin();
            }
          }

          // If no admin was authenticated, check the employees list
          if (!authenticatedUser && storedEmployeesStr) {
            const employees = JSON.parse(storedEmployeesStr);
            // Find an employee with matching credentials
            authenticatedUser = employees.find(
              (emp: any) => emp.email === email && emp.password === password
            );
            if (authenticatedUser) {
              this.router.navigate(['/dashboard']);
              this.updateLastLogin();
            }
          }

          // If neither admin nor employee matched, show an error message
          if (!authenticatedUser) {
            this.message = 'Invalid credentials provided.';
          }
          this.loading = false;
        }, 1000);
      } else {
        // Handle cases where localStorage isn't available
        setTimeout(() => {
          this.loading = false;
          this.message = 'localStorage is not available in this environment.';
        }, 1000);
      }
    } else {
      // For an invalid form, still show a short delay before notifying the user
      setTimeout(() => {
        this.loading = false;
        this.alertService.showErrorToastr(
          'Invalid form, fill required fields!'
        );
      }, 1000);
    }
  }

  createAdmin() {
    if (typeof window !== 'undefined' && localStorage) {
      const existingUser = localStorage.getItem('adminUser');
      if (!existingUser) {
        const user = {
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
        localStorage.setItem('adminUser', JSON.stringify(user));
        console.log('User created with createdDate and saved to localStorage.');
      } else {
        console.log('User already exists in localStorage.');
      }
    }
  }

  updateLastLogin(): void {
    // Retrieve the email input from the login form
    const email = this.loginForm.get('email')?.value;
    const currentDate = new Date()
      .toLocaleString('en-US', { timeZone: 'Africa/Nairobi' })
      .slice(0, 16)
      .replace(',', '');

    // Attempt to update admin user login if it matches the provided email
    const storedAdminStr = localStorage.getItem('adminUser');
    if (storedAdminStr) {
      const adminUser = JSON.parse(storedAdminStr);
      if (adminUser.email === email) {
        adminUser.lastLogin = currentDate;
        localStorage.setItem('adminUser', JSON.stringify(adminUser));

        this.saveToSessionStorage(adminUser.email, adminUser.role)
        return;
      }
    }

    // If admin doesn't match, look for the employee in the employees array.
    const storedEmployeesStr = localStorage.getItem('employees');
    if (storedEmployeesStr) {
      const employees = JSON.parse(storedEmployeesStr);
      const employeeIndex = employees.findIndex(
        (emp: any) => emp.email === email
      );
      if (employeeIndex !== -1) {
        employees[employeeIndex].lastLogin = currentDate;
        localStorage.setItem('employees', JSON.stringify(employees));

        this.saveToSessionStorage(employees[employeeIndex].email, employees[employeeIndex].role)
      } else {
        console.error('Employee not found for email: ' + email);
      }
    } else {
      console.error('No employees data found in localStorage.');
    }
  }

  saveToSessionStorage(email: string, role: string): void {
    const loginTime = new Date()
      .toLocaleString('en-US', { timeZone: 'Africa/Nairobi' })
      .slice(0, 16)
      .replace(',', '');
  
    if (isPlatformBrowser(this.platformId)) {
      const loggedInPersion = {
        email: email,
        loginTime: loginTime,
        role: role,
      };
      sessionStorage.setItem('userSession', JSON.stringify(loggedInPersion));
    } else {
      console.error('SessionStorage is not available in this environment.');
    }
  }
  
}
