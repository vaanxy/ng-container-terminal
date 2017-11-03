import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PcNetworkComponent } from './pc-network.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ PcNetworkComponent ],
  exports: [ PcNetworkComponent ]
})
export class PcNetworkModule { }
