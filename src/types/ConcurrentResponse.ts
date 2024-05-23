export interface ConcurrentResponse {
    strategyType: string;
    bagOfWords: Record<string, number>;
    executionTimeInMs: number;
    threadMetricsDTOList: {
        name: string;
        executionTimeInMs: number;
    }[];
}
