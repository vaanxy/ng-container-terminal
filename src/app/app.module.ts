import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { CtVesselModule } from 'ng-container-terminal';

import { CtYardModule } from 'ng-container-terminal';
import { CtYardBayModule } from 'ng-container-terminal';
import { CtMockService } from 'ng-container-terminal/mock';
import { CtYardOverviewModule } from 'ng-container-terminal';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CtVesselModule,
    CtYardModule,
    CtYardBayModule,
    CtYardOverviewModule
  ],
  providers: [ CtMockService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
