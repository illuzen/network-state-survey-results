import React, {useEffect, useState} from "react";
import {Bar} from "react-chartjs-2";

function AggregatedStats(props) {
    const [chartData, setChartData] = useState(null);

    const {taskId, urlStem} = props

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(urlStem + '/survey-stats/' + taskId);
                const text = await response.text()
                const data = JSON.parse(text);
                // Process and set your data here
                setChartData(data);
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
                    color: '#FFFFFF', // Ensures text labels are white
                    font: {
                        weight: 'bold' // Makes the labels bold
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
        layout: {
            padding: {
                bottom: 30 // Adjusts padding at the bottom to ensure labels fit
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
            {Object.keys(chartData).map((question, index) => {
                const data = createHistogramData(chartData[question]);
                return (
                    <div>
                        <div className="aggregated-chart">
                            <div className="chart-title"><h3>{question}</h3></div>
                            <Bar data={data} title={"Histogram " + index} options={options} key={index}/>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default AggregatedStats;