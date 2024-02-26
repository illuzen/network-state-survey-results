import React from 'react';
import './App.css';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Tabs } from 'antd';
import ResponsesTable from './ResponsesTable'
import AggregatedStats from './AggregatedStats'

ChartJS.register(...registerables);



const onChange = (key) => {
    console.log(key);
};

const items = [
    {
        key: 'aggregatedStats',
        label: 'Aggregated Stats',
        children: <AggregatedStats />,
    },
    {
        key: 'responsesTable',
        label: 'Individual Responses',
        children:  <ResponsesTable />,
    }
];

function App() {
    return (
        <div className="tabs-container">
            <Tabs defaultActiveKey='aggregatedStats' items={items} onChange={onChange} />
        </div>
    )
}

export default App;
