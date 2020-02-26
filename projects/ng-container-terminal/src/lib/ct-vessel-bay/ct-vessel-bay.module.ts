import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CtVesselBayComponent } from './ct-vessel-bay.component';

@NgModule({
  imports: [CommonModule],
  declarations: [CtVesselBayComponent],
  exports: [CtVesselBayComponent]
})
export class CtVesselBayModule {}
