import { YardDetail } from './model/yard-detail';
import { StorageAiDesignToolService } from './storage-ai-design-tool/storage-ai-design-tool.service';
import { Container } from './model/container';
import { YardposInfo } from './model/yardpos-info';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { YardBay } from './model/yard-bay';
import { Yard } from './model/yard';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
// import { YardInfo } from 'app/storage-ai-design-tool/yard-canvas/yard-canvas.component';
// import { YardBayInfo } from 'app/storage-ai-design-tool/yard-detail-canvas/yard-detail-canvas.component';

import * as Highcharts from 'highcharts';
import * as Histogram from 'highcharts/modules/histogram-bellcurve';
import { CtMockService } from './ct-mock.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('expandInAnimation', [
      state('*',
        style({
          opacity: 1,
          transform: 'scale(1)',
        })
      ),
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'scale(0.8)',
        }),
        animate('300ms ease-in')
      ]),
    ]),
    trigger('shrinkOutAnimation', [
      state('*',
        style({
          opacity: 1,
          transform: 'scaleY(1)',
        })
      ),
      transition(':leave', [
        animate('300ms ease-out', style({
          opacity: 0,
          transform: 'scale(0.8)',
        }))
      ])
    ])
  ]
})

export class AppComponent implements OnInit {

  searchTerm = '';
  yards: Yard[] = [];
  yardBays: YardBay[] = [];
  aimContainer: Container;
  selectedContainer: Container = null;





  // yardBayInfoList: YardBayInfo[] = []
  // yardDetails: Array<Array<YardBayInfo>> = []
  yardPoses: Array<Array<YardposInfo>> = []
  yardposInfoList: YardposInfo[] = []

  yardBay: YardBay = {
    name: null,
    maxRow: 0,
    maxTier: 0,
    YardposInfoArray: []
  };

  // 自动播放计时器ID
  timerId: number;
  // 选位计算过程的快照
  snapshot: Snapshot;
  // 当前选中的operation
  currentOperation: Operation;
  // 当前选中的Operation所属Stage
  currentStage: Stage;
  charts = ['count-trends', 'weight-distribution'];
  currentChart = 'count-trends';

  // 全场俯视图组件
  @ViewChild('yardCanvas') yardCanvas;


  constructor(private storageAI: StorageAiDesignToolService, private mock: CtMockService) {
    Histogram(Highcharts);
  }
  // vesType: string = 'OCL TOKY';
  // bayNo: string = '006';
  // bayList = ['002', '006', '010', '014', '018', '022', '026', '030', '034', '038', '042', '046', '050', '054', '058', '062', '066', '070', '074'];
  public ngOnInit(): void {
    // 测试数据1
    // this.aimContainer = {
    //   shippingLine: 'FE4',
    //   ctnno: 'AAAA0000000',
    //   size: '20',
    //   height: '8.6',
    //   type: 'GP',
    //   pod: 'BEANR',
    //   weight: 29050 / 1000.0,
    //   vesselNameIn: '',
    //   voyageIn: '',
    //   vesselNameOut: 'AFIF',
    //   voyageOut: '002W',
    // };
    // this.mock.getYardposInfoList().subscribe((data) => {
    //   console.log(data);
    // });


    this.aimContainer = {
      shippingLine: 'NEU5-OA',
      ctnno: 'AAAA0000000',
      size: '40',
      height: '8.6',
      type: 'GP',
      status: 'F',
      pod: 'NLRTM',
      weight: 29050,
      vesselNameIn: '',
      voyageIn: '',
      vesselNameOut: 'RAFFS',
      voyageOut: '067FM',
    };
    this.activeChart('count-trends');




    // 绘制箱区详情测试
    this.storageAI.getLocations('*3L').subscribe((data: any[]) => {
      this.yardposInfoList = this.proecssData(data);

    })

  }

  /**
   * 压黏测试
   */
  yaNianDemo() {
    this.yardBays = [];
    this.yardPoses = [];
    this.storageAI.yaNian(this.aimContainer).subscribe((snapshot: Snapshot) => {
      this.snapshot = snapshot;
    });
  }

