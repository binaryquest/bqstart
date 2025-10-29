import { TestBed } from '@angular/core/testing';

import { BqStartPrimeService } from './bq-start-prime.service';

describe('BqStartPrimeService', () => {
  let service: BqStartPrimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BqStartPrimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
