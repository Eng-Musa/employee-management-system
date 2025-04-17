import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-delete-employee-dialogue',
  imports: [MatDialogModule, CommonModule, MatButtonModule, MatDialogContent],
  templateUrl: './delete-employee-dialogue.component.html',
  styleUrl: './delete-employee-dialogue.component.scss',
})
export class DeleteEmployeeDialogueComponent {
  employees: any[] = [];
  private readonly LOCAL_STORAGE_KEY_ONBOARDING = 'onboardingStatus';
  constructor(
    public dialogRef: MatDialogRef<DeleteEmployeeDialogueComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { id: number; name: string; email: string },
    private alertService: AlertService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.fetchEmployees();
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.deleteEmployee();
    this.alertService.showSuccessToastr('Employee deleted successfully!');
    this.dialogRef.close(true);
  }

  fetchEmployees(): void {
    if (isPlatformBrowser(this.platformId)) {
      const storedEmployees = localStorage.getItem('employees');
      if (storedEmployees) {
        this.employees = JSON.parse(storedEmployees);
      }
    }
  }

  deleteEmployee(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Filter out the employee that should be deleted
      this.employees = this.employees.filter(
        (employee) => employee.id !== this.data.id
      );

      localStorage.setItem('employees', JSON.stringify(this.employees));
      console.log(`Employee with id ${this.data.id} has been deleted.`);

      // Delete associated employee onboarding status

      const onboardingStatusStr = localStorage.getItem(
        this.LOCAL_STORAGE_KEY_ONBOARDING
      );
      if (onboardingStatusStr) {
        const onboardingStatus = JSON.parse(onboardingStatusStr);
        if (onboardingStatus[this.data.email]) {
          delete onboardingStatus[this.data.email];
          localStorage.setItem(
            this.LOCAL_STORAGE_KEY_ONBOARDING,
            JSON.stringify(onboardingStatus)
          );
        }
      }
    }
  }
}
