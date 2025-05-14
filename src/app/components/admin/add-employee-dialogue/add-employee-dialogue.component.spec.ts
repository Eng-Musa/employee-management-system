import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { constants } from '../../../environments/constants';
import { AddEmployeeDialogueComponent } from './add-employee-dialogue.component';
import { LocalStorageService } from '../../../services/local-storage.service';
import { AlertService } from '../../../services/alert.service';
import { AuthService } from '../../../services/auth.service';
import { expect } from '@jest/globals';

describe('AddEmployeeDialogueComponent', () => {
  let component: AddEmployeeDialogueComponent;
  let fixture: ComponentFixture<AddEmployeeDialogueComponent>;
  let localStorageServiceMock: Partial<LocalStorageService>;
  let alertServiceMock: Partial<AlertService>;
  let authServiceMock: Partial<AuthService>;
  let dialogRefMock: Partial<MatDialogRef<AddEmployeeDialogueComponent>>;

  beforeEach(async () => {
    alertServiceMock = {
      error: jest.fn(),
      success: jest.fn(),
    };

    authServiceMock = {
      getUserType: jest.fn().mockReturnValue('user'),
    };

    localStorageServiceMock = {
      retrieve: jest.fn((key: string) => {
        switch (key) {
          case constants.LOCAL_STORAGE_KEY_EMPLOYEES:
            return [
              {
                email: 'existing@example.com',
                name: 'Existing',
                status: 'Active',
                phoneNumber: '',
                department: '',
                role: '',
                createdDate: '',
                lastLogin: '',
                lastPasswordChange: '',
                password: '',
                id: 0,
                startDate: '',
              },
            ];
          case constants.LOCAL_STORAGE_KEY_CHECKLIST:
            return {
              checklists: {
                common: ['common1'],
                designer: ['designer1'],
                developer: ['developer1'],
                hr: ['hr1'],
              },
            };
          case constants.LOCAL_STORAGE_KEY_ONBOARDING:
            return {};
          default:
            return null;
        }
      }) as unknown as <T>(key: string) => T | null,
      save: jest.fn(),
    };

    dialogRefMock = {
      close: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [AddEmployeeDialogueComponent, MatDialogModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { provide: AlertService, useValue: alertServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        FormBuilder,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddEmployeeDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('loadEmployeesFromLocalStorage should load employees if available', () => {
    component.loadEmployeesFromLocalStorage();
    expect(component.employeesData).toEqual([
      {
        email: 'existing@example.com',
        name: 'Existing',
        status: 'Active',
        phoneNumber: '',
        department: '',
        role: '',
        createdDate: '',
        lastLogin: '',
        lastPasswordChange: '',
        password: '',
        id: 0,
        startDate: '',
      },
    ]);
  });

  test('loadEmployeesFromLocalStorage should alert error if no employees found', () => {
    (localStorageServiceMock.retrieve as jest.Mock).mockReturnValueOnce(null);
    component.loadEmployeesFromLocalStorage();
    expect(alertServiceMock.error).toHaveBeenCalledWith('No employees found!');
  });

  test('saveToLocalStorage should call localStorageService.save with employeesData', () => {
    component.employeesData = [
      {
        email: 'emp1@example.com',
        name: 'Employee One',
        status: 'Onboarding',
        phoneNumber: '1111111111',
        department: 'IT',
        role: 'Developer',
        createdDate: 'date',
        lastLogin: 'Never',
        lastPasswordChange: 'Never',
        password: 'User@1234',
        id: 0,
        startDate: '',
      },
    ];
    component.saveToLocalStorage();
    expect(localStorageServiceMock.save).toHaveBeenCalledWith(
      constants.LOCAL_STORAGE_KEY_EMPLOYEES,
      component.employeesData
    );
  });

  test('onCancel should close the dialog with false', () => {
    component.onCancel();
    expect(dialogRefMock.close).toHaveBeenCalledWith(false);
  });

  test('onSubmit should add an employee with all expected fields, save to localStorage, store onboarding status, alert success and close dialog with employee object', () => {
    component.basicInfoForm.setValue({
      name: 'John Doe',
      email: 'john@example.com',
      phoneNumber: '1234567890',
    });
    component.employmentForm.setValue({
      department: 'IT',
      role: 'Developer',
      startDate: '2025-05-15',
    });

    const storeOnboardingSpy = jest.spyOn(component, 'storeOnboardingStatus');
    component.onSubmit();
    // The recently added employee is the last element of employeesData
    const newEmployee =
      component.employeesData[component.employeesData.length - 1];

    expect(newEmployee).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: 'John Doe',
        email: 'john@example.com',
        phoneNumber: '1234567890',
        department: 'IT',
        role: 'Developer',
        startDate: '2025-05-15',
        status: 'Onboarding',
        lastLogin: 'Never',
        lastPasswordChange: 'Never',
        password: 'User@1234',
      })
    );
    expect(localStorageServiceMock.save).toHaveBeenCalled();
    expect(storeOnboardingSpy).toHaveBeenCalled();
    expect(alertServiceMock.success).toHaveBeenCalledWith(
      'Added employee successfully.'
    );
    expect(dialogRefMock.close).toHaveBeenCalledWith(newEmployee);
  });

  test('isAdmin should return true if authService.getUserType returns admin', () => {
    (authServiceMock.getUserType as jest.Mock).mockReturnValueOnce('admin');
    expect(component.isAdmin()).toBe(true);
  });

  test('loadChecklistData should update checklistData from localStorage if available', () => {
    (localStorageServiceMock.retrieve as jest.Mock).mockImplementation(
      (key: string) => {
        if (key === constants.LOCAL_STORAGE_KEY_CHECKLIST) {
          return {
            checklists: {
              common: ['c1'],
              designer: ['d1'],
              developer: ['d1'],
              hr: ['h1'],
            },
          };
        }
        return null;
      }
    );
    component.loadChecklistData();
    expect(component.checklistData).toEqual({
      checklists: {
        common: ['c1'],
        designer: ['d1'],
        developer: ['d1'],
        hr: ['h1'],
      },
    });
  });

  test('loadChecklistData should set fallback if localStorage returns null', () => {
    (localStorageServiceMock.retrieve as jest.Mock).mockImplementationOnce(
      () => null
    );
    component.loadChecklistData();
    expect(component.checklistData).toEqual({
      checklists: {
        common: [],
        designer: [],
        developer: [],
        hr: [],
      },
    });
  });

  test('storeOnboardingStatus should save a new onboarding record if none exists for the email', () => {
    component.basicInfoForm.setValue({
      name: 'Jane Doe',
      email: 'jane@example.com',
      phoneNumber: '0987654321',
    });
    component.employmentForm.setValue({
      department: 'HR',
      role: 'Hr',
      startDate: '2025-06-01',
    });
    component.checklistData = {
      checklists: {
        common: ['c1'],
        designer: ['d1'],
        developer: ['dev1'],
        hr: ['hr1'],
      },
    };

    (localStorageServiceMock.retrieve as jest.Mock).mockImplementation(
      (key: string) => {
        if (key === constants.LOCAL_STORAGE_KEY_ONBOARDING) {
          return {};
        }
        if (key === constants.LOCAL_STORAGE_KEY_CHECKLIST) {
          return component.checklistData;
        }
        return null;
      }
    );

    component.storeOnboardingStatus();
    const expectedChecklist = {
      'jane@example.com': {
        c1: false,
        hr1: false,
      },
    };
    expect(localStorageServiceMock.save).toHaveBeenCalledWith(
      constants.LOCAL_STORAGE_KEY_ONBOARDING,
      expectedChecklist
    );
  });

  test('storeOnboardingStatus should not overwrite an existing record', () => {
    component.basicInfoForm.setValue({
      name: 'Jane Doe',
      email: 'jane2@example.com',
      phoneNumber: '0987654321',
    });
    component.employmentForm.setValue({
      department: 'HR',
      role: 'Hr',
      startDate: '2025-06-01',
    });

    (localStorageServiceMock.retrieve as jest.Mock).mockImplementation(
      (key: string) => {
        if (key === constants.LOCAL_STORAGE_KEY_ONBOARDING) {
          return { 'jane2@example.com': { hr1: false } };
        }
        if (key === constants.LOCAL_STORAGE_KEY_CHECKLIST) {
          return {
            checklists: {
              common: ['c1'],
              designer: ['d1'],
              developer: ['dev1'],
              hr: ['hr1'],
            },
          };
        }
        return null;
      }
    );
    (localStorageServiceMock.save as jest.Mock).mockClear();
    component.storeOnboardingStatus();
    expect(localStorageServiceMock.save).not.toHaveBeenCalled();
  });

  test('transformChecklist should convert an array of items into an object with false flags', () => {
    const input = ['item1', 'item2'];
    const result = component.transformChecklist(input);
    expect(result).toEqual({ item1: false, item2: false });
  });
});
