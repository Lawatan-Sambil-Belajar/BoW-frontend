import { Card, Group, Title } from '@mantine/core';
import { motion } from 'framer-motion';

interface ComponentProps {
    name: string;
    timeInMs: number;
    width: number;
    slowFactor?: number;
}

export function ThreadProgress({ name, timeInMs, width, slowFactor = 1 }: ComponentProps) {
    const container = {
        visible: {
            scale: 1,
            transition: {
                duration: 0.5,
                delayChildren: 0.5,
                when: 'beforeChildren',
                ease: 'circOut',
            },
        },
        hidden: { scale: 0 },
    };

    const timeInSeconds = timeInMs / 1000;

    const progressBar = {
        hidden: { width: 0 },
        visible: { width, transition: { duration: timeInSeconds * slowFactor, ease: 'easeOut' } },
    };

    const time = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { delay: timeInSeconds * slowFactor + 1, ease: 'easeIn' } },
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={container}
        >
            <Card
                shadow="sm"
                radius="md"
                withBorder
            >
                <Title order={3}>{name}</Title>
                <Group w={300}>
                    <motion.div
                        style={{ backgroundColor: 'var(--mantine-color-indigo-3)', height: 50 }}
                        variants={progressBar}
                    />
                    <motion.p variants={time}>{timeInMs} ms</motion.p>
                </Group>
            </Card>
        </motion.div>
    );
}
