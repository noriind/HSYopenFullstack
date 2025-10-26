import { useState, useEffect } from "react";
import axios from "axios";

const Weather = ({ capital }) => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);

    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

    useEffect(() => {
        if (!capital || !apiKey) {
            setLoading(false);
            return;
        }

        axios
            .get(
                `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}&units=metric`
            )
            .then((response) => {
                setWeather(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching weather:", error);
                setLoading(false);
            });
    }, [capital, apiKey]);

    if (!apiKey) {
        return <div>Weather API key not configured</div>;
    }

    if (loading) {
        return <div>Loading weather...</div>;
    }

    if (!weather) {
        return <div>Weather data not available</div>;
    }

    const iconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;

    return (
        <div>
            <h3>Weather in {capital}</h3>
            <div>temperature {weather.main.temp} Celsius</div>
            <img src={iconUrl} alt={weather.weather[0].description} />
            <div>wind {weather.wind.speed} m/s</div>
        </div>
    );
};

export default Weather;
