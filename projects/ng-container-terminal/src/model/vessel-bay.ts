import { Vescell } from './cell';

export interface VesselBay<T> {
  name: string;
  frontCells: Vescell<T>[];
  backCells: Vescell<T>[];
}
