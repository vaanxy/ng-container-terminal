import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YardComponent } from './yard.component';
import { YardBayComponent } from './yard-bay/yard-bay.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [YardBayComponent, YardComponent],
  exports: [YardBayComponent, YardComponent]
})
export class YardModule { }
