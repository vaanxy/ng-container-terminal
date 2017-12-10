import { TestBed, inject } from '@angular/core/testing';

import { CtMockService } from './ct-mock.service';

describe('CtMockService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CtMockService]
    });
  });

  it('should be created', inject([CtMockService], (service: CtMockService) => {
    expect(service).toBeTruthy();
  }));
});
