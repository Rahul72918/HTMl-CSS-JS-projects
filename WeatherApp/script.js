const inputBox = document.querySelector('.input-box');
const searchBtn = document.getElementById('searchBtn');
const weather_img = document.querySelector('.weather-img');
const temperature = document.querySelector('.temperature');
const description = document.querySelector('.description');
const humidity = document.getElementById('humidity');
const wind_speed = document.getElementById('wind-speed');
const location_not_found = document.querySelector('.location-not-found');
const weather_body = document.querySelector('.weather-body');

// ✅ Add city name display inside .weather-box
const weatherBox = document.querySelector('.weather-box');
let cityName = document.createElement('p');
cityName.classList.add('city');
cityName.style.fontSize = '24px';
cityName.style.fontWeight = '700';
cityName.style.marginBottom = '8px';
weatherBox.prepend(cityName);

const api_key = "79575b0bac4c2ec6fda703466ce8b639";

// ✅ Fetch weather by city
async function checkWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`;
    const weather_data = await fetch(url).then(res => res.json());

    if (weather_data.cod === "404") {
        location_not_found.style.display = "flex";
        weather_body.style.display = "none";
        return;
    }

    displayWeather(weather_data);
}

// ✅ Fetch weather by coordinates
async function checkWeatherByCoords(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`;
    const weather_data = await fetch(url).then(res => res.json());

    if (weather_data.cod !== 200) {
        location_not_found.style.display = "flex";
        weather_body.style.display = "none";
        return;
    }

    displayWeather(weather_data);
}

// ✅ Display weather data
function displayWeather(weather_data) {
    location_not_found.style.display = "none";
    weather_body.style.display = "flex";

    // City name
    cityName.innerHTML = `${weather_data.name}, ${weather_data.sys.country}`;

    temperature.innerHTML = `${(weather_data.main.temp - 273.15).toFixed(1)}<sup>°C</sup>`;
    description.innerHTML = weather_data.weather[0].description;
    humidity.innerHTML = `${weather_data.main.humidity}%`;
    wind_speed.innerHTML = `${weather_data.wind.speed} Km/H`;

    switch (weather_data.weather[0].main) {
        case "Clouds":
            weather_img.src = "assests/cloud.png";
            break;
        case "Clear":
            weather_img.src = "assests/clear.png";
            break;
        case "Rain":
            weather_img.src = "assests/rain.png";
            break;
        case "Mist":
            weather_img.src = "assests/mist.png";
            break;
        case "Snow":
            weather_img.src = "assests/snow.png";
            break;
        default:
            weather_img.src = "assests/clear.png";
    }
}

// ✅ Search button click
searchBtn.addEventListener('click', () => {
    if (inputBox.value.trim() !== "") {
        checkWeather(inputBox.value.trim());
    }
});

// ✅ Enter key support
inputBox.addEventListener('keypress', (event) => {
    if (event.key === "Enter" && inputBox.value.trim() !== "") {
        checkWeather(inputBox.value.trim());
    }
});

// ✅ On page load → get current location
window.onload = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                checkWeatherByCoords(position.coords.latitude, position.coords.longitude);
            },
            (error) => {
                console.log("Location permission denied. Please search manually.");
            }
        );
    }
};
