import { Plan } from './plan';
import { Task } from './task';
import { Container } from './container';

export interface YardposInfo {
  displayedContainer: Container;
  yardpos: string;
  containers: Container[];
  plans: Plan[];
  isLocked: boolean;
  fill?: string;
  text?: string;
}
