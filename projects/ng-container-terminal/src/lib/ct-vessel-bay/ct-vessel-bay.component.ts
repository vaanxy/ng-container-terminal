import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as d3 from 'd3';

import { Vescell, VesselBay } from '../../model';
import { RenderOptions } from '../../model/render-options';
import { CtVescellParserService } from '../tool';

// import { YardposInfo } from '../../model/yardpos-info';
@Component({
  selector: 'ct-vessel-bay',
  templateUrl: './ct-vessel-bay.component.html',
  styleUrls: ['./ct-vessel-bay.component.css']
})
export class CtVesselBayComponent<T> implements OnInit {
  host: d3.Selection<any, any, any, any>;
  svg: d3.Selection<any, any, any, any>;
  vesselDeckBayGroup: d3.Selection<any, any, any, any>;
  vesselHoldBayGroup: d3.Selection<any, any, any, any>;
  vesselDeckBayRowLabelGroup: d3.Selection<any, any, any, any>;
  vesselDeckBayTierLabelGroup: d3.Selection<any, any, any, any>;
  vesselHoldBayRowLabelGroup: d3.Selection<any, any, any, any>;
  vesselHoldBayTierLabelGroup: d3.Selection<any, any, any, any>;
  vesselDeckBayCellGroup: d3.Selection<any, any, any, any>;
  vesselHoldBayCellGroup: d3.Selection<any, any, any, any>;
  vesselBayNameLabelGroup: d3.Selection<any, any, any, any>;

  cells: Vescell<T>[] = [];
  padding = 50;
  private deckRowLabels: string[] = [];
  private deckTierLabels: string[] = [];
  private holdRowLabels: string[] = [];
  private holdTierLabels: string[] = [];
  private deckCells: Vescell<T>[] = [];
  private holdCells: Vescell<T>[] = [];
  private layout = {
    deckMaxRow: 0,
    deckMaxTier: 0,
    // deckRowOffset: 0,
    deckHasZeroRow: false,
    holdMaxRow: 0,
    holdMaxTier: 0,
    // HoldRowOffset: 0,
    holdHasZeroRow: false
  };
  private _vesselBay: VesselBay<T>;
  private _cellSize = 50;
  private _renderOptions: RenderOptions<Vescell<T>>;

  @Input() set renderOptions(options: RenderOptions<Vescell<T>>) {
    this._renderOptions = options;
    setTimeout(() => {
      this.renderLayout();
      this.updateVescells();
    }, 0);
  }

  get renderOptions() {
    return this._renderOptions;
  }

  @Input() set cellSize(size: number) {
    this._cellSize = size;
    setTimeout(() => {
      this.renderLayout();
      this.updateVescells();
    }, 0);
  }

  get cellSize() {
    return this._cellSize;
  }

  @Input() set vesselBay(vesselBay: VesselBay<T>) {
    this._vesselBay = vesselBay;
    this.cells = vesselBay.vescells;
    this.premarshalling(this.cells);
    setTimeout(() => {
      this.renderLayout();
      this.updateVescells();
    }, 0);
  }

  get vesselBay() {
    return this._vesselBay;
  }

  @Output() vescellClick: EventEmitter<Vescell<T>> = new EventEmitter();

  constructor(
    private el: ElementRef,
    private cellParser: CtVescellParserService
  ) {}

  ngOnInit() {
    // if (this.yardBay.dataUpdated) {
    //   this.yardBay.dataUpdated.subscribe(() => {
    //     this.updateYardposInfo();
    //   });
    // }
    this.host = d3.select(this.el.nativeElement);

    // this.renderLayout();
    // this.updateVescells();
  }

