import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { AlertService } from '../../../services/alert.service';
import { AuthService } from '../../../services/auth.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { constants } from '../../../environments/constants';
import { MatDialogModule } from '@angular/material/dialog';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let alertServiceMock: Partial<AlertService>;
  let authServiceMock: Partial<AuthService>;
  let localStorageServiceMock: Partial<LocalStorageService>;

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
            // Return an object keyed by the test user email
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
      }) as unknown as <T>(key: string) => T | null,
      save: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [MatDialogModule],
      providers: [
        { provide: AlertService, useValue: alertServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: LocalStorageService, useValue: localStorageServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
