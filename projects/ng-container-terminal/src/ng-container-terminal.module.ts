import { NgModule } from '@angular/core';

import { CtYardModule } from './ct-yard/ct-yard.module';
import { NgContainerTerminalComponent } from './ng-container-terminal.component';

@NgModule({
  declarations: [NgContainerTerminalComponent],
  imports: [CtYardModule],
  exports: [CtYardModule, NgContainerTerminalComponent]
})
export class NgContainerTerminalModule {}
