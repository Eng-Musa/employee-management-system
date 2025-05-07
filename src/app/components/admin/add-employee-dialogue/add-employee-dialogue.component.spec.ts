import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmployeeDialogueComponent } from './add-employee-dialogue.component';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { constants } from '../../../environments/constants';
import { LocalStorageService } from '../../../services/local-storage.service';

describe('AddEmployeeDialogueComponent', () => {
  let component: AddEmployeeDialogueComponent;
  let fixture: ComponentFixture<AddEmployeeDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEmployeeDialogueComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {},
        },
        {
          provide: LocalStorageService,
          useValue: {
            retrieve: jest
              .fn()
              .mockReturnValue(constants.LOCAL_STORAGE_KEY_EMPLOYEES),
          },
        },
        { provide: MatSnackBar, useValue: { open: jest.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddEmployeeDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
