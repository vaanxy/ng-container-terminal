import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CtVescellParserService } from '../tool/ct-vescell-parser.service';
import { VESCELL_PARSER_CONFIG } from '../tool/model/vescell-parser-config';
import { CtVesselBayComponent } from './ct-vessel-bay.component';

@NgModule({
  imports: [CommonModule],
  declarations: [CtVesselBayComponent],
  exports: [CtVesselBayComponent],
  providers: [
    [
      CtVescellParserService,
      {
        provide: VESCELL_PARSER_CONFIG,
        useValue: { pattern: 'BBBBLLCC' }
      }
    ]
  ]
})
export class CtVesselBayModule {}
