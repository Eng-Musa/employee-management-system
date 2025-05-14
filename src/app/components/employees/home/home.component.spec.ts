import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HomeComponent } from './home.component';
import { AlertService } from '../../../services/alert.service';
import { AuthService } from '../../../services/auth.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { constants } from '../../../environments/constants';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let alertServiceMock: Partial<AlertService>;
  let authServiceMock: Partial<AuthService>;
  let localStorageServiceMock: Partial<LocalStorageService>;
  let dialogMock: Partial<MatDialog>;

  beforeEach(async () => {
    alertServiceMock = {
      error: jest.fn(),
      success: jest.fn(),
    };
    authServiceMock = {
      getUserType: jest.fn().mockReturnValue('Developer'),
      getLoggedInEmail: jest.fn().mockReturnValue('test@example.com'),
    };
    localStorageServiceMock = {
      retrieve: jest.fn((key: string) => {
        switch (key) {
          case constants.LOCAL_STORAGE_KEY_CHECKLIST:
            return {
              checklists: {
                common: ['item1'],
                developer: ['item2'],
                designer: [],
                hr: [],
              },
            };
          case constants.LOCAL_STORAGE_KEY_ONBOARDING:
            return {
              'test@example.com': {
                item1: false,
                item2: false,
              },
            };
          case constants.LOCAL_STORAGE_KEY_EMPLOYEES:
            return [];
          default:
            return null;
        }
      }) as <T>(key: string) => T | null,
      save: jest.fn(),
    };
    dialogMock = {
      open: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [MatDialogModule],
      providers: [
        { provide: AlertService, useValue: alertServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { provide: MatDialog, useValue: dialogMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // triggers ngOnInit()
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should correctly determine user roles (Developer)', () => {
    expect(component.isDeveloper()).toBe(true);
    expect(component.isAdmin()).toBe(false);
    expect(component.isHr()).toBe(false);
    expect(component.isDesigner()).toBe(false);
  });

  test('transformChecklist should convert an item array to an object with false flags', () => {
    const input = ['itemA', 'itemB'];
    const result = component.transformChecklist(input);
    expect(result).toEqual({ itemA: false, itemB: false });
  });

  test('onSumit should update onboarding status and call success alert when onboardingStatus exists', () => {
    jest.useFakeTimers();
    component.loggedInUserEmail = 'test@example.com';
    component.onboardingStatus = { 'test@example.com': { task1: false } };

    const saveSpy = jest.spyOn(localStorageServiceMock, 'save');
    const successSpy = jest.spyOn(alertServiceMock, 'success');
    const errorSpy = jest.spyOn(alertServiceMock, 'error');

    component.onSumit('task1');
    expect(component.loading['task1']).toBe(true);

    jest.advanceTimersByTime(1000);

    expect(component.loading['task1']).toBe(false);
    expect(component.onboardingStatus['test@example.com']['task1']).toBe(true);
    expect(saveSpy).toHaveBeenCalledWith(
      constants.LOCAL_STORAGE_KEY_ONBOARDING,
      component.onboardingStatus
    );
    expect(successSpy).toHaveBeenCalledWith('task1 submitted successfully');
    expect(errorSpy).not.toHaveBeenCalled();
    jest.useRealTimers();
  });

  test('onSumit should call error alert if onboardingStatus for user is missing', () => {
    jest.useFakeTimers();
    component.loggedInUserEmail = 'test@example.com';
    component.onboardingStatus = {}; // No record for the user

    const errorSpy = jest.spyOn(alertServiceMock, 'error');

    component.onSumit('task1');
    jest.advanceTimersByTime(1000);

    expect(errorSpy).toHaveBeenCalledWith('Error occured while processing request.');
    jest.useRealTimers();
  });

  test('openSubmitDialog should call onSumit when dialog returns true', () => {
    const dialogRefSpy = {
      afterClosed: jest.fn().mockReturnValue(of(true)),
    };
    (dialogMock.open as jest.Mock).mockReturnValue(dialogRefSpy);
    const onSumitSpy = jest.spyOn(component, 'onSumit');

    component.openSubmitDialog('task1');

    expect(dialogMock.open).toHaveBeenCalled();
    expect(onSumitSpy).toHaveBeenCalledWith('task1');
  });

  test('getKeys should return the keys of the given object', () => {
    const result = component.getKeys({ a: false, b: true });
    expect(result).toEqual(['a', 'b']);
  });

  test('calculateCompletionPercentage should return 0 when no checklist exists', () => {
    component.loggedInUserEmail = 'test@example.com';
    component.onboardingStatus = {};
    expect(component.calculateCompletionPercentage()).toBe(0);
  });

  test('calculateCompletionPercentage should return correct percentage based on completed items', () => {
    component.loggedInUserEmail = 'test@example.com';
    component.onboardingStatus = { 'test@example.com': { task1: true, task2: false, task3: true } };
    expect(component.calculateCompletionPercentage()).toBe(67);
  });

  test('updateOverallOnboardingStatus should update employee status when completion is 100', () => {
    component.loggedInUserEmail = 'test@example.com';
    component.onboardingStatus = { 'test@example.com': { task1: true, task2: true } };

    const employees = [{ email: 'test@example.com', status: 'Pending' }];
    (localStorageServiceMock.retrieve as jest.Mock).mockImplementation((key: string) => {
      if (key === constants.LOCAL_STORAGE_KEY_EMPLOYEES) {
        return employees;
      }
      return null;
    });

    component.updateOverallOnboardingStatus();

    expect(employees[0].status).toBe('Created');
    expect(localStorageServiceMock.save).toHaveBeenCalledWith(
      constants.LOCAL_STORAGE_KEY_EMPLOYEES,
      employees
    );
  });

  test('updateOverallOnboardingStatus should alert error when no employees found', () => {
    component.loggedInUserEmail = 'test@example.com';
    component.onboardingStatus = { 'test@example.com': { task1: true, task2: true } };

    (localStorageServiceMock.retrieve as jest.Mock).mockImplementation((key: string) => {
      if (key === constants.LOCAL_STORAGE_KEY_EMPLOYEES) {
        return null;
      }
      return null;
    });

    const errorSpy = jest.spyOn(alertServiceMock, 'error');
    component.updateOverallOnboardingStatus();
    expect(errorSpy).toHaveBeenCalledWith('No employees found');
  });

  test('storeOnboardingStatus should store new record when none exists for user', () => {
    component.loggedInUserEmail = 'test@example.com';
    component.checklistData = {
      checklists: {
        common: ['item1'],
        developer: ['item2'],
        designer: [],
        hr: [],
      },
    };

    (localStorageServiceMock.retrieve as jest.Mock).mockImplementation((key: string) => {
      if (key === constants.LOCAL_STORAGE_KEY_ONBOARDING) {
        return {};
      }
      if (key === constants.LOCAL_STORAGE_KEY_CHECKLIST) {
        return component.checklistData;
      }
      return null;
    });

    component.storeOnboardingStatus();

    const expectedChecklist = {
      'test@example.com': {
        item1: false,
        item2: false,
      },
    };
    expect(localStorageServiceMock.save).toHaveBeenCalledWith(
      constants.LOCAL_STORAGE_KEY_ONBOARDING,
      expectedChecklist
    );
  });

  test('loadOnboardingStatus should update onboardingStatus if data exists', () => {
    const onboardingData = { 'test@example.com': { task1: true } };
    (localStorageServiceMock.retrieve as jest.Mock).mockImplementation((key: string) => {
      if (key === constants.LOCAL_STORAGE_KEY_ONBOARDING) {
        return onboardingData;
      }
      return null;
    });

    component.loadOnboardingStatus();
    expect(component.onboardingStatus).toEqual(onboardingData);
  });

  test('loadOnboardingStatus should alert error when no data fetched', () => {
    (localStorageServiceMock.retrieve as jest.Mock).mockImplementation((key: string) => {
      if (key === constants.LOCAL_STORAGE_KEY_ONBOARDING) {
        return null;
      }
      return null;
    });
    const errorSpy = jest.spyOn(alertServiceMock, 'error');
    component.loadOnboardingStatus();
    expect(errorSpy).toHaveBeenCalledWith('Error occured while fetching onboarding status');
  });
});
