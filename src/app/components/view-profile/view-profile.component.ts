import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';

export interface LoggedInPerson {
  name: string;
  email: string;
  password: string;
  createdDate: string;
  role: string;
  phoneNumber: string;
  lastLogin: string;
  lastPasswordChange: string;
}

@Component({
  selector: 'app-view-profile',
  imports: [],
  templateUrl: './view-profile.component.html',
  styleUrl: './view-profile.component.scss',
})
export class ViewProfileComponent implements OnInit {
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

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private alertService: AlertService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getLoggedInPerson();
  }

  getLoggedInPerson() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.authService.getUserType() === 'admin') {
        const storedUserStr = localStorage.getItem('adminUser');
        if (storedUserStr) {
          this.loggedInPerson = JSON.parse(storedUserStr);
        } else {
          this.alertService.showErrorToastr(
            'No admin user found in local storage.'
          );
        }
      } else {
        const loggedInEmail = this.authService.getLoggedInEmail();
        const employeesStr = localStorage.getItem('employees');
        if (employeesStr) {
          try {
            const employees = JSON.parse(employeesStr);
            const foundEmployee = employees.find(
              (emp: any) => emp.email === loggedInEmail
            );
            if (foundEmployee) {
              this.loggedInPerson = {
                name: foundEmployee.name,
                email: foundEmployee.email,
                password: foundEmployee.password,
                createdDate: foundEmployee.createdDate,
                role: foundEmployee.role,
                phoneNumber: foundEmployee.phoneNumber,
                lastLogin: foundEmployee.lastLogin,
                lastPasswordChange: foundEmployee.lastPasswordChange,
              };
            } else {
              this.alertService.showErrorToastr(
                `Employee with email ${loggedInEmail} not found.`
              );
            }
          } catch (error) {
            this.alertService.showErrorToastr('Failed to parse employee data.');
          }
        } else {
          this.alertService.showErrorToastr(
            'No employee data found in local storage.'
          );
        }
      }
    }
  }
}
