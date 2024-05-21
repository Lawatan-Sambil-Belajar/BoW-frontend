import { Group, Text, rem } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { useMediaQuery } from '@mantine/hooks';
import { IconFileCheck, IconFileDescription, IconUpload, IconX } from '@tabler/icons-react';
import { useState } from 'react';
import classes from '../styles/UploadTextFileDropzone.module.css';

export function UploadTextFileDropZone() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const isMobile = useMediaQuery('(max-width: 520px)');
    const textAlign = isMobile ? 'center' : 'left';

    return (
        <Dropzone
            onDrop={(files) => setSelectedFile(files[0])}
            maxSize={250 * 1024 * 1024}
            accept={['text/plain']}
            maxFiles={1}
            className={`${classes.dropzone} ${selectedFile && classes['dropzone-selected']}`}
        >
            <Group
                justify="center"
                gap={isMobile ? 'xs' : 'lg'}
                mih={220}
                p={20}
                style={{ pointerEvents: 'none' }}
            >
                <Dropzone.Accept>
                    <IconUpload
                        style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
                        stroke={1.5}
                    />
                </Dropzone.Accept>
                <Dropzone.Reject>
                    <IconX
                        style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }}
                        stroke={1.5}
                    />
                </Dropzone.Reject>
                <Dropzone.Idle>
                    {selectedFile ? (
                        <IconFileCheck
                            style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-green-6)' }}
                            stroke={1.5}
                        />
                    ) : (
                        <IconFileDescription
                            style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }}
                            stroke={1.5}
                        />
                    )}
                </Dropzone.Idle>
                <div>
                    {selectedFile ? (
                        <Text
                            size="xl"
                            inline
                            ta={textAlign}
                        >
                            Selected {selectedFile.name}
                        </Text>
                    ) : (
                        <>
                            <Text
                                size="xl"
                                inline
                                ta={textAlign}
                            >
                                Drag text file here or click to select files
                            </Text>
                            <Text
                                size="sm"
                                c="dimmed"
                                inline
                                mt={7}
                                ta={textAlign}
                            >
                                The file should not exceed 250mb
                            </Text>
                        </>
                    )}
                </div>
            </Group>
        </Dropzone>
    );
}
