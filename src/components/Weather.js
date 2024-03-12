import React, { useState } from 'react';
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
    const [location, setLocation] = useState('');

    const fetchWeatherData = (query) => {
        const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&appid=${apiKey}`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`API call failed with status: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.cod === 200) {
                    setWeather(data);
                } else {
                    console.error('Weather data fetch error:', data.message);
                    setWeather(null);
                }
            })
            .catch(error => {
                console.error("Error fetching data: ", error.message);
                setWeather(null);
            });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchWeatherData(location.trim());
    };

    const weatherIconCode = weather && weather.weather[0] && weather.weather[0].icon;
    const weatherIconUrl = weatherIconCode ? `http://openweathermap.org/img/wn/${weatherIconCode}.png` : '';

    const sunriseTime = weather && new Date(weather.sys.sunrise * 1000).toLocaleTimeString();
    const sunsetTime = weather && new Date(weather.sys.sunset * 1000).toLocaleTimeString();

    return (
        <Container className="my-4">
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter city name or postcode"
                />
                <Button type="submit" variant="primary">Get Weather</Button>
            </form>
            {weather && (
                <Card className="text-center">
                    <Card.Header as="h5">Weather in {weather.name}</Card.Header>
                    <Card.Body>
                        <Card.Title>{weather.main.temp} °C</Card.Title>
                        {weatherIconUrl && (
                            <div className="weather-icon-container">
                                <img src={weatherIconUrl} alt="Weather Icon" style={{ width: '50px', height: '50px' }} />
                                <Card.Text className="weather-description">{weather.weather[0].description}</Card.Text>
                            </div>
                        )}
                        <Card.Text>Wind Speed: {weather.wind.speed} m/s</Card.Text>
                        <Card.Text className="wind-direction">
                            Wind Direction: {getWindDirection(weather.wind.deg)}
                            <img src={windArrow} alt="Wind Direction" className="wind-arrow" style={{ marginLeft: '5px' }} />
                        </Card.Text>
                        <Card.Text>Pressure: {weather.main.pressure} hPa</Card.Text>
                        <Card.Text>Humidity: {weather.main.humidity}%</Card.Text>
                        <Card.Text>Sunrise: {sunriseTime}</Card.Text>
                        <Card.Text>Sunset: {sunsetTime}</Card.Text>
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
};

export default Weather;