  /**
   * 船箱位数据发生变化时，重新对输入数据进行预处理
   *
   */
  premarshalling(cells: Vescell<T>[]) {
    const deckRows = new Set<string>();
    const holdRows = new Set<string>();
    const deckTiers = new Set<string>();
    const holdTiers = new Set<string>();
    const deckCells = [];
    const holdCells = [];
    cells.forEach(cell => {
      if (this.cellParser.isDeck(cell.name)) {
        deckCells.push(cell);
        deckRows.add(this.cellParser.getL(cell.name));
        deckTiers.add(this.cellParser.getC(cell.name));
      } else {
        holdCells.push(cell);
        holdRows.add(this.cellParser.getL(cell.name));
        holdTiers.add(this.cellParser.getC(cell.name));
      }
    });
    this.deckTierLabels = Array.from(deckTiers).sort((a, b) => {
      const x = +a;
      const y = +b;
      return y - x;
    });
    // this.deckTierLabels = this.deckTierLabels.sort().reverse();
    this.holdTierLabels = Array.from(holdTiers).sort((a, b) => {
      const x = +a;
      const y = +b;
      return y - x;
    });

    this.deckRowLabels = Array.from(deckRows).sort((a, b) => {
      let x = +a;
      let y = +b;
      x = x * ((x % 2) * 2 - 1);
      y = y * ((y % 2) * 2 - 1);
      return x - y;
    });
    this.holdRowLabels = Array.from(holdRows).sort((a, b) => {
      let x = +a;
      let y = +b;
      x = x * ((x % 2) * 2 - 1);
      y = y * ((y % 2) * 2 - 1);
      return x - y;
    });
    this.layout = {
      deckMaxRow: deckRows.size,
      deckMaxTier: deckTiers.size,
      deckHasZeroRow: this.hasZeroRow(deckCells),
      holdMaxRow: holdRows.size,
      holdMaxTier: holdTiers.size,
      holdHasZeroRow: this.hasZeroRow(holdCells)
    };
    this.deckCells = deckCells;
    this.holdCells = holdCells;
    // const deckHasZeroRow = this.hasZeroRow(deckData);
  }

  renderDeckBay() {}

  renderHoldBay() {}

  private hasZeroRow(cells: Vescell<T>[]) {
    cells.forEach(cell => {
      if (+this.cellParser.getL(cell.name) === 0) {
        return true;
      }
    });
    return false;
  }

