import { TestBed, inject } from '@angular/core/testing';

import { DonationsService } from './donations.service';

describe('DonationsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DonationsService]
    });
  });

  it('should be created', inject([DonationsService], (service: DonationsService) => {
    expect(service).toBeTruthy();
  }));
});
