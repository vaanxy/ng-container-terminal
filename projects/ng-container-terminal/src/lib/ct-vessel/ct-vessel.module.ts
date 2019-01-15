import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BayComponent } from './bay/bay.component';
import { CtVesselComponent } from './ct-vessel.component';
import { CtVesselService } from './ct-vessel.service';

@NgModule({
  imports: [CommonModule],
  declarations: [BayComponent, CtVesselComponent],
  exports: [BayComponent, CtVesselComponent],
  providers: [CtVesselService]
})
export class CtVesselModule {}
