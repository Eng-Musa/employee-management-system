import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
export class ChangePassComponent {
  passwordForm: FormGroup;
  loading = false;
  message: string = '';
  isSuccess: boolean = false;
  hide = true;

  constructor(
    public dialogRef: MatDialogRef<ChangePassComponent>,
    private fb: FormBuilder,
    private alertService: AlertService
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

  onSubmit() {
    if (this.passwordForm.valid) {
      console.log(this.passwordForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
