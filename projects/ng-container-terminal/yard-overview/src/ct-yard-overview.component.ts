import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import * as d3 from 'd3';
import { RenderOptions, YardInfo } from 'ng-container-terminal/core';

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
    fill: yardInfo => {
      return d3.interpolateSpectral(yardInfo.x / 3000 + yardInfo.y / 3000);
    },
    scaleFactor: 1,
    stroke: 'rgba(0, 0, 0)',
    strokeWidth: 2,
    text: yardInfo => yardInfo.block + '-' + yardInfo.direction
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

  @Output() yardContentRender: EventEmitter<{
    node: d3.Selection<any, any, any, any>;
    data: YardInfo<T>;
  }> = new EventEmitter();

  constructor(private el: ElementRef) {
    this.host = d3.select(this.el.nativeElement);
  }

  ngOnInit() {
    this.initYardOverview();
  }

  ngOnChanges() {
    if (!this.svgCtx) {
      this.initYardOverview();
    } else {
      this.redraw();
    }
  }

  initYardOverview() {
    this.ctxWidth = Math.max(...this.yardInfoList.map(d => d.x + d.width + 16), 0);
    this.ctxHeight = Math.max(...this.yardInfoList.map(d => d.y + d.height + 16), 0);

    this.host
      .select('svg')
      .selectAll('g.ct-yard-overview-group')
      .remove();
    this.svgCtx = this.host
      .select('svg')
      .attr('width', this.ctxWidth * this.renderOptions.scaleFactor + 'px')
      .attr('height', this.ctxHeight * this.renderOptions.scaleFactor + 'px');

    this.yardOverviewGroup = this.svgCtx
      .append('g')
      .attr('class', 'ct-yard-overview-group')
      .attr('transform', `scale(${this.renderOptions.scaleFactor})`)
      .attr('width', '100%')
      .attr('height', '100%');
    this.redraw();
  }

  scaleYardOverview() {
    this.svgCtx = this.host
      .select('svg')
      .attr('width', this.ctxWidth * this.renderOptions.scaleFactor + 'px')
      .attr('height', this.ctxHeight * this.renderOptions.scaleFactor + 'px');
    this.yardOverviewGroup
      .attr('transform', `scale(${this.renderOptions.scaleFactor})`)
      .attr('width', '100%')
      .attr('height', '100%');
  }

  redraw() {
    this.ctxWidth = Math.max(...this.yardInfoList.map(d => d.x + d.width + 16), 0);
    this.ctxHeight = Math.max(...this.yardInfoList.map(d => d.y + d.height + 16), 0);

    this.svgCtx
      .transition()
      .duration(500)
      .attr('width', this.ctxWidth * this.renderOptions.scaleFactor + 'px')
      .attr('height', this.ctxHeight * this.renderOptions.scaleFactor + 'px');

    this.yardOverviewGroup
      .transition()
      .duration(500)
      .attr('transform', `scale(${this.renderOptions.scaleFactor})`);

    const allYards = this.yardOverviewGroup.selectAll('g.yard-group').data(this.yardInfoList);

    // overview
    //   .selectAll('rect.yard-rect')
    //   .transition()
    //   .attr('fill', (yardInfo: YardInfo<T>) => this.draw('fill', yardInfo));

    const enterYards = allYards.enter();
    const updateYards = allYards;
    const exitYards = allYards.exit();

    const yardGroup = enterYards
      .append('g')
      .attr('class', 'yard-group')
      .attr('transform', data => {
        const x = data.x;
        const y = this.ctxHeight - data.y - data.height;
        return `translate(${x}, ${y})`;
      })
      .on('mouseover', (data, i, nodes) => {
        d3.select(nodes[i])
          .select('rect')
          .attr('fill', 'grey');
      })
      .on('mouseleave', (data, i, nodes) => {
        d3.select(nodes[i])
          .select('rect')
          .attr('fill', (yardInfo: YardInfo<T>) => this.draw('fill', yardInfo));
      })
      .on('click', yardInfo => {
        this.yardClick.emit(yardInfo);
      });

    yardGroup
      .append('rect')
      .attr('class', 'yard-rect')
      .attr('width', data => data.width)
      .attr('height', data => data.height)
      .attr('fill', (yardInfo: YardInfo<T>) => this.draw('fill', yardInfo))
      .attr('stroke', (yardInfo: YardInfo<T>) => this.draw('stroke', yardInfo))
      .attr('stroke-width', (yardInfo: YardInfo<T>) => this.draw('strokeWidth', yardInfo) + 'px');
    yardGroup.each((data, nodeIdx, nodes) => {
      this.yardContentRender.next({
        node: d3.select(nodes[nodeIdx]),
        data: data
      });
    });

    yardGroup
      .append('text')
      .attr('font-size', '12')
      .attr('text-anchor', 'middle')
      .text((yardInfo: YardInfo<any>) => this.draw('text', yardInfo));

    updateYards
      .transition()
      .duration(500)
      .attr('transform', (data: YardInfo<T>) => {
        const x = data.x;
        const y = this.ctxHeight - data.y - data.height;
        console.log(this.ctxHeight);
        return `translate(${x}, ${y})`;
      });
    // .on('mouseover', (data, i, nodes) => {
    //   d3.select(nodes[i])
    //     .select('rect')
    //     .attr('fill', 'grey');
    // })
    // .on('mouseleave', (data, i, nodes) => {
    //   d3.select(nodes[i])
    //     .select('rect')
    //     .attr('fill', (yardInfo: YardInfo<T>) => this.draw('fill', yardInfo));
    // })
    // .on('click', (data: YardInfo<T>) => {
    //   this.yardClick.emit(data);
    // });

    updateYards
      .selectAll('rect.yard-rect')
      .transition()
      .duration(500)
      .attr('width', (yardInfo: YardInfo<T>) => yardInfo.width)
      .attr('height', (yardInfo: YardInfo<T>) => yardInfo.height)
      .attr('fill', (yardInfo: YardInfo<T>) => this.draw('fill', yardInfo))
      .attr('stroke', (yardInfo: YardInfo<T>) => this.draw('stroke', yardInfo))
      .attr('stroke-width', (yardInfo: YardInfo<T>) => this.draw('strokeWidth', yardInfo) + 'px')
      .each((yardInfo: YardInfo<T>, nodeIdx, nodes) => {
        this.yardContentRender.next({
          node: d3.select(nodes[nodeIdx]),
          data: yardInfo
        });
      });

    updateYards.selectAll('text').text((yardInfo: YardInfo<any>) => this.draw('text', yardInfo));

    exitYards
      .attr('opacity', 1)
      .transition()
      .duration(500)
      .attr('opacity', 0)
      .remove();
  }

  private draw(which: string, yardInfo: YardInfo<T>) {
    if (this.renderOptions[which]) {
      switch (typeof this.renderOptions[which]) {
        case 'string':
          return this.renderOptions[which];
        case 'number':
          return `${this.renderOptions[which]}`;
        default:
          return this.renderOptions[which](yardInfo);
      }
    } else {
      return null;
    }
  }
}
