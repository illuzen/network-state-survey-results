import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import ResponsesTable from './ResponsesTable'
import './App.css';
import { Chart as ChartJS, registerables } from 'chart.js';

ChartJS.register(...registerables);

function App() {
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
                label: dataset['Prompt'],
                data: labels.map(x => dataset[x]),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            }],
        };
    };


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
        responsive: true
    };

    return (
        <div>
            { chartData.map((item, index) => {
                const data = createHistogramData(item);
                return (
                    <div style={{ width: '600px', height: '300px', paddingBottom: '50px'}}>
                        <Bar data={data} title={"Histogram " + index} options={options} key={index}/>
                    </div>
                )
            })}
            <ResponsesTable />
        </div>

    );
}

export default App;
