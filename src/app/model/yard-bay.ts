import { Observable } from 'rxjs/Rx';
import { YardposInfo } from './yardpos-info';
import { Subject } from 'rxjs/Subject';

export interface YardBay {
    name: string;
    maxRow: number;
    maxTier: number;
    YardposInfoArray: YardposInfo[];
    dataUpdated?: Observable<void>;
    dataUpdatedSource?: Subject<void>;
}
