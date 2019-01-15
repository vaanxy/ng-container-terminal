export interface YardInfo<T> {
  block: string;
  direction: 'H' | 'V';
  maxBay: number;
  maxRow: number;
  maxTier: number;
  x: number;
  y: number;
  width: number;
  height: number;
  data?: T;
}
