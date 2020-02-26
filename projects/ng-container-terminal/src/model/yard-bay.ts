import { Yardpos } from './yardpos';

export interface YardBay<T> {
  name: string;
  poses: Yardpos<T>[];
}
