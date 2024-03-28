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
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)'
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
            },
            y: {
                type: 'linear',
                beginAtZero: true,
                grid: {
                    color: 'transparent',
                },
                ticks: {
                    stepSize: 1,
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