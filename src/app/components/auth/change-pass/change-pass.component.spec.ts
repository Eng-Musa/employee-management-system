import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ChangePassComponent } from './change-pass.component';
import { LocalStorageService } from '../../../services/local-storage.service';
import { AlertService } from '../../../services/alert.service';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';

describe('ChangePassComponent', () => {
  let component: ChangePassComponent;
  let fixture: ComponentFixture<ChangePassComponent>;
  let mockDialogRef: Partial<MatDialogRef<ChangePassComponent>>;
  let mockAlert: Partial<AlertService>;
  let mockAuth: Partial<AuthService>;
  let mockLS: Partial<LocalStorageService>;

  beforeEach(async () => {
    jest.useFakeTimers();

    mockDialogRef = { close: jest.fn() };
    mockAlert = { error: jest.fn(), success: jest.fn() };
    mockAuth = {
      getUserType: jest.fn().mockReturnValue('admin'),
      logout: jest.fn(),
    };
    mockLS = { retrieve: jest.fn(), save: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [ChangePassComponent, MatDialogModule, BrowserAnimationsModule],
      providers: [
        FormBuilder,
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: AlertService, useValue: mockAlert },
        { provide: AuthService, useValue: mockAuth },
        { provide: LocalStorageService, useValue: mockLS },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangePassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
  });
  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test.only('should mark the form as invalid if both fields are empty', ()=>{
    const form = component.passwordForm;
    expect(form).toBeInstanceOf(FormGroup);

    expect(form.valid).toBe(false);
    expect(form.get('oldPassword')?.hasError('required')).toBe(true);
    expect(form.get('password')?.hasError('required')).toBe(true);
  })
});
