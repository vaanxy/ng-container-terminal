import { Inject, Injectable } from '@angular/core';

import { VESCELL_PARSER_CONFIG, VescellParserConfig } from './model/vescell-parser-config';

@Injectable({
  providedIn: 'root'
})
export class CtVescellParserService {
  private defaultConfig: VescellParserConfig = {
    pattern: 'BBBBLLCC'
  };

  private idxMap = {
    B: { s: 0, e: 4 },
    L: { s: 4, e: 6 },
    C: { s: 6, e: 8 }
  };

  private finalConfig: VescellParserConfig;

  constructor(@Inject(VESCELL_PARSER_CONFIG) private config: VescellParserConfig) {
    // 合并用户提供的解析器配置
    this.finalConfig = Object.assign({}, this.defaultConfig, config);
    // 重新计算索引
    this._updateIdxMap();
  }

  private _updateIdxMap() {
    this.idxMap['B']['s'] = this.finalConfig.pattern.indexOf('B');
    this.idxMap['B']['e'] = this.finalConfig.pattern.lastIndexOf('B') + 1;
    this.idxMap['L']['s'] = this.finalConfig.pattern.indexOf('L');
    this.idxMap['L']['e'] = this.finalConfig.pattern.lastIndexOf('L') + 1;
    this.idxMap['C']['s'] = this.finalConfig.pattern.indexOf('C');
    this.idxMap['C']['e'] = this.finalConfig.pattern.lastIndexOf('C') + 1;
  }

  private _padLeft(num: string, length: number, text = '0'): string {
    return (Array(length).join(text) + num).slice(-length);
  }

  getBay(vescell: string) {
    return vescell.slice(this.idxMap['B']['s'], this.idxMap['B']['e']);
  }

  getBayno(vescell: string) {
    return vescell.slice(this.idxMap['B']['s'], this.idxMap['B']['e'] - 1);
  }

  getL(vescell: string) {
    return vescell.slice(this.idxMap['L']['s'], this.idxMap['L']['e']);
  }

  getC(vescell: string) {
    return vescell.slice(this.idxMap['C']['s'], this.idxMap['C']['e']);
  }

  getLC(vescell: string) {
    return this.getL(vescell) + this.getC(vescell);
  }

  isDeck(vescell: string): boolean {
    const bay = this.getBay(vescell);
    return bay[bay.length - 1] === 'D';
  }

  // formatW(bay: number | string) {
  //   const bayStringWidth = this.idxMap['W']['e'] - this.idxMap['W']['s'];
  //   if (bay.toString().length > bayStringWidth) {
  //     throw Error('传入参数有误，其长度应<=' + bayStringWidth);
  //   }
  //   return this._padLeft(bay.toString(), bayStringWidth, '0');
  // }

  formatP(row: number | string) {
    const rowStringWidth = this.idxMap['P']['e'] - this.idxMap['P']['s'];
    if (row.toString().length > rowStringWidth) {
      throw Error('传入参数有误，其长度应<=' + rowStringWidth);
    }
    return this._padLeft(row.toString(), rowStringWidth, '0');
  }

  formatC(tier: number | string) {
    const tierStringWidth = this.idxMap['C']['e'] - this.idxMap['C']['s'];
    if (tier.toString().length > tierStringWidth) {
      throw Error('传入参数有误，其长度应<=' + tierStringWidth);
    }
    return this._padLeft(tier.toString(), tierStringWidth, '0');
  }
}
