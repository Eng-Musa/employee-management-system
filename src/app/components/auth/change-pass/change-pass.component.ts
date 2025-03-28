import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import {
  MatError,
  MatFormField,
  MatInputModule,
} from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AlertService } from '../../../services/alert.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-change-pass',
  imports: [
    MatDialogModule,
    MatProgressBarModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormField,
    MatInputModule,
    MatIconModule,
    MatError,
    MatButtonModule
  ],
  templateUrl: './change-pass.component.html',
  styleUrl: './change-pass.component.scss',
})
export class ChangePassComponent implements OnInit {
  passwordForm: FormGroup;
  loading = false;
  message: string = '';
  isSuccess: boolean = false;
  hide = true;
  lastPasswordChange: string='';

  constructor(
    public dialogRef: MatDialogRef<ChangePassComponent>,
    private fb: FormBuilder,
    private alertService: AlertService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          Validators.pattern(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,20}$'
          ),
        ],
      ],
    });
  }

  ngOnInit(): void {
    this.getLoggedInPerson();
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      console.log(this.passwordForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  getLoggedInPerson() {
    if (isPlatformBrowser(this.platformId)) {
      const storedUserStr = localStorage.getItem('adminUser');
      if (storedUserStr) {
        const loggedInPerson = JSON.parse(storedUserStr);
        this.lastPasswordChange = loggedInPerson.lastPasswordChange;
      } else {
        this.alertService.showErrorToastr('No user found in localStorage.');
      }
    }
  }
}
