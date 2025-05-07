import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProfileComponent } from './view-profile.component';
import { LocalStorageService } from '../../services/local-storage.service';
import { constants } from '../../environments/constants';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('ViewProfileComponent', () => {
  let component: ViewProfileComponent;
  let fixture: ComponentFixture<ViewProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewProfileComponent],
      providers: [
        {
          provide: LocalStorageService,
          useValue: {
            retrieve: jest
              .fn()
              .mockReturnValue(constants.LOCAL_STORAGE_KEY_ADMIN),
          },
        },
        { provide: MatSnackBar, useValue: { open: jest.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
