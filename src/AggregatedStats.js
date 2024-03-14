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
                backgroundColor: 'rgba(99, 199, 221, 0.4)',
                // backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
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
            },
            y: {
                type: 'linear',
                beginAtZero: true,
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