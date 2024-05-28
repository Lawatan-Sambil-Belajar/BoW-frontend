import { Button, Container, Group, LoadingOverlay, NumberInput, Stack, Text, Title } from '@mantine/core';
import { useMemo, useState } from 'react';
import { AverageResultBarChart } from './components/AverageResultBarChart';
import { PastResultLineChart } from './components/PastResultLineChart';
import { ResultTable } from './components/ResultTable';
import { ThreadProgress } from './components/ThreadProgress';
import { UploadTextFileDropzone } from './components/UploadTextFileDropzone';
import { AllResponse } from './types/AllResponse';
import { VisualisationData } from './types/VisualisationData';

const LOCAL_URI = 'http://localhost:8080';

function App() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [toggleReplay, setToggleReplay] = useState<boolean>(false);
    const [slowFactor, setSlowFactor] = useState<string | number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [pastResults, setPastResults] = useState<VisualisationData[]>([]);

    const onStartVisualisation = async () => {
        if (selectedFile === null) return;
        const formData = new FormData();
        formData.append('textFile', selectedFile as Blob);
        setLoading(true);

        const allResponse = await fetch(`${LOCAL_URI}/bow/all`, {
            method: 'POST',
            body: formData,
            cache: 'no-cache',
        });

        const result = (await allResponse.json()) as AllResponse;

        const data = {
            sequential: result[0],
            concurrent1: result[1],
            concurrent2: result[2],
        };

        setLoading(false);
        setPastResults([...pastResults, data]);
        setToggleReplay(!toggleReplay);
    };

    const onReplayVisualisation = () => {
        setToggleReplay(!toggleReplay);
    };

    const lastResult = pastResults[pastResults.length - 1];

    const concurrent1Max = lastResult?.concurrent1.threadMetricsDTOList.reduce(
        (acc, curr) => (acc > curr.executionTimeInMs ? acc : curr.executionTimeInMs),
        0,
    );

    const concurrent2Max = lastResult?.concurrent2.threadMetricsDTOList.reduce(
        (acc, curr) => (acc > curr.executionTimeInMs ? acc : curr.executionTimeInMs),
        0,
    );

    const averageResult = useMemo(
        () =>
            pastResults.reduce(
                (result, curr) => {
                    result[0].executionTimeInMs += curr.sequential.executionTimeInMs / pastResults.length;
                    result[1].executionTimeInMs += curr.concurrent1.executionTimeInMs / pastResults.length;
                    result[2].executionTimeInMs += curr.concurrent2.executionTimeInMs / pastResults.length;
                    return result;
                },
                [
                    { name: 'Sequential', executionTimeInMs: 0 },
                    { name: 'Concurrent 1', executionTimeInMs: 0 },
                    { name: 'Concurrent 2', executionTimeInMs: 0 },
                ],
            ),
        [pastResults],
    );

    const pastResultLineData = pastResults.reduce(
        (result, curr, index) => {
            result[0].data.push({ y: curr.sequential.executionTimeInMs, x: index + 1 });
            result[1].data.push({ y: curr.concurrent1.executionTimeInMs, x: index + 1 });
            result[2].data.push({ y: curr.concurrent2.executionTimeInMs, x: index + 1 });
            return result;
        },
        [
            { id: 'Sequential', data: [] as { x: number; y: number; }[] },
            { id: 'Concurrent 1', data: [] as { x: number; y: number; }[] },
            { id: 'Concurrent 2', data: [] as { x: number; y: number; }[] },
        ],
    );

    let tableData: [string, number][] = [];
    if (lastResult) {
        tableData = Object.entries(lastResult?.sequential.bagOfWords).sort((a, b) => b[1] - a[1]);
    }

    return (
        <Container
            size="xl"
            pb={100}
        >
            <Stack
                align="center"
                pos="relative"
            >
                <Title>Bag of Words Visualisation</Title>
                <Title order={2}>Upload a Text File!</Title>
                <UploadTextFileDropzone
                    selectedFile={selectedFile}
                    setSelectedFile={setSelectedFile}
                />
                <NumberInput
                    label="Slow Factor"
                    value={slowFactor}
                    onChange={setSlowFactor}
                    min={1}
                />
                <Group>
                    <Button
                        size="md"
                        onClick={onStartVisualisation}
                    >
                        Start Visualisation
                    </Button>
                    <Button
                        size="md"
                        onClick={onReplayVisualisation}
                    >
                        Replay Visualisation
                    </Button>
                </Group>
                {pastResults.length > 0 && (
                    <div style={{ width: '100%', maxWidth: '640px', height: '400px' }}>
                        <AverageResultBarChart data={averageResult} />
                    </div>
                )}
                {pastResults.length > 1 && (
                    <div style={{ width: '100%', maxWidth: '640px', height: '400px' }}>
                        <PastResultLineChart data={pastResultLineData} />
                    </div>
                )}

                {!loading && lastResult && (
                    <Group
                        key={String(toggleReplay)}
                        gap={30}
                        justify="space-evenly"
                        align="flex-start"
                        p={20}
                    >
                        <Stack align="center">
                            <Title order={3}>Sequential</Title>
                            <Text>Total time: {lastResult.sequential.executionTimeInMs} ms</Text>
                            <ThreadProgress
                                name="Main Thread"
                                slowFactor={Number(slowFactor)}
                                timeInMs={lastResult.sequential.executionTimeInMs}
                                width={210}
                            />
                        </Stack>
                        <Stack align="center">
                            <Title order={3}>Concurrent 1</Title>
                            <Text>Total time: {lastResult.concurrent1.executionTimeInMs} ms</Text>
                            {lastResult.concurrent1.threadMetricsDTOList.map((threadMetricsDTO, index) => (
                                <ThreadProgress
                                    key={threadMetricsDTO.name}
                                    name={`Thread ${index + 1}`}
                                    slowFactor={Number(slowFactor)}
                                    timeInMs={threadMetricsDTO.executionTimeInMs}
                                    width={(threadMetricsDTO.executionTimeInMs / concurrent1Max) * 210}
                                />
                            ))}
                        </Stack>
                        <Stack align="center">
                            <Title order={3}>Concurrent 2</Title>
                            <Text>Total time: {lastResult.concurrent2.executionTimeInMs} ms</Text>
                            {lastResult.concurrent2.threadMetricsDTOList.map((threadMetricsDTO, index) => (
                                <ThreadProgress
                                    key={threadMetricsDTO.name}
                                    name={`Thread ${index + 1}`}
                                    slowFactor={Number(slowFactor)}
                                    timeInMs={threadMetricsDTO.executionTimeInMs}
                                    width={(threadMetricsDTO.executionTimeInMs / concurrent2Max) * 210}
                                />
                            ))}
                            <ThreadProgress
                                name="Time taken to combine"
                                slowFactor={Number(slowFactor)}
                                timeInMs={lastResult.concurrent2.executionTimeInMs - concurrent2Max}
                                width={
                                    ((lastResult.concurrent2.executionTimeInMs - concurrent2Max) / concurrent2Max) * 210
                                }
                            />
                        </Stack>
                    </Group>
                )}
                {lastResult && !loading && (
                    <Stack align="center" style={{ width: '80%'}}>
                        <Title>Results</Title>
                        <ResultTable data={tableData} rowPerPage={10} />
                    </Stack>
                )}
                <LoadingOverlay visible={loading} />
            </Stack>
        </Container>
    );
}

// eslint-disable-next-line import/no-default-export
export default App;
