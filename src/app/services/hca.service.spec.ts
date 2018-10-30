import { TestBed, inject } from '@angular/core/testing';

import { HcaService } from './hca.service';

describe('HcaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HcaService]
    });
  });

  it('should be created', inject([HcaService], (service: HcaService) => {
    expect(service).toBeTruthy();
  }));
});
