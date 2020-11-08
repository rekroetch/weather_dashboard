var myAPI = "131f90ece0cb3488d9a1ed02e7222d34"
var search = document.querySelector('#input')

let pastSearches = []
let storedForecastArray = []
function init() {
    
    var searchHistory = JSON.parse(localStorage.getItem("history"))
    
    if (searchHistory !== null) {
        searchHistory.reverse().forEach(function(historyItem){
            var historyEl = $('<li class="list-group-item">'+historyItem+'</li>')
            $('.pastSearches').append(historyEl)
            
        })
        pastSearches = searchHistory
    }   

    var storedCityName = JSON.parse(localStorage.getItem('storedCityName'))
    $('#cityName').append(storedCityName)

    var storedCityInfo = JSON.parse(localStorage.getItem('storedCityInfo'))
    $('#cityInfo').append(storedCityInfo)
    // $('#cityInfo')

    var storedForecast = localStorage.getItem('storedForecast')
    $('.forecast').append(storedForecast)
    // $('.forecast').addClass('card box')


}
init()


$('#submit').on('click', function(event){
    // resets empty array
    var storedForecastArray = []
    event.preventDefault()
    var searchCity = search.value
    var capitalSearchCity = searchCity.charAt(0).toUpperCase() + searchCity.slice(1)

    // clears input box
    search.value = ""
    
    pastSearches.push(capitalSearchCity)
    localStorage.setItem("history", JSON.stringify(pastSearches))

    $('.pastSearches').prepend('<li>'+capitalSearchCity+'</li>')
    $('li').addClass("list-group-item")

     
    var queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + capitalSearchCity + "&units=imperial&appid=" + myAPI;
    
    $.ajax({
        url: queryUrl,
        method: 'GET'
    }).then(function(response){
        $('#cityName').empty()
        $('#cityInfo').empty()

        

        let date = new Date(response.dt * 1000)
        

        console.log(response)
        console.log("temp: " + response.main.temp)
        console.log("wind speed: " + response.wind.speed)
        console.log("humidity: " + response.main.humidity)
        
        var icon = 'http://openweathermap.org/img/wn/'+ response.weather[0].icon + '@2x.png'

        var iconImg = $('<img>')
        iconImg.attr('src', icon)
        $('#cityName').append(iconImg)
        

        
        $('#cityName').append(response.name+ " | " + date.toLocaleDateString('en-US'))
        // $('#cityInfo').append('<div>Temperature: '+response.main.temp+'ºF</div>')
        // $('#cityInfo').append('<div>Humidity: '+response.main.humidity+'%</div>')
        // $('#cityInfo').append('<div>Wind Speed: '+response.wind.speed+' mph</div>')

        // var cityName = $(response.name+ " | " + date.toLocaleDateString('en-US'))
        var tempMain = $('<div>Temperature: '+response.main.temp+'ºF</div>')
        var humidityMain = $('<div>Humidity: '+response.main.humidity+'%</div>')
        var windMain = $('<div>Wind Speed: '+response.wind.speed+' mph</div>')

        $('#cityInfo').append(tempMain, humidityMain, windMain)



                var cityName = $('#cityName').text()

                localStorage.setItem('storedCityName', JSON.stringify(cityName))

                

        var lat = response.coord.lat
        var lon = response.coord.lon 
        var uv = "https://api.openweathermap.org/data/2.5/onecall?lat=" +lat+ "&lon=" +lon+ "&units=imperial&exclude=minutely,hourly,alerts&appid=" + myAPI

        $.ajax({
            url: uv,
            method: 'GET'
        }).then(function(responseNew){
            var uvindex = responseNew.current.uvi
            
            var uvindexAdd = ('<div>UV Index: '+'<span>'+uvindex+'</span>'+'</div>')

            console.log(responseNew)
            $('#cityInfo').append(uvindexAdd)
            

            if (uvindex <= 2) {
                // show green
                $('span').addClass('green')
                console.log("green")
            } else if (uvindex <= 5) {
                // show yellow
                $('span').addClass('yellow')
                console.log("yellow")
            } else if (uvindex <= 7) {
                // show orange
                $('span').addClass('orange')
                console.log('orange')
            } else if (uvindex <= 10) {
                // show red
                $('span').addClass('red')
                console.log('red')
            } else {
                // show purple
                $('span').addClass('purple')
                console.log("purple")
            }

                // var cityInfo = $('#cityInfo').text()
                localStorage.setItem('storedCityInfo', JSON.stringify(tempMain.text()+"<br>"+humidityMain.text()+"<br>"+windMain.text()+"<br>"+uvindexAdd))


            $('.forecast').empty()

            for (var i = 1; i < 6; i++) {

                var iconFive = 'http://openweathermap.org/img/wn/'+ responseNew.daily[i].weather[0].icon + '@2x.png'
                var iconFiveImg = $('<img>')
                iconFiveImg.attr('src', iconFive)
                

                var dateFive = new Date(responseNew.daily[i].dt * 1000)

                var dayBox = $('<div class="card box">')
                var date = $('<div class="date">'+dateFive.toLocaleDateString('en-US')+'</div>')
                var icon = $('<div class="icon"><img src="http://openweathermap.org/img/wn/' +responseNew.daily[i].weather[0].icon+'@2x.png"></div>')
                var high = $('<div>High: '+responseNew.daily[i].temp.max+'ºF</div>')
                var low = $('<div>Low: '+responseNew.daily[i].temp.min+'ºF</div>')
                var humidity = $('<div>Humidity: '+responseNew.daily[i].humidity+'%</div>')
                
                $(dayBox).append(date, icon, high, low, humidity)
                $('.forecast').append(dayBox)

                    // var forecast = $('.forecast').text()
                    // localStorage.setItem('storedForecast', JSON.stringify(forecast))
                    storedForecastArray.push(JSON.stringify(date.text() + "<br>"+ high.text()+"<br>"+ low.text()+"<br>"+ humidity.text()+"<br><br>"))
            }    
                // localStorage.setItem('storedForecast', JSON.stringify(date.text() + "<br>" +icon+"<br>"+ high.text()+"<br>"+ low.text()+"<br>"+ humidity.text()))
            localStorage.setItem('storedForecast', storedForecastArray)
        })

    })

})

