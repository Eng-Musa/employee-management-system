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
      getUserType: jest.fn(),
      logout: jest.fn(),
      getLoggedInEmail: jest.fn(),
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

  test('should mark the form as invalid if both fields are empty', () => {
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

  test('should mark oldPassword as valid when non-empty', () => {
    const oldPwd = component.passwordForm.get('oldPassword')!;
    oldPwd.setValue('OldPass1!');
    expect(oldPwd.valid).toBe(true);
    expect(oldPwd.errors).toBeNull();
  });

  test('should mark the full form valid when both controls are valid', () => {
    component.passwordForm.setValue({
      oldPassword: 'OldPass1!',
      password: 'NewPass1!',
    });
    expect(component.passwordForm.valid).toBe(true);
  });

  test('should populate loggedInPerson if admin and data exists', () => {
    const mockAdmin = {
      name: 'Admin',
      email: 'a@x.com',
      password: 'pw',
      lastPasswordChange: new Date('2025-05-01T12:00:00Z')
        .toLocaleString('en-US', { timeZone: 'Africa/Nairobi' })
        .slice(0, 16)
        .replace(',', ''),
      // other props...
    } as any;

    (mockAuth.getUserType as jest.Mock).mockReturnValue('admin');
    (mockLS.retrieve as jest.Mock).mockReturnValueOnce(mockAdmin);

    component.getLoggedInPerson();

    expect(component.loggedInPerson).toEqual(mockAdmin);
    expect(mockAlert.error).not.toHaveBeenCalled();
    expect(component.lastPasswordChange).toContain('ago');
  });

  test('should call alertService.error if no admin in localStorage', () => {
    (mockAuth.getUserType as jest.Mock).mockReturnValue('admin');
    (mockLS.retrieve as jest.Mock).mockReturnValueOnce(null);

    component.getLoggedInPerson();

    expect(mockAlert.error).toHaveBeenCalledWith(
      'No admin user found in local storage.'
    );
  });

  test('should populate loggedInEmployee if non-admin and match found', () => {
    const mockEmp = {
      id: 1,
      name: 'Emp',
      email: 'e@x.com',
      password: 'pw',
      lastPasswordChange: new Date('2025-04-30T08:00:00Z')
        .toLocaleString('en-US', { timeZone: 'Africa/Nairobi' })
        .slice(0, 16)
        .replace(',', ''),
    } as any;

    (mockAuth.getUserType as jest.Mock).mockReturnValue('employee');
    (mockAuth.getLoggedInEmail as jest.Mock).mockReturnValue('e@x.com');
    (mockLS.retrieve as jest.Mock).mockReturnValueOnce([mockEmp]);

    component.getLoggedInPerson();

    expect(component.loggedInEmployee).toEqual(mockEmp);
    expect(component.lastPasswordChange).toContain('ago');
  });

  test.only("should set lastPasswordChange to 'Never' if employee's lastPasswordChange === 'Never'", () => {
    const mockEmp = {
      id: 2,
      name: 'Emp2',
      email: 'e2@x.com',
      password: 'pw2',
      lastPasswordChange: 'Never',
    } as any;

    (mockAuth.getUserType as jest.Mock).mockReturnValue('employee');
    (mockAuth.getLoggedInEmail as jest.Mock).mockReturnValue('e2@x.com');
    (mockLS.retrieve as jest.Mock)
      .mockReturnValueOnce([mockEmp]);

    component.getLoggedInPerson();

    expect(component.loggedInEmployee).toEqual(mockEmp);
    expect(component.lastPasswordChange).toBe('Never');
  });
});
