import { Task } from './task';

export interface Container<T = any> {
  shippingLineOut: string;
  shippingLineIn: string;
  ctnno: string;
  pod: string;
  size: string;
  type: string;
  height: string;
  status: string;
  weight: number;
  vesselNameIn: string;
  voyageIn: string;
  vesselNameOut: string;
  voyageOut: string;
  tense?: string; // 时态, 一般包含2个时态: 当前态, 将来态
  task?: Task;
  data?: T;
}
