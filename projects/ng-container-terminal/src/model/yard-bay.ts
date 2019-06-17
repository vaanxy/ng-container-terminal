import { Observable, Subject } from 'rxjs';

import { Yardpos } from './yardpos';
import { YardposInfo } from './yardpos-info';

export interface YardBayOld {
  name: string;
  maxRow: number;
  maxTier: number;
  yardposInfoArray: YardposInfo[];
  dataUpdated?: Observable<any>;
  dataUpdatedSource?: Subject<any>;
}

export interface YardBay<T> {
  name: string;
  poses: Yardpos<T>[];
}
