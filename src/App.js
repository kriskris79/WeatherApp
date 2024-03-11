import React from 'react';
import Weather from './components/Weather';
import 'bootstrap/dist/css/bootstrap.css';
import "./scss/styles/_main.scss";

function App() {
    return (
        <div className="App">
            <header className="App-header">
            </header>
            <main>
                <Weather />
            </main>
        </div>
    );
}

export default App;