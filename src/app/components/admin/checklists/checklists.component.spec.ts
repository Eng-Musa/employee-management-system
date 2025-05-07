import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecklistsComponent } from './checklists.component';
import { AlertService } from '../../../services/alert.service';

describe('ChecklistsComponent', () => {
  let component: ChecklistsComponent;
  let fixture: ComponentFixture<ChecklistsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChecklistsComponent],
      providers: [
        {provide: AlertService, useValue: {retrieve: jest.fn()}}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChecklistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