$('.pastSearches').on('click', 'li', function(event) {
    event.preventDefault()
    console.log($(this).text())

    
    var clickUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + $(this).text() + "&units=imperial&appid=" + myAPI;
    
    
    $.ajax({
        url: clickUrl,
        method: 'GET'
    }).then(function(response){
        console.log(response)
        $('#cityName').empty()
        $('#cityInfo').empty()

        let date = new Date(response.dt * 1000)
        
        var icon = 'http://openweathermap.org/img/wn/'+ response.weather[0].icon + '@2x.png'

        var iconImg = $('<img>')
        iconImg.attr('src', icon)
        $('#cityName').append(iconImg)

        $('#cityName').append(response.name + " | " + date.toLocaleDateString('en-US'))
        $('#cityInfo').append('<div>Temperature: '+response.main.temp+'ºF</div>')
        $('#cityInfo').append('<div>Humidity: '+response.main.humidity+'%</div>')
        $('#cityInfo').append('<div>Wind Speed: '+response.wind.speed+' mph</div>')

        var lat = response.coord.lat
        var lon = response.coord.lon 
        var uv = "https://api.openweathermap.org/data/2.5/onecall?lat=" +lat+ "&lon=" +lon+ "&units=imperial&exclude=minutely,hourly,alerts&appid=" + myAPI

        $.ajax({
            url: uv,
            method: 'GET'
        }).then(function(responseNew){
            var uvindex = responseNew.current.uvi
            

            console.log(responseNew)
            $('#cityInfo').append('<div>UV Index: '+'<span>'+uvindex+'</span>'+'</div>')

            if (uvindex <= 2) {
                // show green
                $('span').addClass('green')
                console.log("green")
            } else if (uvindex <= 5) {
                // show yellow
                $('span').addClass('yellow')
                console.log("yellow")
            } else if (uvindex <= 7) {
                // show orange
                $('span').addClass('orange')
                console.log('orange')
            } else if (uvindex <= 10) {
                // show red
                $('span').addClass('red')
                console.log('red')
            } else {
                // show purple
                $('span').addClass('purple')
                console.log("purple")
            }


            $('.forecast').empty()

            for (var i = 1; i < 6; i++) {

                var iconFive = 'http://openweathermap.org/img/wn/'+ responseNew.daily[i].weather[0].icon + '@2x.png'
                var iconFiveImg = $('<img>')
                iconFiveImg.attr('src', iconFive)
                

                var dateFive = new Date(responseNew.daily[i].dt * 1000)

                var dayBox = $('<div class="card box">')
                var date = $('<div class="date">'+dateFive.toLocaleDateString('en-US')+'</div>')
                var icon = $('<div class="icon"><img src="http://openweathermap.org/img/wn/' +responseNew.daily[i].weather[0].icon+'@2x.png"></div>')
                var high = $('<div>High: '+responseNew.daily[i].temp.max+'ºF</div>')
                var low = $('<div>Low: '+responseNew.daily[i].temp.min+'ºF</div>')
                var humidity = $('<div>Humidity: '+responseNew.daily[i].humidity+'%</div>')
                
                $(dayBox).append(date, icon, high, low, humidity)
                $('.forecast').append(dayBox)
    
            }    
                 
        })

    })
})
