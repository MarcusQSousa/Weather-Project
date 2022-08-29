// document.addEventListener("load", geoPosition());

let d = new Date()
let dstring = d.toString().split(" ")

function geoPosition(){
 	 if("geolocation" in navigator){
   		 navigator.geolocation.getCurrentPosition(location => {runApi(location)}, e => {geolocateErr(e)})
 	 }else{
   		 window.alert("Sorry, your browser does not support geolocation");
  		}
}

let coordinates = {
	coords : {
		latitude : 36.3175,
		longitude: -81.6554
	}
}

runApi(coordinates)

function runApi(l){
	console.log(l);
	const lat = l.coords.latitude
	const lon = l.coords.longitude
	const timeZone = dstring[5]
	console.log(lat, lon, timeZone)
	const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&timezone=${timeZone}&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min&current_weather=true`

	fetch(apiUrl)
	.then((res) => res.json())
	.then((json) => montagemsite(json));		
}



function geolocateErr(){
  window.alert("Sorry, cannot get client position");
  console.log(e)
}

function montagemsite(reply) {
	console.log(reply);
    const today = d;
    const months =['January','February','March','April','May','June','July','August','September','October','November','December'];

	const displayWindspeed = document.getElementById("displayWindspeed")
	const displayFeelsLike = document.getElementById("displayFeelsLike");
	const displayHumidity = document.getElementById("displayHumidity");
	const displayHour = document.getElementById("displayHour");
	const displayDate = document.getElementById("displayDate");

	
	const displayCurrentTemp = document.getElementById("displayCurrentTemp");
	const displayCurrentWeather = document.getElementById("displayCurrentWeather");
	const bg = document.querySelector("body");
    
	displayWindspeed.textContent = reply.current_weather.windspeed;
	displayFeelsLike.textContent = reply.hourly.apparent_temperature[reply.hourly.time.indexOf(reply.current_weather.time)];
	displayHumidity.textContent = reply.hourly.relativehumidity_2m[reply.hourly.time.indexOf(reply.current_weather.time)];
	displayHour.textContent = `${today.getHours()}:${today.getMinutes()}`;
	displayDate.textContent = `${months[today.getMonth()]}/${today.getDate()}/${today.getFullYear()}`;

	displayCurrentTemp.textContent = reply.current_weather.temperature + "°c";
	displayCurrentWeather.textContent = wCodeTranslate(reply.current_weather.weathercode)[0];
	bg.style.backgroundImage = `url(../assets/images/img${wCodeTranslate(reply.current_weather.weathercode)[1]}.jpg)`;
	console.log("Aloou", wCodeTranslate(reply.current_weather.weathercode))
    runTable(reply);



}



function runTable(reply){
    const table = document.getElementById('table')
    // const dayCells = table[2].cells
	// const tmpCells = table[1].cells
	// const weatherCells = table[0].cells
    const array = hourlyArray(reply)
	console.log(array)
    for (let i = 0; i < array.length; i++) {
		table.innerHTML +=`<div> <img src='./assets/images/ico${wCodeTranslate(array[i][0][2])[1]}.svg'> <p>${array[i][0][1] + '°c'}</p> <p>${array[i][0][0]}</p> </div>`
        
    }
}


function wCodeTranslate(weatherNumber) {

	const numero = parseInt(weatherNumber)	

	switch (numero) {
		case 0:
			return ["Clear Sky", 1];

		case 1:
			return ["Mainly clear sky", 1];

		case 2:
			return ["Partly cloudy sky", 2];

		case 3:
			return ["Overcast", 3];

		case 45:
			return  ["Fog", 4];

		case 48:
			return  ["Freezing Fog", 4];

		case 51:
			return  ["Light drizzle", 5];

		case 53:
			return ["Moderate drizzle", 5];

		case 55:
			return ["Heavy drizzle", 6];

		case 56:
			return ["Light freezing drizzle", 5];

		case 57:
			return ["Heavy freezing drizzle", 6];

		case 61:
			return ["Light rain", 5];

		case 63:
			return ["Moderate rain", 5];

		case 65:
			return ["Heavy rain", 7];

		case 66:
			return ["Light freezing rain", 5];

		case 67:
			return ["Heavy freezing rain", 7];

		case 71:
			return ["Light snow fall", 8];

		case 73:
			return ["Moderate snow fall", 8];

		case 75:
			return ["Heavy snow fall", 8];

		case 80:
			return ["Light rain shower", 5];

		case 81:
			return ["Moderate rain shower", 6];

		case 82:
			return ["Heavy rain shower", 7];

		case 85:
			return ["Light snow shower", 8];

		case 86:
			return ["Heavy snow shower", 8];

		case 95:
			return ["Thunderstorm", 7];

		case 96:
			return ["Thunderstorm with light hail", 7];

		case 97:
			return ["Thunderstorm with heavy hail", 7];
	}
}


function hourlyArray(reply){
    const currentTime = reply.current_weather.time;
    const replyTime = reply.hourly.time
    const currentIndex = replyTime.indexOf(currentTime)
    let multi = []; 

    for (let i = currentIndex; i < currentIndex+6; i++) {
        multi.push([[reply.hourly.time[i].slice(-5),reply.hourly.temperature_2m[i],reply.hourly.weathercode[i]]]);
        
    }
    return multi
}


// https://ip-api.com/json/?fields=status,message,country,countryCode,region,regionName,city,lat,lon,timezone