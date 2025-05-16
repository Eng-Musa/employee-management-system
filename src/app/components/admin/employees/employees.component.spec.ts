import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeesComponent } from './employees.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../../services/local-storage.service';

describe('EmployeesComponent', () => {
  let component: EmployeesComponent;
  let fixture: ComponentFixture<EmployeesComponent>;
  let dialogMock: Partial<MatDialog>;
  let routerMock: Partial<Router>;
  let localStorageServiceMock: Partial<LocalStorageService>;

  beforeEach(async () => {
    dialogMock = { open: jest.fn() };
    routerMock = { navigate: jest.fn() };
    localStorageServiceMock = { retrieve: jest.fn().mockReturnValue([]) };

    await TestBed.configureTestingModule({
      imports: [EmployeesComponent],
       providers: [
        { provide: MatDialog, useValue: dialogMock },
        { provide: Router, useValue: routerMock },
        { provide: LocalStorageService, useValue: localStorageServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should call fetchEmployees on initialization', () => {
    const fetchSpy = jest.spyOn(component, 'fetchEmployees');
    component.ngOnInit();
    expect(fetchSpy).toHaveBeenCalled();
  });
});
