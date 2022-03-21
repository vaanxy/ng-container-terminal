import { Container } from './container';
import { Plan } from './plan';

export interface YardposInfo<T = any> {
  displayedContainer: Container<T>;
  yardpos: string;
  containers: Container[];
  plans: Plan[];
  isLocked: boolean;
  fill?: string;
  text?: string;
}
