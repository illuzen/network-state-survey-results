import React, {useEffect, useState} from "react";
import {Bar} from "react-chartjs-2";


function insertNewLine(str, interval) {
    const regex = new RegExp(`(.{${interval}})`, 'g');
    return str.replace(regex, '$1\n');
}

const urlStem = 'https://earthnetcdn.com/stats/'
// const urlStem = 'http://localhost:8000/stats/'

function ClusterStats() {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(urlStem + 'responses-by-cluster/2');
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
            {Object.keys(chartData).map((cluster, index) => {
                return (
                    <div>
                        {cluster}
                        {Object.keys(chartData[cluster]).map((question, index) => {
                            const data = createHistogramData(chartData[cluster][question]);
                            console.log({data})
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