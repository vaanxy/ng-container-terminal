import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CtYardOverviewComponent } from './ct-yard-overview.component';

@NgModule({
  imports: [CommonModule],
  declarations: [CtYardOverviewComponent],
  exports: [CtYardOverviewComponent]
})
export class CtYardOverviewModule {}
