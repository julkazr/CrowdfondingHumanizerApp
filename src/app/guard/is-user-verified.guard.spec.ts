import { TestBed, async, inject } from '@angular/core/testing';

import { IsUserVerifiedGuard } from './is-user-verified.guard';

describe('IsUserVerifiedGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IsUserVerifiedGuard]
    });
  });

  it('should ...', inject([IsUserVerifiedGuard], (guard: IsUserVerifiedGuard) => {
    expect(guard).toBeTruthy();
  }));
});
