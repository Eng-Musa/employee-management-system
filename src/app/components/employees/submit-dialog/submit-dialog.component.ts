import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogModule,
} from '@angular/material/dialog';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-submit-dialog',
  imports: [
    MatDialogModule,
    CommonModule,
    MatButtonModule,
    MatDialogContent,
    ReactiveFormsModule,
  ],
  templateUrl: './submit-dialog.component.html',
  styleUrl: './submit-dialog.component.scss',
})
export class SubmitDialogComponent implements OnInit {
  qualificationForm: FormGroup;
  idForm: FormGroup;
  isSubmitted = false;
  selectedFileNames: string = 'No file chosen';


  constructor(
    public dialogRef: MatDialogRef<SubmitDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { itemKey: string },
    public authService: AuthService,
    private fb: FormBuilder
  ) {
    this.qualificationForm = this.fb.group({
      qualification: ['', Validators.required],
      institution: ['', Validators.required],
      year: ['', Validators.required],
      supporting: [null], // File input doesn't work well with reactive forms, we'll handle it separately
    });

    this.idForm = this.fb.group({
      idPhoto: [null, Validators.required]
    })
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    if (this.isSubmitted) {
      this.dialogRef.close(true);
    }
  }

  // Options for qualification dropdown
  qualificationTypes = [
    { value: 'bachelor', label: "Bachelor's Degree" },
    { value: 'master', label: "Master's Degree" },
    { value: 'phd', label: 'PhD' },
    { value: 'certification', label: 'Professional Certification' },
    { value: 'other', label: 'Other' },
  ];

  ngOnInit(): void {}

  /**
   * Handle file selection
   */
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const fileCount = input.files.length;
      this.selectedFileNames =
        fileCount > 1 ? `${fileCount} files selected` : input.files[0].name;
    } else {
      this.selectedFileNames = 'No file chosen';
    }
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    this.isSubmitted = true;
  }

  /**
   * Helper method for form field validation
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.qualificationForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }
}
