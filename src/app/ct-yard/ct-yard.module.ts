import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CtYardComponent } from './ct-yard/ct-yard.component';
import { CtYardposParserService } from '../tool/ct-yardpos-parser.service';
import { YARDPOS_PARSER_CONFIG } from '../tool/model/yardpos-parser-config';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [CtYardComponent],
  exports: [CtYardComponent],
  providers:[
    [CtYardposParserService, {
      provide: YARDPOS_PARSER_CONFIG, useValue: {pattern: 'QQQWWWPPCC'}
    }],
  ]
})
export class CtYardModule { }
