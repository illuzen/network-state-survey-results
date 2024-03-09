import React, {useEffect, useState} from 'react';
import { Table, Select, Card } from 'antd';

const omitColumns = [
    'image',
    'username',
    'cluster',
    'name',
    'task_id',
    'token_id',
    'value',
    'user_fid',
    'question_id',
    'response_id'
]

const nameMapping = {
    'text': 'Answer',
    'submitted_at': 'Time',
    'question': 'Question'
}

const urlStem = 'https://earthnetcdn.com/stats'
const taskId = 2

// Filter `option.label` match the user type `input`
const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());


function ResponsesTable() {
    const [tableData, setTableData] = useState(null);
    const [tableCols, setTableCols] = useState(null);
    const [searchOptions, setSearchOptions] = useState(null);
    const [chosenUser, setChosenUser] = useState(null);
    const [allUsers, setAllUsers] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(urlStem + '/all-usernames/' + taskId);
                const users = await response.json();
                console.log({users})
                const all = {}
                users.forEach(user => {
                    all[user.username] = user
                })
                setAllUsers(all)
                const formatted = users.map(x => { return { value: x.username, label: x.username }})
                console.log({formatted})
                setSearchOptions(formatted)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        const fetchIndividualData = async (user) => {
            if (user == null) {
                return
            }
            const username = user.username

            try {
                const url = urlStem + '/individual-responses/' + taskId + '/' + username
                console.log({url})
                const fetched = await fetch(url);
                const responses = await fetched.json();
                console.log({responses})

                const newCols = []
                // TODO: just hardcode the column names?
                Object.keys(responses[0]).forEach((col, index) => {
                    if (!omitColumns.includes(col)) {
                        console.log('adding column', col)
                        newCols.push({
                            title: nameMapping[col],
                            dataIndex: col,
                            key: col
                        })
                    }
                })

                responses.forEach((row, index) => {
                    row.key = index
                })

                console.log('individual: ', newCols, responses)
                // Process and set your data here
                setTableData(responses);
                setTableCols(newCols);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchIndividualData(chosenUser);
    }, [chosenUser]);

    if (!searchOptions) {
        return <div>Loading...</div>;
    }


    return (
        <div>
            <Select
                showSearch
                placeholder="Select a username"
                optionFilterProp="children"
                onChange={(value) => setChosenUser(allUsers[value])}
                onSearch={(value) => console.log({value})}
                filterOption={filterOption}
                options={searchOptions}
            />
            { chosenUser ?
                <Card title={chosenUser.username} style={{ width: 300 }}>
                    <p>Cluster: {chosenUser.cluster}</p>
                    <p>Token ID: {chosenUser.token_id}</p>
                    <p>Farcaster ID: {chosenUser.user_fid}</p>
                </Card> : null }
            { tableData ?
                <Table
                    columns={tableCols}
                    dataSource={tableData}
                    pagination={{ pageSize: 50 }}  // Set the number of rows per page
                /> : null }
        </div>
    );
}

export default ResponsesTable;