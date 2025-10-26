import { useState, useEffect } from "react";
import axios from "axios";
import Filter from "./components/Filter.jsx";
import Countries from "./components/Countries.jsx";
import "./App.css";

function App() {
    const [countries, setCountries] = useState([]);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        axios
            .get("https://studies.cs.helsinki.fi/restcountries/api/all")
            .then((response) => {
                setCountries(response.data);
            })
            .catch((error) => {
                console.error("Error fetching countries data:", error);
            });
    }, []);

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    return (
        <div className="container">
            <div className="content">
                <Filter value={filter} onChange={handleFilterChange} />
                <Countries countries={countries} filter={filter} />
            </div>
        </div>
    );
}

export default App;
