import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
    CtVesselModule,
    CtYardModule,
    CtYardBayModule,
    CtVesselBayModule,
    CtYardOverviewModule
  ],
  providers: [CtMockService],
  bootstrap: [AppComponent]
})
export class AppModule {}
