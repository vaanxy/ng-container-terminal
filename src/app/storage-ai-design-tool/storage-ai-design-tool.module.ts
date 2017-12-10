import { YardModule } from '../yard/yard.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YardBayCanvasComponent } from './yard-bay-canvas/yard-bay-canvas.component';
import { YardCanvasComponent } from './yard-canvas/yard-canvas.component';
import { YardDetailCanvasComponent } from './yard-detail-canvas/yard-detail-canvas.component';
// import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    // HttpClientModule,
    YardModule
  ],
  declarations: [YardBayCanvasComponent, YardCanvasComponent, YardDetailCanvasComponent],
  exports: [YardCanvasComponent, YardDetailCanvasComponent]
})
export class StorageAiDesignToolModule { }
