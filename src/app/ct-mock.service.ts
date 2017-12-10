import { Injectable } from '@angular/core';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';
import * as d3 from 'd3';
import { YardposInfo } from './model';

@Injectable()
export class CtMockService {

  constructor() { }

  getYardposInfoList(): Observable<YardposInfo[]> {
    return Observable.create((observer: Observer<YardposInfo[]>) => {
      d3.json('../assets/mock-yardpos-data.json', (data) => {
        // console.log(data);
        observer.next(data);
      });
    });
  }

}
