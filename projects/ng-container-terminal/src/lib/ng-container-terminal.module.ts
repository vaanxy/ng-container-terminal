import { NgModule } from '@angular/core';
import { NgContainerTerminalComponent } from './ng-container-terminal.component';
import { CtYardModule } from './ct-yard/ct-yard.module';

@NgModule({
  declarations: [NgContainerTerminalComponent],
  imports: [CtYardModule],
  exports: [CtYardModule, NgContainerTerminalComponent]
})
export class NgContainerTerminalModule {}
