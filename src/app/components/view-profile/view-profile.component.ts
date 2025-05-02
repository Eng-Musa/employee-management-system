import { Component, OnInit } from '@angular/core';
import { constants } from '../../environments/constants';
import { AlertService } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
import { LocalStorageService } from '../../services/local-storage.service';

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

export interface Employee {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  department: string;
  role: string;
  startDate: string;           
  status: string;              
  createdDate: string;         
  lastLogin: string;          
  lastPasswordChange: string;  
  password: string;
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
    private localStorageService: LocalStorageService,
    private alertService: AlertService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getLoggedInPerson();
  }

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
    } else {
      const loggedInEmail = this.authService.getLoggedInEmail();
      const employees = this.localStorageService.retrieve<Employee[]>(
        constants.LOCAL_STORAGE_KEY_EMPLOYEES
      );
     
      if (employees) {
        try {
          const foundEmployee = employees.find(
            (emp: Employee) => emp.email === loggedInEmail
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
            this.alertService.error(
              `Employee with email ${loggedInEmail} not found.`
            );
          }
        } catch {
          this.alertService.error('Failed to parse employee data.');
        }
      } else {
        this.alertService.error('No employee data found in local storage.');
      }
    }
  }
}
