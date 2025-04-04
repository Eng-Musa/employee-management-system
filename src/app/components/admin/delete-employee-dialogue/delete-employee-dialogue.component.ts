import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogContent, MatDialogModule } from '@angular/material/dialog';
import { AlertService } from '../../../services/alert.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delete-employee-dialogue',
  imports: [MatDialogModule, CommonModule, MatButtonModule, MatDialogContent],
  templateUrl: './delete-employee-dialogue.component.html',
  styleUrl: './delete-employee-dialogue.component.scss',
})
export class DeleteEmployeeDialogueComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteEmployeeDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number },
    private alertService: AlertService
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.alertService.showSuccessToastr('Employee deleted successfully!');
    this.dialogRef.close(true);
  }
}
