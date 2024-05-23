import { Button, Container, Group, Stack, Text, Title } from '@mantine/core';
import { useState } from 'react';
import { ThreadProgress } from './components/ThreadProgress';
import { UploadTextFileDropzone } from './components/UploadTextFileDropzone';
import { ConcurrentResponse } from './types/ConcurrentResponse';
import { SequentialResponse } from './types/SequentialResponse';
import { VisualisationData } from './types/VisualisationData';

const LOCAL_URI = 'http://localhost:8080';

function App() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [visualisationData, setVisualisationData] = useState<VisualisationData>();
    console.log(visualisationData);

    const onStartVisualisation = async () => {
        if (selectedFile === null) return;
        const formData = new FormData();
        formData.append('textFile', selectedFile as Blob);
        const sequentialResponse = await fetch(`${LOCAL_URI}/bow/sequential`, { method: 'POST', body: formData });
        const concurrent1Response = await fetch(`${LOCAL_URI}/bow/concurrent/1`, { method: 'POST', body: formData });
        const concurrent2Response = await fetch(`${LOCAL_URI}/bow/concurrent/2`, { method: 'POST', body: formData });

        const sequentialData = (await sequentialResponse.json()) as SequentialResponse;
        const concurrent1Data = (await concurrent1Response.json()) as ConcurrentResponse;
        const concurrent2Data = (await concurrent2Response.json()) as ConcurrentResponse;

        const data = {
            sequential: sequentialData,
            concurrent1: concurrent1Data,
            concurrent2: concurrent2Data,
        };

        setVisualisationData(data);
    };

    const concurrent1Max = visualisationData?.concurrent1.threadMetricsDTOList.reduce(
        (acc, curr) => (acc > curr.executionTimeInMs ? acc : curr.executionTimeInMs),
        0,
    );

    const concurrent2Max = visualisationData?.concurrent2.threadMetricsDTOList.reduce(
        (acc, curr) => (acc > curr.executionTimeInMs ? acc : curr.executionTimeInMs),
        0,
    );

    return (
        <Container size="xl">
            <Stack align="center">
                <Title>Bag of Words Visualisation</Title>
                <Title order={2}>Upload a Text File!</Title>
                <UploadTextFileDropzone
                    selectedFile={selectedFile}
                    setSelectedFile={setSelectedFile}
                />
                <Button
                    size="md"
                    onClick={onStartVisualisation}
                >
                    Start Visualisation
                </Button>
                {visualisationData && !!concurrent1Max && !!concurrent2Max && (
                    <Group
                        gap={30}
                        justify="space-evenly"
                        align="flex-start"
                        p={20}
                    >
                        <Stack align="center">
                            <Title order={3}>Sequential</Title>
                            <ThreadProgress
                                name="Main Thread"
                                timeInMs={visualisationData.sequential.executionTimeInMs}
                                width={210}
                            />
                            <Text>Total time: {visualisationData.sequential.executionTimeInMs} ms</Text>
                        </Stack>
                        <Stack align="center">
                            <Title order={3}>Concurrent 1</Title>
                            {visualisationData.concurrent1.threadMetricsDTOList.map((threadMetricsDTO, index) => (
                                <ThreadProgress
                                    key={threadMetricsDTO.name}
                                    name={`Thread ${index + 1}`}
                                    timeInMs={threadMetricsDTO.executionTimeInMs}
                                    width={(threadMetricsDTO.executionTimeInMs / concurrent1Max) * 210}
                                />
                            ))}
                            <Text>Total time: {visualisationData.concurrent1.executionTimeInMs} ms</Text>
                        </Stack>
                        <Stack align="center">
                            <Title order={3}>Concurrent 2</Title>
                            {visualisationData.concurrent2.threadMetricsDTOList.map((threadMetricsDTO, index) => (
                                <ThreadProgress
                                    key={threadMetricsDTO.name}
                                    name={`Thread ${index + 1}`}
                                    timeInMs={threadMetricsDTO.executionTimeInMs}
                                    width={(threadMetricsDTO.executionTimeInMs / concurrent2Max) * 210}
                                />
                            ))}
                            <ThreadProgress
                                name="Time taken to combine"
                                timeInMs={visualisationData.concurrent2.executionTimeInMs - concurrent2Max}
                                width={
                                    ((visualisationData.concurrent2.executionTimeInMs - concurrent2Max) /
                                        concurrent2Max) *
                                    210
                                }
                            />
                            <Text>Total time: {visualisationData.concurrent2.executionTimeInMs} ms</Text>
                        </Stack>
                    </Group>
                )}
            </Stack>
        </Container>
    );
}

// eslint-disable-next-line import/no-default-export
export default App;
