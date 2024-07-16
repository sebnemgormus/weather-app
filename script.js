const apiKey = "00ab23c09f0809e1377d89d773001d7c";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search-btn");
const geolocateBtn = document.querySelector(".geolocate");
const weatherIcon = document.querySelector(".weather-icon");

async function checkWeather(city) {

    if (!city) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
        document.querySelector(".forecast").style.display = "none";
        return;
    }

    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
    
    if (response.status == 404) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
        document.querySelector(".forecast").style.display = "none";
    } else {
        var data = await response.json();
        
        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";
        
        switch(data.weather[0].main) {
            case "Clouds":
                weatherIcon.src = "images/clouds.png";
                document.body.style.background = "linear-gradient(to top, #d6ecf4, #gray)";
                break;
            case "Clear":
                weatherIcon.src = "images/clear.png";
                document.body.style.background = "linear-gradient(to top, #87cefa, #ffddc1)";
                break;
            case "Rain":
                weatherIcon.src = "images/rain.png";
                document.body.style.background = "linear-gradient(to top, #d6ecf4, #00008b)";
                break;
            case "Drizzle":
                weatherIcon.src = "images/drizzle.png";
                document.body.style.background = "linear-gradient(to top, #d6ecf4, #b0c4de)";
                break;
            case "Mist":
                weatherIcon.src = "images/mist.png";
                document.body.style.background = "linear-gradient(to top, #d6ecf4, #696969)";
                break;
            default:
                weatherIcon.src = "images/unknown.png";
                document.body.style.background = "linear-gradient(to top, #d6ecf4, #87cefa)";
        }
        
        document.querySelector(".weather").style.display = "block";
        document.querySelector(".error").style.display = "none";
        getForecast(city);
    }
}

async function getForecast(city) {
    const response = await fetch(forecastUrl + city + `&appid=${apiKey}`);
    const data = await response.json();
    
    const forecastContainer = document.querySelector(".forecast-container");
    forecastContainer.innerHTML = "";
    
    for (let i = 0; i < 24; i += 8) {
        const day = data.list[i];
        const dayElement = document.createElement("div");
        dayElement.classList.add("day");
        const date = new Date(day.dt_txt);
        dayElement.innerHTML = `
            <p>${date.toLocaleDateString('en-US', { weekday: 'short' })}</p>
            <img src="images/${day.weather[0].main.toLowerCase()}.png" alt="">
            <p>${Math.round(day.main.temp)}°C</p>
        `;
        forecastContainer.appendChild(dayElement);
    }
    
    document.querySelector(".forecast").style.display = "block";
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetch(`https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${apiKey}`)
                .then(response => response.json())
                .then(data => {
                    searchBox.value = data.name;
                    checkWeather(data.name);
                });
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});

geolocateBtn.addEventListener("click", getLocation);

searchBox.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        checkWeather(searchBox.value);
    }
});
