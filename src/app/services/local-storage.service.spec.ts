import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
  describe('When running in a browser environment', () => {
    let service: LocalStorageService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
      });
      service = TestBed.inject(LocalStorageService);
      localStorage.clear();
      sessionStorage.clear();
    });

    test('should be created', () => {
      expect(service).toBeTruthy();
    });

    test('save() should store value in localStorage', () => {
      const setItemSpy = jest
        .spyOn(Storage.prototype, 'setItem')
        .mockImplementation(() => {});
      const testKey = 'myKey';
      const testValue = { a: 1 };

      service.save(testKey, testValue);
      expect(setItemSpy).toHaveBeenCalledWith(
        testKey,
        JSON.stringify(testValue)
      );
      setItemSpy.mockRestore();
    });

    test('retrieve() should return parsed value from localStorage', () => {
      const testKey = 'myKey';
      const testValue = { a: 'value' };

      localStorage.setItem(testKey, JSON.stringify(testValue));
      const retrieved = service.retrieve<typeof testValue>(testKey);
      expect(retrieved).toEqual(testValue);
    });

    test('retrieve() should return null and log a warning if key not found', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const retrieved = service.retrieve('nonexistentKey');
      expect(retrieved).toBeNull();
      expect(warnSpy).toHaveBeenCalledWith(
        `No data found in localStorage for key "nonexistentKey"`
      );
      warnSpy.mockRestore();
    });

    test('retrieve() should return null and log an error on JSON parsing error', () => {
      const errorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const badKey = 'badKey';

      // Save an invalid JSON string deliberately.
      localStorage.setItem(badKey, 'not a json');
      const retrieved = service.retrieve(badKey);
      expect(retrieved).toBeNull();
      expect(errorSpy).toHaveBeenCalled();
      errorSpy.mockRestore();
    });

    test('saveToSessionStorage() should store session details in sessionStorage', () => {
      const setItemSpy = jest
        .spyOn(Storage.prototype, 'setItem')
        .mockImplementation(() => {});
      const email = 'user@example.com';
      const role = 'admin';

      service.saveToSessionStorage(email, role);
      expect(setItemSpy).toHaveBeenCalledTimes(1);

      // Extract the stored string, parse it, and check its properties.
      const savedString = setItemSpy.mock.calls[0][1];
      const savedData = JSON.parse(savedString);
      expect(savedData.email).toEqual(email);
      expect(savedData.role).toEqual(role);
      expect(savedData.loginTime).toBeTruthy();

      setItemSpy.mockRestore();
    });
  });

  describe('When not running in a browser environment', () => {
    let service: LocalStorageService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
      });
      service = TestBed.inject(LocalStorageService);
    });

    test('save() should do nothing when not in a browser', () => {
      const setItemSpy = jest
        .spyOn(Storage.prototype, 'setItem')
        .mockImplementation(() => {});
      service.save('key', { test: 'data' });
      expect(setItemSpy).not.toHaveBeenCalled();
      setItemSpy.mockRestore();
    });

    test('retrieve() should return null when not in a browser', () => {
      const result = service.retrieve('someKey');
      expect(result).toBeNull();
    });

    test('saveToSessionStorage() should log error and not call sessionStorage.setItem when not in a browser', () => {
      const setItemSpy = jest
        .spyOn(Storage.prototype, 'setItem')
        .mockImplementation(() => {});
      const errorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      service.saveToSessionStorage('user@example.com', 'admin');
      expect(setItemSpy).not.toHaveBeenCalled();
      expect(errorSpy).toHaveBeenCalledWith(
        'SessionStorage is not available in this environment.'
      );

      setItemSpy.mockRestore();
      errorSpy.mockRestore();
    });
  });
});
