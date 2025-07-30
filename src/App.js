import React, { useState } from "react";
import axios from "axios";
import { MapPin, Thermometer, Wind, Droplets, Sunrise, Sunset } from "lucide-react";

const API_KEY = "bb36788205c3999f044f625d81579156"; // Replace with your actual API key

export default function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    if (!city) return;
    setLoading(true);
    setError("");
    try {
      const currentWeather = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const forecast = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      setWeatherData(currentWeather.data);
      const dailyForecast = forecast.data.list.filter((_, i) => i % 8 === 0);
      setForecastData(dailyForecast);
    } catch (err) {
      setError("City not found. Please try again.");
      setWeatherData(null);
      setForecastData([]);
    }
    setLoading(false);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-sky-400 to-indigo-700 flex flex-col items-center justify-center p-4 text-white">
      <h1 className="text-5xl font-extrabold mb-8 drop-shadow-xl">🌦 Weather Forecast</h1>
      <div className="flex gap-2 mb-6 w-full max-w-lg">
        <input
          className="text-base p-2 rounded-lg text-black w-full"
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button
          onClick={fetchWeather}
          disabled={loading}
          className="bg-white text-indigo-700 font-bold px-4 py-2 rounded-lg hover:bg-gray-200"
        >
          Search
        </button>
      </div>

      {loading && <p className="text-xl">Loading...</p>}
      {error && <p className="text-red-300 text-lg">{error}</p>}

      {weatherData && (
        <div className="bg-white/90 shadow-2xl rounded-2xl p-6 w-full max-w-xl text-black text-center">
          <MapPin className="text-blue-600 mx-auto" size={28} />
          <h2 className="text-2xl font-semibold mt-2">{weatherData.name}</h2>
          <img
            src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`}
            alt="weather icon"
            className="w-24 h-24 my-2 mx-auto"
          />
          <p className="text-lg italic text-gray-700">{weatherData.weather[0].description}</p>
          <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2 text-blue-800 justify-center">
              <Thermometer />
              <span>{Math.round(weatherData.main.temp)}°C</span>
            </div>
            <div className="flex items-center gap-2 text-blue-800 justify-center">
              <Wind />
              <span>{weatherData.wind.speed} m/s</span>
            </div>
            <div className="flex items-center gap-2 text-blue-800 justify-center">
              <Droplets />
              <span>{weatherData.main.humidity}%</span>
            </div>
            <div className="flex items-center gap-2 text-blue-800 justify-center">
              <Sunrise />
              <span>{formatTime(weatherData.sys.sunrise)}</span>
            </div>
            <div className="flex items-center gap-2 text-blue-800 justify-center">
              <Sunset />
              <span>{formatTime(weatherData.sys.sunset)}</span>
            </div>
          </div>
        </div>
      )}

      {forecastData.length > 0 && (
        <div className="mt-10 w-full max-w-4xl">
          <h3 className="text-2xl font-semibold mb-4 text-center">5-Day Forecast</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {forecastData.map((item, idx) => (
              <div key={idx} className="bg-white/80 p-4 rounded-xl text-center text-black">
                <p className="font-medium">{new Date(item.dt_txt).toLocaleDateString()}</p>
                <img
                  src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                  alt="icon"
                  className="w-16 h-16 mx-auto"
                />
                <p>{item.weather[0].main}</p>
                <p>{Math.round(item.main.temp)}°C</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