  /**
   * 靠黏测试
   */
  kaoNianDemo() {
    this.yardBays = [];
    this.yardPoses = [];
    this.storageAI.kaoNian(this.aimContainer).subscribe((snapshot: Snapshot) => {
      this.snapshot = snapshot;
      // let stage = snapshot.stages[0];
      // let posesAll = this.proecssData(stage.locations)
      // this.redrawYardBays(posesAll);
    });
  }

  /**
   * 开新位测试
   */
  kaiXinWeiDemo() {
    this.yardBays = [];
    this.yardPoses = [];
    this.storageAI.kaiXinWei(this.aimContainer).subscribe((snapshot: Snapshot) => {
      this.snapshot = snapshot;
    });
  }

  /**
   * 内抢测试
   */
  neiQiangDemo() {
    this.yardBays = [];
    this.yardPoses = [];
    this.storageAI.neiQiang(this.aimContainer).subscribe((snapshot: Snapshot) => {
      this.snapshot = snapshot;
      // let stage = snapshot.stages[0];
      // let posesAll = this.proecssData(stage.locations)
      // this.redrawYardBays(posesAll);
    });
  }

  /**
   * 外抢测试
   */
  waiQiangDemo() {
    this.yardBays = [];
    this.yardPoses = [];
    this.storageAI.waiQiang(this.aimContainer).subscribe((snapshot: Snapshot) => {
      this.snapshot = snapshot;
      // let stage = snapshot.stages[0];
      // let posesAll = this.proecssData(stage.locations)
      // this.redrawYardBays(posesAll);
    });
  }

  /**
   * 混吨港测试
   */
  hunDunGangDemo() {
    this.yardBays = [];
    this.yardPoses = [];
    this.storageAI.hunDunGang(this.aimContainer).subscribe((snapshot: Snapshot) => {
      this.snapshot = snapshot;
      // let stage = snapshot.stages[0];
      // let posesAll = this.proecssData(stage.locations)
      // this.redrawYardBays(posesAll);
    });
  }

  /**
   * 自动播放当前的Operations
   * @param interval 时间间隔 ms
   */
  autoPlay(interval: number) {
    if (this.timerId) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
    let stageCounter = 0;
    let operationCounter = 0;
    if (this.snapshot && this.snapshot.stages.length > 0) {
      this.playStage(this.snapshot.stages[stageCounter]);
      this.timerId = window.setInterval(() => {

        if (operationCounter >= this.snapshot.stages[stageCounter].operations.length) {
          operationCounter = 0;
          stageCounter += 1;
          if (stageCounter >= this.snapshot.stages.length) {
            window.clearInterval(this.timerId);
            return;
          }
          this.playStage(this.snapshot.stages[stageCounter]);
        }

        this.doOperation(this.snapshot.stages[stageCounter].operations[operationCounter]);
        operationCounter += 1;

      }, interval);

    }
    // if (this.operations && this.operations.length > 0) {
    //   this.currentOperation = this.operations[0];
    //   let counter = 0;
    //   this.timerId = window.setInterval(() => {
    //     this.doOperation(this.operations[counter]);
    //     counter += 1;
    //     console.log(counter);
    //     if (counter >= this.operations.length) {
    //       window.clearInterval(this.timerId);
    //     }
    //   }, interval);
    // }
  }

  playStage(stage: Stage) {
    this.currentStage = stage;
    let posesAll = this.proecssData(stage.locations);
    this.redrawYardBays(posesAll);
    if (stage.blockLocations) {
      let blockPosesAll = this.proecssData(stage.blockLocations);
      this.redrawBlocks(blockPosesAll);
    }
  }

