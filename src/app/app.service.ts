import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Vescell, YardInfo, YardposInfo } from 'ng-container-terminal';
import { CtYardposParserService } from 'ng-container-terminal/tool';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  constructor(private http: HttpClient, private posParser: CtYardposParserService) {}

  getPrestow() {
    return this.http.get<Vescell<any>[]>(
      // 'http://0.0.0.0:5001/prestow/' + 'P170323001C'
      // 'http://0.0.0.0:5001/prestow/' + 'P1812050001'
      'https://ctas-server.smuport.com/prestow/' + 'P1812050001'
    );
  }

  yardposCompletion(poses: YardposInfo[], info: YardInfo<any>): YardposInfo[] {
    const posMap: { [key: string]: YardposInfo } = {};
    for (let idx = 0; idx < poses.length; idx++) {
      const pos = poses[idx];
      posMap[pos.yardpos] = pos;
    }
    // completion odd bay
    for (let idx = 0; idx < info.maxBay; idx++) {
      const bay = idx * 2 + 1;
      for (let row = 0; row < info.maxRow; row++) {
        for (let tier = 0; tier < info.maxTier; tier++) {
          const yardpos =
            info.block +
            this.posParser.formatW(bay) +
            this.posParser.formatP(row + 1) +
            this.posParser.formatC(tier + 1);
          if (!posMap[yardpos]) {
            posMap[yardpos] = {
              displayedContainer: null,
              yardpos: yardpos,
              containers: [],
              plans: [],
              isLocked: false
            };
          }
        }
      }
    }
    // completion even bay
    for (let idx = 1; idx < info.maxBay; idx++) {
      const bay = idx * 2;
      for (let row = 0; row < info.maxRow; row++) {
        for (let tier = 0; tier < info.maxTier; tier++) {
          const yardpos =
            info.block +
            this.posParser.formatW(bay) +
            this.posParser.formatP(row + 1) +
            this.posParser.formatC(tier + 1);
          if (!posMap[yardpos]) {
            posMap[yardpos] = {
              displayedContainer: null,
              yardpos: yardpos,
              containers: [],
              plans: [],
              isLocked: false
            };
          }
        }
      }
    }
    return Object.values(posMap);
  }
}
