import React from 'react';
import './App.css';
import './styles.css';
import { Chart as ChartJS, registerables } from 'chart.js';
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import Survey from './Survey';
import SurveySelect from './SurveySelect';

ChartJS.register(...registerables);

// const urlStem = 'https://earthnetcdn.com/stats'
const urlStem = 'http://localhost:8000/stats'

function App() {

    return (
        <div>
            <BrowserRouter>
                <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                    <Link to="/">
                        <img src='/nss.logo.png' style={{ width: "30%"}}/>
                    </Link>
                </div>
                <Routes>
                    <Route path="/:surveyId/*" element={<Survey urlStem={urlStem}/>} />
                    <Route path="/" element={<SurveySelect urlStem={urlStem} />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App;