  activeChart(chart) {
    console.log(chart);
    this.currentChart = chart;
    if (this.currentChart === 'weight-distribution') {
      this.storageAI.getWeightDistribution(this.aimContainer, true).subscribe((his: number[][]) => {
        this.storageAI.getWeightDistribution(this.aimContainer, false).subscribe((current: number[]) => {
          let series = his.map((weightList, i) => {
            return {
              name: '历史重量分布' + i,
              type: 'bellcurve',
              xAxis: 0,
              yAxis: 0,
              baseSeries: 'his' + i,
              zIndex: -1
            }
          });

          let baseSeries = his.map((weightList, i) => {
            return {
              name: '历史重量' + i,
              type: 'scatter',
              data: weightList,
              id: 'his' + i,
              visible: false
            }
          });
          
          let currentSeries = {
                name: '在场重量分布',
                type: 'bellcurve',
                xAxis: 0,
                yAxis: 0,
                color: 'rgba(0, 200, 200, 0.1)',
                baseSeries: 'current',
                zIndex: 1
          };
          let currentBaseSeries =  {
                name: '在场重量',
                type: 'scatter',
                data: current,
                id: 'current',
                visible: false
              };

            
          Highcharts.chart('weight-chart', {
            title: {
              text: '箱组 在场-历史重量分布'
            },
            xAxis: [{
              title: { text: '箱重（千克）' },
              opposite: true
            }],
  
            yAxis: [{
              title: { text: '概率密度' },
              opposite: true
            }],
            credits: {
              enabled: false
            },
            series: [...series, currentSeries, ...baseSeries, currentBaseSeries]
  
            // series: [
            //   {
            //     name: '历史重量分布',
            //     type: 'bellcurve',
            //     xAxis: 0,
            //     yAxis: 0,
            //     baseSeries: 'his',
            //     zIndex: -1
            //   },
            //   {
            //     name: '在场重量分布',
            //     type: 'bellcurve',
            //     xAxis: 0,
            //     yAxis: 0,
            //     color: 'rgba(0, 200, 200, 0.1)',
            //     baseSeries: 'current',
            //     zIndex: -2
            //   },
            //   {
            //     name: '历史重量',
            //     type: 'scatter',
            //     data: his,
            //     id: 'his',
            //     visible: false
            //   },
            //   {
            //     name: '在场重量',
            //     type: 'scatter',
            //     data: current,
            //     id: 'current',
            //     visible: false
            //   }]
          });
        });
      });
    }

    if(this.currentChart === 'count-trends') {
      this.storageAI.getHisContainerCount(this.aimContainer).subscribe((data: any[]) => {
        Highcharts.chart('line-chart',
          {
            // chart: {
            //     type: 'column'
            // },
            title: {
              text: '历史箱量趋势图'
            },
            xAxis: {
              type: "datetime",
              // categories: data.map((d) => d.timeIn)
              categories: data.map((d) => {
                let date = new Date(Date.parse(d.timeIn));
                return date.toLocaleDateString();
              })
            },
            yAxis: {
              title: {text: '自然箱个数'}
            },
            credits: {
              enabled: false
            },
            plotOptions: {
              column: {
                // 关于柱状图数据标签的详细配置参考：https://api.hcharts.cn/highcharts#plotOptions.column.dataLabels
                dataLabels: {
                  enabled: true,
                  // verticalAlign: 'top', // 竖直对齐方式，默认是 center
                  inside: true
                }
              }
            },
            series: [{
              name: `${this.aimContainer.shippingLine}-${this.aimContainer.pod}-${this.aimContainer.size}-${this.aimContainer.type}-${this.aimContainer.height}`,
              data: data.map((d) => d.ctnCount)
            }]
          });
      });
    }
  }


  /**
   * 根据场地位置信息数组绘制各个区位
   * @param locations 场地位置信息数组
   */
  redrawYardBays(yardposInfoList: YardposInfo[]) {
    this.yardBays = [];
    let yardBayNames = d3.set(yardposInfoList, (pos) => pos.yardpos.slice(0, 6)).values();
    yardBayNames.forEach((yardBayName) => {
      let poses = yardposInfoList.filter(pos => pos.yardpos.indexOf(yardBayName) !== -1);
      let dataUpdatedSource = new Subject<void>();
      let yardBay = {
        name: yardBayName,
        maxRow: Math.max(...poses.map(d => +d.yardpos.slice(6, 8))),
        maxTier: Math.max(...poses.map(d => +d.yardpos.slice(-2))),
        YardposInfoArray: poses,
        dataUpdated: dataUpdatedSource.asObservable(),
        dataUpdatedSource: dataUpdatedSource
      };
      this.yardBays.push(yardBay);
    });
  }

