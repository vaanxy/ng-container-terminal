import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as d3 from 'd3';
import { RenderOptions, Vescell } from 'ng-container-terminal/core';
import { CtVescellParserService } from 'ng-container-terminal/tool';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

// import { YardposInfo } from '../../model/yardpos-info';
@Component({
  selector: 'ct-vessel-bay',
  templateUrl: './ct-vessel-bay.component.html',
  styleUrls: ['./ct-vessel-bay.component.css']
})
export class CtVesselBayComponent<T> implements OnInit {
  @Input() set renderOptions(options: RenderOptions<Vescell<T>>) {
    this._renderOptions = options;
    this.renderUpdateSubject.next();
  }

  get renderOptions() {
    return this._renderOptions;
  }

  @Input() set cellSize(size: number) {
    this._cellSize = +size;
    this.renderUpdateSubject.next();
  }

  get cellSize() {
    return this._cellSize;
  }

  @Input() set vescells(vescells: Vescell<T>[]) {
    // console.log('update vescells');

    this._vescells = vescells;
    this.renderUpdateSubject.next();
  }

  get vescells() {
    return this._vescells;
  }

  @Input() set name(name: string) {
    this._name = name;
    this.displayName = name;
  }

  get name() {
    return this._name;
  }

  displayName: string;

  @Output() vescellClick: EventEmitter<Vescell<T>> = new EventEmitter();
  @Output() contentRender: EventEmitter<{
    node: d3.Selection<any, any, any, any>;
    data: Vescell<T>;
  }> = new EventEmitter();

  constructor(private el: ElementRef, private cellParser: CtVescellParserService) {
    this.renderUpdateSubject.pipe(debounceTime(100)).subscribe(() => {
      this.premarshalling(this.vescells);
      this.renderAll();
    });
  }
  renderUpdateSubject: Subject<void> = new Subject();
  host: d3.Selection<any, any, any, any>;
  svg: d3.Selection<any, any, any, any>;
  vesselDeckBayGroup: d3.Selection<any, any, any, any>;
  vesselDeckBayRowLabelGroup: d3.Selection<any, any, any, any>;
  vesselDeckBayTierLabelGroup: d3.Selection<any, any, any, any>;
  vesselDeckBayCellGroup: d3.Selection<any, any, any, any>;

  vesselHoldBayGroup: d3.Selection<any, any, any, any>;
  vesselHoldBayRowLabelGroup: d3.Selection<any, any, any, any>;
  vesselHoldBayTierLabelGroup: d3.Selection<any, any, any, any>;
  vesselHoldBayCellGroup: d3.Selection<any, any, any, any>;
  vesselBayNameLabelGroup: d3.Selection<any, any, any, any>;

  private _vescells: Vescell<T>[] = [];
  padding = 16;
  private deckRowLabels: string[] = [];
  private deckTierLabels: string[] = [];
  private deckCells: Vescell<T>[] = [];

  private holdRowLabels: string[] = [];
  private holdTierLabels: string[] = [];
  private holdCells: Vescell<T>[] = [];

  private layout = {
    deckRowCount: 0,
    deckTierCount: 0,
    deckMinTierLabel: 82,
    deckHasZeroRow: false,

    holdRowCount: 0,
    holdTierCount: 0,
    holdHasZeroRow: false,

    maxRow: 0 // 整贝最大列宽 max(deckMaxRow, holdMaxRow)
  };

  private _name: string;
  private _cellSize = 20;
  private _renderOptions: RenderOptions<Vescell<T>>;

  @Input() cellTrackByFn = (cell: Vescell<T>) => {
    return JSON.stringify(cell);
  };

