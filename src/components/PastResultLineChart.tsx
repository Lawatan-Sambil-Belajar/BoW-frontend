import { ResponsiveLine, Serie } from '@nivo/line';

export function PastResultLineChart({ data }: { data: Serie[] }) {
    return (
        <ResponsiveLine
            data={data}
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
    );
}
