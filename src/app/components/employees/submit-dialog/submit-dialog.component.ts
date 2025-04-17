import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-submit-dialog',
  imports: [],
  templateUrl: './submit-dialog.component.html',
  styleUrl: './submit-dialog.component.scss',
})
export class SubmitDialogComponent implements OnInit {


  constructor(
    public dialogRef: MatDialogRef<SubmitDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { itemKey: string }
  ) {}
  ngOnInit(): void {
    console.log(this.data.itemKey)
  }


}
