import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';

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
  imports: [CommonModule],
  templateUrl: './checklists.component.html',
  styleUrl: './checklists.component.scss',
})
export class ChecklistsComponent implements OnInit {
  // Define the local storage key as a constant for reusability and to avoid typos
  private readonly LOCAL_STORAGE_KEY = 'checklistData';
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

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    this.loadChecklistData();
  }

  loadChecklistData(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedData = localStorage.getItem(this.LOCAL_STORAGE_KEY);
      if (savedData) {
        try {
          this.checklistData = JSON.parse(savedData) as ChecklistData;
        } catch (error) {
          console.error(
            'Failed to parse checklist data from local storage.',
            error
          );
        }
      }
    }
  }

  /**
   * Saves the current checklist data to local storage.
   */
  // saveChecklistData(): void {
  //   try {
  //     localStorage.setItem(
  //       this.LOCAL_STORAGE_KEY,
  //       JSON.stringify(this.checklistData)
  //     );
  //   } catch (error) {
  //     console.error('Failed to save checklist data to local storage.', error);
  //   }
  // }
}
