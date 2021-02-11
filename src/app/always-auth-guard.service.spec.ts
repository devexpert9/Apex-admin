import { TestBed } from '@angular/core/testing';

import { AlwaysAuthGuardService } from './always-auth-guard.service';

describe('AlwaysAuthGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AlwaysAuthGuardService = TestBed.get(AlwaysAuthGuardService);
    expect(service).toBeTruthy();
  });
});
