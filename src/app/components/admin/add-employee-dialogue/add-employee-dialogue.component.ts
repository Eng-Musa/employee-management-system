import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-employee-dialogue',
  imports: [
    MatDialogModule,
    MatDialogActions,
    MatButtonModule,
    MatStepperModule,
    MatFormField,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    CommonModule
  ],
  templateUrl: './add-employee-dialogue.component.html',
  styleUrl: './add-employee-dialogue.component.scss',
})
export class AddEmployeeDialogueComponent {
  basicInfoForm: FormGroup;
  employmentForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddEmployeeDialogueComponent>,
    private fb: FormBuilder
  ) {
    // Step 1: Basic Information
    this.basicInfoForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
    });

    // Step 2: Employment Details
    this.employmentForm = this.fb.group({
      department: ['', Validators.required],
      role: ['', Validators.required],
      startDate: ['', Validators.required],
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onSubmit(): void {
    // Build the employee object including computed fields like createdDate.
    const employee = {
      id: Math.floor(Math.random()*1000) + 1, 
      name: this.basicInfoForm.value.name,
      email: this.basicInfoForm.value.email,
      phoneNumber: this.basicInfoForm.value.phoneNumber,
      department: this.employmentForm.value.department,
      role: this.employmentForm.value.role,
      startDate: this.employmentForm.value.startDate,
      status: 'Onboarding',
      createdDate: new Date()
      .toLocaleString('en-US', {
        timeZone: 'Africa/Nairobi',
      })
      .slice(0, 16)
      .replace(',', ''),
      lastLogin: 'Never',
      lastPasswordChange: 'Never',
      password: 'User@1234',
    };

    // Log the employee info to the console.
    console.log(employee);
    
    // Pass the employee data back and close the dialog.
    this.dialogRef.close(employee);
  }
}
