import { Container, Group, Stack, Title } from '@mantine/core';
import { ThreadProgress } from './components/ThreadProgress';
import { UploadTextFileDropzone } from './components/UploadTextFileDropzone';
import { threadMetricsDTOList } from './mock/threadMetricsDTOList';

function App() {
    const max = threadMetricsDTOList.reduce(
        (acc, curr) => (acc > curr.executionTimeInMs ? acc : curr.executionTimeInMs),
        0,
    );

    return (
        <Container size="xl">
            <Stack align="center">
                <Title>Bag of Words Visualisation</Title>
                <Title order={2}>Upload a Text File!</Title>
                <UploadTextFileDropzone />
                <Group
                    gap={30}
                    justify="space-evenly"
                    align="flex-start"
                    p={20}
                >
                    <Stack>
                        {threadMetricsDTOList.map((threadMetricsDTO, index) => (
                            <ThreadProgress
                                key={threadMetricsDTO.name}
                                name={`Thread ${index + 1}`}
                                timeInMs={threadMetricsDTO.executionTimeInMs}
                                width={(threadMetricsDTO.executionTimeInMs / max) * 210}
                            />
                        ))}
                    </Stack>
                    <Stack>
                        <ThreadProgress
                            name="Thread 1"
                            timeInMs={473}
                            width={210}
                        />
                    </Stack>
                    <Stack>
                        <ThreadProgress
                            name="Thread 1"
                            timeInMs={473}
                            width={210}
                        />
                    </Stack>
                </Group>
            </Stack>
        </Container>
    );
}

// eslint-disable-next-line import/no-default-export
export default App;