  /**
   * 绘制贝位结构
   * step1 规划舱内舱面绘制区域
   * step2 规划舱内舱面行、列标签绘制区域
   * step3 规划舱内舱面船箱位绘制区域
   *
   */
  renderLayout() {
    // step1
    this.svg = this.host
      .select('svg')
      .attr(
        'width',
        (Math.max(this.deckRowLabels.length, this.holdRowLabels.length) + 1) *
          this.cellSize +
          2 * this.padding
      )
      .attr(
        'height',
        (this.deckTierLabels.length + this.holdTierLabels.length + 2) *
          this.cellSize +
          3 * this.padding
      );
    this.vesselDeckBayGroup = this.svg
      .append('g')
      .attr('class', 'vessel-deck-bay-group');
    this.vesselHoldBayGroup = this.svg
      .append('g')
      .attr('class', 'vessel-hold-bay-group')
      .attr('transform', (label, index) => {
        const x = 0;
        const y = this.deckTierLabels.length * this.cellSize + this.padding * 2;
        return `translate(${x}, ${y})`;
      });

    // step 2
    // 绘甲板制层标签deck tier
    //        bayno
    //  1 2 3 4 5 6 7 8
    // 1
    // 2
    // 3
    const deckRowCount = this.deckRowLabels.length;
    const holdRowCount = this.holdRowLabels.length;
    let holdRowOffset = 0;
    let deckRowOffset = 0;
    if (deckRowCount >= holdRowCount) {
      holdRowOffset = ((deckRowCount - holdRowCount) / 2) * this.cellSize;
    } else {
      deckRowOffset = ((holdRowCount - deckRowCount) / 2) * this.cellSize;
    }
    console.log(holdRowOffset, deckRowOffset);

    // deck tier label
    this.vesselDeckBayGroup
      .selectAll('g.vessel-deck-bay-tier-label-group')
      .remove();
    this.vesselDeckBayTierLabelGroup = this.vesselDeckBayGroup
      .append('g')
      .attr('class', 'vessel-deck-bay-tier-label-group');
    this.vesselDeckBayTierLabelGroup
      .selectAll('text')
      .data(this.deckTierLabels)
      .enter()
      .append('text')
      .attr('width', this.cellSize)
      .attr('height', this.cellSize)
      .attr('transform', (label, index) => {
        const x = 0;
        const y = (index + 1) * this.cellSize;
        return `translate(${x}, ${y})`;
      })
      .attr('font-size', '12')
      .attr('text-anchor', 'start')
      // .attr('dx', this.cellSize / 2)
      .attr('dy', this.cellSize / 2 + 12 / 2)
      .text(c => c);

    // 绘制甲板列标签deck row label
    this.vesselDeckBayRowLabelGroup = this.vesselDeckBayGroup
      .append('g')
      .attr('class', 'vessel-deck-bay-row-label-group');
    this.vesselDeckBayRowLabelGroup
      .selectAll('text')
      .data(this.deckRowLabels)
      .enter()
      .append('text')
      .attr('width', this.cellSize)
      .attr('height', this.cellSize)
      .attr('transform', (label, index) => {
        const x = deckRowOffset + (index + 1) * this.cellSize;
        const y = 0;
        return `translate(${x}, ${y})`;
      })
      .attr('font-size', '12')
      .attr('text-anchor', 'middle')
      .attr('dx', this.cellSize / 2)
      .attr('dy', this.cellSize / 2)
      .text(c => c);

    // *******HOLD********
    // 舱内层标签
    this.vesselHoldBayGroup
      .selectAll('g.vessel-hold-bay-tier-label-group')
      .remove();
    this.vesselHoldBayTierLabelGroup = this.vesselHoldBayGroup
      .append('g')
      .attr('class', 'vessel-hold-bay-tier-label-group');
    this.vesselHoldBayTierLabelGroup
      .selectAll('text')
      .data(this.holdTierLabels)
      .enter()
      .append('text')
      .attr('width', this.cellSize)
      .attr('height', this.cellSize)
      .attr('transform', (label, index) => {
        const x = 0;
        const y = (1 + index) * this.cellSize;
        return `translate(${x}, ${y})`;
      })
      .attr('font-size', '12')
      .attr('text-anchor', 'start')
      // .attr('dx', this.cellSize / 2)
      .attr('dy', this.cellSize / 2 + 12 / 2)
      .text(c => c);

    // 绘制舱内列标签
    // this.vesselHoldBayGroup
    //   .selectAll('g.vessel-hold-bay-row-label-group')
    //   .remove();
    this.vesselHoldBayRowLabelGroup = this.vesselHoldBayGroup
      .append('g')
      .attr('class', 'vessel-hold-bay-row-label-group');
    this.vesselHoldBayRowLabelGroup
      .selectAll('text')
      .data(this.holdRowLabels)
      .enter()
      .append('text')
      .attr('width', this.cellSize)
      .attr('height', this.cellSize)
      .attr('transform', (label, index) => {
        const x = holdRowOffset + index * this.cellSize + this.padding;
        const y = 0;
        return `translate(${x}, ${y})`;
      })
      .attr('font-size', '12')
      .attr('text-anchor', 'middle')
      .attr('dx', this.cellSize / 2)
      .attr('dy', this.cellSize / 2)
      .text(c => c);
    // // 绘制区位号标签
    // this.svg.selectAll('g.yard-bay-name-label-group').remove();
    // this.yardBayNameLabelGroup = this.svg
    //   .append('g')
    //   .attr('class', 'yard-bay-name-label-group');
    // this.yardBayNameLabelGroup
    //   .append('text')
    //   .attr('transform', label => {
    //     const x = ((this.displaySize.row + 1) / 2.0) * this.cellSize;
    //     const y = (this.displaySize.tier + 1) * this.cellSize;
    //     return `translate(${x}, ${y})`;
    //   })
    //   .attr('font-size', '16')
    //   .attr('text-anchor', 'middle')
    //   .attr('dx', this.cellSize / 2)
    //   .attr('dy', this.cellSize / 2)
    //   .text(this.yardBay.name);

    // step3 划定舱内舱面船箱位vescell绘制区域
    this.vesselDeckBayGroup.selectAll('g.vessel-deck-bay-cell-group').remove();
    this.vesselHoldBayGroup.selectAll('g.vessel-hold-bay-cell-group').remove();
    this.vesselHoldBayCellGroup = this.vesselHoldBayGroup
      .append('g')
      .attr('class', 'vessel-hold-bay-cell-group')
      .attr('transform', (label, index) => {
        const x = this.cellSize;
        const y = this.cellSize;
        return `translate(${x}, ${y})`;
      });

    this.vesselDeckBayCellGroup = this.vesselDeckBayGroup
      .append('g')
      .attr('class', 'vessel-deck-bay-cell-group')
      .attr('transform', (label, index) => {
        const x = this.cellSize;
        const y = this.cellSize;
        return `translate(${x}, ${y})`;
      });
  }

