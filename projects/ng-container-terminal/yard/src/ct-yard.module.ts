import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CtYardComponent } from './ct-yard.component';

@NgModule({
  imports: [CommonModule],
  declarations: [CtYardComponent],
  exports: [CtYardComponent]
})
export class CtYardModule {}
