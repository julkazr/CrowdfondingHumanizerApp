import { TestBed, async, inject } from '@angular/core/testing';

import { AdminUserGuard } from './admin-user.guard';

describe('AdminUserGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminUserGuard]
    });
  });

  it('should ...', inject([AdminUserGuard], (guard: AdminUserGuard) => {
    expect(guard).toBeTruthy();
  }));
});
