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
import { YardModule } from './yard/yard.module';
import { CtVesselService } from './ct-vessel/ct-vessel.service';

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
    PcNetworkModule,
    StorageAiDesignToolModule,
    YardModule
  ],
  providers: [ CtVesselService, StorageAiDesignToolService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
