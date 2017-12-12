import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CtYardComponent } from './ct-yard/ct-yard.component';
import { CtYardposParserService, YARDPOS_PARSER_CONFIG } from '../tool';

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
