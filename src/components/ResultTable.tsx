import { Pagination, Table } from '@mantine/core';
import { useEffect, useState } from 'react';

interface ComponentProps {
    data: [string, number][];
    rowPerPage: number;
}

export function ResultTable({ data, rowPerPage }: ComponentProps) {
    const [activePage, setPage] = useState(1);
    const [chunkedData, setChunkedData] = useState<[string, number][]>([]);

    useEffect(() => {
        const startIndex = (activePage - 1) * rowPerPage;
        setChunkedData(data.slice(startIndex, startIndex + rowPerPage));
    }, [data, rowPerPage, activePage]);

    return (
        <>
            <Table striped withTableBorder withColumnBorders layout='fixed' >
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Word</Table.Th>
                        <Table.Th>Count</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {chunkedData.map((row) => (
                        <Table.Tr key={row[0]}>
                            <Table.Td>{row[0]}</Table.Td>
                            <Table.Td>{[row[1]]}</Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
            <Pagination siblings={2} total={data.length / rowPerPage} value={activePage} onChange={setPage} mt="sm" />
        </>
    );
}