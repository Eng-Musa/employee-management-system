import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MatDialogActions,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { AlertService } from '../../../services/alert.service';
import { AuthService } from '../../../services/auth.service';

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
    CommonModule,
    MatOptionModule,
    MatSelectModule,
  ],
  templateUrl: './add-employee-dialogue.component.html',
  styleUrl: './add-employee-dialogue.component.scss',
})
export class AddEmployeeDialogueComponent {
  basicInfoForm: FormGroup;
  employmentForm: FormGroup;

  employeesData: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddEmployeeDialogueComponent>,
    private fb: FormBuilder,
    private alertService: AlertService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private authService: AuthService
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

  ngOnInit(): void {
    this.loadEmployeesFromLocalStorage();
  }

  loadEmployeesFromLocalStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      const storedEmployees = localStorage.getItem('employees');
      if (storedEmployees) {
        this.employeesData = JSON.parse(storedEmployees);
      }
    }
  }

  saveToLocalStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('employees', JSON.stringify(this.employeesData));
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onSubmit(): void {
    // Build the employee object including computed fields like createdDate.
    const employee = {
      id: Math.floor(Math.random() * 1000) + 1,
      name: this.basicInfoForm.value.name,
      email: this.basicInfoForm.value.email,
      phoneNumber: this.basicInfoForm.value.phoneNumber,
      department: this.employmentForm.value.department,
      role: this.employmentForm.value.role,
      startDate: new Date(this.employmentForm.value.startDate)
        .toISOString()
        .split('T')[0],
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

    this.employeesData.push(employee);
    this.saveToLocalStorage();
    this.alertService.showSuccessToastr('Added employee successfully.');
    // Pass the employee data back and close the dialog.
    this.dialogRef.close(employee);
  }

  isAdmin(): boolean {
    return this.authService.getUserType() === 'admin';
  }
}
