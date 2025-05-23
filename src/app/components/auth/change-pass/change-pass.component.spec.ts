import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ChangePassComponent } from './change-pass.component';
import { LocalStorageService } from '../../../services/local-storage.service';
import { AlertService } from '../../../services/alert.service';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constants } from '../../../environments/constants';
import { expect } from '@jest/globals';
import { Employee } from '../../view-profile/view-profile.component';

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

  test("should set lastPasswordChange to 'Never' if employee's lastPasswordChange === 'Never'", () => {
    const mockEmp = {
      id: 2,
      name: 'Emp2',
      email: 'e2@x.com',
      password: 'pw2',
      lastPasswordChange: 'Never',
    } as any;

    (mockAuth.getUserType as jest.Mock).mockReturnValue('employee');
    (mockAuth.getLoggedInEmail as jest.Mock).mockReturnValue('e2@x.com');
    (mockLS.retrieve as jest.Mock).mockReturnValueOnce([mockEmp]);

    component.getLoggedInPerson();

    expect(component.loggedInEmployee).toEqual(mockEmp);
    expect(component.lastPasswordChange).toBe('Never');
  });

  test('should not proceed if form is invalid', () => {
    mockAuth.getUserType! = jest.fn().mockReturnValue('admin');
    component.onSubmit();

    expect(component.loading).toBe(true);

    jest.advanceTimersByTime(1000);
    fixture.detectChanges();

    expect(mockLS.save).not.toHaveBeenCalled();
    expect(mockAuth.logout).not.toHaveBeenCalled();
    expect(mockDialogRef.close).not.toHaveBeenCalled();
    expect(component.message).toBe('');
    expect(component.isSuccess).toBe(false);
    expect(component.loading).toBe(false);
  });

  test('should show error if old password is same as new password', () => {
    mockAuth.getUserType! = jest.fn().mockReturnValue('admin');
    component.loggedInPerson.password = 'SamePass1!';

    component.passwordForm.setValue({
      oldPassword: 'SamePass1!',
      password: 'SamePass1!',
    });

    component.onSubmit();
    jest.advanceTimersByTime(1000);
    fixture.detectChanges();

    expect(component.message).toBe(
      'Old password cannot be same as new password'
    );
    expect(component.isSuccess).toBe(false);
    expect(mockLS.save).not.toHaveBeenCalled();
    expect(mockAuth.logout).not.toHaveBeenCalled();
    expect(component.loading).toBe(false);
  });

  test('should show error if old password does not match current one', () => {
    mockAuth.getUserType! = jest.fn().mockReturnValue('admin');
    component.loggedInPerson.password = 'Current1!';

    component.passwordForm.setValue({
      oldPassword: 'WrongOld1!',
      password: 'NewPass1!',
    });

    component.onSubmit();
    jest.advanceTimersByTime(1000);
    fixture.detectChanges();

    expect(component.message).toBe('Wrong old password');
    expect(component.isSuccess).toBe(false);
    expect(mockLS.save).not.toHaveBeenCalled();
    expect(mockAuth.logout).not.toHaveBeenCalled();
    expect(component.loading).toBe(false);
  });

  test('should update password for admin if conditions are met', () => {
    (mockAuth.getUserType as jest.Mock).mockReturnValue('admin');
    component.loggedInPerson = {
      name: '',
      email: 'admin@x.com',
      password: 'OldPass1!',
      createdDate: '',
      role: 'admin',
      phoneNumber: '',
      lastLogin: '',
      lastPasswordChange: '',
    };

    component.passwordForm.setValue({
      oldPassword: 'OldPass1!',
      password: 'NewPass2@',
    });
    (mockLS.retrieve as jest.Mock).mockReturnValueOnce(
      component.loggedInPerson
    );

    component.onSubmit();
    expect(component.loading).toBe(true);

    jest.advanceTimersByTime(1000);
    fixture.detectChanges();

    expect(component.loggedInPerson.password).toBe('NewPass2@');
    expect(component.isSuccess).toBe(true);
  });

  test('should store updated admin in local storage', () => {
    (mockAuth.getUserType as jest.Mock).mockReturnValue('admin');
    component.loggedInPerson = {
      name: '',
      email: 'admin@x.com',
      password: 'OldPass1!',
      createdDate: '',
      role: 'admin',
      phoneNumber: '',
      lastLogin: '',
      lastPasswordChange: '',
    };

    component.passwordForm.setValue({
      oldPassword: 'OldPass1!',
      password: 'NewPass2@',
    });
    (mockLS.retrieve as jest.Mock).mockReturnValueOnce(
      component.loggedInPerson
    );

    component.onSubmit();
    jest.advanceTimersByTime(1000);
    fixture.detectChanges();

    expect(mockLS.save).toHaveBeenCalledWith(
      constants.LOCAL_STORAGE_KEY_ADMIN,
      expect.objectContaining({ email: 'admin@x.com', password: 'NewPass2@' })
    );
  });

  test('should call authService.logout after successful admin update', () => {
    (mockAuth.getUserType as jest.Mock).mockReturnValue('admin');
    component.loggedInPerson = {
      name: '',
      email: 'admin@x.com',
      password: 'OldPass1!',
      createdDate: '',
      role: 'admin',
      phoneNumber: '',
      lastLogin: '',
      lastPasswordChange: '',
    };

    component.passwordForm.setValue({
      oldPassword: 'OldPass1!',
      password: 'NewPass2@',
    });
    (mockLS.retrieve as jest.Mock).mockReturnValueOnce(
      component.loggedInPerson
    );

    component.onSubmit();
    jest.advanceTimersByTime(1000);

    // after success message: another 500ms to close + logout
    expect(component.message).toBe(
      'Password change successfull. Logging out...'
    );
    jest.advanceTimersByTime(500);

    expect(mockDialogRef.close).toHaveBeenCalled();
    expect(mockAuth.logout).toHaveBeenCalled();
  });

  test('should update password for employee if conditions are met', () => {
    (mockAuth.getUserType as jest.Mock).mockReturnValue('employee');
    (mockAuth.getLoggedInEmail as jest.Mock).mockReturnValue('user@x.com');
    const existingEmp = {
      id: 1,
      name: 'User',
      email: 'user@x.com',
      phoneNumber: '',
      department: '',
      role: 'employee',
      startDate: '',
      status: '',
      createdDate: '',
      lastLogin: '',
      lastPasswordChange: '',
      password: 'OldEmp1!',
    };
    component.employees = [existingEmp];
    component.loggedInEmployee = { ...existingEmp };

    component.passwordForm.setValue({
      oldPassword: 'OldEmp1!',
      password: 'NewEmp2@',
    });
    (mockLS.retrieve as jest.Mock).mockReturnValueOnce([existingEmp]);

    component.onSubmit();
    expect(component.loading).toBe(true);

    jest.advanceTimersByTime(1000);
    fixture.detectChanges();

    expect(component.loggedInEmployee.password).toBe('NewEmp2@');
    expect(component.isSuccess).toBe(true);
  });

  test('should update the employee in the employee list correctly', () => {
    //setup
    (mockAuth.getUserType as jest.Mock).mockReturnValue('employee');

    const emp = {
      id: 2,
      name: 'E2',
      email: 'e2@x.com',
      phoneNumber: '',
      department: '',
      role: 'employee',
      startDate: '',
      status: '',
      createdDate: '',
      lastLogin: '',
      lastPasswordChange: '',
      password: 'Old2!',
    };

    component.employees = [emp];
    component.loggedInEmployee = { ...emp };
    component.loggedinEmail = 'e2@x.com';

    component.passwordForm.setValue({
      oldPassword: 'Old2!',
      password: 'New2@Pass',
    });

    (mockLS.retrieve as jest.Mock).mockReturnValueOnce([emp]);

    // 2) Act
    component.onSubmit();
    jest.advanceTimersByTime(1000);
    fixture.detectChanges();

    // 3) Assert
    const updated = component.employees.find((e) => e.email === 'e2@x.com');
    expect(updated).toBeDefined();
    expect(updated!.password).toBe('New2@Pass');
  });

  test('should store updated employees list in local storage', () => {
    (mockAuth.getUserType as jest.Mock).mockReturnValue('employee');
    (mockAuth.getLoggedInEmail as jest.Mock).mockReturnValue('e3@x.com');
    const emp = {
      id: 3,
      name: 'E3',
      email: 'e3@x.com',
      phoneNumber: '',
      department: '',
      role: 'employee',
      startDate: '',
      status: '',
      createdDate: '',
      lastLogin: '',
      lastPasswordChange: '',
      password: 'Old3!',
    } as Employee;

    component.employees = [emp];
    component.loggedInEmployee = { ...emp };

    component.passwordForm.setValue({
      oldPassword: 'Old3!',
      password: 'Newp@1234',
    });
    (mockLS.retrieve as jest.Mock).mockReturnValueOnce([emp]);

    component.onSubmit();
    jest.advanceTimersByTime(1000);
    fixture.detectChanges();

    expect(mockLS.save).toHaveBeenCalledWith(
      constants.LOCAL_STORAGE_KEY_EMPLOYEES,
      expect.arrayContaining([
        expect.objectContaining({
          id: 3,
          name: 'E3',
          email: 'e3@x.com',
          phoneNumber: '',
          department: '',
          role: 'employee',
          startDate: '',
          status: '',
          createdDate: '',
          lastLogin: '',
          lastPasswordChange: '',
          password: 'Old3!',
        }),
      ])
    );
  });

  test('should call authService.logout after successful employee update', () => {
    (mockAuth.getUserType as jest.Mock).mockReturnValue('employee');
    (mockAuth.getLoggedInEmail as jest.Mock).mockReturnValue('e4@x.com');
    const emp = {
      id: 4,
      name: 'E4',
      email: 'e4@x.com',
      phoneNumber: '',
      department: '',
      role: 'employee',
      startDate: '',
      status: '',
      createdDate: '',
      lastLogin: '',
      lastPasswordChange: '',
      password: 'Old4!',
    };
    component.employees = [emp];
    component.loggedInEmployee = { ...emp };

    component.passwordForm.setValue({
      oldPassword: 'Old4!',
      password: 'Newp@1234',
    });
    (mockLS.retrieve as jest.Mock).mockReturnValueOnce([emp]);

    component.onSubmit();
    jest.advanceTimersByTime(1000);
    // Employee logout delay is 1000ms after the first
    jest.advanceTimersByTime(1000);
    fixture.detectChanges();

    expect(mockDialogRef.close).toHaveBeenCalled();
    expect(mockAuth.logout).toHaveBeenCalled();
  });

  test('should return correct relative time for minutes, hours, days, weeks, months, years', () => {
    const now = new Date();

    const testCases = [
      {
        label: 'minutes',
        date: new Date(now.getTime() - 5 * 60 * 1000),
        expected: 'minutes ago',
      },
      {
        label: 'hours',
        date: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        expected: 'hours ago',
      },
      {
        label: 'days',
        date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        expected: 'days ago',
      },
      {
        label: 'weeks',
        date: new Date(now.getTime() - 2 * 7 * 24 * 60 * 60 * 1000),
        expected: 'weeks ago',
      },
      {
        label: 'months',
        date: new Date(now.getTime() - 3 * 30 * 24 * 60 * 60 * 1000),
        expected: 'months ago',
      },
      {
        label: 'years',
        date: new Date(now.getTime() - 2 * 365 * 24 * 60 * 60 * 1000),
        expected: 'years ago',
      },
    ];

    // testCases.forEach(({ date, expected }) => {
    //   const result = component.getTimeDifference(date.toISOString());
    //   expect(result.toLowerCase()).toContain(expected);
    // });

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      const dateString = testCase.date.toISOString();
      const result = component.getTimeDifference(dateString);
      expect(result.toLowerCase()).toContain(testCase.expected);
    }
  });

  test('should close dialog when onCancel is called', () => {
    component.onCancel();

    expect(mockDialogRef.close).toHaveBeenCalled();
  });
});
