import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/Firebase';
import Weather from './components/Weather';
import ErrorBoundary from './components/ErrorBoundary';
import 'bootstrap/dist/css/bootstrap.css';
import "./scss/styles/_main.scss";

const App = () => {
    const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Assume loading until auth state is determined

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsLoading(false); // Once auth state is determined, stop loading
            setIsUserAuthenticated(!!user); // Update authentication state
        });
        return () => unsubscribe(); // Unsubscribe from auth state changes on component unmount
    }, []);

    return (
        <div className="App">
            <ErrorBoundary>
                {isLoading ? (
                    <div>Loading...</div>
                ) : !isUserAuthenticated ? (
                    // Redirect to login or show authentication UI
                    <div>Authentication Required</div>
                ) : (
                    // User authenticated, show main content (Weather component)
                    <Weather />
                )}
            </ErrorBoundary>
        </div>
    );
};

export default App;

