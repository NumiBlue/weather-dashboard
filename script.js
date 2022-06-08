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
let previCi = [];
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
    const storedCities = JSON.parse(localStorage.getItem('previCi'));
    if (storedCities) {
        previCi = storedCities;
    }
}
//store searched in loccal storage
function storeCities() {
    localStorage.setItem('previCi', JSON.stringify(previCi));
}

// Functions for the OpenWeather API call
 
function createURL(city) {
    if (city) {
        return `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    }
}

function createURLId(id) {
    return `https://api.openweathermap.org/data/2.5/weather?id=${id}&appid=${apiKey}`;
}

