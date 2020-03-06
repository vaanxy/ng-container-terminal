import { Vescell } from './cell';

export interface VesselBay<T> {
  name: string;
  vescells: Vescell<T>[];
  // backCells: Vescell<T>[];
}
