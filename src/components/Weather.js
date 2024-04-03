import React, { useState} from 'react';
import { Container, Card, Button, Form, ProgressBar  } from 'react-bootstrap';
import windArrow from '../assets/wind_arrow.svg';

function getCurrentFormattedDate(offset = 0) {
    const now = new Date();
    now.setDate(now.getDate() + offset);
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return now.toLocaleDateString('en-UK', options);
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

function getAQIQualitativeName(aqiValue) {
    switch(aqiValue) {
        case 1:
            return 'Good';
        case 2:
            return 'Fair';
        case 3:
            return 'Moderate';
        case 4:
            return 'Poor';
        case 5:
            return 'Very Poor';
        default:
            return 'Unknown';
    }
}

function getPollutantLevel(pollutant, value) {
    let level;
    if (pollutant === 'so2') {
        if (value <= 20) level = 'Good';
        else if (value <= 80) level = 'Fair';
        else if (value <= 250) level = 'Moderate';
        else if (value <= 350) level = 'Poor';
        else level = 'Very Poor';
    } else if (pollutant === 'no2') {
        if (value <= 40) level = 'Good';
        else if (value <= 70) level = 'Fair';
        else if (value <= 150) level = 'Moderate';
        else if (value <= 200) level = 'Poor';
        else level = 'Very Poor';
    } else if (pollutant === 'pm10') {
        if (value <= 20) level = 'Good';
        else if (value <= 50) level = 'Fair';
        else if (value <= 100) level = 'Moderate';
        else if (value <= 200) level = 'Poor';
        else level = 'Very Poor';
    } else if (pollutant === 'pm2_5') {
        if (value <= 10) level = 'Good';
        else if (value <= 25) level = 'Fair';
        else if (value <= 50) level = 'Moderate';
        else if (value <= 75) level = 'Poor';
        else level = 'Very Poor';
    } else if (pollutant === 'o3') {
        if (value <= 60) level = 'Good';
        else if (value <= 100) level = 'Fair';
        else if (value <= 140) level = 'Moderate';
        else if (value <= 180) level = 'Poor';
        else level = 'Very Poor';
    } else if (pollutant === 'co') {
        if (value <= 4400) level = 'Good';
        else if (value <= 9400) level = 'Fair';
        else if (value <= 12400) level = 'Moderate';
        else if (value <= 15400) level = 'Poor';
        else level = 'Very Poor';
    }
    return level;
}

const convertToKelvin = (celsiusTemp) => {
    // round to two d.p.
    return (celsiusTemp + 273.15).toFixed(2);
};

const Weather = () => {
    const [weather, setWeather] = useState(null);
    const [location, setLocation] = useState('');
    const [forecast, setForecast] = useState([]);
    const [airPollution, setAirPollution] = useState(null);
    const [selectedForecastDay, setSelectedForecastDay] = useState(0);
    const [loading, setLoading] = useState(false);
    const [tempUnit, setTempUnit] = useState('metric');
    const [showExplanation, setShowExplanation] = useState(false);
    const [is24HourFormat, setIs24HourFormat] = useState(true);



    const toggleTempUnit = () => {
        setTempUnit(tempUnit === 'metric' ? 'standard' : 'metric');
    };

    const toggleExplanation = () => {
        setShowExplanation(!showExplanation);
    };

    const fetchWeatherData = async (query) => {
        setLoading(true);
        const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&appid=${apiKey}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.cod === 200) {
                setWeather(data);
                fetchAirPollutionData(data.coord.lat, data.coord.lon);
                fetchForecastData(data.coord.lat, data.coord.lon);
            } else {
                console.error('Weather data fetch error:', data.message);
                setWeather(null);
            }
        } catch (error) {
            console.error("Error fetching data: ", error.message);
            setWeather(null);
        }
        setLoading(false);
    };

    const fetchForecastData = async (lat, lon) => {
        const apiKey = process.env.REACT_APP_WEATHER_FORECAST_API_KEY;
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.cod === "200") {
            setForecast(data.list);
        } else {
            console.error('Forecast data fetch error:', data.message);
            setForecast([]);
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
        if (location) {
            fetchWeatherData(location.trim());
        }
    };


    const windSpeedInKmh = weather ? (weather.wind.speed * 3.6).toFixed(2) : 0;



    //convert UTC time to local time for summer
    const convertToLocalTime = (utcSeconds, timezoneOffset, is24Hour = true) => {
        // Subtract one hour  from the provided timezone offset
        const adjustedTimezoneOffset = timezoneOffset - 3600;
        const date = new Date((utcSeconds + adjustedTimezoneOffset) * 1000);
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: !is24Hour,
        };

        return date.toLocaleTimeString([], options);
    };

    //convert UTC time to local time for winter
    // const convertToLocalTime = (utcSeconds, timezoneOffset, is24Hour = true) => {
    //     const date = new Date((utcSeconds + timezoneOffset) * 1000);
    //     const options = {
    //         hour: '2-digit',
    //         minute: '2-digit',
    //         hour12: !is24Hour
    //     };
    //     return date.toLocaleTimeString([], options);
    // };

    const toggleTimeFormat = () => setIs24HourFormat(!is24HourFormat);

    const handlePreviousDay = () => {
        setSelectedForecastDay(prevDay => Math.max(prevDay - 1, 0));
    };

    const handleNextDay = () => {
        setSelectedForecastDay(prevDay => Math.min(prevDay + 1, forecast.length / 8 - 1));
    };


    const weatherIconCode = weather && weather.weather[0] && weather.weather[0].icon;
    const weatherIconUrl = weatherIconCode ? `http://openweathermap.org/img/wn/${weatherIconCode}.png` : '';


    const renderNextDayForecast = () => {
        const startOfDay = new Date();
        startOfDay.setUTCDate(startOfDay.getUTCDate() + selectedForecastDay);
        startOfDay.setUTCHours(0, 0, 0, 0);

        const endOfDay = new Date(startOfDay);
        endOfDay.setUTCHours(21, 0, 0, 0); // Considering forecasts up to 21:00

        const filteredForecasts = forecast.filter(forecastItem => {
            const forecastDate = new Date(forecastItem.dt * 1000);
            return forecastDate >= startOfDay && forecastDate <= endOfDay;
        });

        if (filteredForecasts.length === 0) return <div>No forecast data available for today as it's nearly the end of the day.</div>;

        return filteredForecasts.map((forecastItem, index) => (
            <Card key={index} className="mb-3 mt-3">
                <Card.Header>
                    {convertToLocalTime(forecastItem.dt, weather.timezone, is24HourFormat)}
                </Card.Header>

                <div>
                    <strong>Temperature:</strong>
                    {tempUnit === 'metric' ? `${forecastItem.main.temp} °C` : `${convertToKelvin(forecastItem.main.temp)} K`}
                </div>
                    <div className="weather-icon-container">
                        <img src={`http://openweathermap.org/img/wn/${forecastItem.weather[0].icon}.png`} alt="Weather Icon" />
                        <span>{forecastItem.weather[0].description}</span>
                    </div>
                    <div><strong>Wind Speed:</strong> {(forecastItem.wind.speed * 3.6).toFixed(2)} km/h</div>
                    <div className="wind-direction">
                        <strong>Wind Direction:</strong> {getWindDirection(forecastItem.wind.deg)}
                        <img src={windArrow} alt="Wind Direction" className="wind-arrow" style={{ transform: `rotate(${forecastItem.wind.deg}deg)` }}/>
                    </div>
                    <div><strong>Pressure:</strong> {forecastItem.main.pressure} hPa</div>
                    <div><strong>Humidity:</strong> {forecastItem.main.humidity}%</div>

            </Card>
        ));
    };



    return (
        <Container className="my-4 ">
            <Card className="text-center ">

                    <Card.Title className="text-center mt-3 mb-3">Your World Weather: Current Conditions/Forecast + Air Quality Tracker</Card.Title>
                    <Form onSubmit={handleSearch}>
                        <Form.Group controlId="cityInput" className="mt-3 mb-3">
                            <Form.Control
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Enter city name"
                                className="glow-on-focus"
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-center">
                            <Button type="submit" variant="primary" className="btn">Get Weather</Button>
                        </div>
                        {loading && (
                            <div className="mt-3">
                                <ProgressBar animated now={100} />
                            </div>
                        )}
                    </Form>

            </Card>
            {weather && (
                <Card className="mb-4 text-center mt-3">
                    <Card.Header className=" mb-3" as="h5">
                        Current weather in {weather.name}, {weather.sys.country} today is {getCurrentFormattedDate()}
                    </Card.Header>

                    <Card.Title className="d-flex justify-content-center align-items-center">
                    <span className="mr-3" style={{ marginRight: '1rem' }}>
                    {tempUnit === 'metric' ? `${weather.main.temp} °C` : `${convertToKelvin(weather.main.temp)} K`}
                    </span>
                        <Form>
                            <Form.Check
                                className="custom-switch-size"
                                type="switch"
                                id="temp-unit-switch"
                                label="Celsius / Kelvin"
                                onChange={toggleTempUnit}
                                checked={tempUnit === 'standard'}
                            />
                        </Form>
                    </Card.Title>
                        {weatherIconUrl && (
                            <div className="weather-icon-container ">
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
                                style={{ transform: `rotate(${weather.wind.deg - 90}deg)` }}
                                className="wind-arrow"
                            />
                        </Card.Text>
                        <Card.Text>Pressure: {weather.main.pressure} hPa</Card.Text>
                        <Card.Text>Humidity: {weather.main.humidity}%</Card.Text>
                    <Card.Text>Sunrise: {convertToLocalTime(weather.sys.sunrise, weather.timezone, is24HourFormat)}</Card.Text>
                    <Card.Text>Sunset: {convertToLocalTime(weather.sys.sunset, weather.timezone, is24HourFormat)}</Card.Text>

                    <Card.Text className="weather-card-text">
                        <span>Local Time: {convertToLocalTime(new Date().getTime() / 1000, weather.timezone, is24HourFormat)}</span>
                        <div className="time-format-switch-container">
                            <Form>
                                <Form.Check
                                    type="switch"
                                    id="time-format-switch"
                                    label={<span className="font-weight-bold">24h / 12h</span>}
                                    onChange={toggleTimeFormat}
                                    checked={!is24HourFormat}
                                />
                            </Form>
                        </div>
                    </Card.Text>

                        {airPollution && (
                            <Card className="mb-4 text-center mt-3">
                                <Card.Header className="mb-3" as="h5">Air Quality Index (AQI)</Card.Header>
                                <div className="d-flex justify-content-center align-items-center mb-3">
                                    <Form>
                                        <Form.Check
                                            type="switch"
                                            id="explanation-switch"
                                            label="Show explanations"
                                            onChange={toggleExplanation}
                                            checked={showExplanation}
                                            className="custom-switch"
                                        />
                                    </Form>
                                </div>

                                <Card.Title>
                                    AQI levels as a whole: {airPollution.list[0].main.aqi} - {getAQIQualitativeName(airPollution.list[0].main.aqi)}
                                </Card.Title>
                                {showExplanation && <Card.Text className="explanation-text">AQI levels, from 1 (Good) to 5 (Very Poor), indicate air quality based on pollutant concentrations, despite varying global standards.</Card.Text>}
                                <Card.Text>CO (Carbon monoxide): {airPollution.list[0].components.co.toFixed(2)} μg/m³ - {getPollutantLevel('co', airPollution.list[0].components.co)}</Card.Text>
                                {showExplanation && <Card.Text className="explanation-text">CO is a gas you can't see or smell. It's bad for you if you breathe in a lot of it.</Card.Text>}
                                <Card.Text>NO2 (Nitrogen dioxide): {airPollution.list[0].components.no2.toFixed(2)} μg/m³ - {getPollutantLevel('no2', airPollution.list[0].components.no2)}</Card.Text>
                                {showExplanation && <Card.Text className="explanation-text">NO2 comes from cars and factories. Breathing it can make it harder to breathe.</Card.Text>}
                                <Card.Text>O3 (Ozone): {airPollution.list[0].components.o3.toFixed(2)} μg/m³ - {getPollutantLevel('o3', airPollution.list[0].components.o3)}</Card.Text>
                                {showExplanation && <Card.Text className="explanation-text">O3 Ozone is good up high in the sky but bad on the ground. It can make your chest feel tight.</Card.Text>}
                                <Card.Text>SO2 (Sulphur dioxide): {airPollution.list[0].components.so2.toFixed(2)} μg/m³ - {getPollutantLevel('so2', airPollution.list[0].components.so2)}</Card.Text>
                                {showExplanation && <Card.Text className="explanation-text">SO2 comes from factories and volcanoes. It can make your air dirty and make it hard to breathe.</Card.Text>}
                                <Card.Text>PM2.5 (Fine particles matter): {airPollution.list[0].components.pm2_5.toFixed(2)} μg/m³ - {getPollutantLevel('pm2_5', airPollution.list[0].components.pm2_5)}</Card.Text>
                                {showExplanation && <Card.Text className="explanation-text">PM2.5 are tiny (smaller than 2.5 micrometers) bits in the air that can go deep into your lungs and are not good for you.</Card.Text>}
                                <Card.Text>PM10 (Coarse particulate matter): {airPollution.list[0].components.pm10.toFixed(2)} μg/m³ - {getPollutantLevel('pm10', airPollution.list[0].components.pm10)}</Card.Text>
                                {showExplanation && <Card.Text className="explanation-text">PM10 are like PM2.5 but bigger (smaller than 10 micrometers).They can still get into your lungs and cause problems.</Card.Text>}

                                {forecast && forecast.length > 0 && (
                                 <Card className="text-center">
                                  {/* Forecast content */}
                                 </Card>
                            )}



                                    {forecast && forecast.length > 0 && (
                                        <Card className=" text-canter ">
                                            <Card.Header as="h5" className="mb-3">5-Day Weather Forecast (3-hour intervals)</Card.Header>
                                            <Card.Title> {getCurrentFormattedDate(selectedForecastDay)}</Card.Title>

                                                <div className=" justify-content-between ">
                                                    <Button onClick={handlePreviousDay} disabled={selectedForecastDay === 0}>Previous Day</Button>
                                                    <Button onClick={handleNextDay} disabled={selectedForecastDay === forecast.length / 8 - 1}>Next Day</Button>
                                                </div>
                                                {renderNextDayForecast()}

                                        </Card>
                                    )}

                            </Card>
                        )}

                </Card>
            )}
        </Container>
    );

};

export default Weather;
