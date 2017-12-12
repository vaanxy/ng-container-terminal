import { TestBed, inject } from '@angular/core/testing';

import { CtVescellParserService } from './ct-vescell-parser.service';

describe('CtVescellParserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CtVescellParserService]
    });
  });

  it('should be created', inject([CtVescellParserService], (service: CtVescellParserService) => {
    expect(service).toBeTruthy();
  }));
});
