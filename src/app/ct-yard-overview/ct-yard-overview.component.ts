import { Component, OnInit, Output, EventEmitter, ElementRef, Input } from '@angular/core';
import * as d3 from 'd3';
import { YardInfo } from '../model/yard-info';

@Component({
  selector: 'ct-yard-overview',
  templateUrl: './ct-yard-overview.component.html',
  styleUrls: ['./ct-yard-overview.component.css']
})
export class CtYardOverviewComponent implements OnInit {
  private host: d3.Selection<any, any, any, any>;
  private svg: d3.Selection<any, any, any, any>;
  private yardOverviewGroup: d3.Selection<any, any, any, any>;
  private canvasWidth = 0;
  private canvasHeight = 0;
  private _scaleFactor = 0.5;
  private _yardInfoList: YardInfo[] = [];
  @Input() set yardInfoList(yardInfoList: YardInfo[]) {
    this._yardInfoList = yardInfoList;
    this.initYardOverview();
  }

  get yardInfoList() {
    return this._yardInfoList;
  }

  @Input() set scaleFactor(factor: number) {
    this._scaleFactor = factor;
    this.scaleYardOverview();
  }

  get scaleFactor() {
    return this._scaleFactor;
  }

  @Output() onYardClicked: EventEmitter<YardInfo> = new EventEmitter();

  constructor(private el: ElementRef) {
    this.host = d3.select(this.el.nativeElement);
  }

  ngOnInit() {


    // d3.tsv('../assets/yard_info2.tsv', (data: any[]) => {
    //   const yardData = data.map(d => {
    //     return {
    //       block: d.BLOCK,
    //       direction: d.DIRECTION,
    //       maxBay: +d.MAX_BAY,
    //       maxRow: +d.MAX_ROW,
    //       maxTier: +d.MAX_TIER,
    //       isEmpty: null,
    //       x1: +d.BASEPOINTX,
    //       y1: +d.BASEPOINTY,
    //       width: +(d.ANGLE === '90' ? d.WIDTH : d.LENGTH),
    //       height: +(d.ANGLE === '90' ? d.LENGTH : d.WIDTH)
    //     }
    //   });
    //   this.yardInfoList = yardData;
    //   this.initYardOverview();
    // });
  }

  initYardOverview() {
    this.canvasWidth = Math.max(...this.yardInfoList.map((d) => d.x1 + d.width + 16));
    this.canvasHeight = Math.max(...this.yardInfoList.map((d) => d.y1 + d.height + 16));
    this.host.select('svg').selectAll('g.ct-yard-overview-group').remove();
    this.svg = this.host.select('svg')
      .attr('width', this.canvasWidth * this.scaleFactor + 'px')
      .attr('height', this.canvasHeight * this.scaleFactor + 'px');
    this.yardOverviewGroup = this.svg.append('g')
      .attr('class', 'ct-yard-overview-group')
      .attr('transform', `scale(${this.scaleFactor})`)
      .attr('width', '100%')
      .attr('height', '100%');
    this.redraw();
  }

  scaleYardOverview() {
    this.svg = this.host.select('svg')
      .attr('width', this.canvasWidth * this.scaleFactor + 'px')
      .attr('height', this.canvasHeight * this.scaleFactor + 'px');
    this.yardOverviewGroup
      .attr('transform', `scale(${this.scaleFactor})`)
      .attr('width', '100%')
      .attr('height', '100%');
  }

  redraw() {
    let yard = this.yardOverviewGroup
      .selectAll('g.yard')
      .data(this.yardInfoList);

    yard.selectAll('rect')
      .transition()
      .attr('fill', (yardInfo: YardInfo) => {
        return yardInfo.fill ? yardInfo.fill : 'burlywood';
      })

    let enteredYard = yard.enter();

    let g = enteredYard.append('g')
      .attr('class', 'yard')
      .attr('transform', (data) => {
        let x = data.x1;
        let y = this.canvasHeight - data.y1 - data.height;
        return `translate(${x}, ${y})`;
      })
      .on('mouseover', function (data, i, nodes) {
        d3.select(nodes[i]).select('rect').attr('fill', 'grey');
      })
      .on('mouseleave', (data, i, nodes) => {
        d3.select(nodes[i]).select('rect').attr('fill', (yardInfo: YardInfo) => {
          return yardInfo.fill ? yardInfo.fill : 'burlywood';
        });
      })
      .on('click', (yardInfo) => {
        this.onYardClicked.emit(yardInfo);
      });

    g.append('rect')
      .attr('width', (data) => data.width)
      .attr('height', (data) => data.height)
      .attr('fill', 'burlywood')
      .attr('stroke', 'rgb(0,0,0)')
      .attr('stroke-width', '2px');



    g.append('text')
      .attr('font-size', '12')
      .attr('text-anchor', 'middle')
      .text((yardInfo: YardInfo) => yardInfo.block + '-' + yardInfo.direction);

  }

}
