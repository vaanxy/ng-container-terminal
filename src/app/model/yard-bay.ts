import { Observable } from 'rxjs/Rx';
import { YardPosInfo } from './yard-pos-info';
import { Subject } from 'rxjs/Subject';

export interface YardBay {
    name: string;
    maxRow: number;
    maxTier: number;
    yardPosInfoArray: YardPosInfo[];
    dataUpdated?: Observable<void>;
    dataUpdatedSource?: Subject<void>;
}
