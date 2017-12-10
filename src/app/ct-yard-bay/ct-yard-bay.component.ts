import { YardposInfo } from '../model/yardpos-info';
import { YardBay } from '../model/yard-bay';
import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'ct-yard-bay',
  templateUrl: './ct-yard-bay.component.html',
  styleUrls: ['./ct-yard-bay.component.css']
})
export class CtYardBayComponent implements OnInit, OnChanges {

  host: d3.Selection<any, any, any, any>;
  svg: d3.Selection<any, any, any, any>;
  yardBayGroup: d3.Selection<any, any, any, any>;
  yardBayRowLabelGroup: d3.Selection<any, any, any, any>;
  yardBayTierLabelGroup: d3.Selection<any, any, any, any>;
  yardBayNameLabelGroup: d3.Selection<any, any, any, any>;
  yardposInfoGroup: d3.Selection<any, any, any, any>;

  cellSize: number = 16;
  padding: number = 16;
  @Input() yardBay: YardBay = {
    name: '',
    maxRow: 6,
    maxTier: 4,
    YardposInfoArray: [],
    dataUpdated: null
  };

  @Output() onYardposInfoClicked: EventEmitter<YardposInfo> = new EventEmitter();

  constructor(private el: ElementRef) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['yardBay']) {
      setTimeout(() => {
        console.log(this.yardBay)
        this.host = d3.select(this.el.nativeElement);
        this.svg = this.host.select('svg')
          .attr('width', (this.yardBay.maxRow + 1) * this.cellSize + 2 * this.padding)
          .attr('height', (this.yardBay.maxTier + 1) * this.cellSize + 2 * this.padding);
        this.renderLayout();
        this.updateYardposInfo();
      },0);
    }
  }

  ngOnInit() {
    if (this.yardBay.dataUpdated) {
      this.yardBay.dataUpdated.subscribe(
        () => {
          this.updateYardposInfo();
        });


    }

    // 生成场地结构数据
    // d3.range(1, this.yardBay.maxRow + 1)
    //   .forEach((row: number) => {
    //     d3.range(1, this.yardBay.maxTier + 1).forEach((tier: number) => {
    //       this.slots.push(this.yardBay.name + this.padLeft(row, 2) + tier);
    //     });
    // });
    this.host = d3.select(this.el.nativeElement);
    this.svg = this.host.select('svg')
      .attr('width', (this.yardBay.maxRow + 1) * this.cellSize + 2 * this.padding)
      .attr('height', (this.yardBay.maxTier + 1) * this.cellSize + 2 * this.padding);
    this.yardBayGroup = this.svg.append('g')
      .attr('class', 'yard-bay-group');
    this.yardposInfoGroup = this.svg.append('g')
      .attr('class', 'yard-pos-info-group');
    this.renderLayout();
    this.updateYardposInfo();
  }

  /**
   * 绘制贝位结构
   */
  renderLayout() {
    // let rect = this.yardBayGroup
    //   .selectAll('rect')
    //   .data(this.slots);

    // rect
    //   .enter()
    //   .append('rect')
    //   .attr('x', (cellName: string) => {
    //     return (parseInt(cellName.slice(5, 7), 10)) * this.cellSize;
    //   })
    //   .attr('y', (cellName: string) => {
    //     return (this.yardBay.maxTier - (parseInt(cellName[cellName.length - 1], 10))) * this.cellSize;
    //   })
    //   .attr('width', this.cellSize)
    //   .attr('height', this.cellSize)
    //   .attr('fill', 'white')
    //   .attr('stroke', 'rgb(0,0,0)')
    //   .attr('stroke-width', '2px');
    // rect.exit().remove();

    // 绘制层标签
    this.svg.selectAll('g.yard-bay-tier-label-group').remove()
    this.yardBayTierLabelGroup = this.svg.append('g')
    .attr('class', 'yard-bay-tier-label-group');
    this.yardBayTierLabelGroup.selectAll('text').data(d3.range(1, this.yardBay.maxTier + 1)).enter().append('text')
    .attr('width', this.cellSize)
    .attr('height', this.cellSize)
    .attr('transform', (label) => {
      let x = 0;
      let y = (this.yardBay.maxTier - label) * this.cellSize;
      return `translate(${x}, ${y})`;
    })
    .attr('font-size', '12')
    .attr('text-anchor', 'middle')
    .attr('dx', this.cellSize / 3 * 2)
    .attr('dy', this.cellSize / 3 * 2)
    .text(c => c);

    // 绘制列标签
    this.svg.selectAll('g.yard-bay-row-label-group').remove()
    this.yardBayRowLabelGroup = this.svg.append('g')
    .attr('class', 'yard-bay-row-label-group');
    this.yardBayRowLabelGroup.selectAll('text').data(d3.range(1, this.yardBay.maxRow + 1)).enter().append('text')
    .attr('width', this.cellSize)
    .attr('height', this.cellSize)
    .attr('transform', (label) => {
      let x = label * this.cellSize;
      let y = this.yardBay.maxTier * this.cellSize;
      return `translate(${x}, ${y})`;
    })
    .attr('font-size', '12')
    .attr('text-anchor', 'middle')
    .attr('dx', this.cellSize / 2)
    .attr('dy', this.cellSize / 2)
    .text(c => c);

    // 绘制区位号标签
    this.svg.selectAll('g.yard-bay-name-label-group').remove()
    this.yardBayNameLabelGroup = this.svg.append('g')
    .attr('class', 'yard-bay-name-label-group');
    this.yardBayNameLabelGroup.append('text')
    .attr('transform', (label) => {
      let x = (this.yardBay.maxRow + 1) / 2.0  * this.cellSize;
      let y = (this.yardBay.maxTier + 1) * this.cellSize;
      return `translate(${x}, ${y})`;
    })
    .attr('font-size', '16')
    .attr('text-anchor', 'middle')
    .attr('dx', this.cellSize / 2)
    .attr('dy', this.cellSize / 2)
    .text(this.yardBay.name);

  }

  updateYardposInfo() {
    let cell = this.yardposInfoGroup
      .selectAll('g.yard-pos-info')
      .data(this.yardBay.YardposInfoArray, (pos: YardposInfo, idx) => JSON.stringify(pos));

      // 更新
      cell.selectAll('path')
          .transition()
          .attr('fill', (data: any) => {
            if (data.fill) {
              return data.fill;
            }
            if (data.container.ctnno) {
              return 'rgb(251,124,133)';
            } else if (data.plans.length > 0) {
              if (data.plans.indexOf('定位组') >= 0) {
                return 'rgb(255,238,196)';
              }
              // if (data.plans.indexOf('拖车限制') >= 0) {
              //   return 'rgb(139,172,161)';
              // }
              return 'white'
              // return data.plans[0] === '定位组' ? 'yellow' : 'darkgray';
            } else if (data.tasks.length > 0) {
              return 'rgb(251,254,133)';
            } else {
              return 'white';
            }
          })
          cell.selectAll('text')
          .text((YardposInfo: YardposInfo) => YardposInfo.text ? YardposInfo.text : '');

  // 新增
    let enteredCell = cell.enter();
    this.renderYardposInfo(enteredCell);

    // 删除
    cell.exit()
    .transition()
    .attr('transform', (yardposInfo: YardposInfo) => {
      let x = (parseInt(yardposInfo.yardpos.slice(6, 8), 10)) * this.cellSize;
      // return `translate(${x}, -${this.cellSize})`;
      return `scale(0,0)`;
    })
    .remove();


  }

  renderYardposInfo(selection: d3.Selection<any, any, any, any>) {
    let g = selection.append('g')
      .style('cursor', 'pointer')
      .attr('class', 'yard-pos-info')
      .attr('transform', (posInfo: YardposInfo) => {
        let x = (parseInt(posInfo.yardpos.slice(6, 8), 10)) * this.cellSize;
        let y = (this.yardBay.maxTier - (+posInfo.yardpos.slice(-2))) * this.cellSize;
        return `translate(${x}, -${y + this.cellSize})`;
      })
      .on('click', (YardposInfo: YardposInfo, index: number) => {
        this.onYardposInfoClicked.emit(YardposInfo);
      });

    g.append('path')
      .attr('d', (data) => {
        if (data.plans.length > 0 && data.plans.indexOf('封场') >= 0 ) {
          return `M0 0 L${this.cellSize} 0 L${this.cellSize} ${this.cellSize} L0 ${this.cellSize} Z M0 0 L${this.cellSize} ${this.cellSize} M${this.cellSize} 0 L0 ${this.cellSize}`

        }
        return `M0 0 L${this.cellSize} 0 L${this.cellSize} ${this.cellSize} L0 ${this.cellSize} Z`

      })
      .attr('fill', (data) => {
        if (data.fill) {
          return data.fill;
        }
        if (data.container.ctnno) {
          return 'rgb(251,124,133)';
        } else if (data.plans.length > 0) {
          if (data.plans.indexOf('定位组') >= 0) {
            return 'rgb(255,238,196)';
          }
          // if (data.plans.indexOf('拖车限制') >= 0) {
          //   return 'rgb(139,172,161)';
          // }
          return 'white'
          // return data.plans[0] === '定位组' ? 'yellow' : 'darkgray';
        } else if (data.tasks.length > 0) {
          return 'rgb(251,254,133)';
  
        } else {
          return 'white';
        }
      })
      .attr('stroke', 'rgb(90,68,70)')
      .attr('stroke-width', '1px');
    // 高箱 需要加一条粗线
    g.append('path')
      .attr('d', (data) => {
        if(data.container.height + '' === '9.6') {
          return `M0 2 L${this.cellSize} 2`;
        } else {
          return `M0 0 L${this.cellSize} 0`;
        }
      })
      .attr('stroke', 'black')
      .attr('stroke-width', (data) => {
        if(data.container.height + '' === '9.6') {
          return 4;
        } else {
          return 1;
        }
      });
    g.append('text')
      .attr('font-size', '9')
      .attr('text-anchor', 'middle')
      .attr('dx', this.cellSize / 2)
      .attr('dy', this.cellSize / 1.2)
      .text((posInfo: YardposInfo) => posInfo.text ? posInfo.text : '');

    g.transition()
    .delay((posInfo: YardposInfo) => {
      let tier = (+posInfo.yardpos.slice(-2));
      return (tier) * 100;
    })
    .attr('transform', (posInfo: YardposInfo) => {
      let x = (parseInt(posInfo.yardpos.slice(6, 8), 10)) * this.cellSize;
      let y = (this.yardBay.maxTier - (+posInfo.yardpos.slice(-2))) * this.cellSize;
      return `translate(${x}, ${y})`;
    });
  }


  private padLeft(num, length, text = '0'): string {
    return (Array(length).join(text) + num).slice(-length);
  }

}
