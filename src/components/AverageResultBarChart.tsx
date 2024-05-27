import { BarDatum, ResponsiveBar } from '@nivo/bar';

export function AverageResultBarChart({ data }: { data: BarDatum[] }) {
    return (
        <ResponsiveBar
            indexBy="name"
            data={data}
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
    );
}
