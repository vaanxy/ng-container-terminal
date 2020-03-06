import { TestBed, inject } from '@angular/core/testing';

import { CtYardposParserService } from './ct-yardpos-parser.service';
import { YARDPOS_PARSER_CONFIG } from './model/yardpos-parser-config';

describe('CtYardposParserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CtYardposParserService,
        {
          provide: YARDPOS_PARSER_CONFIG,
          useValue: { pattern: 'QQQWWWPPCC' }
        }
      ]
    });
  });

  it('should be created', inject(
    [CtYardposParserService],
    (service: CtYardposParserService) => {
      expect(service).toBeTruthy();
    }
  ));
});
