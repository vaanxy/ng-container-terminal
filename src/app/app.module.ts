import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { CtVesselModule } from './ct-vessel/ct-vessel.module';
import { CtVesselService } from './ct-vessel/ct-vessel.service';
import { CtYardModule } from './ct-yard/ct-yard.module';
import { CtYardBayModule } from './ct-yard-bay/ct-yard-bay.module';
import { CtMockService } from '../../mock/ct-mock.service';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CtVesselModule,
    CtYardModule,
    CtYardBayModule
  ],
  providers: [ CtMockService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
