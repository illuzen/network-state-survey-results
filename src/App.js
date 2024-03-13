import React, {useEffect, useState} from 'react';
import './App.css';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Tabs, Select, Card } from 'antd';
import ResponsesTable from './ResponsesTable'
import AggregatedStats from './AggregatedStats'
import ClusterStats from "./ClusterStats";

ChartJS.register(...registerables);

const urlStem = 'https://earthnetcdn.com/stats'
// const urlStem = 'http://localhost:8000/stats'

const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

function App() {
    const [allTasks, setAllTasks] = useState(null);
    const [chosenTask, setChosenTask] = useState(null);
    const [searchOptions, setSearchOptions] = useState(null);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch(urlStem + '/all-tasks');
                const tasks = await response.json();
                console.log({tasks})
                const all = {}
                tasks.forEach(task => {
                    all[task.title] = task
                })
                setAllTasks(all)
                const formatted = tasks.map(x => { return { value: x.title, label: x.title }})
                console.log({formatted})
                setSearchOptions(formatted)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchTasks();
    }, []);

    let items = []
    if (chosenTask) {
        items = [
            {
                key: 'aggregatedStats',
                label: 'Aggregated Stats',
                children: <AggregatedStats taskId={chosenTask.task_id} urlStem={urlStem} />,
            },
            {
                key: 'byCluster',
                label: 'Cluster Stats',
                children: <ClusterStats taskId={chosenTask.task_id} urlStem={urlStem} />,
            },
            {
                key: 'responsesTable',
                label: 'Individual Responses',
                children:  <ResponsesTable taskId={chosenTask.task_id} urlStem={urlStem} />,
            }
        ]
    }

    return (
        <div>
            <Select
                showSearch
                placeholder="Select a task"
                optionFilterProp="children"
                onChange={(value) => setChosenTask(allTasks[value])}
                onSearch={(value) => console.log({value})}
                filterOption={filterOption}
                options={searchOptions}
            />
            { chosenTask ?
                <div>
                    <Card title={chosenTask.title} style={{ width: 500 }}>
                        <p>Network: {chosenTask.network}</p>
                        <p>Task ID: {chosenTask.task_id}</p>
                        <p>{chosenTask.description}</p>
                        <p>Contract: {chosenTask.contract_address}</p>
                    </Card>
                    <div className="tabs-container">
                        <Tabs defaultActiveKey='aggregatedStats' items={items} onChange={console.log} />
                    </div>
                </div> : null
            }
        </div>
    )
}

export default App;