  updateVescells() {
    const deckCells = this.vesselDeckBayCellGroup
      .selectAll('rect')
      .data(this.deckCells, (d: Vescell<T>) => JSON.stringify(d));

    const enteredDeckCells = deckCells.enter();
    const updatedDeckCells = deckCells.selectAll('rect');
    const exitedDeckCells = deckCells.exit();

    enteredDeckCells
      .append('rect')
      .attr('width', this.cellSize)
      .attr('height', this.cellSize)
      .attr('transform', (cell, index) => {
        const row = +this.cellParser.getL(cell.name);
        const tier = (+this.cellParser.getC(cell.name) - 82) / 2;
        let x = row * ((row % 2) * 2 - 1);
        if (this.layout.deckHasZeroRow) {
          x = x + (row % 2);
        } else {
          x = x - (row % 2);
        }
        x = x / 2 + 5;
        //  + (row % 2)) / 2 + 5;
        const y = (3 - tier) * this.cellSize;

        x = this.cellSize * x;
        // const y = this.cellSize;
        return `translate(${x}, ${y})`;
      })
      .attr('stroke-width', '2px')
      .attr('stroke', 'black')
      .attr('fill', (cell: Vescell<T>) => this._fillFunction(cell));

    updatedDeckCells
      .transition()
      .attr('fill', (cell: Vescell<T>) => this._fillFunction(cell));

    exitedDeckCells
      .transition()
      .attr('transform', (pos: Vescell<T>) => {
        return `scale(0,0)`;
      })
      .remove();

    // hold cell
    this.vesselHoldBayCellGroup
      .selectAll('rect')
      .data(this.holdCells)
      .enter()
      .append('rect')
      .attr('width', this.cellSize)
      .attr('height', this.cellSize)
      .attr('transform', (cell, index) => {
        const row = +this.cellParser.getL(cell.name);
        const tier = +this.cellParser.getC(cell.name) / 2;

        let x = row * ((row % 2) * 2 - 1);
        // TODO:
        if (this.layout.holdHasZeroRow) {
          x = x + (row % 2);
        } else {
          x = x - (row % 2);
        }
        x = x / 2 + 5;
        const y = (9 - tier) * this.cellSize;
        x = this.cellSize * x;
        return `translate(${x}, ${y})`;
      })
      .attr('stroke-width', '2px')
      .attr('stroke', 'black')
      .attr('fill', (cell: Vescell<T>) => this._fillFunction(cell));
    // console.log('updating....');
    // this.generatePoses();
    // if (!this.yardposInfoGroup) {
    //   return;
    // }
    // const cell = this.yardposInfoGroup
    //   .selectAll('g.yard-pos-info')
    //   .data(this.poses, (pos: Yardpos<T>, idx) => JSON.stringify(pos));
    // // 更新
    // cell
    //   .selectAll('path')
    //   .transition()
    //   .attr('fill', (pos: Yardpos<T>) => this._fillFunction(pos));
    // // cell
    // //   .selectAll('text')
    // //   .text((posInfo: Yardpos<T>) => (posInfo.text ? posInfo.text : ''));
    // // 新增
    // const enteredCell = cell.enter();
    // this.renderYardposInfo(enteredCell);
    // // 删除
    // cell
    //   .exit()
    //   .transition()
    //   .attr('transform', (pos: Yardpos<T>) => {
    //     const x =
    //       parseInt(this.yardposParser.getP(pos.name), 10) * this.cellSize;
    //     // return `translate(${x}, -${this.cellSize})`;
    //     return `scale(0,0)`;
    //   })
    //   .remove();
  }

