import { StorageAiDesignToolModule } from './storage-ai-design-tool/storage-ai-design-tool.module';
import { StorageAiDesignToolService } from './storage-ai-design-tool/storage-ai-design-tool.service';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import { AppComponent } from './app.component';
import { CtVesselModule } from './ct-vessel/ct-vessel.module';
import { PcNetworkModule } from './pc-network/pc-network.module';
import { CtVesselService } from './ct-vessel/ct-vessel.service';
import { CtYardModule } from './ct-yard/ct-yard.module';
import { CtYardBayModule } from './ct-yard-bay/ct-yard-bay.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    CtVesselModule,
    CtYardModule,
    CtYardBayModule,
    PcNetworkModule,
    StorageAiDesignToolModule
  ],
  providers: [ CtVesselService, StorageAiDesignToolService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
