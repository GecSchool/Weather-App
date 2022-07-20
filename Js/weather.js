const weatherApi = {
  API_KEY: "91cce404db7f7f79c1684fc4b4022752",
  lat: 0,
  lon : 0,
}

const geoNowloca = function geoNowloca() {
  return new Promise(function(resolve){
    if (!navigator.geolocation){
     console.log("Geolocation is not supported by your browser");
      return;
    }
    function success(position) {
      weatherApi.lat  = position.coords.latitude;
      weatherApi.lon = position.coords.longitude;
      resolve();
    }
    function error() {
      console.log("Unable to retrieve your location");
    }
    navigator.geolocation.getCurrentPosition(success, error);
  })
}

const getWeather = function getWeather(){
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${weatherApi.lat}&lon=${weatherApi.lon}&appid=${weatherApi.API_KEY}`
  fetch(url)
  .then((response) => response.json())
  .then((data)=>{
    console.log(data);
    console.log(data.city.country);
    mainScreen(data);
    subScreen(data);
  })
}

const targetLocation = function targetLocation(){
  const savedloca = JSON.parse(localStorage.getItem('location'));
  if(savedloca){
    // Yes
    weatherApi.lat = savedloca.lat;
    weatherApi.lon = savedloca.lon;    
    getWeather();
  } else{
    // No get a new location
    geoNowloca().then(getWeather);
  }
}
function mainScreen(data){
  const date = new Date();
  const day = document.querySelector(".day");
  const todayDate = document.querySelector(".date");
  const location  = document.querySelector(".location");
  const weatherSummery = document.querySelector(".today_weather__summary__weather");
  const temperature = document.querySelector(".today_weather__summary__temperature");
  const screen = document.querySelector(".today_weather");
  day.textContent = date.toLocaleString('en-US',{weekday:'long'});
  todayDate.textContent = `${String(date.getDay()).padStart(2,"0")} ${date.toLocaleString('en-US',{month:'short'})} ${date.getFullYear()}`;
  location.textContent = `${data.city.name} ${data.city.country}`;
  const iconcode = data.list[0].weather[0].icon
  const url = `http://openweathermap.org/img/w/${iconcode}.png`
  $('#wicon').attr('src', url);
  const weather = data.list[0].weather[0].main
  weatherSummery.textContent = weather;
  temperature.textContent = `${Math.round(data.list[0].main.temp-273.15,1)}℃`;
  const hours = date.getHours();
  let time;
  if(hours>=6&&hours<17){
    time = "Morning";
  } else if(hours>=17&&hours<20){
    time = "Afternoon";
  } else{
    time = "Nights"
  }
  screen.style.backgroundImage = `url(../img/${weather}${time}.jpg)`;
}
function subScreen(data){
  const precipitation = document.getElementById("precipitation");
  const humidity = document.querySelector("#humidity");
  const wind = document.querySelector("#wind");
  // const humidity = document.querySelector(".")
  precipitation.textContent = `${data.list[0].pop*100}℃`;
  humidity.textContent = `${data.list[0].main.humidity}%`;
  wind.textContent = `${data.list[0].wind.speed}Km/h`
}
targetLocation();

// const clock = document.querySelector("#clock");
// const getClock = function getClock(){
//     const date = new Date();
//     const hours = String(date.getHours()).padStart(2,"0");
//     const minutes = String(date.getMinutes()).padStart(2,"0");
//     const seconds = String(date.getSeconds()).padStart(2,"0");
//     clock.innerText = `${hours}:${minutes}:${seconds}`
// }

// getClock();
// setInterval(getClock,1000);
