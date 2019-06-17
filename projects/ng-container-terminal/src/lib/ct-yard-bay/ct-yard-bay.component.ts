import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';

import { RenderOptions } from '../../model/render-options';
import { YardBay } from '../../model/yard-bay';
import { Yardpos } from '../../model/yardpos';
import { CtYardposParserService } from '../tool/ct-yardpos-parser.service';

// import { YardposInfo } from '../../model/yardpos-info';
@Component({
  selector: 'ct-yard-bay',
  templateUrl: './ct-yard-bay.component.html',
  styleUrls: ['./ct-yard-bay.component.css']
})
export class CtYardBayComponent<T> implements OnInit, OnChanges {
  host: d3.Selection<any, any, any, any>;
  svg: d3.Selection<any, any, any, any>;
  yardBayGroup: d3.Selection<any, any, any, any>;
  yardBayRowLabelGroup: d3.Selection<any, any, any, any>;
  yardBayTierLabelGroup: d3.Selection<any, any, any, any>;
  yardBayNameLabelGroup: d3.Selection<any, any, any, any>;
  yardposInfoGroup: d3.Selection<any, any, any, any>;

  poses: Yardpos<T>[] = [];
  padding = 16;
  private _yardBay: YardBay<T>;
  private _renderOptions: RenderOptions<Yardpos<T>>;
  private _size = { row: 6, tier: 5 };
  displaySize = { row: 6, tier: 5 };
  @Input() set size(s) {
    this._size = { row: 6, tier: 5 };
    this.updateYardposInfo();
    // this.resize();
  }
  get size() {
    return this._size;
  }
  @Input() set renderOptions(options: RenderOptions<Yardpos<T>>) {
    this._renderOptions = options;
    this.renderLayout();
    this.updateYardposInfo();
    // setTimeout(() => {
    //   this.renderLayout();
    //   this.updateYardposInfo();
    // }, 0);
  }

  get renderOptions() {
    return this._renderOptions;
  }

  @Input() cellSize = 16;

  @Input() set yardBay(yardBay: YardBay<T>) {
    this._yardBay = yardBay;
    this.updateYardposInfo();
  }

  get yardBay() {
    return this._yardBay;
  }

  @Output() yardposClick: EventEmitter<Yardpos<T>> = new EventEmitter();

  constructor(
    private el: ElementRef,
    private yardposParser: CtYardposParserService
  ) {}

  ngOnInit() {
    // if (this.yardBay.dataUpdated) {
    //   this.yardBay.dataUpdated.subscribe(() => {
    //     this.updateYardposInfo();
    //   });
    // }
    this.host = d3.select(this.el.nativeElement);
    this.svg = this.host
      .select('svg')
      .attr(
        'width',
        (this.displaySize.row + 1) * this.cellSize + 2 * this.padding
      )
      .attr(
        'height',
        (this.displaySize.tier + 1) * this.cellSize + 2 * this.padding
      );
    this.yardBayGroup = this.svg.append('g').attr('class', 'yard-bay-group');
    this.yardposInfoGroup = this.svg
      .append('g')
      .attr('class', 'yard-pos-info-group');
    this.renderLayout();
    this.updateYardposInfo();
  }

  generatePoses() {
    const posMap = {};
    this.yardBay.poses.forEach(p => {
      posMap[p.name] = p;
    });
    const poses: Yardpos<T>[] = [];
    for (let row = 1; row <= this.displaySize.row; row++) {
      for (let tier = 1; tier <= this.displaySize.tier; tier++) {
        const posName =
          this.yardBay.name +
          this.yardposParser.formatP(row) +
          this.yardposParser.formatC(tier);
        if (posMap[posName]) {
          poses.push(posMap[posName]);
        } else {
          poses.push({
            name:
              this.yardBay.name +
              this.yardposParser.formatP(row) +
              this.yardposParser.formatC(tier),
            data: null
          });
        }
      }
    }

    this.poses = poses;
  }

