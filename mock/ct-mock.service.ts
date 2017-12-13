import { Injectable } from '@angular/core';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';
// import { of } from 'rxjs/observable/of';
import 'rxjs/add/observable/of';
import * as d3 from 'd3';
import { mockBlockLocations } from './data/block-locations';


@Injectable()
export class CtMockService {

  constructor() { }

  getYardposInfoList(): Observable<any[]> {
    const data: any[] = this.proecssData(mockBlockLocations);
    return Observable.of(data);
  }

  proecssData(data: any[]) {
    const posCounter = {};
    const yardposInfoList = [];
    data.forEach((d) => {
      if (posCounter[d.yardpos]) {
        // 该场地位置已经添加过，则更新之前添加的信息
        const posInfo = yardposInfoList.find(pos => pos.yardpos === d.yardpos);
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
          });
        }

        if (d.planType && d.planType === '定位组') {
          posInfo.plans.push({planType: d.planType});
        }
        if (d.planType && d.planType === '封场') {
          posInfo.isLocked = true;
        }

        posCounter[d.yardpos] += 1;

      } else {
        // TODO: 如果ctnno为null, 则container属性也应该为null
        posCounter[d.yardpos] = 1;
        const posInfo = {
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
          });
        }
        if (d.planType  && d.planType === '定位组') {
          posInfo.plans.push({planType: d.planType});
        }
        if (d.planType && d.planType === '封场') {
          posInfo.isLocked = true;
        }
        yardposInfoList.push(posInfo);
      }


    });
    // console.log(JSON.stringify(yardposInfoList));
    return yardposInfoList;

  }

}
