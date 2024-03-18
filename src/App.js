import React from 'react';
import Weather from './components/Weather';
import 'bootstrap/dist/css/bootstrap.css';
import "./scss/styles/_main.scss";

const App = () => {
    return (
        <div className="App">
            <Weather />
        </div>
    );
};

export default App;