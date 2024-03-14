import React, {useEffect, useState} from 'react';
import { useParams, useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import {Card, Tabs} from "antd";
import AggregatedStats from "./AggregatedStats";
import ClusterStats from "./ClusterStats";
import ResponsesTable from "./ResponsesTable";

function Survey(props) {
    let { urlStem } = props
    let { surveyId } = useParams(); // This hook gives you access to the surveyId param in the URL
    let navigate = useNavigate(); // For programmatically navigating
    const location = useLocation(); // To get the current location
    const [task, setTask] = useState(null);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await fetch(urlStem + '/task/' + surveyId);
                const t = await response.json();
                console.log({t})
                setTask(t[0])
                // navigate(`/${surveyId}/aggregatedStats`);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchTask();
    }, []);

    const handleTabChange = (key) => {
        // Navigate to the current survey with the new tab selected
        navigate(`/${surveyId}/${key}`);
    };

    if (task == null) {
        return <div>Loading...</div>;
    }

    const items = [
        { label: "Aggregated Stats", key: "aggregatedStats" },
        { label: "Clustered Stats", key: "clusteredStats" },
        { label: "Individual Responses", key: "individualResponses" },
        // More items as needed
    ];

    console.log({items, location})
    const activeKey = items.find(item => location.pathname.includes(item.key))?.key || items[0].key;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px', marginBottom: '20px' }}>
                <Card title={task.title} style={{ width: 500 }}>
                    <p>Network: {task.network}</p>
                    <p>Task ID: {task.task_id}</p>
                    <p>{task.description}</p>
                    <p>Contract: {task.contract_address}</p>
                </Card>
            </div>
            <div className="center-wrapper">
                <div className="tabs-container">
                    <Tabs activeKey={activeKey} onChange={handleTabChange} items={items} />
                    <Routes>
                        <Route path="aggregatedStats" element={<AggregatedStats taskId={task.task_id} urlStem={urlStem} />} />
                        <Route path="clusteredStats" element={<ClusterStats taskId={task.task_id} urlStem={urlStem} />} />
                        <Route path="individualResponses/*" element={<ResponsesTable taskId={task.task_id} urlStem={urlStem} />} />
                    </Routes>
                </div>
            </div>
        </div>
    )
}

export default Survey;