  resize() {
    let maxRow: number,
      maxTier = 0;
    this.yardBay.poses.forEach(pos => {
      const row = +this.yardposParser.getP(pos.name);
      const tier = +this.yardposParser.getC(pos.name);
      if (row > maxRow) {
        maxRow = row;
      }
      if (tier > maxTier) {
        maxTier = tier;
      }
    });
    this.displaySize = {
      row: Math.max(this.displaySize.row, maxRow),
      tier: Math.max(this.displaySize.tier, maxTier)
    };
    // this.yardBay.poses.;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['yardBay']) {
      setTimeout(() => {
        console.log(this.yardBay);
        this.host = d3.select(this.el.nativeElement);
        this.svg = this.host
          .select('svg')
          .attr(
            'width',
            (this.displaySize.row + 1) * this.cellSize + 2 * this.padding
          )
          .attr(
            'height',
            (this.displaySize.tier + 1) * this.cellSize + 2 * this.padding
          );
        this.renderLayout();
        this.updateYardposInfo();
      }, 0);
    }
  }

  /**
   * 绘制贝位结构
   */
  renderLayout() {
    // 绘制层标签
    this.svg.selectAll('g.yard-bay-tier-label-group').remove();
    this.yardBayTierLabelGroup = this.svg
      .append('g')
      .attr('class', 'yard-bay-tier-label-group');
    this.yardBayTierLabelGroup
      .selectAll('text')
      .data(d3.range(1, this.displaySize.row + 1))
      .enter()
      .append('text')
      .attr('width', this.cellSize)
      .attr('height', this.cellSize)
      .attr('transform', label => {
        const x = 0;
        const y = (this.displaySize.tier - label) * this.cellSize;
        return `translate(${x}, ${y})`;
      })
      .attr('font-size', '12')
      .attr('text-anchor', 'middle')
      .attr('dx', (this.cellSize / 3) * 2)
      .attr('dy', (this.cellSize / 3) * 2)
      .text(c => c);

    // 绘制列标签
    this.svg.selectAll('g.yard-bay-row-label-group').remove();
    this.yardBayRowLabelGroup = this.svg
      .append('g')
      .attr('class', 'yard-bay-row-label-group');
    this.yardBayRowLabelGroup
      .selectAll('text')
      .data(d3.range(1, this.displaySize.row + 1))
      .enter()
      .append('text')
      .attr('width', this.cellSize)
      .attr('height', this.cellSize)
      .attr('transform', label => {
        const x = label * this.cellSize;
        const y = this.displaySize.tier * this.cellSize;
        return `translate(${x}, ${y})`;
      })
      .attr('font-size', '12')
      .attr('text-anchor', 'middle')
      .attr('dx', this.cellSize / 2)
      .attr('dy', this.cellSize / 2)
      .text(c => c);

    // 绘制区位号标签
    this.svg.selectAll('g.yard-bay-name-label-group').remove();
    this.yardBayNameLabelGroup = this.svg
      .append('g')
      .attr('class', 'yard-bay-name-label-group');
    this.yardBayNameLabelGroup
      .append('text')
      .attr('transform', label => {
        const x = ((this.displaySize.row + 1) / 2.0) * this.cellSize;
        const y = (this.displaySize.tier + 1) * this.cellSize;
        return `translate(${x}, ${y})`;
      })
      .attr('font-size', '16')
      .attr('text-anchor', 'middle')
      .attr('dx', this.cellSize / 2)
      .attr('dy', this.cellSize / 2)
      .text(this.yardBay.name);
  }

  updateYardposInfo() {
    console.log('updating....');
    this.generatePoses();
    if (!this.yardposInfoGroup) {
      return;
    }

    const cell = this.yardposInfoGroup
      .selectAll('g.yard-pos-info')
      .data(this.poses, (pos: Yardpos<T>, idx) => JSON.stringify(pos));

    // 更新
    cell
      .selectAll('path')
      .transition()
      .attr('fill', (pos: Yardpos<T>) => this._fillFunction(pos));

    // cell
    //   .selectAll('text')
    //   .text((posInfo: Yardpos<T>) => (posInfo.text ? posInfo.text : ''));

    // 新增
    const enteredCell = cell.enter();
    this.renderYardposInfo(enteredCell);

    // 删除
    cell
      .exit()
      .transition()
      .attr('transform', (pos: Yardpos<T>) => {
        const x =
          parseInt(this.yardposParser.getP(pos.name), 10) * this.cellSize;
        // return `translate(${x}, -${this.cellSize})`;
        return `scale(0,0)`;
      })
      .remove();
  }

  renderYardposInfo(selection: d3.Selection<any, any, any, any>) {
    const g = selection
      .append('g')
      .style('cursor', 'pointer')
      .attr('class', 'yard-pos-info')
      .attr('transform', (pos: Yardpos<T>) => {
        const x =
          parseInt(this.yardposParser.getP(pos.name), 10) * this.cellSize;
        const y =
          (this.displaySize.tier - +this.yardposParser.getC(pos.name)) *
          this.cellSize;
        return `translate(${x}, -${y + this.cellSize})`;
      })
      .on('mouseover', function(data, i, nodes) {
        d3.select(nodes[i])
          .select('path')
          .attr('fill', 'grey');
      })
      .on('mouseleave', (data, i, nodes) => {
        d3.select(nodes[i])
          .select('path')
          .attr('fill', d => this._fillFunction(data));
      })
      .on('click', (posInfo: Yardpos<T>, index: number) => {
        this.yardposClick.emit(posInfo);
      });

    g.append('path')
      .attr('d', (pos: Yardpos<T>) => {
        // 基础图形是一个框
        const path = `M0 0 L${this.cellSize} 0 L${this.cellSize} ${
          this.cellSize
        } L0 ${this.cellSize} Z`;
        // if (data.isLocked) {
        //   // 箱区封锁要画叉
        //   path =
        //     path +
        //     `M0 0 L${this.cellSize} ${this.cellSize} M${this.cellSize} 0 L0 ${
        //       this.cellSize
        //     }`;
        // }
        return path;
      })
      .attr('fill', (pos: Yardpos<T>) => this._fillFunction(pos))
      .attr('stroke', 'rgb(90,68,70)')
      .attr('stroke-width', '1px');
    // 高箱 需要加一条粗线
    // g.append('path')
    //   .attr('d', data => {
    //     if (data.container && data.container.height + '' === '9.6') {
    //       return `M0 2 L${this.cellSize} 2`;
    //     } else {
    //       return `M0 0 L${this.cellSize} 0`;
    //     }
    //   })
    //   .attr('stroke', 'black')
    //   .attr('stroke-width', data => {
    //     if (data.container && data.container.height + '' === '9.6') {
    //       return 4;
    //     } else {
    //       return 1;
    //     }
    //   });
    // g.append('text')
    //   .attr('font-size', '9')
    //   .attr('text-anchor', 'middle')
    //   .attr('dx', this.cellSize / 2)
    //   .attr('dy', this.cellSize / 1.2)
    //   .text((posInfo: YardposInfo) => (posInfo.text ? posInfo.text : ''));

    g.transition()
      .delay((pos: Yardpos<T>) => {
        const tier = +this.yardposParser.getC(pos.name);
        return tier * 100;
      })
      .attr('transform', (pos: Yardpos<T>) => {
        const x =
          parseInt(this.yardposParser.getP(pos.name), 10) * this.cellSize;
        const y =
          (this.displaySize.tier - +this.yardposParser.getC(pos.name)) *
          this.cellSize;
        return `translate(${x}, ${y})`;
      });
  }

  private _fillFunction(pos: Yardpos<T>) {
    // 如果提供了填充色选项则使用填充色选项的配置
    if (this.renderOptions && this.renderOptions.fill) {
      if (typeof this.renderOptions.fill === 'string') {
        return this.renderOptions.fill;
      } else {
        return this.renderOptions.fill(pos);
      }
    } else {
      // 默认填充色配置
      if (pos.data) {
        return 'red';
      } else {
        return 'white';
      }
      // if (data.fill) {
      //   return data.fill;
      // }
      // if (data.displayedContainer && data.displayedContainer.ctnno) {
      //   return 'rgb(251,124,133)';
      // } else if (data.plans.length > 0) {
      //   if (data.plans.filter(p => p.planType === '定位组').length > 0) {
      //     return 'rgb(255,238,196)';
      //   }
      //   return 'white';
      // } else if (data.displayedContainer && data.displayedContainer.task) {
      //   return 'rgb(251,254,133)';
      // } else {
      //   return 'white';
      // }
    }
  }
}
