import { Operation } from '../';
import { Container } from '../model/container';
import { YardBay } from '../model/yard-bay';
import { YardPosInfo } from '../model/yard-pos-info';
import { Injectable } from '@angular/core';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import * as d3 from 'd3';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class StorageAiDesignToolService {
  private yardPosInfoAll: YardPosInfo[];
  private yardBayMap = {};
  private weightLimits = [
    {lowerBound: 0, upperBound: 9, lowerOffset: -9, upperOffset: 2},
    {lowerBound: 9, upperBound: 18, lowerOffset: -5, upperOffset: 3.5},
    {lowerBound: 18, upperBound: 99, lowerOffset: -6, upperOffset: 5},
  ];
  constructor(private http: HttpClient) { }

  getContainerLocations(): Observable<YardPosInfo[]> {
    return Observable.create((observer: Observer<YardPosInfo[]>) => {
      if (this.yardPosInfoAll) {
        observer.next(this.yardPosInfoAll);
      }
      d3.csv('../assets/container_location.csv', (d: Array<any>) => {
        let yardPosInfoAll = d.map(data => {
          return {
            location: data.location.slice(0, 3) + data.location.slice(4, 8) + data.location.slice(9, 10),
            //TODO
            container: {
              shippingLine: 'NEU5-OA',
              ctnno: data.no,
              isoCode: data.size_type,
              size: '40',
              height: '8.6',
              type: 'GP',
              status: 'F',
              pod: data.pod,
              weight: data.weight / 1000.0,
              vesselNameIn: data.vessel_name_in,
              voyageInId: 'data.vessel_name_in',
              voyageIn: data.voyage_in,
              vesselNameOut: data.vessel_name_out,
              voyageOutId: 'data.vessel_name_in',
              voyageOut: data.voyage_out,
            },
            tasks: null,
            plans: null
          };
        });
        this.yardPosInfoAll = yardPosInfoAll;
        observer.next(yardPosInfoAll);

      });
    });
  }

  getYardBays(yardBayNames: string[]) {
    return this.getContainerLocations().map((yardPosInfoAll: YardPosInfo[]): YardBay[] => {
      return yardBayNames.map((yardBayName) => {
        if (this.yardBayMap[yardBayName]) {
          return this.yardBayMap[yardBayName];
        }
        let yardPosInfoArray = yardPosInfoAll.filter((info) => info.location.indexOf(yardBayName) === 0);
        let dataUpdatedSource = new Subject<void>();
        // this.notifyDataUpdatedStreamMap[yardBayName] = new Subject<void>();
        //TODO: 等提供场地结构视图后进行修改
        let yardBay: YardBay = {
          name: yardBayName,
          // maxRow: Math.max(...yardPosInfoArray.map(pos => +pos.location.slice(5, 7))),
          // maxTier: Math.max(...yardPosInfoArray.map(pos => +pos.location.slice(7, 8))),
          maxRow: 6,
          maxTier: 4,
          yardPosInfoArray: yardPosInfoArray,
          dataUpdated: dataUpdatedSource.asObservable(),
          dataUpdatedSource: dataUpdatedSource
        };
        this.yardBayMap[yardBayName] = yardBay;
        return yardBay;
        // yard.yardBays.push(yardBay);
      });
    });
  }

  kaoNian(container: Container, isLocal=false) {
    if (isLocal) {
      return this.kaoNianLocal(container);
    } else {
      return this.http.get(`http://localhost:5000/kaonian?shipping_line=${container.shippingLine}&vessel_name=${container.vesselNameOut}&voyage=${container.voyageOut}&pod=${container.pod}&ctn_size=${container.size}&ctn_type=${container.type}&ctn_height=${container.height}&ctn_status=${container.status}&ctn_weight=${container.weight}`);
    }
  }

  /**
   * 靠黏
   * 1. 过滤：找同类箱且绝对吨差<=8t；
   * 2. 绝对吨差排序;
   * 3. 依次剔除左右2排均为非空排的被靠箱;
   * @param aimContainer 
   */
  kaoNianLocal(aimContainer: Container) {
    return this.getContainerLocations().map((poses) => {
      let operations: Operation[] = [];
      let validYardPosInfo = poses.filter((pos) => {
        return pos.container
          && pos.container.pod === aimContainer.pod
          && pos.container.size === aimContainer.size
          && pos.container.type === aimContainer.type
          && pos.container.height === aimContainer.height
          && pos.container.voyageOut === aimContainer.voyageOut
          && pos.container.vesselNameOut === aimContainer.vesselNameOut
          && Math.abs(pos.container.weight - aimContainer.weight) <= 8;
      });
      operations.push({
        action: 'filter',
        markedLocations: validYardPosInfo,
        description: '找同类箱（卸货港、箱型、尺寸、箱高）且吨差<=8t'
      });

      // step2.
      let sortedValidYardPosInfo = [...validYardPosInfo].sort((a, b) => {
        return Math.abs(a.container.weight - aimContainer.weight) - Math.abs(b.container.weight - aimContainer.weight)
      });
      operations.push({
        action: 'sort',
        markedLocations: sortedValidYardPosInfo,
        description: '根据绝对吨差排序'
      });

      // step3.
      for (let i = 0; i < sortedValidYardPosInfo.length; i++) {
        let pos = sortedValidYardPosInfo[i];
        let rowLeft = ((+pos.location.slice(-3, -1)) - 1);
        let rowRight = ((+pos.location.slice(-3, -1)) + 1);
        if (rowLeft > 0) {
          let leftRows = this.yardPosInfoAll.filter((p) => p.location.slice(0, 7) === pos.location.slice(0, 5) + this.padLeft(rowLeft, 2));
          console.log(leftRows);
          if (leftRows.length === 0) {
            // 左侧可靠
            let posLeft = {
              location: pos.location.slice(0, 5) + this.padLeft(rowLeft, 2) + '1',
              container: aimContainer,
              tasks: null,
              plans: null,
              markColor: 'deeppink'
            };
            // yardBay.yardPosInfoArray.push(posLeft);
            // this.updateYardPosInfo(posLeft, {markColor: 'deeppink'});
            operations.push({
              action: 'add',
              markedLocations: [posLeft],
              description: '左侧靠黏成功，位置：' + posLeft.location
            });
            break;
          }
        };

        // TODO: 最大列数需根据场地结构修改
        if (rowRight <= 6) {
          let rightRows = this.yardPosInfoAll.filter((p) => p.location.slice(0, 7) === pos.location.slice(0, 5) + this.padLeft(rowRight, 2));
          console.log(rightRows);
          if (rightRows.length === 0) {
            // 右侧可靠
            let posRight = {
              location: pos.location.slice(0, 5) + this.padLeft(rowRight, 2) + '1',
              container: aimContainer,
              tasks: null,
              plans: null,
              markColor: 'deeppink'
            };
            // yardBay.yardPosInfoArray.push(posRight);
            // this.updateYardPosInfo(posRight, {markColor: 'deeppink'});
            operations.push({
              action: 'add',
              markedLocations: [posRight],
              description: '右侧靠黏成功，位置：' + posRight.location
            });
            break;
          }
        }
        operations.push({
          action: 'remove',
          markedLocations: [pos],
          description: '该位置左右没有空排'
        });
      };
      return operations;
    });
  }


  yaNian(container: Container, isLocal=false) {
    if (isLocal) {
      return this.yaNianLocal(container);
    } else {
      return this.http.get(`http://localhost:5000/yanian?shipping_line=${container.shippingLine}&vessel_name=${container.vesselNameOut}&voyage=${container.voyageOut}&pod=${container.pod}&ctn_size=${container.size}&ctn_type=${container.type}&ctn_height=${container.height}&ctn_status=${container.status}&ctn_weight=${container.weight}`);
    }
  }

  /**
   * 压黏
   * @param aimContainer 目标箱
   * step1. 找同船、同港、同类箱
   * step2. 过滤不符绝对吨差范围的被压箱
   * step3.根据吨差排序
   */
  yaNianLocal(aimContainer: Container) {
    return this.getContainerLocations().map((poses) => {
      let operations: Operation[] = [];

      // step1. 过滤找同类箱
      let validYardPosInfo = poses.filter((pos) => {
        return pos.container
          && pos.container.pod === aimContainer.pod
          && pos.container.size === aimContainer.size
          && pos.container.type === aimContainer.type
          && pos.container.height === aimContainer.height
          && pos.container.voyageOut === aimContainer.voyageOut
          && pos.container.vesselNameOut === aimContainer.vesselNameOut;
      });
      console.log(validYardPosInfo.length)
      operations.push({
        action: 'filter',
        markedLocations: [...validYardPosInfo],
        description: '找同类箱（卸货港、箱型、尺寸、箱高）'
      });

      // step2. 过滤不符绝对吨差范围的被压箱
      let yardPoses = [];
        for (let i = 0; i < this.weightLimits.length; i++) {
          let limit = this.weightLimits[i];
          if (aimContainer.weight >= limit.lowerBound && aimContainer.weight < limit.upperBound ) {
            yardPoses = validYardPosInfo
              .filter((pos) => {
                return pos.container.weight >= aimContainer.weight + limit.lowerOffset
                    && pos.container.weight < aimContainer.weight + limit.upperOffset;
              });
            break;
          }
        }
      operations.push({
        action: 'filter',
        markedLocations: yardPoses,
        description: '过滤不符绝对吨差范围的被压箱'
      });

      // step3.根据吨差排序
      let sortedValidYardPosInfo = [...yardPoses].sort((a, b) => {
        return Math.abs(a.container.weight - aimContainer.weight) - Math.abs(b.container.weight - aimContainer.weight)
      });

      operations.push({
        action: 'sort',
        markedLocations: sortedValidYardPosInfo,
        description: '根据绝对吨差排序'
      });

      let found = false;

      for (let i = 0; i < sortedValidYardPosInfo.length; i++) {
        let pos = sortedValidYardPosInfo[i];
        // let yardBayName = pos.location.slice(0, 5);
        // let yardBay: YardBay = this.yardBayMap[yardBayName];
        let tierUp =  ((+pos.location.slice(-1)) + 1);
        //TODO: 之后根据场地结构调整
        if (tierUp > 4) { 
          operations.push({
            action: 'remove',
            markedLocations: [pos],
            description: pos.location + '上方无场地位置'
          });
          continue; 
        };
        let posUp = poses.find((p) => p.location === pos.location.slice(0, -1) + tierUp);
        console.log(posUp);
        if (!posUp) {
          posUp = {
            location: pos.location.slice(0, -1) + tierUp,
            container: aimContainer,
            tasks: null,
            plans: null,
            markColor: 'deeppink'
          };
          operations.push({
            action: 'add',
            markedLocations: [posUp],
            description: '压黏成功，场地位置：' + posUp.location
          });
          break;
        } else {
          operations.push({
            action: 'remove',
            markedLocations: [pos],
            description: pos.location + '上方场地位置不可用'
          });
        }
      }
      return operations;
    });

  }


  getHistoryStat(container: Container): Observable<any> {
    return Observable.create((observer: Observer<any>) => {
      d3.csv('../assets/ef4_ctn_count.csv', (data: any[]) => {
        
        let count = data.filter((d) => container.pod === d.pod && container.height === d.height && container.size === d.size && container.type === d.type).map(d => +d.count).sort();
        console.log(count)
        let avg = Math.ceil(count.slice(1, -1).reduce((a, b) => a + b, 0) / count.length);
        let mid = count[Math.floor(count.length / 2)];
        observer.next({avg: avg, mid: mid});
        observer.complete();
        console.log({avg: avg, mid: mid});
      });

    });
  }

  getOccupiedBays(container: Container) {
    return Observable.create((observer: Observer<any>) => {
      d3.csv('.csv', (data) => {
        observer.next(data);
        observer.complete();
      });
    });

  }


  getLocations(block: string) {
    return this.http.get('http://localhost:5000/location/' + block)
  }

  getYardDetail(block: string) {
    return this.http.get('http://localhost:5000/yard/detail/' + block)
  }

  kaiXinWei(container: Container) {
    return this.http.get(`http://localhost:5000/kaixinwei?shipping_line=${container.shippingLine}&vessel_name=${container.vesselNameOut}&voyage=${container.voyageOut}&pod=${container.pod}&ctn_size=${container.size}&ctn_type=${container.type}&ctn_height=${container.height}&ctn_status=${container.status}&ctn_weight=${container.weight}`)
    // http://localhost:5000/kaixinwei?shipping_line=FE4&vessel_name=AFIF&voyage=002W&pod=BEANR&ctn_size=40&ctn_type=GP&ctn_height=8.6
  }

  neiQiang(container: Container) {
    return this.http.get(`http://localhost:5000/neiqiang?shipping_line=${container.shippingLine}&vessel_name=${container.vesselNameOut}&voyage=${container.voyageOut}&pod=${container.pod}&ctn_size=${container.size}&ctn_type=${container.type}&ctn_height=${container.height}&ctn_status=${container.status}&ctn_weight=${container.weight}`)
  }

  waiQiang(container: Container) {
    return this.http.get(`http://localhost:5000/waiqiang?shipping_line=${container.shippingLine}&vessel_name=${container.vesselNameOut}&voyage=${container.voyageOut}&pod=${container.pod}&ctn_size=${container.size}&ctn_type=${container.type}&ctn_height=${container.height}&ctn_status=${container.status}&ctn_weight=${container.weight}`)
    // http://localhost:5000/kaixinwei?shipping_line=FE4&vessel_name=AFIF&voyage=002W&pod=BEANR&ctn_size=40&ctn_type=GP&ctn_height=8.6
  }

  hunDunGang(container: Container) {
    return this.http.get(`http://localhost:5000/hundungang?shipping_line=${container.shippingLine}&vessel_name=${container.vesselNameOut}&voyage=${container.voyageOut}&pod=${container.pod}&ctn_size=${container.size}&ctn_type=${container.type}&ctn_height=${container.height}&ctn_status=${container.status}&ctn_weight=${container.weight}`)
    
  }

  getHisContainerCount(container: Container) {
    return this.http.get(`http://localhost:5000/his?shipping_line=${container.shippingLine}&pod=${container.pod}&ctn_size=${container.size}&ctn_type=${container.type}&ctn_height=${container.height}&ctn_status=${container.status}`)
    
  }

  getWeightDistribution(container: Container, isHis: boolean) {
    let term = 'current';
    if (isHis) {
      term = 'his';
    }
    return this.http.get(`http://localhost:5000/weight/${term}?shipping_line=${container.shippingLine}&pod=${container.pod}&ctn_size=${container.size}&ctn_type=${container.type}&ctn_height=${container.height}&ctn_status=${container.status}`)
    
  }

  private padLeft(num, length, text = '0'): string {
    return (Array(length).join(text) + num).slice(-length);
  }

}
