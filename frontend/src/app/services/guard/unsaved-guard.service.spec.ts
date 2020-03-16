import { TestBed } from '@angular/core/testing';

import { UnsavedGuard } from './unsaved.guard';

describe('UnsavedGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UnsavedGuard = TestBed.get(UnsavedGuard);
    expect(service).toBeTruthy();
  });
});
