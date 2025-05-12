import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertService } from './alert.service';

describe('AlertService', () => {
  let service: AlertService;
  let snackBarSpy: { open: jest.Mock };

  beforeEach(() => {
    snackBarSpy = {
      open: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        AlertService,
        { provide: MatSnackBar, useValue: snackBarSpy },
      ],
    });

    service = TestBed.inject(AlertService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('should call snackbar.open with success options', () => {
    const message = 'Success Message';
    service.success(message);
    expect(snackBarSpy.open).toHaveBeenCalledWith(message, 'X', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: 'snackbar-success',
      duration: 3000,
    });
  });

  test('should call snackbar.open with error options', () => {
    const message = 'Error Message';
    service.error(message);
    expect(snackBarSpy.open).toHaveBeenCalledWith(message, 'X', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: 'snackbar-danger',
      duration: 3000,
    });
  });

  test('should call snackbar.open with warning options', () => {
    const message = 'Warning Message';
    service.warning(message);
    expect(snackBarSpy.open).toHaveBeenCalledWith(message, 'X', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: 'snackbar-warning',
      duration: 3000,
    });
  });

  test('should call snackbar.open with information options', () => {
    const message = 'Information Message';
    service.information(message);
    expect(snackBarSpy.open).toHaveBeenCalledWith(message, 'X', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: 'snackbar-info',
      duration: 3000,
    });
  });
});
