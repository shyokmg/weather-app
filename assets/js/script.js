const apiKey = '382e4071686a9c9505887e47a96575f7';



function currentForecast(lat, lon, appid) {
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appid}`;
    fetch(url).then(function(response){
        if (response.status === 200){
            return response.json();
        } else {
            document.location.replace('index.html');
        }
    })
    .then(function(data){
        console.log('CURRENT DAY FORECAST');
        console.log(data);
        getCurrentWeather(data);
    })
}

function fiveDayForecast(lat, lon, appid) {
    let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${appid}`;
    fetch(url).then(function(response){
        if (response.status === 200){
            return response.json();
        } else {
            document.location.replace('index.html');
        }
    })
    .then(function(data){
        console.log('FIVE DAY FORECAST');
        console.log(data);
    })
}

function geoCoding(cityname, limit, appid) {
    // let url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityname},${statecode},${countrycode}&limit=${limit}&appid=${appid}`;
    let url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityname}&limit=${limit}&appid=${appid}`;

    fetch(url).then(function(response){
        if (response.status === 200){
            return response.json();
        } else {
            document.location.replace('index.html');
        }
    })
    .then(function(data){
        // console.log(data);
        let lat = data[0].lat
        let lon = data[0].lon
        currentForecast(lat, lon, apiKey)
        fiveDayForecast(lat, lon, apiKey)

    })
}

function getCurrentWeather(data){
    let cityName = data.name;
    let dt = dayjs.unix(data.dt).format('MM/DD/YYYY');
    let weatherDesc = data.weather[0].description;
    let temp = data.main.temp;
    let wind = data.wind.speed;
    let humid = data.main.humidity;

    let printData = `${cityName} (${dt}) ${weatherDesc}\n 
    Temp: ${temp} \n
    Wind: ${wind} \n
    Humidity: ${humid}`

    console.log(printData);



}
















$('#search').on('click', function(){
    let searchInput = $('#autocomplete').val();
    if (searchInput !== ""){
        console.log(searchInput);
        geoCoding(searchInput, 1, apiKey);
    }
    $('#autocomplete').val('');
});


$('#autocomplete').autocomplete({
    source: [ "Sydney", "Melbourne", "Brisbane", "Manila", "Tokyo", "Atlanta", "New York" ]
  });
// geoCoding('Sydney,', 1, apiKey);
// openWeather();