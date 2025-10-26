import Weather from "./Weather";

const CountryDetails = ({ country }) => {
    return (
        <div>
            <h2>{country.name.common}</h2>
            <div>capital {country.capital?.[0]}</div>
            <div>area {country.area}</div>
            <h3>languages:</h3>
            <ul>
                {Object.values(country.languages || {}).map((language) => (
                    <li key={language}>{language}</li>
                ))}
            </ul>
            <img
                src={country.flags.png}
                alt={`flag of ${country.name.common}`}
                style={{ width: "150px", border: "1px solid black" }}
            />
            <Weather capital={country.capital?.[0]} />
        </div>
    );
};

export default CountryDetails;
