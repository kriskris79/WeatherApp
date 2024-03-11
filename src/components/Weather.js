import React, { useState, useEffect } from 'react';
import { Container, Card, Button } from 'react-bootstrap';

const Weather = () => {
    const [weather, setWeather] = useState(null);

    useEffect(() => {
        const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=Folkestone,uk&units=metric&appid=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.main && data.wind) {
                    setWeather(data);
                } else {
                    console.error('Invalid data structure:', data);
                    setWeather(null);
                }
            })
            .catch(error => console.error("Error fetching data: ", error));
    }, []);

    if (!weather) return <Container>Loading...</Container>;


    return (
        <Container className="my-4">
            <Card className="text-center">
                <Card.Header as="h5">Weather in Folkestone</Card.Header>
                <Card.Body>
                    <Card.Title>{weather.main.temp} °C</Card.Title>
                    <Card.Text>
                        Wind Speed: {weather.wind.speed} m/s
                    </Card.Text>
                    <Button variant="primary">Refresh</Button>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Weather;