import { ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, Output, EventEmitter } from '@angular/core';
import * as d3 from 'd3';
import { YardDetail } from 'app/model/yard-detail';
import { StorageAiDesignToolService } from 'app/storage-ai-design-tool/storage-ai-design-tool.service';
import { Observable } from 'rxjs/Observable';
import { YardPosInfo } from 'app/model/yard-pos-info';

@Component({
  selector: 'app-yard-detail-canvas',
  templateUrl: './yard-detail-canvas.component.html',
  styleUrls: ['./yard-detail-canvas.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class YardDetailCanvasComponent implements OnInit, OnChanges {

  host: d3.Selection<any, any, any, any>;
  svg: d3.Selection<any, any, any, any>;
  yardDetailCanvasGroup: d3.Selection<any, any, any, any>;
  rowLabelsGroup: d3.Selection<any, any, any, any>;
  oddBayLabelsGroup: d3.Selection<any, any, any, any>;
  evenBayLabelsGroup: d3.Selection<any, any, any, any>;
  
  

  // @Input() yardBayInfoList: YardBayInfo[] = [];  
  // displayYardBayInfoList: YardBayInfo[] = [];

  @Input() yardPosInfoList: YardPosInfo[] = [];  
  displayYardPosInfoList: YardPosInfo[] = [];

  @Output() onYardPosClicked: EventEmitter<YardPosInfo> = new EventEmitter();

  baseWidth = 6;
  baseHeight = 12;

  interval = 1;

  maxRow = 6;
  maxTier = 5;
  maxBay = 0;

  canvasWidth = 2000;
  canvasHeight = 100;

  pods = [];
  podColor;

  constructor(private el: ElementRef, private storageAI: StorageAiDesignToolService) {


  }

  ngOnInit() {
    this.host = d3.select(this.el.nativeElement);
    this.svg = this.host.select('svg')
      .attr('width', this.canvasWidth + 'px')
      .attr('height', this.canvasHeight + 'px');
    this.yardDetailCanvasGroup = this.svg.append('g')
      .attr('class', 'yard-detail-canvas-group')
      .attr('transform', 'translate(20, 20)');

    this.rowLabelsGroup = this.svg.append('g')
      .attr('class', 'row-labels-group')
      .attr('transform', 'translate(0, 20)');

    this.oddBayLabelsGroup = this.svg.append('g')
      .attr('class', 'odd-bay-labels-group')
      .attr('transform', 'translate(20, 0)');

  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes);
    // if (changes['yardBayInfoList']) {
    //   setTimeout(() => {
    //     this.processData();
    //     this.updateLayout();
    //   },0);
    // }
    if (changes['yardPosInfoList']) {
      setTimeout(() => {
        this.extractBasicInfo();
        this.processData2();
        this.updateLayout2();
      },0);
    }
  }
  
  extractBasicInfo() {
    this.maxRow = Math.max(...this.yardPosInfoList.map(d => +d.location.slice(6, 8)));
    this.maxTier = Math.max(...this.yardPosInfoList.map(d => +d.location.slice(-2)));
    this.maxBay = d3.set(this.yardPosInfoList.map(d => +d.location.slice(3, 6)).filter(bay => bay % 2 === 1)).values().length;

    this.pods = d3.set(this.yardPosInfoList.filter(pos => pos.container.pod), (pos) => pos.container.pod).values();
    this.podColor = d3.scaleOrdinal(d3.schemeCategory20);
    // console.log(color(this.pods[0]));


  }


  processData2() {
    // this.displayYardPosInfoList = this.displayYardPosInfoList.filter((pos) => (+pos.location.slice(3, 6) % 2 === 1));
    // this.displayYardBayInfoList = [];
    this.displayYardPosInfoList = [];
    let bayInfo = [];
    this.yardPosInfoList.forEach((pos, idx) => {
      let bay = +pos.location.slice(3, 6);
      if (bayInfo[bay]) {
        if (pos.container.ctnno) {
          bayInfo[bay] += 1;
        }   
      } else {
        if (pos.container.ctnno) {
          bayInfo[bay] = 1;
        } else {
          bayInfo[bay] = 0;
        }
      }
    });

    bayInfo.forEach((containerCount, idx) => {
      // console.log(containerCount, idx)
      
        if (containerCount > 0) {
          let poses = this.yardPosInfoList.filter(pos => +pos.location.slice(3, 6) === idx);
          this.displayYardPosInfoList = [...poses, ...this.displayYardPosInfoList]
        } else if( (idx) % 2 === 1 && 
                   (bayInfo[idx + 1] === undefined || bayInfo[idx + 1] === 0) &&
                   (bayInfo[idx - 1] === undefined || bayInfo[idx - 1] === 0)) {
          // 如果是基数贝，则向前向后找其偶数倍是否存在占位信息，若不存在则需要画该基数贝
          let poses = this.yardPosInfoList.filter(pos => +pos.location.slice(3, 6) === idx);
          this.displayYardPosInfoList = [...poses, ...this.displayYardPosInfoList]
        }
      });



    // this.displayYardPosInfoList = this.displayYardPosInfoList.filter((pos) => (+pos.location.slice(3, 6) % 2 === 0));
  }

  updateLayout2() {
    // if (!this.yardDetailCanvasGroup) {
    //   return;
    // }

    let rowLabels = this.rowLabelsGroup
      .selectAll('g.row-label')
      .data(d3.range(this.maxRow));
    
    let rowLabel = rowLabels.enter().append('g')
      .attr('class', 'row-label')
      .attr('transform', (data) => {
        return `translate(0, ${data * this.baseHeight})`
      });
    rowLabel.append('text')
      .attr('width', 20)
      .attr('height', this.baseHeight)
      .attr('font-size', '9')
      .attr('text-anchor', 'middle')
      .attr('dx', 15)
      .attr('dy', this.baseHeight / 1.2)
      .text(c => c + 1);

    rowLabels.exit().remove();

    let oddBayLabels = this.oddBayLabelsGroup
      .selectAll('g.odd-bay-label')
      .data(d3.range(0, this.maxBay * 2, 2));
    
    let oddBayLabel = oddBayLabels.enter().append('g')
      .attr('class', 'odd-bay-label')
      .attr('transform', (data, idx) => {
        return `translate(${idx * this.baseWidth * this.maxTier + this.interval * data}, 0)`
      });
    oddBayLabel.append('text')
      .attr('width', (data, idx) => idx * this.baseWidth * this.maxTier + this.interval * data)
      .attr('height', 20)
      .attr('font-size', '9')
      .attr('text-anchor', 'middle')
      .attr('dx', 12)
      .attr('dy', this.baseHeight)
      .text(c => c + 1);
    oddBayLabels.exit().remove();

    




    let yardPoses = this.yardDetailCanvasGroup
      .selectAll('g.yard-pos')
      .data(this.displayYardPosInfoList, (data) => JSON.stringify(data));

    let pos = yardPoses.enter().append('g')
      .attr('class', 'yard-pos')
      .attr('transform', (data) => {
        let x = (parseInt(data.location.slice(6, 8), 10)) * this.baseWidth;
        let y = (this.maxTier - (+data.location.slice(-2))) * this.baseHeight;
        return `translate(${x}, ${y})`;
        // let x = 0
        // let bay = +data.location.slice(3, 6);
        // let row = +data.location.slice(6, 8);
        // let tier = +data.location.slice(-2);
        // if (bay % 2 === 1) {
        //   // 基数贝
        //   x = (bay - 1) / 2 * (this.maxTier * this.baseWidth);
        //   x = x + (tier - 1) * this.baseWidth;
        // } else {
        //   x = ((bay / 2) - 1) * (this.maxTier * this.baseWidth);
        //   x = x + (tier - 1) * this.baseWidth * 2;
        // }
        // x = x + (bay - 1) * this.interval;
        // let y = this.baseHeight * (row - 1);
        // return `translate(${x}, ${y})`;
      })
      .on('click', (data) => {
        console.log(data);
        this.onYardPosClicked.emit(data);

      });
    // bay.append('rect')
    // .attr('width', (data) => {
    //   let bay = +data.location.slice(3, 6);
    //   if (bay % 2 === 1) {
    //     // 基数贝
    //     return this.baseWidth;
    //   } else {
    //     return this.baseWidth * 2;
    //   }
    // }).attr('height', this.baseHeight)

    pos.transition()
    .delay((yardPosInfo: YardPosInfo) => {
      let bay = +yardPosInfo.location.slice(3, 6);
      let row = +yardPosInfo.location.slice(6, 8);
      let tier = (+yardPosInfo.location.slice(-2));
      
      return bay * 10 + (row) * 10 + tier * 10;
    })
    .attr('transform', (data: YardPosInfo) => {
      let x = 0
      let bay = +data.location.slice(3, 6);
      let row = +data.location.slice(6, 8);
      let tier = +data.location.slice(-2);
      if (bay % 2 === 1) {
        // 基数贝
        x = (bay - 1) / 2 * (this.maxTier * this.baseWidth);
        x = x + (tier - 1) * this.baseWidth;
      } else {
        x = ((bay / 2) - 1) * (this.maxTier * this.baseWidth);
        x = x + (tier - 1) * this.baseWidth * 2;
      }
      x = x + (bay - 1) * this.interval;
      let y = this.baseHeight * (row - 1);
      return `translate(${x}, ${y})`;
      // let x = (parseInt(yardPosInfo.location.slice(6, 8), 10)) * this.baseWidth;
      // let y = (this.maxTier - (+yardPosInfo.location.slice(-2))) * this.baseHeight;
      // return `translate(${x}, ${y})`;
    });

    pos.append('path')
    .attr('d', (data) => {
      let bay = +data.location.slice(3, 6);
      let width = 0;
      if (bay % 2 === 1) {
        // 基数贝
        width = this.baseWidth;
      } else {
        width = this.baseWidth * 2;
      }
      
      let baseRect = `M0 0 L${width} 0 L${width} ${this.baseHeight} L0 ${this.baseHeight} Z`;
      let finalRect = baseRect;
      if (data.plans.length > 0 && data.plans.indexOf('封场') >= 0 ) {
        //有封场则画X表示
        finalRect = finalRect + ` M0 0 L${width} ${this.baseHeight} M${width} 0 L0 ${this.baseHeight}`

      }
      if (data.tasks.length > 0) {
        //有任务占位则画圈表示
        finalRect = finalRect + ` M0 ${this.baseHeight / 2} A${width / 2} ${width / 2} 0 0 1 ${width} ${this.baseHeight / 2}  M${width} ${this.baseHeight / 2} A${width / 2} ${width / 2} 0 0 1 ${0} ${this.baseHeight / 2}`

      }
      return finalRect

    })
    .attr('fill', (data) => {
      if (data.container.ctnno) {
        return this.podColor(data.container.pod);
        // return 'rgb(251,124,133)';
      } else if (data.plans.length > 0) {
        if (data.plans.indexOf('定位组') >= 0) {
          // return 'rgb(255,238,196)';
          return 'lightgrey';
        }
        // if (data.plans.indexOf('拖车限制') >= 0) {
        //   return 'rgb(139,172,161)';
        // }
        return 'white'
        // return data.plans[0] === '定位组' ? 'yellow' : 'darkgray';
      // } else if (data.tasks.length > 0) {
      //   return 'rgb(251,254,133)';

      } else {
        return 'white';
      }
    })
    .attr('stroke', 'rgb(90,68,70)')
    .attr('stroke-width', '1px');
    yardPoses.exit()
    .remove();


  }

  // processData() {
  //   this.displayYardBayInfoList = [];
  //   this.yardBayInfoList.forEach((yardBay, idx) => {
  //     if (yardBay.containerCount > 0) {
  //       this.displayYardBayInfoList.push(yardBay);
  //     } else if( (+yardBay.w) % 2 === 1 && 
  //                (!this.yardBayInfoList[idx + 1] || this.yardBayInfoList[idx + 1].containerCount === 0) &&
  //                (!this.yardBayInfoList[idx - 1] || this.yardBayInfoList[idx - 1].containerCount === 0)) {
  //       // 如果是基数贝，则向前向后找其偶数倍是否存在占位信息，若不存在则需要画该基数贝
  //       this.displayYardBayInfoList.push(yardBay);
  //     }
  //   });
  // }

  // updateLayout() {
  //   if (!this.yardDetailCanvasGroup) {
  //     return;
  //   }
  //   let yardBays = this.yardDetailCanvasGroup
  //     .selectAll('g.yard-bay')
  //     .data(this.displayYardBayInfoList, (data) => JSON.stringify(data));

  //   let bay = yardBays.enter().append('g')
  //     .attr('class', 'yard-bay')
  //     .attr('transform', (data) => {
  //       let x = 0
  //       if (+(data.w) % 2 === 1) {
  //         // 基数贝
  //         x = (+(data.w) - 1) / 2 * 10;
  //       } else {
  //         x = ((+(data.w)/ 2) - 1) * 10;
  //       }
        
  //       return `translate(${x}, 0)`;
  //     });
  //   bay.append('rect')
  //   .attr('width', (data) => {
  //     if (+(data.w) % 2 === 1) {
  //       // 基数贝
  //       return '10px';
  //     } else {
  //       return '20px';
  //     }
  //   }).attr('height', '50px')
  //   .attr('fill', (data) => {
  //     if (data.containerCount > 0) {
  //       return data.samePodCount > 0 ? 'green' : 'grey';
  //     }
  //     return 'white';
  //   })
  //   .attr('stroke', 'rgb(0,0,0)')
  //   .attr('stroke-width', '2px');


  //   yardBays.exit()
  //   .remove();

  // }

}

export interface YardBayInfo {
  qw: string;
  w: string;
  containerCount: number;
  taskCount: number;
  planCount: number;
  samePodCount: number;
}