var myAPI = "131f90ece0cb3488d9a1ed02e7222d34"
var search = document.querySelector('#input')

// EMPTY ARRAYS FOR LOCAL STORAGE USE
let pastSearches = []
let storedForecastArray = []

// PULLS FROM LOCAL STORAGE WHEN APP IS OPENED OR REFRESHED
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
    
    var storedForecast = localStorage.getItem('storedForecast')
    $('.forecast').append(storedForecast)
    
}
init()

// WHEN SEARCH BUTTON IS CLICKED:
$('#submit').on('click', function(event){
    // resets empty array
    var storedForecastArray = []
    event.preventDefault()
    var searchCity = search.value
    var capitalSearchCity = searchCity.charAt(0).toUpperCase() + searchCity.slice(1)

    // clears input box
    search.value = ""
    
    // PAST CITY SEARCHES TO LOCAL STORAGE
    pastSearches.push(capitalSearchCity)
    localStorage.setItem("history", JSON.stringify(pastSearches))

    // ADD PAST SEARCHES BELOW SEARCH BAR
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
        

        
        // WEATHER ICON FOR CURRENT WEATHER HEADING
        var icon = 'http://openweathermap.org/img/wn/'+ response.weather[0].icon + '@2x.png'

        var iconImg = $('<img>')
        iconImg.attr('src', icon)
        $('#cityName').append(iconImg)
        

        // ADD NAME AND DATE TO CURRENT WEATHER HEADING
        $('#cityName').append(response.name+ " | " + date.toLocaleDateString('en-US'))
        
        // VARIABLES FOR CITY INFO AREA
        var tempMain = $('<div>Temperature: '+response.main.temp+'ºF</div>')
        var humidityMain = $('<div>Humidity: '+response.main.humidity+'%</div>')
        var windMain = $('<div>Wind Speed: '+response.wind.speed+' mph</div>')

        // APPEND VARIABLES TO CITY INFO
        $('#cityInfo').append(tempMain, humidityMain, windMain)


        // CITY NAME TO LOCAL STORAGE
        var cityName = $('#cityName').text()
        localStorage.setItem('storedCityName', JSON.stringify(cityName))

                
        // LATITUDE AND LONGITUDE FOR NEW API SEARCH
        var lat = response.coord.lat
        var lon = response.coord.lon 
        var uv = "https://api.openweathermap.org/data/2.5/onecall?lat=" +lat+ "&lon=" +lon+ "&units=imperial&exclude=minutely,hourly,alerts&appid=" + myAPI

        $.ajax({
            url: uv,
            method: 'GET'
        }).then(function(responseNew){

            // UV INDEX FROM NEW API SEARCH
            var uvindex = responseNew.current.uvi
            var uvindexAdd = ('<div>UV Index: '+'<span>'+uvindex+'</span>'+'</div>')

            // ADD UV INDEX TO CITY INFO
            $('#cityInfo').append(uvindexAdd)
            
            // HIGHLIGHTS THE UV INDEX BASED ON SEVERITY
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

            // CITY INFO TO LOCAL STORAGE   
            localStorage.setItem('storedCityInfo', JSON.stringify('<div class="cityInfo">' + tempMain.text()+"<br>"+humidityMain.text()+"<br>"+windMain.text()+"<br>"+uvindexAdd+ "</div>"))

            // RESETS FORECASTS AREA FOR EACH SEARCH
            $('.forecast').empty()

            // LOOPS OVER API RESPONSE 5 TIMES TO GET FORECAST
            for (var i = 1; i < 6; i++) {

                // WEATHER ICONS
                var iconFive = 'http://openweathermap.org/img/wn/'+ responseNew.daily[i].weather[0].icon + '@2x.png'
                var iconFiveImg = $('<img>')
                iconFiveImg.attr('src', iconFive)
                

                var dateFive = new Date(responseNew.daily[i].dt * 1000)

                // VARIABLES FOR EACH ITEM ON FORECAST CARDS
                var dayBox = $('<div class="card box">')
                var date = '<div class="date">'+dateFive.toLocaleDateString('en-US')+'</div>'
                var icon = $('<div class="icon"><img src="http://openweathermap.org/img/wn/' +responseNew.daily[i].weather[0].icon+'@2x.png"></div>')
                var high = '<div>High: '+responseNew.daily[i].temp.max+'ºF</div>'
                var low = '<div>Low: '+responseNew.daily[i].temp.min+'ºF</div>'
                var humidity = '<div>Humidity: '+responseNew.daily[i].humidity+'%</div>'
                
                // APPEND VARIABLES TO FORECAST CARDS
                $(dayBox).append(date, icon, high, low, humidity)
                $('.forecast').append(dayBox)

                // 5 DAY FORECAST TO ARRAY   
                storedForecastArray.push('<div class="card box">'+date + high+ low+ humidity+"</div>")
            }    
            // 5 DAY FORECAST TO LOCAL STORAGE
            localStorage.setItem('storedForecast', storedForecastArray)
        })

    })

})


// FOLLOWING REPEATS LOGIC ABOVE, USES PAST SEARCH CLICK RATHER THAN NEW SEARCH


// WHEN A PAST SEARCH IS CLICKED: 
$('.pastSearches').on('click', 'li', function(event) {
    event.preventDefault()
    console.log($(this).text())

    
    var clickUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + $(this).text() + "&units=imperial&appid=" + myAPI;
    
    // USES API
    $.ajax({
        url: clickUrl,
        method: 'GET'
    }).then(function(response){
        console.log(response)
        // CLEARS MAIN AREA FOR NEW SEARCH
        $('#cityName').empty()
        $('#cityInfo').empty()

        let date = new Date(response.dt * 1000)
        
        // WEATHER ICON FOR MAIN AREA
        var icon = 'http://openweathermap.org/img/wn/'+ response.weather[0].icon + '@2x.png'

        var iconImg = $('<img>')
        iconImg.attr('src', icon)
        $('#cityName').append(iconImg)

        // APPENDS RESPONSE TO CURRENT WEATHER
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

            // FOR THE UV INDEX
            var uvindex = responseNew.current.uvi
            
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


            // FOR THE 5 DAY FORECAST
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
