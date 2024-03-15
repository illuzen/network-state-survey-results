import React, {useEffect, useState} from 'react';
import { Table, Select, Card } from 'antd';
import {Route, Routes, useParams, useNavigate, useLocation} from "react-router-dom";
import Survey from "./Survey";

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

// Filter `option.label` match the user type `input`
const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());


const UserResponse = (props) => {
    let { taskId, chosenUser, urlStem } = props
    let { username } = useParams(); // This captures the username from the URL
    const [tableData, setTableData] = useState(null);
    const [tableCols, setTableCols] = useState(null);
    // Fetch user-specific data here based on `username`, or pass it down to child components

    console.log({username, taskId, chosenUser, urlStem})

    useEffect(() => {
        const fetchIndividualData = async (username) => {
            if (username == null) {
                return
            }

            try {
                const url = urlStem + '/individual-responses/' + taskId + '/' + username
                console.log({url})
                const fetched = await fetch(url);
                console.log({fetched})
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

        fetchIndividualData(username);
    }, [username]);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Card title={chosenUser.username} style={{ width: 300 }}>
                    <p>Cluster: {chosenUser.cluster}</p>
                    <p>Token ID: {chosenUser.token_id}</p>
                    <p>Farcaster ID: {chosenUser.user_fid}</p>
                </Card>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                { tableData ?
                    <Table
                        columns={tableCols}
                        dataSource={tableData}
                        pagination={{ pageSize: 50 }}  // Set the number of rows per page
                    /> : null }
            </div>
            <Routes>
                <Route path="/:username/*" element={<Survey urlStem={urlStem}/>} />
            </Routes>

        </div>
    );
};


function ResponsesTable(props) {
    const [searchOptions, setSearchOptions] = useState(null);
    const [chosenUser, setChosenUser] = useState(null);
    const [allUsers, setAllUsers] = useState(null);
    const navigate = useNavigate();
    const location = useLocation(); // To get the current location
    const {taskId, urlStem} = props
    console.log({taskId, urlStem, location})
    const components = location.pathname.split('/')
    let username = null
    if (components.length > 2 && components[components.length - 2] === 'individualResponses') {
        username = components[components.length - 1]
    }

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                console.log({taskId, urlStem})
                const url = urlStem + '/all-users/' + taskId
                const response = await fetch(url)
                console.log({url, response})
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
                if (username) {
                    setChosenUser(all[username])
                    // TODO: make the select already show username in this case
                }

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchUsers();
    }, []);


    const handleSelection = async (username) => {
        setChosenUser(allUsers[username])
        navigate(`/${taskId}/individualResponses/${username}`)
    }


    if (!searchOptions) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Select
                    showSearch
                    placeholder="Select a username"
                    optionFilterProp="children"
                    onChange={handleSelection}
                    onSearch={(value) => console.log({value})}
                    filterOption={filterOption}
                    options={searchOptions}
                />
            </div>

            <Routes>
                <Route path=":username" element={<UserResponse taskId={taskId} chosenUser={chosenUser} urlStem={urlStem} />} />
            </Routes>

        </div>
    );
}

export default ResponsesTable;