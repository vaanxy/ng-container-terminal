export interface YardInfo {
    block: string;
    direction: 'H' | 'V';
    maxBay: number;
    maxRow: number;
    maxTier: number;
    isEmpty: boolean;
    x1: number;
    y1: number;
    width: number;
    height: number;
    fill?: string;
    text?: string;
}
