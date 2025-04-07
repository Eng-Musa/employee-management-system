import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from '../../../services/alert.service';

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
  selector: 'app-view-employee',
  imports: [],
  templateUrl: './view-employee.component.html',
  styleUrl: './view-employee.component.scss',
})
export class ViewEmployeeComponent implements OnInit {
  employeeId!: number;
  employeeName: string = '';
  employee!: Employee | undefined;

  constructor(
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    // Retrieve the id from the route parameters
    this.route.params.subscribe((params) => {
      this.employeeId = +params['id'];
      this.employeeName = params['name'];

      this.getEmployeeById(this.employeeId);
    });
  }

  getEmployeeById(id: number): void {
    if (isPlatformBrowser(this.platformId)) {
      const storedEmployees = localStorage.getItem('employees');
      if (storedEmployees) {
        const employees: Employee[] = JSON.parse(storedEmployees);
        this.employee = employees.find((emp: Employee) => emp.id === id);

        if (!this.employee) {
          this.alertService.showErrorToastr(
            'Employee not found in localStorage!'
          );
        }
      } else {
        this.alertService.showErrorToastr('No employees found in localStorage');
      }
    }
  }
}
