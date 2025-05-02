import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { constants } from '../../../environments/constants';
import { AlertService } from '../../../services/alert.service';
import { AuthService } from '../../../services/auth.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { ChecklistData } from '../checklists/checklists.component';
import { Employee } from '../view-employee/view-employee.component';

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
export class AddEmployeeDialogueComponent implements OnInit {
  basicInfoForm: FormGroup;
  employmentForm: FormGroup;

  employeesData: Employee[] = [];
  checklistData: ChecklistData = {
    checklists: {
      common: [],
      designer: [],
      developer: [],
      hr: [],
    },
  };

  constructor(
    public dialogRef: MatDialogRef<AddEmployeeDialogueComponent>,
    private fb: FormBuilder,
    private alertService: AlertService,
    private authService: AuthService,
    private localStorageService: LocalStorageService
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
    const retrievedData = this.localStorageService.retrieve<Employee[]>(
      constants.LOCAL_STORAGE_KEY_EMPLOYEES
    );

    if (retrievedData) {
      this.employeesData = retrievedData;
    } else {
      this.alertService.error('No employees found!');
    }
  }

  saveToLocalStorage(): void {
    this.localStorageService.save(
      constants.LOCAL_STORAGE_KEY_EMPLOYEES,
      this.employeesData
    );
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
    this.storeOnboardingStatus();
    this.alertService.success('Added employee successfully.');
    // Pass the employee data back and close the dialog.
    this.dialogRef.close(employee);
  }

  isAdmin(): boolean {
    return this.authService.getUserType() === 'admin';
  }

  loadChecklistData(): void {
    const retrievedData = this.localStorageService.retrieve<ChecklistData>(
      constants.LOCAL_STORAGE_KEY_CHECKLIST
    );
    this.checklistData = retrievedData || {
      // Fallback if null
      checklists: {
        common: [],
        designer: [],
        developer: [],
        hr: [],
      },
    };
  }

  storeOnboardingStatus(): void {
    let existingData: Record<string, Record<string, boolean>> = {};

    existingData = this.localStorageService.retrieve<any>(
      constants.LOCAL_STORAGE_KEY_ONBOARDING
    );

    if (existingData[this.basicInfoForm.value.email]) {
      return;
    }

    this.loadChecklistData();
    // Combine common checklist items with role-specific checklist items.
    const designerChecklist = [
      ...this.checklistData.checklists.common,
      ...this.checklistData.checklists.designer,
    ];
    const developerChecklist = [
      ...this.checklistData.checklists.common,
      ...this.checklistData.checklists.developer,
    ];
    const hrChecklist = [
      ...this.checklistData.checklists.common,
      ...this.checklistData.checklists.hr,
    ];

    let newChecklist: Record<string, boolean> = {};

    if (this.employmentForm.value.role === 'Designer') {
      newChecklist = this.transformChecklist(designerChecklist);
    } else if (this.employmentForm.value.role === 'Developer') {
      newChecklist = this.transformChecklist(developerChecklist);
    } else if (this.employmentForm.value.role === 'Hr') {
      newChecklist = this.transformChecklist(hrChecklist);
    } else {
      this.alertService.error(
        'User role not recognized for onboarding status.'
      );
      return;
    }

    existingData[this.basicInfoForm.value.email] = newChecklist;

    this.localStorageService.save(
      constants.LOCAL_STORAGE_KEY_ONBOARDING,
      existingData
    );
  }

  transformChecklist(items: string[]): Record<string, boolean> {
    const checklist: Record<string, boolean> = {};
    for (const item of items) {
      checklist[item] = false;
    }

    return checklist;
  }
}
