import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges, Output, EventEmitter
} from '@angular/core';
import * as d3 from 'd3';
import { Observable } from 'rxjs/Observable';
import { YardposInfo } from '../../model/yardpos-info';
import { CtYardposParserService } from '../../../../tool/ct-yardpos-parser.service';
import { RenderOptions } from '../../model/render-options';



@Component({
  selector: 'ct-yard',
  templateUrl: './ct-yard.component.html',
  styleUrls: ['./ct-yard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CtYardComponent implements OnInit, OnChanges {
  host: d3.Selection<any, any, any, any>;
  svg: d3.Selection<any, any, any, any>;
  yardGroup: d3.Selection<any, any, any, any>;
  rowLabelsGroup: d3.Selection<any, any, any, any>;
  oddBayLabelsGroup: d3.Selection<any, any, any, any>;
  evenBayLabelsGroup: d3.Selection<any, any, any, any>;
  displayYardposInfoList: YardposInfo[] = [];

  interval = 1;

  maxRow = 6;
  maxTier = 5;
  maxBay = 0;

  // TODO: 根据数据自动计算
  canvasWidth = 2000;
  canvasHeight = 100;

  pods = [];
  podColor;

  block = '';

  private _renderOptions: RenderOptions<YardposInfo>;

  @Input() set renderOptions(options: RenderOptions<YardposInfo>){
    this._renderOptions = options;
    setTimeout(() => {
      this.redraw();
    }, 0);
  }

  get renderOptions() {
    return this._renderOptions;
  }

  @Input() yardposInfoList: YardposInfo[] = [];
  @Input() baseWidth = 6;
  @Input() baseHeight = 12;
  @Input() rotation = 0;

  @Output() onYardposClicked: EventEmitter<YardposInfo> = new EventEmitter();

  constructor(private el: ElementRef, private yardposParser: CtYardposParserService) { }

  ngOnInit() {
    this.host = d3.select(this.el.nativeElement);
    this.svg = this.host.select('svg')
      .attr('width', this.canvasWidth + 'px')
      .attr('height', this.canvasHeight + 'px');
    this.yardGroup = this.svg.append('g')
      .attr('class', 'ct-yard-group')
      .attr('transform', 'translate(20, 20)');

    this.rowLabelsGroup = this.svg.append('g')
      .attr('class', 'row-labels-group')
      .attr('transform', 'translate(0, 20)');

    this.oddBayLabelsGroup = this.svg.append('g')
      .attr('class', 'odd-bay-labels-group')
      .attr('transform', 'translate(20, 0)');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['yardposInfoList']) {
      if (this.yardposInfoList.length > 0) {
        this.block = this.yardposParser.getQ(this.yardposInfoList[0].yardpos);
      } else {
        this.block = '';
      }
      setTimeout(() => {
        this.notifyDataUpdated();
      }, 0);
    }
    if (changes['rotation'] && !changes['rotation'].firstChange) {
      setTimeout(() => {
        this.redraw();
      }, 0);

    }
  }


  /**
   * 当yardposInfoList里面的相关属性发生变化时，通知视图进行刷行
   */
  notifyDataUpdated() {
    this.extractBasicInfo();
    this.processData();
    this.redraw();
  }


  /**
   * 从场地位置信息数组中剔除箱区基础数据，即:
   * maxBay: 小贝个数
   * maxRow: 最大列
   * maxTier: 最大层
   * pods: 所有卸货港数组
   */
  extractBasicInfo() {

    this.maxRow = Math.max(...this.yardposInfoList.map(d => +this.yardposParser.getP(d.yardpos)));
    this.maxTier = Math.max(...this.yardposInfoList.map(d => +this.yardposParser.getC(d.yardpos)));
    this.maxBay = d3.set(this.yardposInfoList.map(d => +this.yardposParser.getW(d.yardpos)).filter(bay => bay % 2 === 1)).values().length;
    this.pods = d3.set(this.yardposInfoList.filter(pos => pos.container && pos.container.pod), (pos) => pos.container.pod).values();
    this.podColor = d3.scaleOrdinal(d3.schemeCategory20);
  }

  /**
   * 数据预处理，从所有数据中提取出需要显示的数据
   */
  processData() {
    this.displayYardposInfoList = [];
    let bayInfo = [];
    // 计算每个场地位置是否含有集装箱、任务、计划
    this.yardposInfoList.forEach((pos, idx) => {
      let bay = +this.yardposParser.getW(pos.yardpos);
      if (!bayInfo[bay]) {
        bayInfo[bay] = {
          containerCount: 0,
          planCount: 0,
          taskCount: 0
        };
      }
      if (pos.container && pos.container.ctnno) {
        bayInfo[bay].containerCount += 1;
      }
      if (pos.plans.length > 0) {
        bayInfo[bay].planCount += 1;
      }
      if (pos.tasks.length > 0) {
        bayInfo[bay].taskCount += 1;
      }

    });
    // console.log(bayInfo);

    bayInfo.forEach((info, idx) => {
      // 如果是基数贝，则向前向后找其偶数倍是否存在占位信息，若不存在则需要画该基数贝
      if ((idx) % 2 === 1) {
        if ((bayInfo[idx + 1] === undefined ||
            (bayInfo[idx + 1].containerCount === 0 &&
            bayInfo[idx + 1].taskCount === 0 &&
            bayInfo[idx + 1].planCount === 0)) &&
           ((bayInfo[idx - 1] === undefined ||
            bayInfo[idx - 1].containerCount === 0 &&
            bayInfo[idx - 1].taskCount === 0 &&
            bayInfo[idx - 1].planCount === 0))) {
          let poses = this.yardposInfoList.filter(pos => +this.yardposParser.getW(pos.yardpos) === idx);
          this.displayYardposInfoList = [...poses, ...this.displayYardposInfoList];
        }
      } else {
        if (info.containerCount > 0 || info.planCount > 0 || info.taskCount > 0) {
          let poses = this.yardposInfoList.filter(pos => +this.yardposParser.getW(pos.yardpos) === idx);
          this.displayYardposInfoList = [...poses, ...this.displayYardposInfoList];
        }
      }

      // if (info.containerCount > 0 || info.taskCount > 0) {
      //   let poses = this.yardposInfoList.filter(pos => +this.yardposParser.getW(pos.yardpos) === idx);
      //   this.displayYardposInfoList = [...poses, ...this.displayYardposInfoList]
      // } else if ((idx) % 2 === 1 &&
      //   (bayInfo[idx + 1] === undefined || (bayInfo[idx + 1].containerCount === 0 || bayInfo[idx + 1].taskCount === 0 || bayInfo[idx + 1].planCount === 0)) &&
      //   (bayInfo[idx - 1] === undefined || (bayInfo[idx - 1].containerCount === 0 || bayInfo[idx - 1].taskCount === 0 || bayInfo[idx - 1].planCount === 0))) {
      //   // 如果是基数贝，则向前向后找其偶数倍是否存在占位信息，若不存在则需要画该基数贝
      //   let poses = this.yardposInfoList.filter(pos => +this.yardposParser.getW(pos.yardpos) === idx);
      //   this.displayYardposInfoList = [...poses, ...this.displayYardposInfoList]
      // } else {
      //   // 如果基数贝有计划信息，查其前后偶数贝是否包含计划信息，若包含则不画该基数贝
      //   if (info.planCount > 0 && (idx) % 2 === 1 &&
      //     (bayInfo[idx + 1] === undefined || bayInfo[idx + 1].planCount === 0) &&
      //     (bayInfo[idx - 1] === undefined || bayInfo[idx - 1].planCount === 0)
      //   ) {
      //     let poses = this.yardposInfoList.filter(pos => +this.yardposParser.getW(pos.yardpos) === idx);
      //     this.displayYardposInfoList = [...poses, ...this.displayYardposInfoList]
      //   }
      // }
    });
  }

  /**
   * 视图渲染
   */
  redraw() {
    // 绘制列标签
    this.rowLabelsGroup.selectAll('g.row-label').remove();
    let rowLabels = this.rowLabelsGroup
      .selectAll('g.row-label');
    if (this.rotation === 90) {
      rowLabels = rowLabels.data(d3.range(this.maxRow));
    } else {
      rowLabels = rowLabels.data(d3.range(this.maxTier));
    }
    let rowLabel = rowLabels.enter().append('g')
    .attr('class', 'row-label')
    .attr('transform', (data: number) => {
      if (this.rotation === 90) {
        return `translate(0, ${data * this.baseHeight})`;
      } else {
        return `translate(0, ${(this.maxTier - data - 1) * this.baseHeight})`;
      }
    });


    rowLabel.append('text')
      .attr('width', 20)
      .attr('height', this.baseHeight)
      .attr('font-size', '9')
      .attr('text-anchor', 'middle')
      .attr('dx', 15)
      .attr('dy', this.baseHeight / 1.2)
      .text((c: number) => c + 1);
    rowLabels.exit().remove();

    // 绘制基数贝标签
    this.oddBayLabelsGroup.selectAll('g.odd-bay-label').remove();
    let oddBayLabels = this.oddBayLabelsGroup
      .selectAll('g.odd-bay-label')
      .data(d3.range(0, this.maxBay * 2, 2));
    let oddBayLabel = oddBayLabels.enter().append('g')
      .attr('class', 'odd-bay-label')
      .attr('transform', (data, idx) => {
        let x = 0;
        if (this.rotation === 90) {
          x = idx * this.baseWidth * this.maxTier + this.interval * data
        } else {
          x = idx * this.baseWidth * this.maxRow + this.interval * data
        }
        return `translate(${x}, 0)`
      });
    oddBayLabel.append('text')
      .attr('width', (data, idx) => {
        if (this.rotation === 90) {
          return idx * this.baseWidth * this.maxTier + this.interval * data
        } else {
          return idx * this.baseWidth * this.maxRow + this.interval * data
        }
      })
      .attr('height', 20)
      .attr('font-size', '9')
      .attr('text-anchor', 'middle')
      .attr('dx', 12)
      .attr('dy', this.baseHeight)
      .text(c => c + 1);
    oddBayLabels.exit().remove();

    // TODO: 绘制偶数贝标签



    let yardPoses = this.yardGroup
      .selectAll('g.yardpos')
      .data(this.displayYardposInfoList, (data) => JSON.stringify(data));

      // 更新
      yardPoses.transition()
      .attr('transform', (posInfo: YardposInfo) => {
        return this._transformFunction(posInfo)
      });
      yardPoses.selectAll('path.cell')
      .transition()
      .attr('fill', (data: YardposInfo) => {
        return this._fillFunction(data);
      })

          // 高箱 需要加一条粗线
      yardPoses.selectAll('path.ctn-height')
      .transition()
      .attr('d', (data: YardposInfo) => {
        if (data.container && data.container.height + '' === '9.6') {
          let factor = 1;
          if (data.container.size !== '20') {
            factor = 2
          }
          return `M0 2 L${this.baseWidth * factor } 2`;
        } else {
          return `M0 0 L${this.baseWidth} 0`;
        }
      })
      .attr('stroke', 'black')
      .attr('stroke-width', (data: YardposInfo) => {
        if (data.container && data.container.height + '' === '9.6') {
          return 4;
        } else {
          return 1;
        }
      });


    let pos = yardPoses.enter().append('g')
      .attr('class', 'yardpos')
      .attr('transform', (posInfo) => {
        let x = 0;
        let y = 0;
        let bay = +this.yardposParser.getW(posInfo.yardpos);
        let row = +this.yardposParser.getP(posInfo.yardpos);
        let tier = +this.yardposParser.getC(posInfo.yardpos);
        if (this.rotation === 90) {
          if (bay % 2 === 1) {
            // 基数贝
            x = (bay - 1) / 2 * (this.maxTier * this.baseWidth);
            x = x + (tier - 1) * this.baseWidth;
          } else {
            x = ((bay / 2) - 1) * (this.maxTier * this.baseWidth);
            x = x + (tier - 1) * this.baseWidth * 2;
          }
          x = x + (bay - 1) * this.interval;
          y = this.baseHeight * (row - 1);
        } else {
          if (bay % 2 === 1) {
            // 基数贝
            x = (bay - 1) / 2 * (this.maxRow * this.baseWidth);
            x = x + (row - 1) * this.baseWidth;
          } else {
            x = ((bay / 2) - 1) * (this.maxRow * this.baseWidth);
            x = x + (row - 1) * this.baseWidth * 2;
          }
          x = x + (bay - 1) * this.interval;
          y = this.baseHeight * (this.maxTier - tier);
        }


        return `translate(${x + 8}, ${y})`;
      })
      .attr('opacity', '0')
      .on('mouseover', function(data, i, nodes) {
        d3.select(nodes[i]).select('path').attr('fill', 'grey');
      })
      .on('mouseleave', (data, i, nodes) => {
        d3.select(nodes[i]).select('path').attr('fill', (d) => this._fillFunction(data));
      })
      .on('click', (data) => {
        console.log(data);
        this.onYardposClicked.emit(data);
      });



    pos.transition()
      .delay((posInfo: YardposInfo) => {
        let bay = +this.yardposParser.getW(posInfo.yardpos);
        return bay * 10;
      })
      .duration(500)
      .ease(d3.easeCubicOut)
      .attr('transform', (posInfo) => {
        return this._transformFunction(posInfo)
      })
      .attr('opacity', (posInfo: YardposInfo) => {
        return 1;
      })


    pos.append('path')
      .attr('class', 'cell')
      .attr('d', (data) => {
        let bay = +this.yardposParser.getW(data.yardpos);
        let width = 0;
        if (bay % 2 === 1) {
          // 基数贝
          width = this.baseWidth;
        } else {
          width = this.baseWidth * 2;
        }

        let baseRect = `M0 0 L${width} 0 L${width} ${this.baseHeight} L0 ${this.baseHeight} Z`;
        let finalRect = baseRect;
        if (data.isLocked) {
          // 有封场则画X表示
          finalRect = finalRect + ` M0 0 L${width} ${this.baseHeight} M${width} 0 L0 ${this.baseHeight}`

        }
        if (data.tasks.length > 0) {
          // 有任务占位则画圈表示
          finalRect = finalRect +
            ` M0 ${this.baseHeight / 2} A${width / 2} ${width / 2} 0 0 1 ${width} ${this.baseHeight / 2}` + // 上半圈
            ` M${width} ${this.baseHeight / 2} A${width / 2} ${width / 2} 0 0 1 ${0} ${this.baseHeight / 2}`// 下半圈

        }
        return finalRect

      })
      .attr('fill', (data) => {
        return this._fillFunction(data);
      })
      .attr('stroke', 'rgb(90,68,70)')
      .attr('stroke-width', '1px');


    // 高箱 需要加一条粗线
    pos.append('path')
    .attr('class', 'ctn-height')
    .attr('d', (data) => {
      if (data.container && data.container.height + '' === '9.6') {
        let factor = 1;
        if (data.container.size !== '20') {
          factor = 2
        }
        return `M0 2 L${this.baseWidth * factor } 2`;
      } else {
        return `M0 0 L${this.baseWidth} 0`;
      }
    })
    .attr('stroke', 'black')
    .attr('stroke-width', (data) => {
      if (data.container && data.container.height + '' === '9.6') {
        return 4;
      } else {
        return 1;
      }
    });
    yardPoses.exit()
      .transition()
      .attr('opacity', '0')
      .attr('transform', 'scale(0.5)')
      .remove();


  }


  private _fillFunction(data: YardposInfo) {
    // 如果提供了填充色选项则使用填充色选项的配置
    if (this.renderOptions && this.renderOptions.fill) {
      if (typeof(this.renderOptions.fill) === 'string') {
        return this.renderOptions.fill;
      } else {
        return this.renderOptions.fill(data);
      }
    } else {
      // 默认填充色配置
      if (data.container && data.container.ctnno) {
        return this.podColor(data.container.pod);
      } else if (data.plans.length > 0) {
        if (data.plans.filter(p => p.planType === '定位组').length > 0) {
          return 'lightgrey';
        }
        return 'white'
      } else {
        return 'white';
      }
    }
  }

  private _transformFunction(posInfo: YardposInfo) {
    let x = 0;
    let y = 0;
    let bay = +this.yardposParser.getW(posInfo.yardpos);
    let row = +this.yardposParser.getP(posInfo.yardpos);
    let tier = +this.yardposParser.getC(posInfo.yardpos);
    if (this.rotation === 90) {
      if (bay % 2 === 1) {
        // 基数贝
        x = (bay - 1) / 2 * (this.maxTier * this.baseWidth);
        x = x + (tier - 1) * this.baseWidth;
      } else {
        x = ((bay / 2) - 1) * (this.maxTier * this.baseWidth);
        x = x + (tier - 1) * this.baseWidth * 2;
      }
      x = x + (bay - 1) * this.interval;
      y = this.baseHeight * (row - 1);
    } else {
      if (bay % 2 === 1) {
        // 基数贝
        x = (bay - 1) / 2 * (this.maxRow * this.baseWidth);
        x = x + (row - 1) * this.baseWidth;
      } else {
        x = ((bay / 2) - 1) * (this.maxRow * this.baseWidth);
        x = x + (row - 1) * this.baseWidth * 2;
      }
      x = x + (bay - 1) * this.interval;
      y = this.baseHeight * (this.maxTier - tier);
    }
    return `translate(${x}, ${y})`;
  }



}
