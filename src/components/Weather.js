import React, { useState, useEffect } from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import windArrow from '../assets/wind_arrow.svg';

function getWindDirection(degree) {
    if (degree > 337.5 || degree <= 22.5) return 'North';
    if (degree > 22.5 && degree <= 67.5) return 'Northeast';
    if (degree > 67.5 && degree <= 112.5) return 'East';
    if (degree > 112.5 && degree <= 157.5) return 'Southeast';
    if (degree > 157.5 && degree <= 202.5) return 'South';
    if (degree > 202.5 && degree <= 247.5) return 'Southwest';
    if (degree > 247.5 && degree <= 292.5) return 'West';
    if (degree > 292.5 && degree <= 337.5) return 'Northwest';
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

    const weatherIconCode = weather && weather.weather[0].icon;
    const weatherIconUrl = `http://openweathermap.org/img/wn/${weatherIconCode}.png`;

    return (
        <Container className="my-4">
            <Card className="text-center">
                <Card.Header as="h5">Weather in Folkestone</Card.Header>
                <Card.Body>
                    <Card.Title>{weather.main.temp} °C</Card.Title>
                    {weatherIconCode && (
                        <div className="weather-icon-container">
                            <img src={weatherIconUrl} alt="Weather Icon" />
                            <Card.Text className="weather-description">{weather.weather[0].description}</Card.Text>
                        </div>
                    )}
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