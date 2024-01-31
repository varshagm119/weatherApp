import React, { useState } from "react";
import classes from "./styles.module.css";
const API_KEY = "db4e1f3478c6555915a54732789eea8b";

const WeatherForecastDashboard = () => {
  const [cityName, setCityName] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [units, setUnits] = useState("metric");
  const [visibility, setVisibility] = useState(true);

  const handleSearch = async () => {
    if (!cityName) return;

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=${units}`
      );
      const data = await response.json();
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=${units}`
      );
      const forecastData = await forecastResponse.json();
      setWeatherData({
        name: data.name,
        sys: data.sys,
        main: data.main,
        wind: data.wind,
        weather: data.weather[0],
        forecast: forecastData.list.slice(0, 5).map((day) => ({
          dt: day.dt,
          main: day.main,
          weather: day.weather[0],
        })),
      });
    } catch (error) {
      alert("City not found. Please try again!");
      setCityName("");
    }
    setVisibility(true);
  };

  const handleUnitsToggle = () => {
    setUnits((prevUnits) => (prevUnits === "metric" ? "imperial" : "metric"));
    setVisibility(false);
  };

  return (
    <div className={classes.weather_forecast_dashboard}>
      <h1>Weather Forecast Dashboard</h1>
      <div className={classes.search_bar}>
        <input
          type="text"
          placeholder="Enter city name"
          value={cityName}
          onChange={(e) => setCityName(e.target.value)}
          className={classes.ip}
        />
        <select value={units} onChange={handleUnitsToggle} className={classes.dropdown}>
          <option value="metric">Celsius</option>
          <option value="imperial">Fahrenheit</option>
        </select>
        <button className={classes.btn} onClick={handleSearch}>
          Search
        </button>
      </div>
      <div className={classes.weather_details}>
        {visibility && weatherData && (
          <>
            <h2>
              {weatherData.name}, {weatherData.sys.country}
            </h2>
            <p>
              Temperature: {weatherData.main.temp}{" "}
              {units === "metric" ? "°C" : "°F"}
            </p>
            <p>
              Minimum Temperature: {weatherData.main.temp_min}{" "}
              {units === "metric" ? "°C" : "°F"}
            </p>
            <p>
              Maximum Temperature: {weatherData.main.temp_max}{" "}
              {units === "metric" ? "°C" : "°F"}
            </p>
            <p>Humidity: {weatherData.main.humidity}%</p>
            <p>Wind Speed: {weatherData.wind.speed} m/s</p>
            <p>Description: {weatherData.weather.description}</p>
          </>
        )}
      </div>

      <div className={classes.forecast_details}>
        {visibility && weatherData && weatherData.forecast && (
          <>
            <h2>5-Day Forecast</h2>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Average Temperature</th>
                  <th>Description</th>
                  <th>Icon</th>
                </tr>
              </thead>
              <tbody>
                {weatherData.forecast.map((day) => (
                  <tr key={day.dt}>
                    <td>{new Date(day.dt * 1000).toLocaleDateString()}</td>
                    <td>
                      {day.main.temp} {units === "metric" ? "°C" : "°F"}
                    </td>
                    <td>{day.weather.description}</td>
                    <td>
                      <img
                        src={`http://openweathermap.org/img/wn/${day.weather.icon}@2x.png`}
                        alt={day.weather.description}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default WeatherForecastDashboard;
