import { Component, Inject, PLATFORM_ID } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogContent,
  MatDialogModule,
} from '@angular/material/dialog';
import { AlertService } from '../../../services/alert.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delete-employee-dialogue',
  imports: [MatDialogModule, CommonModule, MatButtonModule, MatDialogContent],
  templateUrl: './delete-employee-dialogue.component.html',
  styleUrl: './delete-employee-dialogue.component.scss',
})
export class DeleteEmployeeDialogueComponent {
  employees: any[] = [];
  constructor(
    public dialogRef: MatDialogRef<DeleteEmployeeDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number; name: string },
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
        console.log(this.employees);
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
    }
  }
}
