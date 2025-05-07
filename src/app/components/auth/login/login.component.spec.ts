import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { LocalStorageService } from '../../../services/local-storage.service';
import { FormGroup } from '@angular/forms';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        {
          provide: LocalStorageService,
          useValue: { retrieve: jest.fn(), save: jest.fn() },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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
    expect(control?.valid).toBe(false)
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

  test.only('should have hide signal initially set to true', () => {
    expect(component.hide()).toBe(true);
  });

  test.only('should toggle password visibility on clickEvent call', () => {
    const before = component.hide();
    component.clickEvent();
    expect(component.hide()).toBe(!before);

    component.clickEvent();
    expect(component.hide()).toBe(before);
  });
});
