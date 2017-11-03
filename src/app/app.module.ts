import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { CtVesselModule } from './ct-vessel/ct-vessel.module';
import { PcNetworkModule } from './pc-network/pc-network.module';
import { YardModule } from './yard/yard.module';
import { CtVesselService } from './ct-vessel/ct-vessel.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    CtVesselModule,
    PcNetworkModule,
    YardModule
  ],
  providers: [ CtVesselService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
