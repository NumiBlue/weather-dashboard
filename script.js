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

    // API
let lat = response.coord.lat;
let lon = response.coord.lon;
let queryURLAll = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`;
$.ajax({
    url: queryURLAll,
    method: 'GET'
}).then(function (response) {
    let uvIndex = response.current.uvi;
    let uvColor = setUVIndexColor(uvIndex);
    uVIndex.text(response.current.uvi);
    uVIndex.attr('style', `background-color: ${uvColor}; color: ${uvColor === "yellow" ? "black" : "white"}`);
    let fiveDay = response.daily;

    // Display 5 days
    for (let i = 0; i <= 5; i++) {
        let currDay = fiveDay[i];
        $(`div.day-${i} .card-title`).text(moment.unix(currDay.dt).format('L'));
        $(`div.day-${i} .fiveDay-img`).attr(
            'src',
            `http://openweathermap.org/img/wn/${currDay.weather[0].icon}.png`
        ).attr('alt', currDay.weather[0].description);
        $(`div.day-${i} .fiveDay-temp`).text(((currDay.temp.day - 273.15) * 1.8 + 32).toFixed(1));
        $(`div.day-${i} .fiveDay-humid`).text(currDay.humidity);
    }
});
});
}
// Show last searched
function displayLastCity() {
    if (previCi[0]) {
        let queryURL = createID(previCi[0].id);
        whatWeather(queryURL);
    } else {
        // if no past searched cities, load Austin weather data
        let queryURL = createURL("Austin");
        whatWeather(queryURL);
    }
}
// on-click
$('#search-btn').on('click', function (event) {
    // Preventing the button from trying to submit the form
    event.preventDefault();

    let city = nextCity.val().trim();
        city = city.replace(' ', '%20');
        nextCity.val('');
    
        if (city) {
            let queryURL = createURL(city);
            whatWeather(queryURL);
        }
    }); 

   // on-click for weather
   $(document).on("click", "button.city-btn", function (event) {
    let clickedCity = $(this).text();
    let foundCity = $.grep(previCi, function (storedCity) {
        return clickedCity === storedCity.city;
    })
    let queryURL = createID(foundCity[0].id)
    whatWeather(queryURL);
});