  ngOnInit() {
    // console.log('ng on init');

    this.host = d3.select(this.el.nativeElement);
    // step1
    this.svg = this.host
      .select('svg')
      .attr('width', (this.layout.maxRow + 1) * this.cellSize + 2 * this.padding)
      .attr('height', (this.layout.deckTierCount + this.layout.holdTierCount + 3) * this.cellSize + 2 * this.padding);
    this.svg.selectAll('g').remove();
    this.vesselDeckBayGroup = this.svg
      .append('g')
      .attr('class', 'vessel-deck-bay-group')
      .attr('transform', `translate(${this.padding}, ${this.padding})`);
    this.vesselHoldBayGroup = this.svg
      .append('g')
      .attr('class', 'vessel-hold-bay-group')
      .attr('transform', (label, index) => {
        const x = this.padding;
        const y = this.cellSize * (this.layout.deckTierCount + 2) + this.padding; // +2 为2组列标签占位
        return `translate(${x}, ${y})`;
      });

    // deck tier label
    this.vesselDeckBayGroup.selectAll('g.vessel-deck-bay-tier-label-group').remove();
    this.vesselDeckBayTierLabelGroup = this.vesselDeckBayGroup
      .append('g')
      .attr('class', 'vessel-deck-bay-tier-label-group');

    // 绘制甲板列标签deck row label
    this.vesselDeckBayGroup.selectAll('g.vessel-deck-bay-row-label-group').remove();
    this.vesselDeckBayRowLabelGroup = this.vesselDeckBayGroup
      .append('g')
      .attr('class', 'vessel-deck-bay-row-label-group');

    // hold tier label
    this.vesselHoldBayGroup.selectAll('g.vessel-hold-bay-tier-label-group').remove();
    this.vesselHoldBayTierLabelGroup = this.vesselHoldBayGroup
      .append('g')
      .attr('class', 'vessel-hold-bay-tier-label-group');

    // hold row label
    this.vesselHoldBayGroup.selectAll('g.vessel-hold-bay-row-label-group').remove();
    this.vesselHoldBayRowLabelGroup = this.vesselHoldBayGroup
      .append('g')
      .attr('class', 'vessel-hold-bay-row-label-group');

    // step3 划定舱内舱面船箱位vescell绘制区域
    this.vesselDeckBayGroup.selectAll('g.vessel-deck-bay-cell-group').remove();
    this.vesselHoldBayGroup.selectAll('g.vessel-hold-bay-cell-group').remove();

    this.vesselDeckBayCellGroup = this.vesselDeckBayGroup.append('g').attr('class', 'vessel-deck-bay-cell-group');

    this.vesselHoldBayCellGroup = this.vesselHoldBayGroup.append('g').attr('class', 'vessel-hold-bay-cell-group');
  }

  /**
   * 船箱位数据发生变化时，重新对输入数据进行预处理
   *
   */
  premarshalling(cells: Vescell<T>[]) {
    if (!cells || cells.length <= 0) {
      return;
    }
    if (!this.name) {
      this.displayName = this.cellParser.getBayno(cells[0].name);
    }
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
    // console.log((+deckTiers[0] - 82) / 2);

    const deckMinTierLabel = +this.deckTierLabels[this.deckTierLabels.length - 1];
    this.layout = {
      deckRowCount: deckRows.size,
      deckTierCount: this.deckTierLabels.length > 0 ? (+this.deckTierLabels[0] - deckMinTierLabel) / 2 + 1 : 0,
      deckHasZeroRow: this.hasZeroRow(deckCells),
      deckMinTierLabel: deckMinTierLabel,

      holdRowCount: holdRows.size,
      holdTierCount: this.holdTierLabels.length > 0 ? +this.holdTierLabels[0] / 2 : 0,
      holdHasZeroRow: this.hasZeroRow(holdCells),
      maxRow: Math.max(deckRows.size, holdRows.size)
    };
    this.deckCells = deckCells;
    this.holdCells = holdCells;
  }

