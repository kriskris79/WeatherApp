import React, { useState } from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import windArrow from '../assets/wind_arrow.svg';

function calculateRotation(degree) {
    return `rotate(${degree}deg)`;
}

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

function getAQILevel(pm25) {
    if (pm25 <= 10) return { level: 'Good', color: 'Green' };
    else if (pm25 <= 25) return { level: 'Fair', color: 'Yellow' };
    else if (pm25 <= 50) return { level: 'Moderate', color: 'Orange' };
    else if (pm25 <= 75) return { level: 'Poor', color: 'Red' };
    else return { level: 'Very Poor', color: 'Black' };
}

const Weather = () => {
    const [weather, setWeather] = useState(null);
    const [location, setLocation] = useState('');
    const [airPollution, setAirPollution] = useState(null);

    const fetchWeatherData = async (query) => {
        const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&appid=${apiKey}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.cod === 200) {
                setWeather(data);
                fetchAirPollutionData(data.coord.lat, data.coord.lon);
            } else {
                console.error('Weather data fetch error:', data.message);
                setWeather(null);
            }
        } catch (error) {
            console.error("Error fetching data: ", error.message);
            setWeather(null);
        }
    };

    const fetchAirPollutionData = async (lat, lon) => {
        const apiKey = process.env.REACT_APP_AIR_POLLUTION_API_KEY;
        const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            if (response.ok) {
                setAirPollution(data);
            } else {
                console.error('Air Pollution data fetch error:', data.message);
                setAirPollution(null);
            }
        } catch (error) {
            console.error('Error fetching air pollution data:', error);
            setAirPollution(null);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchWeatherData(location.trim());
    };

    const windSpeedInKmh = weather ? (weather.wind.speed * 3.6).toFixed(2) : 0;

    //convert UTC time to local time
    const convertToLocalTime = (utcSeconds, timezoneOffset) => {
        const utcDate = new Date(utcSeconds * 1000);
        const localDate = new Date(utcDate.getTime() + timezoneOffset * 1000);
        return localDate.toLocaleTimeString();
    };


    const weatherIconCode = weather && weather.weather[0] && weather.weather[0].icon;
    const weatherIconUrl = weatherIconCode ? `http://openweathermap.org/img/wn/${weatherIconCode}.png` : '';

    //timezone offset to adjust times
    const sunriseTime = weather ? convertToLocalTime(weather.sys.sunrise, weather.timezone) : '';
    const sunsetTime = weather ? convertToLocalTime(weather.sys.sunset, weather.timezone) : '';
    const localTime = weather ? new Date(Date.now() + weather.timezone * 1000).toLocaleTimeString() : '';
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
                    <Card.Header as="h5">Weather in {weather.name}, {weather.sys.country}</Card.Header>
                    <Card.Body>
                        <Card.Title>{weather.main.temp} °C</Card.Title>
                        {weatherIconUrl && (
                            <div className="weather-icon-container">
                                <img src={weatherIconUrl} alt="Weather Icon"  />
                                <Card.Text className="weather-description">{weather.weather[0].description}</Card.Text>
                            </div>
                        )}
                        <Card.Text>Wind Speed: {windSpeedInKmh} km/h</Card.Text>
                        <Card.Text className="wind-direction">
                            Wind Direction: {getWindDirection(weather.wind.deg)}
                            <img
                                src={windArrow}
                                alt="Wind Direction"
                                className={`wind-arrow ${getWindDirection(weather.wind.deg).toLowerCase()}`}
                                style={{ marginLeft: '5px' }}
                            />
                        </Card.Text>
                        <Card.Text>Pressure: {weather.main.pressure} hPa</Card.Text>
                        <Card.Text>Humidity: {weather.main.humidity}%</Card.Text>
                        <Card.Text>Sunrise: {sunriseTime}</Card.Text>
                        <Card.Text>Sunset: {sunsetTime}</Card.Text>
                        <Card.Text>Local Time: {localTime}</Card.Text>
                        {airPollution && (
                            <Card className="text-center mt-3">
                                <Card.Header as="h5">Air Quality Index (AQI)</Card.Header>
                                <Card.Body>
                                    <Card.Title>AQI: {airPollution.list[0].main.aqi}</Card.Title>
                                    <Card.Text>CO (Carbon monoxide): {airPollution.list[0].components.co.toFixed(2)} μg/m³</Card.Text>
                                    <Card.Text>NO (Nitrogen monoxide): {airPollution.list[0].components.no.toFixed(2)} μg/m³</Card.Text>
                                    <Card.Text>NO2 (Nitrogen dioxide): {airPollution.list[0].components.no2.toFixed(2)} μg/m³</Card.Text>
                                    <Card.Text>O3 (Ozone): {airPollution.list[0].components.o3.toFixed(2)} μg/m³</Card.Text>
                                    <Card.Text>SO2 (Sulphur dioxide): {airPollution.list[0].components.so2.toFixed(2)} μg/m³</Card.Text>
                                    <Card.Text>PM2.5 (Fine particles matter): {airPollution.list[0].components.pm2_5.toFixed(2)} μg/m³</Card.Text>
                                    <Card.Text>PM10 (Coarse particulate matter): {airPollution.list[0].components.pm10.toFixed(2)} μg/m³</Card.Text>
                                    <Card.Text>NH3 (Ammonia): {airPollution.list[0].components.nh3.toFixed(2)} μg/m³</Card.Text>
                                </Card.Body>
                            </Card>
                        )}
                    </Card.Body>
                </Card>


            )}
        </Container>
    );
};

export default Weather;
