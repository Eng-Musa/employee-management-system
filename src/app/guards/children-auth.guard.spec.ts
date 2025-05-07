import { TestBed } from '@angular/core/testing';
import { CanActivateChildFn } from '@angular/router';

import { childrenAuthGuard } from './children-auth.guard';

describe('childrenAuthGuard', () => {
  const executeGuard: CanActivateChildFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => childrenAuthGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  test('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