  /**
   * ## 绘制贝位结构
   *
   * 1. 规划舱内舱面绘制区域
   * 2. 规划舱内舱面行、列标签绘制区域
   * 3. 规划舱内舱面船箱位绘制区域
   *
   */
  renderAll() {
    // step1
    this.svg
      .transition()
      .attr('width', (this.layout.maxRow + 1) * this.cellSize + 2 * this.padding)
      .attr('height', (this.layout.deckTierCount + this.layout.holdTierCount + 3) * this.cellSize + 2 * this.padding);
    this.vesselDeckBayGroup.transition().attr('transform', `translate(${this.padding}, ${this.padding})`);
    this.vesselHoldBayGroup.transition().attr('transform', (label, index) => {
      const x = this.padding;
      const y = this.cellSize * (this.layout.deckTierCount + 2) + this.padding; // +2 为2组列标签占位
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

    this.renderTierLabels(this.vesselDeckBayTierLabelGroup, this.deckTierLabels);

    // 绘制甲板列标签deck row label
    this.renderRowLabels(this.vesselDeckBayRowLabelGroup, this.deckRowLabels, deckRowOffset);

    // *******HOLD********
    // 舱内层标签
    this.renderTierLabels(this.vesselHoldBayTierLabelGroup, this.holdTierLabels);
    // 舱内列标签
    this.renderRowLabels(this.vesselHoldBayRowLabelGroup, this.holdRowLabels, holdRowOffset);

    // step3 划定舱内舱面船箱位vescell绘制区域
    this.vesselDeckBayCellGroup
      // .transition()
      .attr('transform', (label, index) => {
        const x = deckRowOffset + this.cellSize;
        const y = this.cellSize; // 舱面列标签占位
        return `translate(${x}, ${y})`;
      });

    this.vesselHoldBayCellGroup
      // .transition()
      .attr('transform', (label, index) => {
        const x = holdRowOffset + this.cellSize;
        const y = this.cellSize; // 舱内列标签占位
        return `translate(${x}, ${y})`;
      });
    this.renderVescells();
  }

  renderTierLabels(selection: d3.Selection<SVGGElement, string, SVGGElement, any>, data: string[]) {
    const tierLabelSelection = selection.selectAll('text').data(data, (label: string) => label);
    const enteredTierLabels = tierLabelSelection.enter();
    const updatedTierLabels = tierLabelSelection;
    const exitedTierLabels = tierLabelSelection.exit();

    // console.log(enteredTierLabels, updatedTierLabels, exitedTierLabels);

    enteredTierLabels
      .append('text')
      .attr('transform', (_, index) => {
        const x = -this.cellSize;
        const y = (index + 1) * this.cellSize;
        return `translate(${x}, ${y})`;
      })
      .attr('opacity', 0)
      .transition()
      .duration(500)
      .attr('opacity', 1)
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
    updatedTierLabels
      .transition()
      .attr('opacity', 1)
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
      .text((c: string) => c);
    exitedTierLabels.remove();
  }

  renderRowLabels(selection: d3.Selection<SVGGElement, string, SVGGElement, any>, data: string[], rowOffset: number) {
    const rowLabelSelection = selection.selectAll('text').data(data, (label: string) => label);
    const enteredRowLabels = rowLabelSelection.enter();
    const updatedRowLabels = rowLabelSelection;
    const exitedRowLabels = rowLabelSelection.exit();

    // console.log('row labels', updatedRowLabels);

    enteredRowLabels
      .append('text')
      .attr('transform', (_, index) => {
        const x = rowOffset + (index + 1) * this.cellSize;
        const y = -this.cellSize;
        return `translate(${x}, ${y})`;
      })
      .attr('opacity', 0)
      .transition()
      .duration(500)
      .attr('width', this.cellSize)
      .attr('height', this.cellSize)
      .attr('transform', (_, index) => {
        const x = rowOffset + (index + 1) * this.cellSize;
        const y = 0;
        return `translate(${x}, ${y})`;
      })
      .attr('opacity', 1)
      .attr('font-size', '12')
      .attr('text-anchor', 'middle')
      .attr('dx', this.cellSize / 2)
      .attr('dy', this.cellSize / 2)
      .text(c => c);

    updatedRowLabels
      .transition()
      .duration(500)
      .attr('transform', (_, index) => {
        const x = rowOffset + (index + 1) * this.cellSize;
        const y = 0;
        return `translate(${x}, ${y})`;
      })
      .attr('width', this.cellSize)
      .attr('height', this.cellSize)
      .attr('opacity', 1)
      .attr('font-size', '12')
      .attr('text-anchor', 'middle')
      .attr('dx', this.cellSize / 2)
      .attr('dy', this.cellSize / 2)
      .text((c: string) => c);

    exitedRowLabels
      .transition()
      .duration(500)
      .attr('transform', (label, index) => {
        const x = rowOffset + (index + 1) * this.cellSize;
        const y = -12;
        return `translate(${x}, ${y})`;
      })
      .attr('opacity', 0);
  }

  renderVescells() {
    const deckCells = this.vesselDeckBayCellGroup
      .selectAll('g')
      .data(this.deckCells, (cell: Vescell<T>) => this.cellTrackByFn(cell));

    const enteredDeckCells = deckCells.enter();
    const updatedDeckCells = deckCells;
    const exitedDeckCells = deckCells.exit();
    // console.log('deck cells', updatedDeckCells);

    const enteredDeckG = enteredDeckCells
      .append('g')
      .attr('transform', cell => {
        const row = +this.cellParser.getL(cell.name);
        const tier = (+this.cellParser.getC(cell.name) - this.layout.deckMinTierLabel) / 2;
        let x = row * ((row % 2) * 2 - 1);
        if (this.layout.deckHasZeroRow) {
          x = x + (row % 2);
        } else {
          x = x - (row % 2);
        }
        x = x / 2 + (this.layout.deckRowCount - +this.layout.deckHasZeroRow) / 2;
        const y = (this.layout.deckTierCount - tier - 1) * this.cellSize;
        x = this.cellSize * x;
        return `translate(${x}, ${y})`;
      })
      .on('click', (cell: Vescell<T>, index: number) => {
        this.vescellClick.emit(cell);
        // console.log('vescell click', cell);
      });

    enteredDeckG
      // .selectAll('rect')
      .append('rect')
      .attr('stroke-width', '2px')
      .attr('stroke', 'black')
      .attr('fill', 'white')
      // .transition()
      // .duration(500)
      .attr('width', this.cellSize)
      .attr('height', this.cellSize)
      .attr('fill', (cell: Vescell<T>) => this._fillFunction(cell));

    enteredDeckG
      // .selectAll('text')
      .append('text')
      .attr('font-size', '9')
      .attr('text-anchor', 'middle')
      .attr('dx', this.cellSize / 2)
      .attr('dy', this.cellSize / 1.2)
      .text((cell: Vescell<T>) => this._renderText(cell));

    enteredDeckG.each((data, nodeIdx, nodes) => {
      this.contentRender.next({
        node: d3.select(nodes[nodeIdx]),
        data: data
      });
    });

    updatedDeckCells
      .transition()
      .duration(500)
      .attr('transform', cell => {
        const row = +this.cellParser.getL(cell.name);
        const tier = (+this.cellParser.getC(cell.name) - this.layout.deckMinTierLabel) / 2;
        let x = row * ((row % 2) * 2 - 1);
        if (this.layout.deckHasZeroRow) {
          x = x + (row % 2);
        } else {
          x = x - (row % 2);
        }
        x = x / 2 + (this.layout.deckRowCount - +this.layout.deckHasZeroRow) / 2;
        const y = (this.layout.deckTierCount - tier - 1) * this.cellSize;
        x = this.cellSize * x;
        return `translate(${x}, ${y})`;
      });
    updatedDeckCells
      .selectAll('rect')
      .attr('width', this.cellSize)
      .attr('height', this.cellSize)
      .attr('fill', (cell: Vescell<T>) => this._fillFunction(cell));

    updatedDeckCells
      .selectAll('text')
      .attr('dx', this.cellSize / 2)
      .attr('dy', this.cellSize / 1.2)
      .text((cell: Vescell<T>) => this._renderText(cell));

    updatedDeckCells.each((data, nodeIdx, nodes) => {
      this.contentRender.next({
        node: d3.select(nodes[nodeIdx]),
        data: data
      });
    });

    exitedDeckCells
      .transition()
      .attr('transform', (pos: Vescell<T>) => {
        return `scale(0,0)`;
      })
      .remove();

    // hold cell group
    const holdCells = this.vesselHoldBayCellGroup
      .selectAll('g')
      .data(this.holdCells, (cell: Vescell<T>) => this.cellTrackByFn(cell));

    const enteredHoldCells = holdCells.enter();
    const updatedHoldCells = holdCells;
    const exitedHoldCells = holdCells.exit();

    const enteredHoldG = enteredHoldCells
      .append('g')
      .attr('transform', cell => {
        const row = +this.cellParser.getL(cell.name);
        const tier = +this.cellParser.getC(cell.name) / 2;

        let x = row * ((row % 2) * 2 - 1);

        if (this.layout.holdHasZeroRow) {
          x = x + (row % 2);
        } else {
          x = x - (row % 2);
        }
        x = x / 2 + (this.layout.holdRowCount - +this.layout.holdHasZeroRow) / 2;

        const y = (this.layout.holdTierCount - tier) * this.cellSize;
        x = this.cellSize * x;
        return `translate(${x}, ${y})`;
      })
      .on('click', (cell: Vescell<T>, index: number) => {
        this.vescellClick.emit(cell);
        // console.log('vescell click', cell);
      });
    enteredHoldG
      .append('rect')
      .attr('stroke-width', '2px')
      .attr('stroke', 'black')
      .attr('fill', 'white')
      .transition()
      .duration(500)
      .attr('width', this.cellSize)
      .attr('height', this.cellSize)
      .attr('fill', (cell: Vescell<T>) => this._fillFunction(cell));

    enteredHoldG
      .append('text')
      .attr('font-size', '9')
      .attr('text-anchor', 'middle')
      .attr('dx', this.cellSize / 2)
      .attr('dy', this.cellSize / 1.2)
      .text((cell: Vescell<T>) => this._renderText(cell));

    enteredHoldG.each((data, nodeIdx, nodes) => {
      this.contentRender.next({
        node: d3.select(nodes[nodeIdx]),
        data: data
      });
    });
    updatedHoldCells
      .transition()
      .duration(500)
      .attr('transform', cell => {
        const row = +this.cellParser.getL(cell.name);
        const tier = +this.cellParser.getC(cell.name) / 2;

        let x = row * ((row % 2) * 2 - 1);

        if (this.layout.holdHasZeroRow) {
          x = x + (row % 2);
        } else {
          x = x - (row % 2);
        }
        x = x / 2 + (this.layout.holdRowCount - +this.layout.holdHasZeroRow) / 2;

        const y = (this.layout.holdTierCount - tier) * this.cellSize;
        x = this.cellSize * x;
        return `translate(${x}, ${y})`;
      });
    // .attr('width', this.cellSize)
    // .attr('height', this.cellSize)
    // .attr('fill', (cell: Vescell<T>) => this._fillFunction(cell));

    updatedHoldCells
      .selectAll('rect')
      .attr('width', this.cellSize)
      .attr('height', this.cellSize)
      .attr('fill', (cell: Vescell<T>) => this._fillFunction(cell));

    updatedHoldCells
      .selectAll('text')
      .attr('dx', this.cellSize / 2)
      .attr('dy', this.cellSize / 1.2)
      .text((cell: Vescell<T>) => this._renderText(cell));

    updatedHoldCells.each((data, nodeIdx, nodes) => {
      this.contentRender.next({
        node: d3.select(nodes[nodeIdx]),
        data: data
      });
    });

    exitedHoldCells
      .transition()
      .attr('transform', (pos: Vescell<T>) => {
        return `scale(0,0)`;
      })
      .remove();
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

  private hasZeroRow(cells: Vescell<T>[]) {
    for (let index = 0; index < cells.length; index++) {
      const cell = cells[index];
      if (+this.cellParser.getL(cell.name) === 0) {
        return true;
      }
    }

    return false;
  }

  private _renderText(cell: Vescell<T>) {
    if (this.renderOptions && this.renderOptions.text) {
      if (typeof this.renderOptions.text === 'string') {
        return this.renderOptions.text;
      } else {
        return this.renderOptions.text(cell);
      }
    } else {
      return '';
    }
  }
}
