import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { LocalStorageService } from '../../../services/local-storage.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AlertService } from '../../../services/alert.service';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockLS: Partial<LocalStorageService>;
  let mockAlert: Partial<AlertService>;
  let mockRouter: Partial<Router>;

  beforeEach(async () => {
    jest.useFakeTimers();
    mockLS = {
      retrieve: jest.fn(),
      save: jest.fn(),
      saveToSessionStorage: jest.fn(),
    };

    mockAlert = {
      error: jest.fn(),
    };
    mockRouter = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        FormBuilder,
        { provide: LocalStorageService, useValue: mockLS },
        { provide: AlertService, useValue: mockAlert },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
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

  test('should create login form with name and password controls', () => {
    const form = component.loginForm;
    expect(form).toBeInstanceOf(FormGroup);
    expect(form).toBeTruthy();
    expect(form.contains('email')).toBeTruthy();
    expect(form.contains('password')).toBeTruthy();
  });

  test('should make the email control required', () => {
    const control = component.loginForm.get('email');
    expect(control).toBeTruthy();
    control!.setValue('');
    expect(control?.valid).toBe(false);
    expect(control?.hasError('required')).toBe(true);
  });

  test('should make the password control required', () => {
    const control = component.loginForm.get('password');
    expect(control).toBeTruthy();
    control!.setValue('');
    expect(control?.valid).toBe(false);
    expect(control?.hasError('required')).toBe(true);
  });

  test('should mark form as invalid when fields are empty', () => {
    component.loginForm.get('email')?.setValue('');
    component.loginForm.get('password')?.setValue('');
    // Trigger validation
    fixture.detectChanges();
    expect(component.loginForm.valid).toBe(false);
  });

  test('should mark form as valid with proper inputs', () => {
    component.loginForm.get('email')?.setValue('user@example.com');
    component.loginForm.get('password')?.setValue('ValidPass123');

    // Trigger validation
    fixture.detectChanges();
    expect(component.loginForm.valid).toBe(true);
  });

  test('should have hide signal initially set to true', () => {
    expect(component.hide()).toBe(true);
  });

  test('should toggle password visibility on clickEvent call', () => {
    const before = component.hide();
    component.clickEvent();
    expect(component.hide()).toBe(!before);

    component.clickEvent();
    expect(component.hide()).toBe(before);
  });

  test('should display error message if credentials are invalid', () => {
    (mockLS.retrieve as jest.Mock)
      .mockReturnValueOnce(null)
      .mockReturnValueOnce(null);

    component.loginForm.setValue({ email: 'bad@user.com', password: 'wrong' });
    component.onLogin();

    jest.advanceTimersByTime(1000);

    expect(component.message).toBe('Invalid credentials provided.');
    expect(mockRouter.navigate).not.toHaveBeenCalled();
    expect(component.loading).toBe(false);
  });

  test('should login as admin and navigate to /dashboard/admin-home', () => {
    const admin = { email: 'a@a.com', password: 'pass', role: 'admin' };
    (mockLS.retrieve as jest.Mock)
      .mockReturnValueOnce(admin)
      .mockReturnValueOnce([]);

    component.loginForm.setValue({ email: 'a@a.com', password: 'pass' });
    component.onLogin();

    jest.advanceTimersByTime(1000);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard/admin-home']);
    expect(component.loading).toBe(false);
  });

  test('should login as employee and navigate to /dashboard/home', () => {
    (mockLS.retrieve as jest.Mock)
      .mockReturnValueOnce(null)   
      .mockReturnValueOnce([
        { email: 'e@e.com', password: 'empPass', role: 'employee' }
      ]);                          

    component.loginForm.setValue({ email: 'e@e.com', password: 'empPass' });
    component.onLogin();

    jest.advanceTimersByTime(1000);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard/home']);
    expect(component.loading).toBe(false);
  });

  test('should not login if form is invalid and should show alert', () => {
    component.loginForm.setValue({ email: '', password: '' });
    component.onLogin();

    jest.advanceTimersByTime(1000);

    expect(mockAlert.error).toHaveBeenCalledWith('Invalid form, fill required fields!');
    expect(component.loading).toBe(false);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  test.only('should set loading to true during login and false after', () => {
    const admin = { email: 'x@x.com', password: 'pwd', role: 'admin' };
    (mockLS.retrieve as jest.Mock)
      .mockReturnValueOnce(admin)
      .mockReturnValueOnce([]);

    component.loginForm.setValue({ email: 'x@x.com', password: 'pwd' });
    component.onLogin();

    // immediately after call
    expect(component.loading).toBe(true);

    jest.advanceTimersByTime(1000);

    expect(component.loading).toBe(false);
  });

});
