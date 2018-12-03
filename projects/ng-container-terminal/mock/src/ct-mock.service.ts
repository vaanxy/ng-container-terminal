
import { Observable } from 'rxjs/Observable';
import {of as observableOf} from 'rxjs/observable/of';
import { Injectable } from '@angular/core';

import { mockBlockLocations } from './data/block-locations';
import { mockYardInfoList } from './data/yard-info-list';


@Injectable()
export class CtMockService {

  constructor() { }

  getYardposInfoList(): Observable<any[]> {
    const data: any[] = this.proecssData(mockBlockLocations);
    return observableOf(data);
  }

  getYardInfoList(): Observable<any[]> {
    return observableOf(mockYardInfoList);
  }

  proecssData(data: any[]) {
    const posCounter = {};
    const yardposInfoList = [];
    data.forEach((d) => {
      if (posCounter[d.yardpos]) {
        // 该场地位置已经添加过，则更新之前添加的信息
        const posInfo = yardposInfoList.find(pos => pos.yardpos === d.yardpos);
        // 有箱号则添加在场箱信息, 并作为默认显示箱
        if (d.ctnno) {
          const container = {
            shippingLineOut: d.shippingLine,
            shippingLineIn: null,
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
            tense: 'C',
            task: null
          };
          posInfo.containers.push(container);
          posInfo.displayedContainer = container;
        }
        if (d.taskCtnno) {
          // 有任务则是将来态的集装箱
          posInfo.containers.push({
            shippingLineOut: d.taskShippingLine,
            shippingLineIn: null,
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
            tense: 'F',
            task: {
              type: d.taskType
            }
          });
        }

        if (d.planType && d.planType === '定位组') {
          posInfo.plans.push({ planType: d.planType });
        }
        if (d.planType && d.planType === '封场') {
          posInfo.isLocked = true;
        }

        posCounter[d.yardpos] += 1;

      } else {
        posCounter[d.yardpos] = 1;
        const newPosInfo = {
          yardpos: d.yardpos,
          displayedContainer: null,
          containers: [],
          plans: [],
          isLocked: false
        };
        // 有箱号则添加再场箱信息, 并作为默认显示箱
        if (d.ctnno) {
          const container = {
            shippingLineOut: d.shippingLine,
            shippingLineIn: null,
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
          };
          newPosInfo.containers.push(container);
          newPosInfo.displayedContainer = container;
        }
        if (d.taskCtnno) {
          newPosInfo.containers.push({
            shippingLineOut: d.taskShippingLine,
            shippingLineIn: null,
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
            tense: 'F',
            task: {
              type: d.taskType
            }
          });
        }
        if (d.planType && d.planType === '定位组') {
          newPosInfo.plans.push({ planType: d.planType });
        }
        if (d.planType && d.planType === '封场') {
          newPosInfo.isLocked = true;
        }
        yardposInfoList.push(newPosInfo);
      }
    });
    return yardposInfoList;

  }

}
