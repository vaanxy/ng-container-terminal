import { Task } from './task';
import { Container } from '../model/container';

export interface YardPosInfo {
    location: string;
    container: Container;
    tasks: Task[];
    plans: string[];
    markColor?: string;
    text?: string;
}
