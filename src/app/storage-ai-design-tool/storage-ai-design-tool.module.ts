import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YardBayCanvasComponent } from './yard-bay-canvas/yard-bay-canvas.component';
import { YardCanvasComponent } from './yard-canvas/yard-canvas.component';
// import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [YardBayCanvasComponent, YardCanvasComponent],
  exports: [YardCanvasComponent]
})
export class StorageAiDesignToolModule { }
