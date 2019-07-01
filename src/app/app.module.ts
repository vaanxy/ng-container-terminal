import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CtMockService } from 'projects/ng-container-terminal/mock/src/public_api';
import {
  CtVescellParserService,
  CtVesselBayModule,
  CtYardBayModule,
  CtYardModule,
  CtYardOverviewModule,
  VESCELL_PARSER_CONFIG,
} from 'projects/ng-container-terminal/src/public_api';

import { AppComponent } from './app.component';

// import { CtMockService } from 'ng-container-terminal/mock';
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
