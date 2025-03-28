import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
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
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    RouterModule,
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
  message: string = '';
  isSuccess: boolean = false;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {
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

  onLogin() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.isSuccess = false;
      this.message = '';
      if (isPlatformBrowser(this.platformId)) {
        console.table(this.loginForm.value);
        // Retrieve the stored user from localStorage
        const storedUserStr = localStorage.getItem('adminUser');

        // Add setTimeout to simulate a delay of 1 second
        setTimeout(() => {
          if (!storedUserStr) {
            this.loading = false;
            this.message = 'No user found in localStorage.';
          } else {
            // Parse the JSON string into an object
            const storedUser = JSON.parse(storedUserStr);
            // Extract form values for email and password
            const email = this.loginForm.get('email')?.value;
            const password = this.loginForm.get('password')?.value;

            // Compare the provided credentials with the stored credentials
            if (
              storedUser.email === email &&
              storedUser.password === password
            ) {
              this.router.navigate(['/dashboard']);
              this.updateLastLogin();
            } else {
              this.message = 'Invalid credentials provided.';
            }
            this.loading = false;
          }
        }, 1000);
      } else {
        setTimeout(() => {
          this.loading = false;
          this.message = 'localStorage is not available in this environment.';
        }, 1000);
      }
    } else {
      // For invalid form, still show loading also
      setTimeout(() => {
        this.loading = false;
        this.alertService.showErrorToastr(
          'Invalid form, fill required fields!'
        );
      }, 1000);
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
          createdDate: new Date().toISOString().slice(0, 16),
          role: 'admin',
          phoneNumber: '254 763 000 000',
          lastLogin: null,
          lastPasswordChange: null,
        };
        localStorage.setItem('adminUser', JSON.stringify(user));
        console.log('User created with createdDate and saved to localStorage.');
      } else {
        console.log('User already exists in localStorage.');
      }
    }
  }

  updateLastLogin() {
    const storedUserStr = localStorage.getItem('adminUser');
    if (storedUserStr) {
      const user = JSON.parse(storedUserStr);
      user.lastLogin = new Date().toISOString().slice(0, 16); 
      localStorage.setItem('adminUser', JSON.stringify(user));
      console.log('Last login updated:', user.lastLogin);
    } else {
      console.error('No user found in localStorage.');
    }
  }

   updateLastPasswordChange() {
    const storedUserStr = localStorage.getItem('adminUser');
    if (storedUserStr) {
      const user = JSON.parse(storedUserStr);
      user.lastPasswordChange = new Date().toISOString().slice(0, 16); 
      localStorage.setItem('adminUser', JSON.stringify(user));
      console.log('Last password change updated:', user.lastPasswordChange);
    } else {
      console.error('No user found in localStorage.');
    }
  }
  
  
}
