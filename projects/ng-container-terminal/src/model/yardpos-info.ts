import { Container } from './container';
import { Plan } from './plan';

export interface YardposInfo {
  displayedContainer: Container;
  yardpos: string;
  containers: Container[];
  plans: Plan[];
  isLocked: boolean;
  fill?: string;
  text?: string;
}
