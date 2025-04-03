import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteEmployeeDialogueComponent } from './delete-employee-dialogue.component';

describe('DeleteEmployeeDialogueComponent', () => {
  let component: DeleteEmployeeDialogueComponent;
  let fixture: ComponentFixture<DeleteEmployeeDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteEmployeeDialogueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteEmployeeDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
