import { YardBay } from './yard-bay';
import { YardPosInfo } from './yard-pos-info';
export interface Yard {
    name: string;
    maxBay: number;
    maxRow: number;
    maxTier: number;
    direction: 'H' | 'V';
    x1?: number;
    y1?: number;
    x2?: number;
    y2?: number;
    x3?: number;
    y3?: number;
    x4?: number;
    y4?: number;
    yardBays: YardBay[];
}
