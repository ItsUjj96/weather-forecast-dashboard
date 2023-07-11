import React, { useState } from 'react';

const API_KEY = '30d7b3ae2544115656b8378df42a0e70';
const API_URL = `http://api.weatherstack.com/current?access_key=${API_KEY}`;
const FORECAST_API_URL = `http://api.weatherstack.com/forecast?access_key=${API_KEY}`;

const WeatherForecast = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [searchedCity, setSearchedCity] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setCity(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (city.trim() === '') {
      setError('Please enter a city name');
      return;
    }
    fetchWeatherData();
    fetchForecastData();
    setSearchedCity(city);
    setCity('');
    setError('');
  };

  const fetchWeatherData = () => {
    fetch(`${API_URL}&query=${city}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.error.info);
          setWeather(null);
        } else {
          setWeather(data.current);
        }
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
        setWeather(null);
      });
  };

  const fetchForecastData = () => {
    fetch(`${FORECAST_API_URL}&query=${city}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.error.info);
          setForecast([]);
        } else {
          setForecast(data.forecast);
        }
      })
      .catch((error) => {
        console.error('Error fetching forecast data:', error);
        setForecast([]);
      });
  };

  return (
    <div>
      <h1>Weather Forecast Dashboard</h1>

      <form onSubmit={handleFormSubmit}>
        <input type="text" value={city} onChange={handleInputChange} placeholder="Enter city name" />
        <button className="btn" type="submit">Search</button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {weather && (
        <div className="card">
          <h2>Current Weather in {searchedCity}</h2>
          <p>Temperature: {weather.temperature}°C</p>
          <p>Humidity: {weather.humidity}%</p>
          <p>Wind Speed: {weather.wind_speed} km/h</p>
          <p>Wind Direction: {weather.wind_dir}</p>
          <p>Description: {weather.weather_descriptions[0]}</p>
          <img src={weather.weather_icons[0]} alt="Weather Icon" />
        </div>
      )}

      {forecast.length > 0 && (
        <div>
          <h2>7-Day Forecast</h2>
          {forecast.map((item) => (
            <div key={item.date}>
              <p>Date: {item.date}</p>
              <p>Average Temperature: {item.avgtemp}°C</p>
              <p>Description: {item.weather_descriptions[0]}</p>
              <img src={item.weather_icons[0]} alt="Weather Icon" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WeatherForecast;
