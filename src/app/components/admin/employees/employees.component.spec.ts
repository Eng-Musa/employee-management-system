import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { EmployeesComponent } from './employees.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../../services/local-storage.service';
import { of } from 'rxjs';
import { AddEmployeeDialogueComponent } from '../add-employee-dialogue/add-employee-dialogue.component';
import { expect } from '@jest/globals';
import { DeleteEmployeeDialogueComponent } from '../delete-employee-dialogue/delete-employee-dialogue.component';
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
        { provide: LocalStorageService, useValue: localStorageServiceMock },
      ],
    }).compileComponents();

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

  test('should apply the filter correctly', () => {
    const testQuery = 'Sample Filter';
    const inputElem = document.createElement('input');
    inputElem.value = testQuery;
    component.applyFilter(inputElem);
    expect(component.dataSource.filter).toEqual(testQuery.trim().toLowerCase());
  });

  test('should fetch employees and update the datasource after timeout', fakeAsync(() => {
    const dummyEmployees = [
      {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        phoneNumber: '1234567890',
        department: 'Engineering',
        role: 'Developer',
        startDate: '2023-01-01',
        endDate: null,
        status: 'Active',
        address: '123 Main St',
        password: 'password123',
        createdDate: '2023-01-01T00:00:00Z',
        lastLogin: '2023-06-01T12:00:00Z',
        lastPasswordChange: '2023-05-01T12:00:00Z',
      },
    ];
    (localStorageServiceMock.retrieve as jest.Mock).mockReturnValue(
      dummyEmployees
    );

    component.fetchEmployees();
    expect(component.loading).toBeTruthy();

    tick(1000);

    expect(component.loading).toBeFalsy();
    expect(component.employee).toEqual(dummyEmployees);
    expect(component.dataSource.data).toEqual(dummyEmployees);
  }));

  test('should open add employee dialog and refresh employees when closed with a valid result', fakeAsync(() => {
    // Simulate a dialog reference with afterClosed returning an observable of true.
    const fakeDialogRef = { afterClosed: () => of(true) };
    (dialogMock.open as jest.Mock).mockReturnValue(fakeDialogRef)
    const fetchSpy = jest.spyOn(component, 'fetchEmployees');

    component.openAddEmployeeDialog();
    tick();
    expect(dialogMock.open).toHaveBeenCalledWith(
      AddEmployeeDialogueComponent,
      expect.objectContaining({
        width: 'auto',
        maxWidth: '90vw',
        height: 'auto',
        maxHeight: '90vh'
      })
    );
    expect(fetchSpy).toHaveBeenCalled();
  }));

   test('should open delete employee dialog and refresh employees when closed with a valid result', fakeAsync(() => {
    const fakeDialogRef = { afterClosed: () => of(true) };
    (dialogMock.open as jest.Mock).mockReturnValue(fakeDialogRef);
    const fetchSpy = jest.spyOn(component, 'fetchEmployees');
    const id = 1;
    const name = 'Test User';
    const email = 'test@example.com';

    component.openDeleteEmployeeDialog(id, name, email);
    tick();
    expect(dialogMock.open).toHaveBeenCalledWith(
      DeleteEmployeeDialogueComponent,
      expect.objectContaining({
        width: '40vw',
        maxHeight: '90vh',
        height: 'auto',
        data: { id, name, email }
      })
    );
    expect(fetchSpy).toHaveBeenCalled();
  }));
  
});
