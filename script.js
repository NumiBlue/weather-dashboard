//OpenWeather API
const apiKey = '07a72207ba241e4886d27dddb4eef7ce';

//HTML elements
const cityEl = $('h2#city');
    const dateEl = $('h3#date');
    const weatherIcon = $('img#weather-icon');
    const tempEl = $('span#temperature');
    const humidEl = $('span#humidity');
    const windEl = $('span#wind');
    const uVIndex = $('span#uv-index');
    const cityList = $('div.cityList');

//Form and Stored
  const nextCity = $('#city-input');
//function to sort
let oldCities = [];
//local storage
function compare(a, b) {
    // Use toUpperCase() to ignore character casing
    const cityA = a.city.toUpperCase();
    const cityB = b.city.toUpperCase();

    let comparison = 0;
    if (cityA > cityB) {
        comparison = 1;
    } else if (cityA < cityB) {
        comparison = -1;
    }
    return comparison;
}
//load past events
function pullCities() {
    const storedCities = JSON.parse(localStorage.getItem('oldCities'));
    if (storedCities) {
        oldCities = storedCities;
    }
}
//store searched in loccal storage
function storeCities() {
    localStorage.setItem('oldCities', JSON.stringify(oldCities));
}
