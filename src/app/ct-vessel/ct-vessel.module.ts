import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BayComponent } from './bay/bay.component';
import { BayListComponent } from './bay-list/bay-list.component';
import { CtVesselComponent } from './ct-vessel.component';
import { CtVesselService } from './ct-vessel.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ BayComponent, BayListComponent, CtVesselComponent ],
  exports: [ BayComponent, CtVesselComponent ],
  providers: [ ],
})
export class CtVesselModule { }
