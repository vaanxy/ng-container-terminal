import { Plan } from './plan';
import { Task } from './task';
import { Container } from './container';

export interface YardposInfo {
    yardpos: string;
    container: Container;
    tasks: Task[];
    plans: Plan[];
    isLocked: boolean;
    fill?: string;
    text?: string;
}
