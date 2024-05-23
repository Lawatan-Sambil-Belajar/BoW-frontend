import { Container, Group, Stack, Title } from '@mantine/core';
import { ThreadProgress } from './components/ThreadProgress';
import { UploadTextFileDropzone } from './components/UploadTextFileDropzone';

function App() {
    return (
        <Container>
            <Stack align="center">
                <Title>Bag of Words Visualisation</Title>
                <Title order={2}>Upload a Text File!</Title>
                <UploadTextFileDropzone />
                <Group gap={50}>
                    <Stack>
                        <ThreadProgress
                            name="Thread 1"
                            timeInMs={473}
                            width={300}
                        />
                    </Stack>
                    <Stack>asdf</Stack>
                    <Stack>asdf</Stack>
                </Group>
            </Stack>
        </Container>
    );
}

// eslint-disable-next-line import/no-default-export
export default App;
