import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitDialogComponent } from './submit-dialog.component';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SubmitDialogComponent', () => {
  let component: SubmitDialogComponent;
  let fixture: ComponentFixture<SubmitDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmitDialogComponent, MatDialogModule, BrowserAnimationsModule],
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
