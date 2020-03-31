import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CtMockService } from 'ng-container-terminal/mock';
import { VESCELL_PARSER_CONFIG, YARDPOS_PARSER_CONFIG } from 'ng-container-terminal/tool';
import { CtVesselBayModule } from 'ng-container-terminal/vessel-bay';
import { CtYardModule } from 'ng-container-terminal/yard';
import { CtYardBayModule } from 'ng-container-terminal/yard-bay';
import { CtYardOverviewModule } from 'ng-container-terminal/yard-overview';

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
    {
      provide: VESCELL_PARSER_CONFIG,
      useValue: { pattern: 'BBBBLLCC' }
    },
    {
      provide: YARDPOS_PARSER_CONFIG,
      useValue: { pattern: 'QQQWWWPPCC' }
    }
    //
    // [
    //   CtVescellParserService,
    //   {
    //     provide: VESCELL_PARSER_CONFIG,
    //     useValue: { pattern: 'BBBBLLCC' }
    //   }
    // ]
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
