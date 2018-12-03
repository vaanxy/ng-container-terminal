import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { YardposInfo } from './yardpos-info';

export interface YardBay {
    name: string;
    maxRow: number;
    maxTier: number;
    yardposInfoArray: YardposInfo[];
    dataUpdated?: Observable<void>;
    dataUpdatedSource?: Subject<void>;
}
