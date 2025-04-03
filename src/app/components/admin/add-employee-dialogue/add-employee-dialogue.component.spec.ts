import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmployeeDialogueComponent } from './add-employee-dialogue.component';

describe('AddEmployeeDialogueComponent', () => {
  let component: AddEmployeeDialogueComponent;
  let fixture: ComponentFixture<AddEmployeeDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEmployeeDialogueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEmployeeDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
