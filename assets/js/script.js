const apiKey = '382e4071686a9c9505887e47a96575f7';
var savedCities = ['Sydney'];

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
            console.log('CURRENT DAY FORECAST');
            // console.log(data);
            getCurrentWeather(data);
        })
}

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
            console.log('FIVE DAY FORECAST');
            console.log(data);
            let fiveResults = getFiveDayWeather(data);
            generateFiveDayForecast(fiveResults);
        })
}

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
            console.log(data);
            let lat = data[0].lat
            let lon = data[0].lon
            let saveCity = data[0].name
            if(savedCities.includes(saveCity)){
                console.log('YES');
            } else {
                console.log('NO');
                savedCities.push(saveCity);
                localStorage.setItem('savedCities', JSON.stringify(savedCities));
            }
            currentForecast(lat, lon, apiKey)
            fiveDayForecast(lat, lon, apiKey)
            createHistory(savedCities);

        })
}

function getCurrentWeather(data) {
    let cityName = data.name;
    let dt = dayjs.unix(data.dt).format('MM/DD/YYYY');
    let icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    let temp = data.main.temp;
    let wind = data.wind.speed;
    let humid = data.main.humidity;

    $('#cityname').text(`${cityName} (${dt})`);
    $('#mainIcon').attr('src', icon);
    $('#mainTemp').text(`Temp ${temp} °C`);
    $('#mainWind').text(`Wind: ${wind} km/h`);
    $('#mainHumid').text(`Humidity: ${humid}%`);
    


}

function getFiveDayWeather(data) {
    let fiveObj = { dt: [], temp: [], humid: [], wind: [], iconID: [] }
    let filterObj = { dt: [], temp: [], humid: [], wind: [], iconID: [] }

    for (let i = 0; i < data.list.length; i++) {
        fiveObj.dt.push(dayjs.unix(data.list[i].dt).format('MM/DD/YYYY'));
        fiveObj.temp.push(data.list[i].main.temp);
        fiveObj.humid.push(data.list[i].main.humidity);
        fiveObj.wind.push(data.list[i].wind.speed);
        fiveObj.iconID.push(data.list[i].weather[0].icon);
    }

    let filter = filterFiveResults(fiveObj.dt);
    for (let i = 0; i < filter.length; i++) {
        filterObj.dt.push(fiveObj.dt[filter[i]]);
        filterObj.temp.push(fiveObj.temp[filter[i]]);
        filterObj.humid.push(fiveObj.humid[filter[i]]);
        filterObj.wind.push(fiveObj.wind[filter[i]]);
        filterObj.iconID.push(fiveObj.iconID[filter[i]]);
    }
    console.log(fiveObj);
    console.log(filterObj);
    return filterObj;
}


function generateFiveDayForecast(data) {
    var list = $('#weatherList');
    for (let i = 0; i < data.dt.length; i++) {
        let fiveList = $('<li>').addClass('box');
        let date = $('<li>').text(data.dt[i]);
        let icon = $(`<li><img src="https://openweathermap.org/img/wn/${data.iconID[i]}@2x.png"/></li>`);
        let temp = $('<li>').text(`Temp: ${data.temp[i]}°C`);
        let wind = $('<li>').text(`Wind: ${data.wind[i]} km/h`);
        let humid = $('<li>').text(`Humidity: ${data.humid[i]}%`);
        fiveList.append(date, icon, temp, wind, humid);       
        list.append(fiveList);
    }
    

}
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


$('#search').on('click', function () {
    let searchInput = $('#autocomplete').val();
    $('#weatherList').empty();
    $('#historyList').empty();
    if (searchInput !== "") {
        console.log(searchInput);
        geoCoding(searchInput, 1, apiKey);
    }
    $('#autocomplete').val('');
});



$('#autocomplete').autocomplete({
    source: savedCities
});



function createHistory(arr){
    let historyList = $('#historyList');
    for (let i = 0; i < arr.length; i++){
        let cityButton = $(`<li><button class="cityButton" data-city=${savedCities[i]}>${savedCities[i]}</button></li>`);
        historyList.append(cityButton);
    }
    $('.cityButton').on('click', function(event){
        let element = event.target;
        console.log('PRESSED');
        if(element.matches('button')){
            $('#weatherList').empty();
            $('#historyList').empty();
            let city = element.dataset.city;
            geoCoding(city, 1, apiKey);
        }
    });
}

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