import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CtVescellParserService, VESCELL_PARSER_CONFIG } from 'ng-container-terminal';
import { CtMockService } from 'ng-container-terminal/mock';
import {
  CtVesselBayModule,
  CtVesselModule,
  CtYardBayModule,
  CtYardModule,
  CtYardOverviewModule,
} from 'projects/ng-container-terminal/src/public_api';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CtVesselModule,
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
    ]
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
