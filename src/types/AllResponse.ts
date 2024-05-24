import { ConcurrentResponse } from './ConcurrentResponse';
import { SequentialResponse } from './SequentialResponse';

export type AllResponse = [SequentialResponse, ConcurrentResponse, ConcurrentResponse];
