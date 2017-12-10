import { Plan } from './plan';
import { Task } from './task';
import { Container } from './container';

export interface YardPosInfo {
    location: string;
    container: Container;
    tasks: Task[];
    plans: string[];
    isLocked?: boolean;
    markColor?: string;
    text?: string;
}
