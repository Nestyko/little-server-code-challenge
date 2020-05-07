const express = require("express");
const axios = require("axios");
const app = express();
const port = 3000;

const ENDPOINT = "https://api.covid19api.com/summary";

const formatValue = (first, second) => {
  const symbol = first > second ? "+" : "";
  return `${symbol}${first-second}`;
}

app.get("/compare-countries", async (req, res) => {
  const countries = req.query.countries.split(","); // TODO: Add validation
  const { data } = await axios.get(ENDPOINT);

  const requestedCountries = data.Countries.filter(country => countries.includes(country.CountryCode));
  const response = {
    [`${requestedCountries[0].CountryCode}_v_${requestedCountries[1].CountryCode}`]: {
      NewConfirmed: formatValue(requestedCountries[0].NewConfirmed, requestedCountries[1].NewConfirmed),
      TotalDeaths: formatValue(requestedCountries[0].TotalDeaths, requestedCountries[1].TotalDeaths),
      NewDeaths: formatValue(requestedCountries[0].NewDeaths, requestedCountries[1].NewDeaths),
      NewRecovered: formatValue(requestedCountries[0].NewRecovered, requestedCountries[1].NewRecovered),
      TotalRecovered: formatValue(requestedCountries[0].TotalRecovered, requestedCountries[1].TotalRecovered),
      TotalConfirmed: formatValue(requestedCountries[0].TotalConfirmed, requestedCountries[1].TotalConfirmed),
    }
  }

  res.json(response);
});

app.listen(port, () => console.log(`Listening at http://localhost:${port}`));
