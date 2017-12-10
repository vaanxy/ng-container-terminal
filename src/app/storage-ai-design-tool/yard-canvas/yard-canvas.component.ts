import { Component, ElementRef, OnInit, EventEmitter, Output } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-yard-canvas',
  templateUrl: './yard-canvas.component.html',
  styleUrls: ['./yard-canvas.component.css'],
})
export class YardCanvasComponent implements OnInit {
  host: d3.Selection<any, any, any, any>;
  svg: d3.Selection<any, any, any, any>;
  yardCanvasGroup: d3.Selection<any, any, any, any>;
  yardData: YardInfo[] = []
  canvasWidth = 0;
  canvasHeight = 0;
  @Output() onYardClicked: EventEmitter<YardInfo> = new EventEmitter();

  constructor(private el: ElementRef) { }

  ngOnInit() {
    this.host = d3.select(this.el.nativeElement);


    d3.tsv('../assets/yard_info2.tsv', (data) => {

      this.yardData = data;
      // this.canvasWidth = Math.max(...this.yardData.map((d) => d.x3));
      // this.canvasHeight = Math.max(...this.yardData.map((d) => d.y3));
      this.canvasWidth = 1200;
      this.canvasHeight = 1800;

      this.svg = this.host.select('svg')
        .attr('width', this.canvasWidth + 'px')
        .attr('height', this.canvasHeight + 'px');
      this.yardCanvasGroup = this.svg.append('g')
        .attr('class', 'yard-canvas-group')
        .attr('transform', (data) => {
          return `scale(0.5)`;
        })

        .attr('width', '100%')
        .attr('height', '100%');
        this.updateYardCanvas();
      });
      



  }

  updateYardCanvas() {
    let yard = this.yardCanvasGroup
    .selectAll('g.yard')
    .data(this.yardData);

  yard.selectAll('rect')
  .transition()
  .attr('fill', (yard: YardInfo) => {
    return yard.fill ? yard.fill : 'burlywood';
  })

  let enteredYard = yard.enter();

  let g = enteredYard.append('g')
    .attr('class', 'yard')
    .attr('transform', (data) => {
      let x = data.x1;
      let y = this.canvasHeight - data.y1 - data.width;
      return `translate(${x}, ${y})`;
    });
  g.append('rect')
    .attr('width', (data) => data.length)
    .attr('height', (data) => data.width)
    .attr('fill', 'burlywood')
    .attr('stroke', 'rgb(0,0,0)')
    .attr('stroke-width', '2px')
    .on('click', (yardInfo) => {
      this.onYardClicked.emit(yardInfo);
    });


  g.append('text')
    .attr('font-size', '12')
    .attr('text-anchor', 'middle')
    .text((yardInfo: YardInfo) => yardInfo.block + '-' + yardInfo.direction);

  }

}

export interface YardInfo {
  block: string;
  direction: string;
  maxBay: number;
  maxRow: number;
  maxTier: number;
  isEmpty: boolean;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  x3: number;
  y3: number;
  x4: number;
  y4: number;
  width: number;
  length: number;
  fill?: string;

}
