import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DeleteEmployeeDialogueComponent } from './delete-employee-dialogue.component';
import { LocalStorageService } from '../../../services/local-storage.service';

describe('DeleteEmployeeDialogueComponent (basic mocks)', () => {
  let component: DeleteEmployeeDialogueComponent;
  let fixture: ComponentFixture<DeleteEmployeeDialogueComponent>;

  // 1) Minimal MatDialogRef stub
  const matDialogRefStub = { close: jest.fn() };

  // 2) Dummy data payload for the dialog
  const dialogDataStub = { id: 123, name: 'test', email: 'test@gmail.com' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteEmployeeDialogueComponent],
      providers: [
        {provide: LocalStorageService, useValue: {retrieve: jest.fn()}},
        { provide: MatDialogRef, useValue: matDialogRefStub },
        { provide: MAT_DIALOG_DATA, useValue: dialogDataStub }, // ← this line fixes the “No provider for MatMdcDialogData!” :contentReference[oaicite:0]{index=0}
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteEmployeeDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should have received the dialog data', () => {
    // e.g. if your component reads @Inject(MAT_DIALOG_DATA) public data
    expect(component.data.id).toBe(123);
    expect(component.data.email).toBe('test@gmail.com');
    expect(component.data.name).toBe("test");
  });
});
