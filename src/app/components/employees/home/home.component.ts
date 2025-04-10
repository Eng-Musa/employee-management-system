import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ChecklistData } from '../../admin/checklists/checklists.component';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
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
      // Combine common checklists with role-specific checklists.
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

      // Build the onboarding status object based on user type.
      let onboardingStatus: any = {};

      if (this.isDesigner()) {
        onboardingStatus[this.loggedInUserEmail] =
          this.transformChecklist(designerChecklist);
      } else if (this.isDeveloper()) {
        onboardingStatus[this.loggedInUserEmail] =
          this.transformChecklist(developerChecklist);
      } else if (this.isHr()) {
        onboardingStatus[this.loggedInUserEmail] =
          this.transformChecklist(hrChecklist);
      }

      localStorage.setItem(
        this.LOCAL_STORAGE_KEY_ONBOARDING,
        JSON.stringify(onboardingStatus)
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
}
