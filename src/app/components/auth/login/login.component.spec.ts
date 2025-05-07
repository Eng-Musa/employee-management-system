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

  test('should create login form with name and password controls' , () =>{
    const form = component.loginForm;
    expect(form).toBeInstanceOf(FormGroup)
    expect(form).toBeTruthy();
    expect(form.contains('email')).toBeTruthy();
    expect(form.contains('password')).toBeTruthy();
  });

  test.only('should make the email required', () =>{
    const control = component.loginForm.get('email');
    expect(control).toBeTruthy();
    control!.setValue('');
    expect(control?.valid).toBeFalsy();
    expect(control?.hasError('required')).toBeTruthy();
  })

});
