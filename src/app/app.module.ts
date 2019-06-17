import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CtVesselModule, CtYardBayModule, CtYardModule, CtYardOverviewModule } from 'ng-container-terminal';
import { CtMockService } from 'ng-container-terminal/mock';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CtVesselModule,
    CtYardModule,
    CtYardBayModule,
    CtYardOverviewModule
  ],
  providers: [CtMockService],
  bootstrap: [AppComponent]
})
export class AppModule {}
