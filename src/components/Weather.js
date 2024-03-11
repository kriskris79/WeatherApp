import React, { useState, useEffect } from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import windArrow from '../assets/wind_arrow.svg';

function getWindDirection(degree) {
    if (degree > 337.5) return 'N';
    if (degree > 292.5) return 'NW';
    if (degree > 247.5) return 'W';
    if (degree > 202.5) return 'SW';
    if (degree > 157.5) return 'S';
    if (degree > 122.5) return 'SE';
    if (degree > 67.5) return 'E';
    if (degree > 22.5) return 'NE';
    return 'N';
}

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
                    <Card.Text className="wind-direction">
                        Wind Direction: {getWindDirection(weather.wind.deg)}
                        <img
                            src={windArrow}
                            alt="Wind Direction"
                            className="wind-arrow"
                        />
                    </Card.Text>
                    <Button variant="primary">Refresh</Button>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Weather;