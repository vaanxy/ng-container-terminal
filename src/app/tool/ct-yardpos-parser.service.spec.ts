import { TestBed, inject } from '@angular/core/testing';

import { CtYardposParserService } from './ct-yardpos-parser.service';

describe('CtYardposParserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CtYardposParserService]
    });
  });

  it('should be created', inject([CtYardposParserService], (service: CtYardposParserService) => {
    expect(service).toBeTruthy();
  }));
});
