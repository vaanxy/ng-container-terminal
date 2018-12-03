import { Subject, Observable } from 'rxjs';
import { YardposInfo } from './yardpos-info';

export interface YardBay {
    name: string;
    maxRow: number;
    maxTier: number;
    yardposInfoArray: YardposInfo[];
    dataUpdated?: Observable<any>;
    dataUpdatedSource?: Subject<any>;
}
