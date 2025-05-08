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

  test('should mark the form as invalid if both fields are empty', ()=>{
    const form = component.passwordForm;
    expect(form).toBeInstanceOf(FormGroup);

    expect(form.valid).toBe(false);
    expect(form.get('oldPassword')?.hasError('required')).toBe(true);
    expect(form.get('password')?.hasError('required')).toBe(true);
  });

  test('should mark the password as invalid if it does not meet complexity rules', () => {
    const pwd = component.passwordForm.get('password')!;

    pwd.setValue('abc');
    expect(pwd.invalid).toBe(true);
    expect(pwd.hasError('pattern')).toBe(true);

   
    pwd.setValue('Abcdef12');
    expect(pwd.hasError('pattern')).toBe(true);

    pwd.setValue('A'.repeat(21) + '1!');
    expect(pwd.hasError('maxlength')).toBe(true);
  });

  test('should mark the password as valid if it meets all rules', () => {
    const pwd = component.passwordForm.get('password')!;
    pwd.setValue('Abcdef1!');
    expect(pwd.valid).toBe(true);
    expect(pwd.errors).toBeNull();
  });

  test.only('should mark oldPassword as valid when non-empty', () => {
    const oldPwd = component.passwordForm.get('oldPassword')!;
    oldPwd.setValue('OldPass1!');
    expect(oldPwd.valid).toBe(true);
    expect(oldPwd.errors).toBeNull();
  });
});
