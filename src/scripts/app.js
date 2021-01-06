const apiKey = "369ded4865e834c70609959d996e7654";
const baseUrl = "https://api.openweathermap.org";
const currentCond = document.querySelector('.current');
const dayForecast = document.querySelector('.forecast');


// ------------------------- API Interaction Functions ------------------------- //
function getCurrentWeatherData(lat, long) {
  const url = `${baseUrl}/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`
  return fetch(
    url
  ).then((response) => response.json())
}

function get5DaysForecast(lat, long) {
  const url = `${baseUrl}/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`
  return fetch(
    url
  ).then((response) => response.json());
}

// ------------------------- Methods for UI flow ------------------------- //
function getuserLocation(loc) {
  const latitude = loc.coords.latitude;
  const longitude = loc.coords.longitude;
  let forecastFiveObjectArray = []

  getCurrentWeatherData(latitude, longitude)
  .then((currentWeather) => { 
    const temp = Math.round(currentWeather.main.temp);
    const weatherCondition = currentWeather.weather[0].description;

    createCurrentTemp(temp);
    createCurrentCondition(weatherCondition);
  })

  get5DaysForecast(latitude, longitude)
  .then((forecastFive) => {
    forecastFive.list.forEach(forecast => {
      forecastFiveObjectArray.push({
        "dt_full": forecast.dt_txt,
        "dt": forecast.dt_txt.split(' ')[0],
        "dt_hour": forecast.dt_txt.split(' ')[1],
        "temp_min": Math.round(forecast.main.temp_min),
        "temp_max": Math.round(forecast.main.temp_max),
        "description": forecast.weather[0].description,
        "icon": forecast.weather[0].icon
      })
    });
    
    const sortedForecastArray = sortArrayOfForecasts(forecastFiveObjectArray);

    // create Forecast on UI
    sortedForecastArray.forEach(forecast => {
      createNext5daysForecast(forecast.weekday, forecast.icon, forecast.description, forecast.max_temp, forecast.min_temp)
    });
  })

}

// ------------------------- Helper Functions ------------------------- //
function sortArrayOfForecasts(forecastFiveObjectArray) {
  let resultArray = []

  let currentMin = 0
  let currentMax = 0
  let currentIcon = ''
  let currentDescription = ''


  for(let i = 0; i < forecastFiveObjectArray.length; i++) {
    let currentForecast = forecastFiveObjectArray[i]
    let previousForecast = []
    
    if(i === 0) {
      previousForecast = forecastFiveObjectArray[i]
      currentMin = forecastFiveObjectArray[i].temp_min
      currentMax = forecastFiveObjectArray[i].temp_max
    } else {
      previousForecast = forecastFiveObjectArray[i-1]
    }

    // check min temp
    if (currentForecast.dt === previousForecast.dt && currentMin > currentForecast.temp_min) {
      currentMin = currentForecast.temp_min
    }

    // check max temp
    if (currentForecast.dt === previousForecast.dt && currentMax < currentForecast.temp_max) {
      currentMax = currentForecast.temp_max
    }

    if (currentForecast.dt_hour === "12:00:00") {
      currentIcon = currentForecast.icon;
      currentDescription = currentForecast.description;
    }

    if(currentForecast.dt != previousForecast.dt) {
      resultArray.push( 
        {
          "dt": currentForecast.dt,
          "weekday": dayOfTheWeek(currentForecast.dt),
          "min_temp": currentMin,
          "max_temp": currentMax,
          "description": currentDescription,
          "icon": currentIcon
        }
      )
    }    
  }
  console.log(resultArray)
  return resultArray;

}

function dayOfTheWeek(date) {
  const dateObj = new Date(date)
  let weekday = dateObj.toLocaleString("default", { weekday: "long" });

  return weekday;
}

// ------------------------- UI Interaction Methods ------------------------- //
function createCurrentTemp(temp) {
  currentCond.insertAdjacentHTML(
    "afterbegin",
    `<div class="temp">${temp}</div>`
  )
}

function createCurrentCondition(cond) {
  currentCond.insertAdjacentHTML(
    "beforeend",
    `<div class="condition">${cond}</div>`
  )
}

function createNext5daysForecast(dayOfTheWeek, icon, cond, highTemp, lowTemp) {
  dayForecast.insertAdjacentHTML(
    "afterbegin",
    `<div class="day">
    <h3>${dayOfTheWeek}</h3>
    <img src="http://openweathermap.org/img/wn/${icon}@2x.png" />
    <div class="description">${cond}</div>
    <div class="temp">
      <span class="high">${highTemp}</span>/<span class="low">-${lowTemp}</span>
    </div>`
  )
}


// ------------------------- Event Listeners ------------------------- //
document.addEventListener('DOMContentLoaded', function() {
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(getuserLocation);
  } else {
    alert("Geolocation not supported, try again using another browser");
  }
})


