import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnInit, Output, OnChanges } from '@angular/core';
import * as d3 from 'd3';

import { YardInfo, RenderOptions } from '../../model';

@Component({
  selector: 'ct-yard-overview',
  templateUrl: './ct-yard-overview.component.html',
  styleUrls: ['./ct-yard-overview.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CtYardOverviewComponent<T> implements OnInit, OnChanges {
  private host: d3.Selection<any, any, any, any>;
  private svgCtx: d3.Selection<any, any, any, any>;
  private yardOverviewGroup: d3.Selection<any, any, any, any>;
  private ctxWidth = 0;
  private ctxHeight = 0;
  private defaultRenderOptions: RenderOptions<YardInfo<T>> = {
    fill: (yardInfo) => {
      return d3.interpolateSpectral(yardInfo.x / 3000 + yardInfo.y / 3000);
    },
    scaleFactor: 1,
  };

  private _renderOptions: RenderOptions<YardInfo<T>> = Object.assign({}, this.defaultRenderOptions);

  @Input() set renderOptions(options: RenderOptions<YardInfo<T>>) {
    if (options) {
      this._renderOptions = Object.assign({}, this.defaultRenderOptions, options);
    }
  }

  get renderOptions() {
    return this._renderOptions;
  }

  @Input() yardInfoList: YardInfo<T>[] = [];

  @Output() yardClick: EventEmitter<YardInfo<T>> = new EventEmitter();

  @Output() yardContentRender: EventEmitter<{node: d3.Selection<any, any, any, any>, data: YardInfo<T>}> = new EventEmitter();

  constructor(private el: ElementRef) {
    this.host = d3.select(this.el.nativeElement);
  }

  ngOnInit() {

  }

  ngOnChanges() {
    this.initYardOverview();
  }

  initYardOverview() {
    this.ctxWidth = Math.max(...this.yardInfoList.map((d) => d.x + d.width + 16), 0);
    this.ctxHeight = Math.max(...this.yardInfoList.map((d) => d.y + d.height + 16), 0);

    this.host.select('svg').selectAll('g.ct-yard-overview-group').remove();
    this.svgCtx = this.host.select('svg')
      .attr('width', this.ctxWidth * this.renderOptions.scaleFactor + 'px')
      .attr('height', this.ctxHeight * this.renderOptions.scaleFactor + 'px');

    this.yardOverviewGroup = this.svgCtx.append('g')
      .attr('class', 'ct-yard-overview-group')
      .attr('transform', `scale(${this.renderOptions.scaleFactor})`)
      .attr('width', '100%')
      .attr('height', '100%');
    this.redraw();
  }

  scaleYardOverview() {
    this.svgCtx = this.host.select('svg')
      .attr('width', this.ctxWidth * this.renderOptions.scaleFactor + 'px')
      .attr('height', this.ctxHeight * this.renderOptions.scaleFactor + 'px');
    this.yardOverviewGroup
      .attr('transform', `scale(${this.renderOptions.scaleFactor})`)
      .attr('width', '100%')
      .attr('height', '100%');
  }

  redraw() {
    const yard = this.yardOverviewGroup
      .selectAll('g.yard-group')
      .data(this.yardInfoList);

    yard.selectAll('rect.yard-rect')
      .transition()
      .attr('fill', (yardInfo: YardInfo<T>) => this.fill(yardInfo));

    const enteredYard = yard.enter();

    const yardGroup = enteredYard.append('g')
      .attr('class', 'yard-group')
      .attr('transform', (data) => {
        const x = data.x;
        const y = this.ctxHeight - data.y - data.height;
        return `translate(${x}, ${y})`;
      })
      .on('mouseover', (data, i, nodes) => {
        d3.select(nodes[i]).select('rect').attr('fill', 'grey');
      })
      .on('mouseleave', (data, i, nodes) => {
        d3.select(nodes[i]).select('rect')
        .attr('fill', (yardInfo: YardInfo<T>) => this.fill(yardInfo));
      })
      .on('click', (yardInfo) => {
        this.yardClick.emit(yardInfo);
      });

    yardGroup.append('rect')
      .attr('class', 'yard-rect')
      .attr('width', (data) => data.width)
      .attr('height', (data) => data.height)
      .attr('fill', (yardInfo: YardInfo<T>) => this.fill(yardInfo))
      .attr('stroke', 'rgb(0,0,0)')
      .attr('stroke-width', '2px');
      yardGroup.each((data, nodeIdx, nodes) => {
        this.yardContentRender.next({
          node: d3.select(nodes[nodeIdx]),
          data: data
        });
        // if (data.data instanceof Array && data.data.length > 0) {
        //   const pieceWidth = data.width / data.data.length;
        //   data.data.forEach((d, index) => {
        //     d3.select(nodes[nodeIdx])
        //     .append('rect')
        //     .attr('width', pieceWidth)
        //     .attr('height', data.height)
        //     .attr('stroke', 'rgb(0,0,0)')
        //     .attr('stroke-width', '2px')
        //     .attr('transform', `translate(${index * pieceWidth}, 0)`)
        //     .attr('fill', 'red');
        //   });
        // }


      });



    yardGroup.append('text')
      .attr('font-size', '12')
      .attr('text-anchor', 'middle')
      .text((yardInfo: YardInfo<any>) => yardInfo.block + '-' + yardInfo.direction);

  }

  private fill(yardInfo: YardInfo<T>) {
    if (typeof (this.renderOptions.fill) === 'string') {
      return this.renderOptions.fill;
    } else {
      return this.renderOptions.fill(yardInfo);
    }
  }

}
