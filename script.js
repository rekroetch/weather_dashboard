var myAPI = "131f90ece0cb3488d9a1ed02e7222d34"
var search = document.querySelector('#input')

$('li').text(history)
var history = localStorage.getItem('history')

$('#submit').on('click', function(event){
    event.preventDefault()
    var searchCity = search.value
    console.log(searchCity)

    $('.pastSearches').prepend('<li>'+searchCity+'</li>')
    $('li').addClass("list-group-item")
    
    localStorage.setItem("history", searchCity)
    
    var queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + searchCity + "&units=imperial&appid=" + myAPI;
    

    $.ajax({
        url: queryUrl,
        method: 'GET'
    }).then(function(response){
        console.log(response)
        console.log("temp: " + response.main.temp)
        console.log("wind speed: " + response.wind.speed)
        console.log("humidity: " + response.main.humidity)

        // var tempF = Math.round((response.main.temp - 273.15) * 9/5 + 32)

        $('#cityInfo').empty()
        
        $('#cityName').text(searchCity + " " + response.dt)
        $('#cityInfo').append('<div>Temperature: '+response.main.temp+'ºF</div>')
        $('#cityInfo').append('<div>Humidity: '+response.main.humidity+'%</div>')
        $('#cityInfo').append('<div>Wind Speed: '+response.wind.speed+'</div>')

        console.log(response.weather[0].icon)

        
    
    })

    var fiveDay = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchCity + "&units=imperial&cnt=5&appid=" + myAPI;

    $.ajax({
        url: fiveDay,
        method: 'GET'
    }).then(function(response){
        console.log(response)
        console.log(response.list[0].main.temp)
        console.log(response.list[0].main.humidity)
        console.log(response.list[0].dt_txt)
        console.log(response.list[0].weather[0].description)

        $('.forecast').empty()

        for (var i = 0; i < response.list.length; i++) {
            $('.forecast').append(
                '<div class="card box">'+
                '<div>'+response.list[i].dt_txt+'</div>'+
                '<div>Temperature: '+response.list[i].main.temp+'ºF</div>'+
                '<div>Humidity: '+response.list[i].main.humidity+'%</div>'+
                '<div>'+response.list[i].weather[0].description+'</div>'+
                '</div>'
            )
        }    
        
    })

})
