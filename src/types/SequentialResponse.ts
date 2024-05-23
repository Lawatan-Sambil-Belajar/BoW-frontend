export interface SequentialResponse {
    strategyType: string;
    bagOfWords: Record<string, number>;
    executionTimeInMs: number;
}
