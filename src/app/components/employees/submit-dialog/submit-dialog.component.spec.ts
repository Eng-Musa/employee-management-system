import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SubmitDialogComponent } from './submit-dialog.component';

describe('SubmitDialogComponent', () => {
  let component: SubmitDialogComponent;
  let fixture: ComponentFixture<SubmitDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmitDialogComponent],
      providers: [
        {provide: MatDialogRef, useValue:{}},
        {provide: MAT_DIALOG_DATA, useValue:{}}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmitDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
