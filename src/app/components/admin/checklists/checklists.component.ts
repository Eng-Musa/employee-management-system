import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { constants } from '../../../environments/constants';
import { AlertService } from '../../../services/alert.service';
import { AuthService } from '../../../services/auth.service';
import { LocalStorageService } from '../../../services/local-storage.service';

// Define an interface for each checklist
interface Checklist {
  common: string[];
  designer: string[];
  developer: string[];
  hr: string[];
}

// Define an interface for the complete checklist data
export interface ChecklistData {
  checklists: Checklist;
}
@Component({
  selector: 'app-checklists',
  imports: [CommonModule, FormsModule],
  templateUrl: './checklists.component.html',
  styleUrl: './checklists.component.scss',
})
export class ChecklistsComponent implements OnInit {
  checklistData: ChecklistData = {
    checklists: {
      common: [],
      designer: [],
      developer: [],
      hr: [],
    },
  };

  // Default checklist data
  // checklistData = {
  //   checklists: {
  //     common: ['ID/passport', 'Birth certificate', 'Contact details'],
  //     designer: [
  //       'Submit design portfolio',
  //       'Install Figma Suite',
  //       'Submit signed NDA',
  //       'Submit certificates',
  //       'Technical Assessment',
  //       'Share work tools',
  //     ],
  //     developer: [
  //       'Share GitHub link',
  //       'Submit software licenses',
  //       'Submit certifications',
  //       'Install dev tools',
  //       'Technical Assessment',
  //       'Access repositories',
  //     ],
  //     hr: [
  //       'Submit HR certifications',
  //       'Provide job references',
  //       'Read company policies',
  //       'Setup HR systems',
  //       'Submit confidentiality form',
  //     ],
  //   },
  // };

  constructor(
    private alertService: AlertService,
    private authService: AuthService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.loadChecklistData();
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

  // Editing state for each checklist section.
  editingState: { [key in keyof Checklist]: boolean } = {
    common: false,
    designer: false,
    developer: false,
    hr: false,
  };

  // Toggle the editing flag for a given section
  toggleEdit(section: keyof Checklist): void {
    this.editingState[section] = !this.editingState[section];

    // Remove any empty items
    this.cleanEmptyItems(section);
  }

  // Remove empty items when exiting edit mode
  cleanEmptyItems(section: keyof Checklist): void {
    this.checklistData.checklists[section] = this.checklistData.checklists[
      section
    ].filter((item) => item.trim() !== '');
  }

  trackByIndex(index: number): number {
    return index;
  }

  // Method to add a new item to a given checklist section.
  addNewItem(section: keyof Checklist): void {
    this.checklistData.checklists[section].push('');
  }
  // Save method for a single checklist section.
  saveChecklist(section: keyof Checklist): void {
    // Remove any empty items
    this.cleanEmptyItems(section);

    this.alertService.success('Changes saved successfully');
    this.editingState[section] = false;
    this.localStorageService.save(
      constants.LOCAL_STORAGE_KEY_CHECKLIST,
      this.checklistData
    );
  }

  isAdmin(): boolean {
    return this.authService.getUserType() === 'admin';
  }
}
