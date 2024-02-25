import React, {useEffect, useState} from 'react';
import { Space, Table, Tag } from 'antd';
const columns = [
    {
        title: 'Category',
        dataIndex: 'image',
        key: 'category',
        render: (image) => image['category']
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

const data = [
    {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
    },
    {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        tags: ['loser'],
    },
    {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sydney No. 1 Lake Park',
        tags: ['cool', 'teacher'],
    },
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
                    if (!['image', 'username', 'token_id'].includes(col)) {
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


    return <Table
        columns={tableCols}
        dataSource={tableData}
        pagination={{ pageSize: 50 }}  // Set the number of rows per page
    />;
}

export default ResponsesTable;