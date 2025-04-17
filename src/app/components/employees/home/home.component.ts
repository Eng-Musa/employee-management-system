import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AlertService } from '../../../services/alert.service';
import { AuthService } from '../../../services/auth.service';
import { ChecklistData } from '../../admin/checklists/checklists.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly LOCAL_STORAGE_KEY = 'checklistData';
  private readonly LOCAL_STORAGE_KEY_ONBOARDING = 'onboardingStatus';
  private readonly LOCAL_STORAGE_KEY_EMPLOYEES = 'employees';
  checklistData: ChecklistData = {
    checklists: {
      common: [],
      designer: [],
      developer: [],
      hr: [],
    },
  };

  onboardingStatus: any = {};
  loggedInUserEmail: string = '';

  constructor(
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private alertService: AlertService
  ) {}

  isAdmin(): boolean {
    return this.authService.getUserType() === 'admin';
  }

  isDeveloper(): boolean {
    return this.authService.getUserType() === 'Developer';
  }

  isHr(): boolean {
    return this.authService.getUserType() === 'Hr';
  }

  isDesigner(): boolean {
    return this.authService.getUserType() === 'Designer';
  }
  ngOnInit(): void {
    this.loggedInUserEmail = this.authService.getLoggedInEmail();
    this.loadChecklistData();
    this.storeOnboardingStatus();
    this.loadOnboardingStatus();
    this.updateOverallOnboardingStatus();
  }

  loading: { [key: string]: boolean } = {};

  onSumit(itemKey: string): void {
    this.loading[itemKey] = true;
    setTimeout(() => {
      this.loading[itemKey] = false;
      if (!this.onboardingStatus[this.loggedInUserEmail]) {
        this.alertService.showErrorToastr(
          'Error occured while processing request.'
        );
        return;
      }

      this.onboardingStatus[this.loggedInUserEmail][itemKey] = true;

      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem(
          this.LOCAL_STORAGE_KEY_ONBOARDING,
          JSON.stringify(this.onboardingStatus)
        );

        this.alertService.showSuccessToastr(
          `${itemKey} submitted successfully`
        );

        this.updateOverallOnboardingStatus();
      }
    }, 1000);
  }

  loadChecklistData(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedData = localStorage.getItem(this.LOCAL_STORAGE_KEY);
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

  transformChecklist(items: string[]): { [key: string]: boolean } {
    let checklist: { [key: string]: boolean } = {};
    for (let i = 0; i < items.length; i++) {
      checklist[items[i]] = false;
    }
    return checklist;
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

      // Combine common checklist items with role-specific items.
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

      // Compute the new checklist based on the user's role.
      let newChecklist: { [key: string]: boolean } = {};
      if (this.isDesigner()) {
        newChecklist = this.transformChecklist(designerChecklist);
      } else if (this.isDeveloper()) {
        newChecklist = this.transformChecklist(developerChecklist);
      } else if (this.isHr()) {
        newChecklist = this.transformChecklist(hrChecklist);
      } else {
        this.alertService.showErrorToastr(
          'User role not recognized for onboarding status.'
        );
        return;
      }

      // If checklist exists for this user, compare and update if needed.
      if (existingData[this.loggedInUserEmail]) {
        const storedChecklist = existingData[this.loggedInUserEmail];
        let changed = false;

        // Add any missing fields
        for (const key in newChecklist) {
          if (!(key in storedChecklist)) {
            storedChecklist[key] = newChecklist[key]; // typically false
            changed = true;
          }
        }

        // Remove fields not in the current definition.
        for (const key in storedChecklist) {
          if (!(key in newChecklist)) {
            delete storedChecklist[key];
            changed = true;
          }
        }

        if (changed) {
          existingData[this.loggedInUserEmail] = storedChecklist;
          localStorage.setItem(
            this.LOCAL_STORAGE_KEY_ONBOARDING,
            JSON.stringify(existingData)
          );
        }
      } else {
        // If no record exists, simply store the new checklist.
        existingData[this.loggedInUserEmail] = newChecklist;
        localStorage.setItem(
          this.LOCAL_STORAGE_KEY_ONBOARDING,
          JSON.stringify(existingData)
        );
      }
    }
  }

  loadOnboardingStatus(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedData = localStorage.getItem(this.LOCAL_STORAGE_KEY_ONBOARDING);
      if (savedData) {
        try {
          this.onboardingStatus = JSON.parse(savedData);
        } catch (error) {
          this.alertService.showErrorToastr(
            'Failed to load onboarding status from local storage.'
          );
        }
      }
    }
  }

  // Helper method to get keys for an object;
  getKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  calculateCompletionPercentage(): number {
    const userChecklist = this.onboardingStatus[this.loggedInUserEmail];
    if (!userChecklist) {
      return 0;
    }
    const keys = this.getKeys(userChecklist);
    const totalItems = keys.length;

    if (totalItems === 0) {
      return 0;
    }

    let completedItems = 0;
    for (const key of keys) {
      if (userChecklist[key]) {
        completedItems++;
      }
    }
    return parseFloat(((completedItems / totalItems) * 100).toFixed(0));
  }

  updateOverallOnboardingStatus(): void {
    if (
      this.calculateCompletionPercentage() === 100 &&
      isPlatformBrowser(this.platformId)
    ) {
      const employeesStr = localStorage.getItem(
        this.LOCAL_STORAGE_KEY_EMPLOYEES
      );
      if (employeesStr) {
        const employees = JSON.parse(employeesStr);

        const employeeIndex = employees.findIndex(
          (emp: any) => emp.email === this.loggedInUserEmail
        );

        if (employeeIndex !== -1) {
          employees[employeeIndex].status = 'Created';
          localStorage.setItem(
            this.LOCAL_STORAGE_KEY_EMPLOYEES,
            JSON.stringify(employees)
          );
        }
      } else {
        this.alertService.showErrorToastr('No employees found');
      }
    }
  }
}
