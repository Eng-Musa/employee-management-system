import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { constants } from '../../../environments/constants';
import { AlertService } from '../../../services/alert.service';
import { LocalStorageService } from '../../../services/local-storage.service';

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
  imports: [CommonModule, MatIconModule],
  templateUrl: './view-employee.component.html',
  styleUrl: './view-employee.component.scss',
})
export class ViewEmployeeComponent implements OnInit {
  employeeId!: number;
  employeeName = '';
  employee!: Employee | null;
  employeeOnboardingStatus: Record<string, boolean> = {};

  constructor(
    private route: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    // Retrieve the id from the route parameters
    this.route.params.subscribe((params) => {
      this.employeeId = +params['id'];
      this.employeeName = params['name'];

      this.getEmployeeById(this.employeeId);
      this.loadOnboardingStatus();
    });
  }

  getEmployeeById(id: number): void {
    const employees = this.localStorageService.retrieve<Employee[]>(
      constants.LOCAL_STORAGE_KEY_EMPLOYEES
    );

    if (employees) {
      this.employee = employees.find((emp: Employee) => emp.id === id) || null;

      if (!this.employee) {
        this.alertService.error('Employee not found in localStorage!');
      }
    } else {
      this.alertService.error('No employees found in localStorage');
    }
  }

  loadOnboardingStatus(): void {
    const onboardingStatus = this.localStorageService.retrieve<
      Record<string, Record<string, boolean>>
    >(constants.LOCAL_STORAGE_KEY_ONBOARDING);
    const employeeEmail = this.employee?.email;
    if (onboardingStatus && employeeEmail) {
      this.employeeOnboardingStatus = onboardingStatus[employeeEmail];
    }
  }

  calculateCompletionPercentage(): number {
    const keys = this.getKeys(this.employeeOnboardingStatus);

    if (!keys || keys.length === 0) {
      return 0;
    }

    let completed = 0;
    for (const key of keys) {
      if (this.employeeOnboardingStatus[key]) {
        completed++;
      }
    }

    return Math.round((completed / keys.length) * 100);
  }

  sendReminder(): void{
    this.alertService.success('Reminder sent!')
  }

  // Helper method to get keys for an object;
  getKeys(obj: Record<string, boolean>): string[] {
    return Object.keys(obj);
  }
}
