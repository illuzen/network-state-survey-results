import React, {useEffect, useState} from "react";
import {Bar} from "react-chartjs-2";
import { Row, Col, Card, Typography, Divider } from 'antd';
const { Title } = Typography;


function insertNewLine(str, interval) {
    const regex = new RegExp(`(.{${interval}})`, 'g');
    return str.replace(regex, '$1\n');
}

function ClusterStats(props) {
    const [chartData, setChartData] = useState(null);
    const {taskId, urlStem} = props

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(urlStem + '/responses-by-cluster/' + taskId);
                const text = await response.text()
                const clusterData = JSON.parse(text);
                console.log({clusterData})
                // Process and set your data here
                setChartData(clusterData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const labels = ['Strongly Agree', 'Agree', 'Disagree', 'Strongly Disagree']
    // Function to create data structure for each histogram
    const createHistogramData = (item) => {
        return {
            labels: labels,
            datasets: [{
                data: labels.map(label => item[label]),
                backgroundColor: [
                    '#45B3B5', // Cyan
                    '#1B6178', // Dark cyan
                    '#1A7EA5', // Sky blue
                    '#0F3A4E', // Deep sea blue
                ],
                borderColor: 'transparent',
            }],
        };
    }

    if (!chartData) {
        return <div>Loading...</div>;
    }

    console.log({chartData})

    const options = {
        scales: {
            x: {
                type: 'category',
                grid: {
                    color: 'transparent',
                },
                ticks: {
                    color: '#FFFFFF', // Keeps text labels white
                    font: {
                        weight: 'bold' // Keeps the labels bold
                    },
                }
            },
            y: {
                type: 'linear',
                beginAtZero: true,
                grid: {
                    color: 'transparent',
                },
                ticks: {
                    stepSize: 1,
                    color: '#FFFFFF', // Ensures text labels are white
                    font: {
                        weight: 'bold' // Makes the labels bold
                    },
                    callback: function(value) {
                        if (Number.isInteger(value)) {
                            return value.toString();
                        }
                        return value.toFixed(1);
                    }
                }
            }
        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false, // This will hide the legend
            },
        }
    }

    return (
        <div className="aggregated-charts">
            {Object.keys(chartData).map((cluster, index) => {
                return (
                    <div>
                        <Title level={4} style={{ textAlign: 'center', margin: '20px 0', paddingTop: '50px' }}>{cluster}</Title>

                        {Object.keys(chartData[cluster]).map((question, index) => {
                            const data = createHistogramData(chartData[cluster][question]);
                            return (
                                <div className="aggregated-chart">
                                    <div className="chart-title"><h3>{question}</h3></div>
                                    <Bar data={data} title={"Histogram " + index} options={options} key={index}/>
                                </div>
                                )})}
                    </div>
                )
            })}
        </div>
    )
}

export default ClusterStats;