  renderYardposInfo(selection: d3.Selection<any, any, any, any>) {
    // const g = selection
    //   .append('g')
    //   .style('cursor', 'pointer')
    //   .attr('class', 'yard-pos-info')
    //   .attr('transform', (pos: Yardpos<T>) => {
    //     const x =
    //       parseInt(this.yardposParser.getP(pos.name), 10) * this.cellSize;
    //     const y =
    //       (this.displaySize.tier - +this.yardposParser.getC(pos.name)) *
    //       this.cellSize;
    //     return `translate(${x}, -${y + this.cellSize})`;
    //   })
    //   .on('mouseover', function(data, i, nodes) {
    //     d3.select(nodes[i])
    //       .select('path')
    //       .attr('fill', 'grey');
    //   })
    //   .on('mouseleave', (data, i, nodes) => {
    //     d3.select(nodes[i])
    //       .select('path')
    //       .attr('fill', d => this._fillFunction(data));
    //   })
    //   .on('click', (posInfo: Yardpos<T>, index: number) => {
    //     this.yardposClick.emit(posInfo);
    //   });
    // g.append('path')
    //   .attr('d', (pos: Yardpos<T>) => {
    //     // 基础图形是一个框
    //     const path = `M0 0 L${this.cellSize} 0 L${this.cellSize} ${
    //       this.cellSize
    //     } L0 ${this.cellSize} Z`;
    //     // if (data.isLocked) {
    //     //   // 箱区封锁要画叉
    //     //   path =
    //     //     path +
    //     //     `M0 0 L${this.cellSize} ${this.cellSize} M${this.cellSize} 0 L0 ${
    //     //       this.cellSize
    //     //     }`;
    //     // }
    //     return path;
    //   })
    //   .attr('fill', (pos: Yardpos<T>) => this._fillFunction(pos))
    //   .attr('stroke', 'rgb(90,68,70)')
    //   .attr('stroke-width', '1px');
    // // 高箱 需要加一条粗线
    // // g.append('path')
    // //   .attr('d', data => {
    // //     if (data.container && data.container.height + '' === '9.6') {
    // //       return `M0 2 L${this.cellSize} 2`;
    // //     } else {
    // //       return `M0 0 L${this.cellSize} 0`;
    // //     }
    // //   })
    // //   .attr('stroke', 'black')
    // //   .attr('stroke-width', data => {
    // //     if (data.container && data.container.height + '' === '9.6') {
    // //       return 4;
    // //     } else {
    // //       return 1;
    // //     }
    // //   });
    // // g.append('text')
    // //   .attr('font-size', '9')
    // //   .attr('text-anchor', 'middle')
    // //   .attr('dx', this.cellSize / 2)
    // //   .attr('dy', this.cellSize / 1.2)
    // //   .text((posInfo: YardposInfo) => (posInfo.text ? posInfo.text : ''));
    // g.transition()
    //   .delay((pos: Yardpos<T>) => {
    //     const tier = +this.yardposParser.getC(pos.name);
    //     return tier * 100;
    //   })
    //   .attr('transform', (pos: Yardpos<T>) => {
    //     const x =
    //       parseInt(this.yardposParser.getP(pos.name), 10) * this.cellSize;
    //     const y =
    //       (this.displaySize.tier - +this.yardposParser.getC(pos.name)) *
    //       this.cellSize;
    //     return `translate(${x}, ${y})`;
    //   });
  }

  private _fillFunction(cell: Vescell<T>) {
    // 如果提供了填充色选项则使用填充色选项的配置
    if (this.renderOptions && this.renderOptions.fill) {
      if (typeof this.renderOptions.fill === 'string') {
        return this.renderOptions.fill;
      } else {
        return this.renderOptions.fill(cell);
      }
    } else {
      // 默认填充色配置
      if (cell.data) {
        return 'red';
      } else {
        return 'white';
      }
    }
  }
}
