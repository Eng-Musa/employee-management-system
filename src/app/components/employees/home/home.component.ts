import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ChecklistData } from '../../admin/checklists/checklists.component';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AlertService } from '../../../services/alert.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly LOCAL_STORAGE_KEY = 'checklistData';
  private readonly LOCAL_STORAGE_KEY_ONBOARDING = 'onboardingStatus';
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
    return this.authService.getUserType() === 'HR';
  }

  isDesigner(): boolean {
    return this.authService.getUserType() === 'Designer';
  }
  ngOnInit(): void {
    this.loggedInUserEmail = this.authService.getLoggedInEmail();
    this.loadChecklistData();
    this.storeOnboardingStatus();
    this.loadOnboardingStatus();
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
      // Retrieve any existing onboarding status from local storage.
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

      // If onboarding data for the logged-in email exists, do nothing.
      if (existingData[this.loggedInUserEmail]) {
        return;
      }

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

      // Determine the new checklist data based on the user role.
      let newChecklist: { [key: string]: boolean } = {};
      if (this.isDesigner()) {
        newChecklist = this.transformChecklist(designerChecklist);
      } else if (this.isDeveloper()) {
        newChecklist = this.transformChecklist(developerChecklist);
      } else if (this.isHr()) {
        newChecklist = this.transformChecklist(hrChecklist);
      } else {
        // Optionally, handle the case when the role is not recognized.
        this.alertService.showErrorToastr(
          'User role not recognized for onboarding status.'
        );
        return;
      }

      // Use the user's email as the key.
      const currentEmail = this.loggedInUserEmail;
      // Update the checklist for the current email while keeping entries for other emails intact.
      existingData[currentEmail] = newChecklist;

      localStorage.setItem(
        this.LOCAL_STORAGE_KEY_ONBOARDING,
        JSON.stringify(existingData)
      );
    }
  }

  // Load the onboarding status from local storage for display purposes.
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

  // Helper method to get keys for an object; handy for ngFor in the template.
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
    return (completedItems / totalItems) * 100;
  }
}
