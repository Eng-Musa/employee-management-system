import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ViewEmployeeComponent } from './view-employee.component';

describe('ViewEmployeeComponent', () => {
  let component: ViewEmployeeComponent;
  let fixture: ComponentFixture<ViewEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewEmployeeComponent, RouterTestingModule ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
