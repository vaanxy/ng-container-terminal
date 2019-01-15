import { Injectable, Inject } from '@angular/core';
import {
  YardposParserConfig,
  YARDPOS_PARSER_CONFIG
} from './model/yardpos-parser-config';

@Injectable()
export class CtYardposParserService {
  private defaultConfig: YardposParserConfig = {
    pattern: 'QQQWWWPPCC'
  };

  private idxMap = {
    Q: { s: 0, e: 3 },
    W: { s: 3, e: 5 },
    P: { s: 5, e: 7 },
    C: { s: 7, e: 8 }
  };

  private finalConfig: YardposParserConfig = this.defaultConfig;

  constructor(
    @Inject(YARDPOS_PARSER_CONFIG) private config: YardposParserConfig
  ) {
    // 合并用户提供的解析器配置
    this.finalConfig = Object.assign(this.finalConfig, config);
    // 重新计算索引
    this._updateIdxMap();
  }

  private _updateIdxMap() {
    this.idxMap['Q']['s'] = this.finalConfig.pattern.indexOf('Q');
    this.idxMap['Q']['e'] = this.finalConfig.pattern.lastIndexOf('Q') + 1;
    this.idxMap['W']['s'] = this.finalConfig.pattern.indexOf('W');
    this.idxMap['W']['e'] = this.finalConfig.pattern.lastIndexOf('W') + 1;
    this.idxMap['P']['s'] = this.finalConfig.pattern.indexOf('P');
    this.idxMap['P']['e'] = this.finalConfig.pattern.lastIndexOf('P') + 1;
    this.idxMap['C']['s'] = this.finalConfig.pattern.indexOf('C');
    this.idxMap['C']['e'] = this.finalConfig.pattern.lastIndexOf('C') + 1;
  }

  private _padLeft(num, length, text = '0'): string {
    return (Array(length).join(text) + num).slice(-length);
  }

  getQ(yardpos: string) {
    return yardpos.slice(this.idxMap['Q']['s'], this.idxMap['Q']['e']);
  }

  getW(yardpos: string) {
    return yardpos.slice(this.idxMap['W']['s'], this.idxMap['W']['e']);
  }

  getP(yardpos: string) {
    return yardpos.slice(this.idxMap['P']['s'], this.idxMap['P']['e']);
  }

  getC(yardpos: string) {
    return yardpos.slice(this.idxMap['C']['s'], this.idxMap['C']['e']);
  }

  getQW(yardpos: string) {
    return this.getQ(yardpos) + this.getW(yardpos);
  }

  getQWP(yardpos: string) {
    return this.getQW(yardpos) + this.getP(yardpos);
  }

  formatW(bay: number | string) {
    const bayStringWidth = this.idxMap['W']['e'] - this.idxMap['W']['s'];
    if (bay.toString().length > bayStringWidth) {
      throw Error('传入参数有误，其长度应<=' + bayStringWidth);
    }
    return this._padLeft(bay.toString(), bayStringWidth, '0');
  }

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
