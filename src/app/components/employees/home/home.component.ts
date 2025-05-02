import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { delay } from 'rxjs';
import { constants } from '../../../environments/constants';
import { AlertService } from '../../../services/alert.service';
import { AuthService } from '../../../services/auth.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { ChecklistData } from '../../admin/checklists/checklists.component';
import { SubmitDialogComponent } from '../submit-dialog/submit-dialog.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  checklistData: ChecklistData = {
    checklists: {
      common: [],
      designer: [],
      developer: [],
      hr: [],
    },
  };

  onboardingStatus: any = {};
  loggedInUserEmail = '';

  constructor(
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private alertService: AlertService,
    private dialog: MatDialog
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

  loading: Record<string, boolean> = {};

  onSumit(itemKey: string): void {
    this.loading[itemKey] = true;
    setTimeout(() => {
      this.loading[itemKey] = false;
      if (!this.onboardingStatus[this.loggedInUserEmail]) {
        this.alertService.error(
          'Error occured while processing request.'
        );
        return;
      }

      this.onboardingStatus[this.loggedInUserEmail][itemKey] = true;

      this.localStorageService.save(
        constants.LOCAL_STORAGE_KEY_ONBOARDING,
        this.onboardingStatus
      );
      this.alertService.success(`${itemKey} submitted successfully`);

      this.updateOverallOnboardingStatus();
    }, 1000);
  }

  openSubmitDialog(itemKey: string): void {
    const dialogRef = this.dialog.open(SubmitDialogComponent, {
      width: '40vw',
      maxHeight: '90vh',
      height: 'auto',
      data: { itemKey },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        delay(3000);
        this.onSumit(itemKey);
      }
    });
  }

  loadChecklistData(): void {
    this.checklistData = this.localStorageService.retrieve<ChecklistData>(
      constants.LOCAL_STORAGE_KEY_CHECKLIST
    ) as ChecklistData;
  }

  transformChecklist(items: string[]): Record<string, boolean> {
    const checklist: Record<string, boolean> = {};
    for (const item of items) {
      checklist[item] = false;
    }
    return checklist;
  }

  storeOnboardingStatus(): void {
    const existingData: Record<string, Record<string, boolean>> =
      this.localStorageService.retrieve<Record<string, Record<string, boolean>>>(constants.LOCAL_STORAGE_KEY_ONBOARDING) || {};

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
    let newChecklist: Record<string, boolean> = {};
    if (this.isDesigner()) {
      newChecklist = this.transformChecklist(designerChecklist);
    } else if (this.isDeveloper()) {
      newChecklist = this.transformChecklist(developerChecklist);
    } else if (this.isHr()) {
      newChecklist = this.transformChecklist(hrChecklist);
    } else {
      this.alertService.error(
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
        this.localStorageService.save(
          constants.LOCAL_STORAGE_KEY_ONBOARDING,
          existingData
        );
      }
    } else {
      // If no record exists, simply store the new checklist.
      existingData[this.loggedInUserEmail] = newChecklist;
      this.localStorageService.save(
        constants.LOCAL_STORAGE_KEY_ONBOARDING,
        existingData
      );
    }
  }

  loadOnboardingStatus(): void {
    this.onboardingStatus = this.localStorageService.retrieve<any>(
      constants.LOCAL_STORAGE_KEY_ONBOARDING
    );
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
    if (this.calculateCompletionPercentage() === 100) {
      const employees = this.localStorageService.retrieve<any[]>(
        constants.LOCAL_STORAGE_KEY_EMPLOYEES
      );
      if (employees) {
        const employeeIndex = employees.findIndex(
          (emp: any) => emp.email === this.loggedInUserEmail
        );

        if (employeeIndex !== -1) {
          employees[employeeIndex].status = 'Created';

          this.localStorageService.save(
            constants.LOCAL_STORAGE_KEY_EMPLOYEES,
            employees
          );
        }
      } else {
        this.alertService.error('No employees found');
      }
    }
  }
}