  /**
   * 根据场地位置信息数组绘制各个箱区详情图
   * @param locations 场地位置信息数组
   */
  redrawBlocks(yardposInfoList: YardposInfo[]) {
    this.yardPoses = [];
    let yardNames = d3.set(yardposInfoList, (pos) => pos.yardpos.slice(0, 3)).values();
    yardNames.forEach((yardName) => {
      let poses = yardposInfoList.filter(pos => pos.yardpos.indexOf(yardName) !== -1);
      this.yardPoses.push(poses);
    });
  }

  private padLeft(num, length, text = '0'): string {
    return (Array(length).join(text) + num).slice(-length);
  }


  doOperation(operation: Operation) {
    this.currentOperation = operation;
    // 先将所有标记色清空
    this.yardBays.forEach((bay) => {
      bay.YardposInfoArray.forEach(pos => {
        pos.fill = null;
        pos.text = null
      });
      setTimeout(() => bay.dataUpdatedSource.next(), 0);
    });
    let poses = this.proecssData(operation.markedLocations);
    if (operation.action === '过滤') {
      poses.forEach((pos) => {
        this.updateYardposInfo(pos, { fill: 'skyblue' });
      });
    }

    if (operation.action === '排序') {
      let poses = this.proecssData(operation.markedLocations);
      poses.forEach((pos, idx) => {
        this.updateYardposInfo(pos, { text: idx + 1, fill: 'skyblue' });
      });
    }

    if (operation.action === '剔除') {
      let poses = this.proecssData(operation.markedLocations);
      poses.forEach((pos, idx) => {
        this.updateYardposInfo(pos, { text: idx + 1, fill: 'skyblue' });
      });
    }

    if (operation.action === '成功') {
      let poses = this.proecssData(operation.markedLocations);
      poses.forEach((pos, idx) => {
        this.updateYardposInfo(pos, { text: '√', fill: 'lightgreen' });
        this.onYardposInfoClicked(pos);
      });
    }

    // 开新位特殊operation
    if (operation.blocks) {
      // 在全场俯视图中标记这些箱区
      this.yardCanvas.yardData.forEach((yard) => yard.fill = null);
      let yards = this.yardCanvas.yardData.filter((yard) => operation.blocks.indexOf(yard.block) !== -1);
      yards.forEach((yard) => yard.fill = 'skyblue');
      this.yardCanvas.updateYardCanvas();
    }



    // if (operation.action === '失败') {
    //   let poses = this.proecssData(operation.markedLocations);
    //   console.log(poses.length)
    //   poses.forEach((pos, idx) => {
    //     this.updateYardposInfo(pos, {text: idx + 1, fill: 'lightgreen'});
    //   });
    // }


  }

  onOperationClicked(stage: Stage, operation: Operation) {
    // 如果在自动播放，先取消自动播放
    if (this.timerId) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }

