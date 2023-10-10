const apiKey = '382e4071686a9c9505887e47a96575f7';


function openWeather(lat, lon, appid) {
    let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${appid}`;
    fetch(url)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        console.log(data);
    })
}

function geoCoding(cityname, limit, appid) {
    // let url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityname},${statecode},${countrycode}&limit=${limit}&appid=${appid}`;
    let url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityname}&limit=${limit}&appid=${appid}`;

    fetch(url)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        console.log(data);
        let lat = data[0].lat
        let lon = data[0].lon
        openWeather(lat, lon, apiKey)
    })
}
geoCoding('Sydney,', 1, apiKey);
// openWeather();