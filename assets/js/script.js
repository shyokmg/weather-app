const apiKey = '382e4071686a9c9505887e47a96575f7';
var savedCities = ['Sydney'];

// API for current weather forecast
function currentForecast(lat, lon, appid) {
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${appid}`;
    fetch(url).then(function (response) {
        if (response.status === 200) {
            return response.json();
        } else {
            document.location.replace('index.html');
        }
    })
        .then(function (data) {
            getCurrentWeather(data);
        })
}

// API for 5day weather forecast
function fiveDayForecast(lat, lon, appid) {
    let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${appid}`;
    fetch(url).then(function (response) {
        if (response.status === 200) {
            return response.json();
        } else {
            document.location.replace('index.html');
        }
    })
        .then(function (data) {
            let fiveResults = getFiveDayWeather(data);
            generateFiveDayForecast(fiveResults);
        })
}

// function for getting geo location using API
function geoCoding(cityname, limit, appid) {
    let url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityname}&limit=${limit}&appid=${appid}`;

    fetch(url).then(function (response) {
        if (response.status === 200) {
            return response.json();
        } else {
            document.location.replace('index.html');
        }
    })
        .then(function (data) {
            let lat = data[0].lat
            let lon = data[0].lon
            let saveCity = data[0].name
            // Check saved city history and save to local storage
            if(!savedCities.includes(saveCity)){
                savedCities.push(saveCity);
                localStorage.setItem('savedCities', JSON.stringify(savedCities));
            } 
            currentForecast(lat, lon, apiKey)
            fiveDayForecast(lat, lon, apiKey)
            createHistory(savedCities);

        })
}

// Extract current weather forecast from given data
function getCurrentWeather(data) {
    let cityName = data.name;
    let dt = dayjs.unix(data.dt).format('MM/DD/YYYY');
    let icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    let temp = data.main.temp;
    let wind = data.wind.speed;
    let humid = data.main.humidity;

    // Dynamically add data to html
    $('#cityname').text(`${cityName} (${dt})`);
    $('#mainIcon').addClass('icons').attr('src', icon);
    $('#mainTemp').text(`Temp ${temp} °C`);
    $('#mainWind').text(`Wind: ${wind} km/h`);
    $('#mainHumid').text(`Humidity: ${humid}%`);
}

// Extract 5day weather forecast from given data
function getFiveDayWeather(data) {
    // Assign data to object
    let fiveObj = { dt: [], temp: [], humid: [], wind: [], iconID: [] }
    let filterObj = { dt: [], temp: [], humid: [], wind: [], iconID: [] }

    // loops through data and adds to fiveObj
    for (let i = 0; i < data.list.length; i++) {
        fiveObj.dt.push(dayjs.unix(data.list[i].dt).format('MM/DD/YYYY'));
        fiveObj.temp.push(data.list[i].main.temp);
        fiveObj.humid.push(data.list[i].main.humidity);
        fiveObj.wind.push(data.list[i].wind.speed);
        fiveObj.iconID.push(data.list[i].weather[0].icon);
    }

    // lopps through the fiveObj and filters data to managable results
    let filter = filterFiveResults(fiveObj.dt);
    for (let i = 0; i < filter.length; i++) {
        filterObj.dt.push(fiveObj.dt[filter[i]]);
        filterObj.temp.push(fiveObj.temp[filter[i]]);
        filterObj.humid.push(fiveObj.humid[filter[i]]);
        filterObj.wind.push(fiveObj.wind[filter[i]]);
        filterObj.iconID.push(fiveObj.iconID[filter[i]]);
    }
    return filterObj;
}

// function that dynamically adds weather cards for 5day forecast
function generateFiveDayForecast(data) {
    var list = $('#weatherList');
    for (let i = 0; i < data.dt.length; i++) {
        let fiveList = $('<li>').addClass('col fs-8');
        let div = $('<div class="border border-secondary bg-dark text-white p-2">')
        let date = $('<li class="fw-bold">').text(data.dt[i]);
        let icon = $(`<li><img class="icons" src="https://openweathermap.org/img/wn/${data.iconID[i]}@2x.png"/></li>`);
        let temp = $('<li>').text(`Temp: ${data.temp[i]}°C`);
        let wind = $('<li>').text(`Wind: ${data.wind[i]} km/h`);
        let humid = $('<li>').text(`Humidity: ${data.humid[i]}%`);
        div.append(date, icon, temp, wind, humid);       
        fiveList.append(div);
        list.append(fiveList);
    }
    

}

// function to reduce results to managable data
function filterFiveResults(arr) {
    let someArr = [];
    let count = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[count] !== arr[i]) {
            someArr.push(i);
            count = i;
        }
    }
    return someArr;
}

// Click event for search
$('#search').on('click', function (event) {
    event.preventDefault();
    $('#weatherList').empty();
    $('#historyList').empty();

    let searchInput = $('#autocomplete').val();
    if (searchInput !== "") {
        geoCoding(searchInput, 1, apiKey);
    }
    $('#autocomplete').val('');
});


// Added auto complete function that gets data from saved history
$('#autocomplete').autocomplete({
    source: savedCities
});


// Create a button list of saved cities from history
function createHistory(arr){
    let historyList = $('#historyList');
    for (let i = 0; i < arr.length; i++){
        let cityButton = $(`<button class="btn btn-secondary btn-sm cityButton" data-city=${savedCities[i]}>${savedCities[i]}</button>`);
        historyList.append(cityButton);
    }
    // Click event on city buttons 
    $('.cityButton').on('click', function(event){
        let element = event.target;
        if(element.matches('button')){
            $('#weatherList').empty();
            $('#historyList').empty();
            let city = element.dataset.city;
            geoCoding(city, 1, apiKey);
        }
    });
}

// initialize page with default city (Syndey) and get  history from local storage;
function init(){
    geoCoding("Sydney", 1, apiKey);
    let check = JSON.parse(localStorage.getItem('savedCities'));
    if (check!==null){
        savedCities = check;
    } else {
        localStorage.setItem('savedCities', JSON.stringify(savedCities));
    }
}
init();