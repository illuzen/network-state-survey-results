import React, {useEffect, useState} from 'react';
import { Space, Table, Tag } from 'antd';
const columns = [
    {
        title: 'Category',
        dataIndex: 'name',
        key: 'name'
    },
    {
        title: 'Token ID',
        dataIndex: 'token_id',
        key: 'token_id'
    },
    {
        title: 'Username',
        dataIndex: 'username',
        key: 'username'
    }
];

function ResponsesTable() {
    const [tableData, setTableData] = useState(null);
    const [tableCols, setTableCols] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://earthnetcdn.com/stats/individual-responses/7');
                const data = await response.json();
                const newCols = columns
                Object.keys(data[0]).forEach((col, index) => {
                    console.log('key', col)
                    if (!['image', 'username', 'name', 'token_id'].includes(col)) {
                        console.log('adding column', col)
                        newCols.push({
                            title: col,
                            dataIndex: col,
                            key: col
                        })
                    }
                })
                data.forEach((row, index) => {
                    row.key = index
                })

                console.log('individual: ', newCols, data)
                // Process and set your data here
                setTableData(data);
                setTableCols(newCols);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    if (!tableData) {
        return <div>Loading...</div>;
    }


    return <Table
        columns={tableCols}
        dataSource={tableData}
        pagination={{ pageSize: 50 }}  // Set the number of rows per page
    />;
}

export default ResponsesTable;