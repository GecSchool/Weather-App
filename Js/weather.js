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
  const mainIcon = document.querySelector(".today_weather__summary__icon");
  day.textContent = date.toLocaleString('en-US',{weekday:'long'});
  todayDate.textContent = `${String(date.getDay()).padStart(2,"0")} ${date.toLocaleString('en-US',{month:'short'})} ${date.getFullYear()}`;
  console.log(date.getDay())
  location.textContent = `${data.city.name} ${data.city.country}`;
  const weather = data.list[0].weather[0].main
  weatherSummery.textContent = weather;
  temperature.textContent = `${Math.round(data.list[0].main.temp-273.15,1)}℃`;
  const hours = date.getHours();
  let time;
  if(hours>=6&&hours<17){
    time = "Morning";
    paintIcon(data.list[0].weather,mainIcon,0);
  } else if(hours>=17&&hours<20){
    time = "Afternoon";
    paintIcon(data.list[0].weather,mainIcon,0);
  } else{
    time = "Nights"
    paintIcon(data.list[0].weather,mainIcon,1);
  }
  screen.style.backgroundImage = `url(../img/${weather}${time}.jpg)`;
}
function subScreen(data){
  console.log(data)
  const precipitation = document.getElementById("precipitation");
  const humidity = document.querySelector("#humidity");
  const wind = document.querySelector("#wind");
  // const humidity = document.querySelector(".")
  precipitation.textContent = `${data.list[0].pop*100}%`;
  humidity.textContent = `${data.list[0].main.humidity}%`;
  wind.textContent = `${data.list[0].wind.speed}Km/h`
  const LIST = document.querySelectorAll('li');
  const date = new Date()
  paintList(data.list[0],LIST[0],date.getDate());
  paintList(data.list[8],LIST[1],date.getDate()+1);
  paintList(data.list[16],LIST[2],date.getDate()+2);
  paintList(data.list[24],LIST[3],date.getDate()+3);
}
targetLocation();

const paintIcon = (data,html,Nights=0) => {
  const weatherId = Math.floor(data[0].id/100)
  console.log(weatherId)
  switch (weatherId) {
    case 2:
      html.classList.add('fa-cloud-bolt');
      break;
    case 3: case 5:
      html.classList.add('fa-cloud-rain');
      break;
    case 6:
      html.classList.add('fa-snow-flake');
      break
    case 8:
      if(data[0].id==800){
        if(Nights)
        html.classList.add('fa-moon');
      } else{
        html.classList.add('fa-sun');
      }
      break;
    default:
      break;
  }
}

const paintList = (data,html,day)=>{
  const days = ['Sun','Mon','Tue','Wen','Thu','Fri','Sat']
  paintIcon(data.weather,html.childNodes[1],1);
  html.childNodes[2].textContent = days[day];
  html.childNodes[3].textContent = `${Math.round(data.main.temp-273.15,1)}℃`
}