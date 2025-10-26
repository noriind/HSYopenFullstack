import { useState } from "react";
import CountryDetails from "./CountryDetails.jsx";
import CountryList from "./CountryList.jsx";

const Countries = ({ countries, filter }) => {
    const [selectedCountry, setSelectedCountry] = useState(null);

    const filteredCountries = countries.filter((country) =>
        country.name.common.toLowerCase().includes(filter.toLowerCase())
    );

    const handleShowCountry = (country) => {
        setSelectedCountry(country);
    };

    if (filter === "") {
        return null;
    }

    if (selectedCountry) {
        return <CountryDetails country={selectedCountry} />;
    }

    if (filteredCountries.length > 10) {
        return <p>Too many matches, specify another filter</p>;
    }

    if (filteredCountries.length > 1) {
        return (
            <CountryList
                countries={filteredCountries}
                onShow={handleShowCountry}
            />
        );
    }

    if (filteredCountries.length === 1) {
        return <CountryDetails country={filteredCountries[0]} />;
    }

    return <div>No matches found</div>;
};

export default Countries;
