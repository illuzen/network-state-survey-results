import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Select} from "antd";


const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

function SurveySelect(props) {
    const {urlStem} = props
    const navigate = useNavigate();
    const [searchOptions, setSearchOptions] = useState(null);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch(urlStem + '/all-tasks');
                const tasks = await response.json();
                console.log({tasks})
                const formatted = tasks.map(x => { return { value: x.task_id, label: x.title }})
                console.log({formatted})
                setSearchOptions(formatted)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchTasks();
    }, []);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
                <h3>Please select which survey you want to display</h3>
            </div>
            { searchOptions ?
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }} >
                    <Select
                        showSearch
                        placeholder="Select a survey"
                        optionFilterProp="children"
                        onChange={(value) => navigate(`/${value}`)}
                        onSearch={(value) => console.log({value})}
                        filterOption={filterOption}
                        options={searchOptions}
                    />
                </div>
                : null }
        </div>
    )
}

export default SurveySelect;