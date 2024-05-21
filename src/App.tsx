import { Container, Stack, Title } from '@mantine/core';
import { UploadTextFileDropZone } from './components/UploadTextFileDropZone';

function App() {
    return (
        <Container>
            <Stack align="center">
                <Title>Bag of Words Visualisation</Title>
                <Title order={2}>Upload a Text File!</Title>
                <UploadTextFileDropZone />
            </Stack>
        </Container>
    );
}

// eslint-disable-next-line import/no-default-export
export default App;
