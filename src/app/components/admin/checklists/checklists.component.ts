import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-checklists',
  imports: [CommonModule],
  templateUrl: './checklists.component.html',
  styleUrl: './checklists.component.scss',
})
export class ChecklistsComponent {
  // Create an object with all your checklists under the "chskilist" key
  checklistData = {
    checklists: {
      common: ['ID/passport', 'Birth certificate', 'Contact details'],
      designer: [
        'Submit design portfolio',
        'Install Figma Suite',
        'Submit signed NDA',
        'Submit certificates',
        'Technical Assessment',
        'Share work tools',
      ],
      developer: [
        'Share GitHub link',
        'Submit software licenses',
        'Submit certifications',
        'Install dev tools',
        'Technical Assessment',
        'Access repositories',
      ],
      hr: [
        'Submit HR certifications',
        'Provide job references',
        'Read company policies',
        'Setup HR systems',
        'Submit confidentiality form',
      ],
    },
  };
}
