import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hide = signal(true);

  constructor(private fb: FormBuilder, private alertService: AlertService) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.createAdmin();
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      this.alertService.showInfoToastr("Done")
    }
  }

  createAdmin() {
    if (typeof window !== 'undefined' && localStorage) {
      const existingUser = localStorage.getItem('adminUser');
      if (!existingUser) {
        const user = {
          name: 'System Admin',
          email: 'admin@gmail.com',
          password: 'Admin@1234',
          createdDate: new Date().toISOString(),
          role: 'admin',
        };
        localStorage.setItem('adminUser', JSON.stringify(user));
        console.log('User created with createdDate and saved to localStorage.');
      } else {
        console.log('User already exists in localStorage.');
      }
    }
  }
}
