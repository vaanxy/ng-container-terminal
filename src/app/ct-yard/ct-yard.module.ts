import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CtYardComponent } from './ct-yard/ct-yard.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [CtYardComponent],
  exports: [CtYardComponent]
})
export class CtYardModule { }
