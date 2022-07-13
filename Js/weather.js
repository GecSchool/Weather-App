let weatherApi = {
    API_KEY: "91cce404db7f7f79c1684fc4b4022752",
    lat : 0,
    lon : 0,
}

const geoNowloca = function geoNowloca() {
  if (!navigator.geolocation){
   console.log("Geolocation is not supported by your browser");
    return;
  }
  function success(position) {
    weatherApi.lat  = position.coords.latitude;
    weatherApi.lon = position.coords.longitude;
  }
  function error() {
    console.log("Unable to retrieve your location");
  }
  navigator.geolocation.getCurrentPosition(success, error);

}
const targetLocation = function targetLocation(){
  const savedloca = JSON.parse(localStorage.getItem('location'));
  if(savedloca){
    // Yes
    weatherApi.lat = savedloca.lat;
    weatherApi.lon = savedloca.lon;    
  } else{
    // No get a new location
    geoNowloca();
    
  }
  getWeather();
}
const getWeather = function getWeather(){
  const url = `https://pro.openweathermap.org/data/2.5/forecast/hourly?lat=${weatherApi.lat}&lon=${weatherApi.lon}&appid=${weatherApi.API_KEY}`
  fetch(url)
    .then((response) => response.json())
    .then((data)=>{
      console.log(data);
    })
}
// function onGeoOk(position){
//     const lat = position.coords.latitude;
//     const lon = position.coords.longitude;
//     const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
//     fetch(url)
//         .then((response) => response.json())
//         .then((data)=>{
//             const weather = document.querySelector("#weather p:last-child");
//             const city = document.querySelector("#weather p:first-child");
//             city.innerText = data.name;
//             weather.innerText = `${data.weather[0].main} ${Math.round(data.main.temp)}℃`;
//         });

// }
// function onGeoError(){
//     console.log("Can't find you");
// }
// navigator.geolocation.getCurrentPosition(onGeoOk,onGeoError);