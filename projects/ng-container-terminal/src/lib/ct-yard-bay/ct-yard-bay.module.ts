import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CtYardposParserService } from '../tool/ct-yardpos-parser.service';
import { YARDPOS_PARSER_CONFIG } from '../tool/model/yardpos-parser-config';
import { CtYardBayComponent } from './ct-yard-bay.component';

@NgModule({
  imports: [CommonModule],
  declarations: [CtYardBayComponent],
  exports: [CtYardBayComponent],
  providers: [
    [
      CtYardposParserService,
      {
        provide: YARDPOS_PARSER_CONFIG,
        useValue: { pattern: 'QQQWWWPPCC' }
      }
    ]
  ]
})
export class CtYardBayModule {}
