var cities;
var apikey = "2f0d7745f820d66ebaf17295dbd69c5b";

$(document).ready(function () {
    $("#5DayForecast").hide();
    $("#current").hide();
    getstoredCities();
});

$("#city-search").on("click", function (event) {
    event.preventDefault();

    var cityName = $("#city-name").val();
    console.log(cityName);
    if (cityName === '') {
        return false;
    }

    displayTempinfo(cityName);

    $("#city-name").val("");
    console.log("cityname" + cityName);

});

function cityData(cityName) {

    $("#buttons-view").show();

    var cities = JSON.parse(localStorage.getItem("cities"));
    console.log(cities);
    if (cities) {
        if (!cities.includes(cityName)) {
            cities.push(cityName);
        }
    }
    else {
        cities = [cityName];
    }
    localStorage.setItem("cities", JSON.stringify(cities));
    console.log(cities);
    getstoredCities();
}


function getstoredCities() {

    var citiesList = JSON.parse(localStorage.getItem("cities"));
    $("#list").empty();
    console.log(citiesList);
    for (i = 0; i < citiesList.length; i++) {
        var liBtn = $("<li class='list-group-item city-btn text-center'>");
        liBtn.attr("id", citiesList[i]);
        liBtn.attr("data-name", citiesList[i]);
        liBtn.text(citiesList[i]);
        $("#list").append(liBtn);
    }
}


function displayTempinfo(cityName) {

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&apikey=" + apikey;


    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {


        $("#current").show();
        $("#current-day").empty();

        var header1 = $("<h3>").text("Current Weather");
        $("#current-day").append(header1);
        var date = moment().format(" MMMM Do YYYY");
        var cityDate = $("<h5>").text(response.name + " ("+date + " )");
        $("#current-day").append(cityDate);
        var image = $("<img>").attr("src", "https://openweathermap.org/img/wn/" +
            response.weather[0].icon + ".png").width('100px').height('100px');
        $("#current-day").append(image);
        var tempF = (response.main.temp - 273.15) * 1.80 + 32;
        var temp = $("<p>").text("Temperature: " + tempF.toFixed(2) + " °F");
        $("#current-day").append(temp);
        var windSpeed = $("<p>").text("Wind Speed: " + response.wind.speed);
        $("#current-day").append(windSpeed);    
        var humidity = $("<p>").text("humidity: " + response.main.humidity)
        $("#current-day").append(humidity);   
        var lattitude = response.coord.lat;
        var longitude = response.coord.lon;

        var uvqueryURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + apikey + "&lat=" + lattitude + "&lon=" + longitude;
        uvIndex(uvqueryURL);
     
        var cityId = response.id;
        var forecastqueryUrl = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityId + "&units=imperial&appid=" + apikey;

        forecastDays(forecastqueryUrl);
        cityData(cityName);
    }).fail(() => {
        $("#current-day").empty();
        var error = $("<h3>").text("Invalid City Name");
        console.log(error);
        $("#current-day").append(error);
        $("#5DayForecast").empty();
        $("#forecast").empty();

    });

}

function uvIndex(uvqueryURL) {

    $.ajax({
        url: uvqueryURL,
        method: "GET"
    }).then(function (uvresponse) {
        var uvValue = uvresponse.value;

        var uvIndex = $("<p>").text("UV Index: ");
        $("#current-day").append(uvIndex);
        var mark = $("<mark>").text(uvresponse.value);
        mark.attr("id", "uv-index");
        uvIndex.append(mark);

        
    });
}



function forecastDays(forecastqueryUrl) {


    $("#forecast").empty();
    $("#5DayForecast").show();
    $("#forecast").show();

    console.log(forecastqueryUrl);
    $.ajax({
        url: forecastqueryUrl,
        method: "GET"
    }).then(function (forecastresponse) {


        var forecast = forecastresponse.list;

        for (i = 0; i < forecast.length; i++) {

            if ((forecastresponse.list[i].dt_txt).substr(11, 8) == "00:00:00") { 

                var card = $("<div class='card  text-white text-center bg-primary mb-10 p-2'>");
                $("#forecast").append(card);

                var date = (forecastresponse.list[i].dt_txt).substr(8, 2);
                var month = (forecastresponse.list[i].dt_txt).substr(5, 2);
                var year = (forecastresponse.list[i].dt_txt).substr(0, 4);
                var tempdate = $("<h5 class='card-title'>").text(date + "/" + month + "/" + year);
                card.append(tempdate);

                var image = $("<img>").attr("src", "https://openweathermap.org/img/wn/"
                    + forecastresponse.list[i].weather[0].icon + ".png").width('100px').height('100px');
                card.append(image);

                var temp = $("<p class='card-text'>").text( forecastresponse.list[i].main.temp + " °F" );
                card.append(temp);

                var humidity = $("<p class='card-text'>").text("Humidity: " + forecastresponse.list[i].main.humidity);
                card.append(humidity);
            }
        }
    });

}

$(document).on("click", ".city-btn", function () {
    var cityName = $(this).attr("data-name");
    displayTempinfo(cityName);
});
