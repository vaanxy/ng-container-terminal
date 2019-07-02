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
  VESCELL_PARSER_CONFIG,
} from 'ng-container-terminal';
import { CtMockService } from 'ng-container-terminal/mock';

import { AppComponent } from './app.component';

// import {
//   CtVescellParserService,
//   CtVesselBayModule,
//   CtYardBayModule,
//   CtYardModule,
//   CtYardOverviewModule,
//   VESCELL_PARSER_CONFIG,
// } from 'projects/ng-container-terminal/src/public_api';

// import { CtMockService } from 'projects/ng-container-terminal/mock/src/public_api';
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
    ]
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
