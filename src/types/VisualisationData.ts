import { ConcurrentResponse } from './ConcurrentResponse';
import { SequentialResponse } from './SequentialResponse';

export interface VisualisationData {
    sequential: SequentialResponse;
    concurrent1: ConcurrentResponse;
    concurrent2: ConcurrentResponse;
}
