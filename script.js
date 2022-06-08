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

function createId(id) {
    return `https://api.openweathermap.org/data/2.5/weather?id=${id}&appid=${apiKey}`;
}

// Display Searched cities
function whatCities(previCi) {
    cityEl.empty();
    previCi.splice(5);
    let sortedCities = [...previCi];
    sortedCities.sort(compare);
    sortedCities.forEach(function (location) {
        let cityDiv = $('<div>').addClass('col-12 city');
        let cityBtn = $('<button>').addClass('btn btn-light city-btn').text(location.city);
        cityDiv.append(cityBtn);
        cityEl.append(cityDiv);
    });
}

// UV
function setUVIndexColor(uvi) {
    if (uvi < 3) {
        return 'green';
    } else if (uvi >= 3 && uvi < 6) {
        return 'yellow';
    } else if (uvi >= 6 && uvi < 8) {
        return 'orange';
    } else if (uvi >= 8 && uvi < 11) {
        return 'red';
    } else return 'black';
}
// Search using API
function whatWeather(queryURL) {
// Create an AJAX call 
$.ajax({
    url: queryURL,
    method: 'GET'
}).then(function (response) 
{
    let city = response.name;
    let id = response.id;
    // Remove same cities
    if (previCi[0]) {
        previCi = $.grep(previCi, function (storedCity) {
            return id !== storedCity.id;
        })
    }
    previCi.unshift({ city, id });
    storeCities();
    whatCities(previCi);

    // Display current weather
    cityEl.text(response.name);
    let formattedDate = moment.unix(response.dt).format('L');
    dateEl.text(formattedDate);
    let weatherIcon = response.weather[0].icon;
    weatherIcon.attr('src', `http://openweathermap.org/img/wn/${weatherIcon}.png`).attr('alt', response.weather[0].description);
    tempEl.html(((response.main.temp - 273.15) * 1.8 + 32).toFixed(1));
    humidEl.text(response.main.humidity);
    windEl.text((response.wind.speed * 2.237).toFixed(1));