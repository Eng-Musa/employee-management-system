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
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { AlertService } from '../../../services/alert.service';
import { AuthService } from '../../../services/auth.service';
import { ChecklistData } from '../checklists/checklists.component';

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
  private readonly LOCAL_STORAGE_KEY_CHECKLIST = 'checklistData';
  private readonly LOCAL_STORAGE_KEY_ONBOARDING = 'onboardingStatus';
  basicInfoForm: FormGroup;
  employmentForm: FormGroup;

  employeesData: any[] = [];
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
    this.storeOnboardingStatus();
    this.alertService.showSuccessToastr('Added employee successfully.');
    // Pass the employee data back and close the dialog.
    this.dialogRef.close(employee);
  }

  isAdmin(): boolean {
    return this.authService.getUserType() === 'admin';
  }

  loadChecklistData(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedData = localStorage.getItem(this.LOCAL_STORAGE_KEY_CHECKLIST);
      if (savedData) {
        try {
          this.checklistData = JSON.parse(savedData) as ChecklistData;
        } catch (error) {
          this.alertService.showErrorToastr(
            'Failed to parse checklist data from local storage.'
          );
        }
      }
    }
  }

  storeOnboardingStatus(): void {
    if (isPlatformBrowser(this.platformId)) {
      let existingData: { [email: string]: { [key: string]: boolean } } = {};
      const savedData = localStorage.getItem(this.LOCAL_STORAGE_KEY_ONBOARDING);
      if (savedData) {
        try {
          existingData = JSON.parse(savedData);
        } catch (error) {
          this.alertService.showErrorToastr(
            'Failed to parse onboarding status from local storage.'
          );
        }
      }

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

      let newChecklist: { [key: string]: boolean } = {};

      if (this.employmentForm.value.role === 'Designer') {
        newChecklist = this.transformChecklist(designerChecklist);
      } else if (this.employmentForm.value.role === 'Developer') {
        newChecklist = this.transformChecklist(developerChecklist);
      } else if (this.employmentForm.value.role === 'Hr') {
        newChecklist = this.transformChecklist(hrChecklist);
      } else {
        this.alertService.showErrorToastr(
          'User role not recognized for onboarding status.'
        );
        return;
      }

      existingData[this.basicInfoForm.value.email] = newChecklist;

      localStorage.setItem(
        this.LOCAL_STORAGE_KEY_ONBOARDING,
        JSON.stringify(existingData)
      );
    }
  }

  transformChecklist(items: string[]): { [key: string]: boolean } {
    let checklist: { [key: string]: boolean } = {};
    for (let i = 0; i < items.length; i++) {
      checklist[items[i]] = false;
    }
    return checklist;
  }
}
