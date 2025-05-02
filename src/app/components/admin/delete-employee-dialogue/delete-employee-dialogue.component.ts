import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { constants } from '../../../environments/constants';
import { AlertService } from '../../../services/alert.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { Employee } from '../view-employee/view-employee.component';

@Component({
  selector: 'app-delete-employee-dialogue',
  imports: [MatDialogModule, CommonModule, MatButtonModule, MatDialogContent],
  templateUrl: './delete-employee-dialogue.component.html',
  styleUrl: './delete-employee-dialogue.component.scss',
})
export class DeleteEmployeeDialogueComponent implements OnInit {
  employees: Employee[] = [];
  private readonly LOCAL_STORAGE_KEY_ONBOARDING = 'onboardingStatus';
  constructor(
    public dialogRef: MatDialogRef<DeleteEmployeeDialogueComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { id: number; name: string; email: string },
    private alertService: AlertService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.fetchEmployees();
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.deleteEmployee();
    this.alertService.success('Employee deleted successfully!');
    this.dialogRef.close(true);
  }

  fetchEmployees(): void {
    const retrievedData = this.localStorageService.retrieve<Employee[]>(
      constants.LOCAL_STORAGE_KEY_EMPLOYEES
    );
    this.employees = retrievedData || [];
  }

  deleteEmployee(): void {
    // Filter out the employee that should be deleted
    this.employees = this.employees.filter(
      (employee) => employee.id !== this.data.id
    );

    this.localStorageService.save(
      constants.LOCAL_STORAGE_KEY_EMPLOYEES,
      this.employees
    );

    // Delete associated employee onboarding status

    const onboardingStatus = this.localStorageService.retrieve<any>(
      constants.LOCAL_STORAGE_KEY_ONBOARDING
    );
    if (onboardingStatus[this.data.email]) {
      delete onboardingStatus[this.data.email];
      localStorage.setItem(
        this.LOCAL_STORAGE_KEY_ONBOARDING,
        JSON.stringify(onboardingStatus)
      );
    }
  }
}
