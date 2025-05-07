import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ViewEmployeeComponent } from './view-employee.component';
import { LocalStorageService } from '../../../services/local-storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('ViewEmployeeComponent', () => {
  let component: ViewEmployeeComponent;
  let fixture: ComponentFixture<ViewEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewEmployeeComponent, RouterTestingModule],
      providers: [
        { provide: LocalStorageService, useValue: { retrieve: jest.fn() } },
        { provide: MatSnackBar, useValue: { open: jest.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
