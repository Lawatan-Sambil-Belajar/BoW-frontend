import { Button, Container, Group, LoadingOverlay, NumberInput, Stack, Text, Title } from '@mantine/core';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveLine } from '@nivo/line';
import { useMemo, useState } from 'react';
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
            { id: 'Sequential', data: [] as { x: number; y: number }[] },
            { id: 'Concurrent 1', data: [] as { x: number; y: number }[] },
            { id: 'Concurrent 2', data: [] as { x: number; y: number }[] },
        ],
    );

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
                        <ResponsiveBar
                            indexBy="name"
                            data={averageResult}
                            keys={['executionTimeInMs']}
                            margin={{ top: 50, bottom: 50, left: 60, right: 60 }}
                            axisBottom={{
                                legend: 'Implementation Type',
                                legendPosition: 'middle',
                                legendOffset: 40,
                            }}
                            axisLeft={{
                                legend: 'Average Execution Time (ms)',
                                legendPosition: 'middle',
                                legendOffset: -50,
                            }}
                            valueScale={{ type: 'linear' }}
                            indexScale={{ type: 'band', round: true }}
                            colors={({ index }) => {
                                if (index === 0) return 'rgb(226,194,164)';
                                if (index === 1) return 'rgb(228,124,103)';
                                if (index === 2) return 'rgb(238,226,113)';
                                return 'black';
                            }}
                            labelSkipWidth={12}
                            labelSkipHeight={12}
                            labelTextColor={{
                                from: 'color',
                                modifiers: [['darker', 1.6]],
                            }}
                            theme={{
                                axis: {
                                    legend: { text: { fontWeight: 600, fill: 'rgb(111,111,111)', fontSize: 13 } },
                                },
                            }}
                        />
                    </div>
                )}

                {pastResults.length > 1 && (
                    <div style={{ width: '100%', maxWidth: '640px', height: '400px' }}>
                        <ResponsiveLine
                            data={pastResultLineData}
                            margin={{ top: 50, bottom: 50, left: 60, right: 120 }}
                            axisBottom={{
                                legend: 'Runs',
                                legendPosition: 'middle',
                                legendOffset: 40,
                            }}
                            axisLeft={{
                                legend: 'Execution Time (ms)',
                                legendPosition: 'middle',
                                legendOffset: -50,
                            }}
                            theme={{
                                axis: {
                                    legend: { text: { fontWeight: 600, fill: 'rgb(111,111,111)', fontSize: 13 } },
                                },
                            }}
                            yFormat=" >-.2f"
                            pointSize={10}
                            pointColor="white"
                            pointBorderColor={{ from: 'serieColor' }}
                            pointBorderWidth={2}
                            legends={[
                                {
                                    anchor: 'bottom-right',
                                    direction: 'column',
                                    justify: false,
                                    translateX: 100,
                                    translateY: 0,
                                    itemsSpacing: 0,
                                    itemDirection: 'left-to-right',
                                    itemWidth: 80,
                                    itemHeight: 20,
                                    itemOpacity: 0.75,
                                    symbolSize: 12,
                                    symbolShape: 'circle',
                                    symbolBorderColor: 'rgba(0, 0, 0, .5)',
                                    effects: [
                                        {
                                            on: 'hover',
                                            style: {
                                                itemBackground: 'rgba(0, 0, 0, .03)',
                                                itemOpacity: 1,
                                            },
                                        },
                                    ],
                                },
                            ]}
                        />
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
                <LoadingOverlay visible={loading} />
            </Stack>
        </Container>
    );
}

// eslint-disable-next-line import/no-default-export
export default App;
