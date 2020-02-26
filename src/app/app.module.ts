import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  CtVescellParserService,
  CtVesselBayModule,
  CtYardBayModule,
  CtYardModule,
  CtYardOverviewModule,
  CtYardposParserService,
  VESCELL_PARSER_CONFIG,
  YARDPOS_PARSER_CONFIG,
} from 'ng-container-terminal';
import { CtMockService } from 'ng-container-terminal/mock';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CtYardModule,
    CtYardBayModule,
    CtVesselBayModule,
    CtYardOverviewModule
  ],
  providers: [
    CtMockService,
    [
      CtVescellParserService,
      {
        provide: VESCELL_PARSER_CONFIG,
        useValue: { pattern: 'BBBBLLCC' }
      }
    ],
    [
      CtYardposParserService,
      {
        provide: YARDPOS_PARSER_CONFIG,
        useValue: { pattern: 'QQQWWWPPCC' }
      }
    ]
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