    if (stage !== this.currentStage) {
      this.playStage(stage);
    }
    this.doOperation(operation);
  }

  onYardposInfoClicked(YardposInfo: YardposInfo) {
    if (YardposInfo.container) {
      this.selectedContainer = YardposInfo.container;
    } else {
      this.selectedContainer = null;
    }
  }

  // onYardClicked(yardInfo: YardInfo) {
  //   this.storageAI.getLocations(yardInfo.block).subscribe((data: any[]) => {
  //     this.YardposInfoList = this.proecssData(data);
  //   });
  // }

  onYardPosClicked(pos: YardposInfo) {
    let yardBayName = pos.yardpos.slice(0, 6);
    let poses = this.yardposInfoList.filter(pos => pos.yardpos.indexOf(yardBayName) !== -1);
    this.yardBay = {
      name: yardBayName,
      maxRow: Math.max(...poses.map(d => +d.yardpos.slice(6, 8))),
      maxTier: Math.max(...poses.map(d => +d.yardpos.slice(-2))),
      YardposInfoArray: poses

    };

  }

  /**
   * 更新场地位置相关信息并通知刷新视图
   * @param pos 要更新的场地位置
   * @param newValue 更新值
   */
  updateYardposInfo(pos: YardposInfo, updateValues?: any) {
    let yardBayName = pos.yardpos.slice(0, 6);
    // let yardBay: YardBay = this.yardBayMap[yardBayName];
    let yardBay: YardBay = this.yardBays.find(bay => bay.name === yardBayName);
    let idx = yardBay.YardposInfoArray.findIndex((p) => p.yardpos === pos.yardpos);
    if (idx >= 0) {
      Object.assign(yardBay.YardposInfoArray[idx], updateValues);
    }
    setTimeout(() => yardBay.dataUpdatedSource.next(), 0);
  }


  proecssData(data: any[]): YardposInfo[] {
    let posCounter = {};
    let yardposInfoList: YardposInfo[] = [];
    data.forEach((d) => {
      if (posCounter[d.yardpos]) {
        // 该场地位置已经添加过，则更新之前添加的信息
        let posInfo = yardposInfoList.find(pos => pos.yardpos === d.yardpos);
        if (d.taskCtnno) {
          posInfo.tasks.push({
            container: {
              shippingLine: d.taskShippingLine,
              ctnno: d.taskCtnno,
              pod: d.taskPod,
              size: d.taskCtnSize,
              type: d.taskCtnType,
              height: d.taskCtnHeight,
              status: d.ctnStatus,
              weight: d.ctnWeight,
              vesselNameIn: d.taskVesselName,
              voyageIn: d.taskYoyage,
              vesselNameOut: d.taskVesselName,
              voyageOut: d.taskYoyage,
            },
            type: d.taskType
          })
        }

        if (d.planType && d.planType === '定位组') {
          posInfo.plans.push({planType: d.planType})
        }
        if (d.planType && d.planType === '封场') {
          posInfo.isLocked = true;
        }

        posCounter[d.yardpos] += 1;

      } else {
        // TODO: 如果ctnno为null, 则container属性也应该为null
        posCounter[d.yardpos] = 1;
        let posInfo: YardposInfo = {
          yardpos: d.yardpos,
          container: {
            shippingLine: d.shippingLine,
            ctnno: d.ctnno,
            pod: d.pod,
            size: d.ctnSize,
            type: d.ctnType,
            height: d.ctnHeight,
            status: d.ctnStatus,
            weight: d.ctnWeight,
            vesselNameIn: d.vesselName,
            voyageIn: d.voyage,
            vesselNameOut: d.vesselName,
            voyageOut: d.voyage,
          },
          tasks: [],
          plans: [],
          isLocked: false
        };
        if (d.taskCtnno) {
          posInfo.tasks.push({
            container: {
              shippingLine: d.taskShippingLine,
              ctnno: d.taskCtnno,
              pod: d.taskPod,
              size: d.taskCtnSize,
              type: d.taskCtnType,
              height: d.taskCtnHeight,
              status: d.ctnStatus,
              weight: d.ctnWeight,
              vesselNameIn: d.taskVesselName,
              voyageIn: d.taskYoyage,
              vesselNameOut: d.taskVesselName,
              voyageOut: d.taskYoyage,
            },
            type: d.taskType
          })
        }
        if (d.planType  && d.planType === '定位组') {
          posInfo.plans.push({planType: d.planType})
        }
        if (d.planType && d.planType === '封场') {
          posInfo.isLocked = true;
        }
        yardposInfoList.push(posInfo)
      }


    });
    console.log(JSON.stringify(yardposInfoList));
    return yardposInfoList;
    
  }



}

export interface Snapshot {
  id: string;
  aimContainer: Container;
  stages: Stage[]
}

export interface Stage {
  name: string;
  locations: YardposInfo[];
  blockLocations?: YardposInfo[];
  operations: Operation[]
}

export interface Operation {
  action: string;
  markedLocations: YardposInfo[];
  description: string;
  blocks?: string[];

}
