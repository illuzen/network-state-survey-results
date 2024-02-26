import React, {useEffect, useState} from "react";
import {Bar} from "react-chartjs-2";


function insertNewLine(str, interval) {
    const regex = new RegExp(`(.{${interval}})`, 'g');
    return str.replace(regex, '$1\n');
}

function AggregatedStats() {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://earthnetcdn.com/stats/collection-stats/7');
                const data = await response.json();
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
    const createHistogramData = (dataset) => {
        return {
            labels: labels,
            datasets: [{
                data: labels.map(x => dataset[x]),
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
            {chartData.map((item, index) => {
                const data = createHistogramData(item);
                return (
                    <div>
                        <div className="aggregated-chart">
                            <div className="chart-title"><h3>{item['Prompt']}</h3></div>
                            <Bar data={data} title={"Histogram " + index} options={options} key={index}/>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default AggregatedStats;