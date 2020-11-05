var myAPI = "131f90ece0cb3488d9a1ed02e7222d34"
var search = document.querySelector('#input')


// ICON LINK EX: http://openweathermap.org/img/wn/10d@2x.png
// change the 10d ^^

var history = localStorage.getItem('history')
$('li').text(history)


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
        $('#cityName').empty()
        $('#cityInfo').empty()

        // console.log(Date(response.dt))

        let date = new Date(response.dt * 1000)
        console.log(date.toLocaleDateString('en-US'))

        console.log(response)
        console.log("temp: " + response.main.temp)
        console.log("wind speed: " + response.wind.speed)
        console.log("humidity: " + response.main.humidity)
        
        var icon = 'http://openweathermap.org/img/wn/'+ response.weather[0].icon + '@2x.png'

        var iconImg = $('<img>')
        iconImg.attr('src', icon)
        $('#cityName').append(iconImg)
        

        
        $('#cityName').append(searchCity+ " | " + date.toLocaleDateString('en-US'))
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
    
                $('.forecast').append(
                    '<div class="card box">'+
                    '<div class="date">'+dateFive.toLocaleDateString('en-US')+'</div>'+
                    iconFiveImg +
                    '<div>High: '+responseNew.daily[i].temp.max+'ºF</div>'+
                    '<div>Low: '+responseNew.daily[i].temp.min+'ºF</div>'+
                    '<div>Humidity: '+responseNew.daily[i].humidity+'%</div>'+
                    
                    '</div>',

                    
                )
           
            }    
           
        })

        
    
    })

//     var fiveDay = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchCity + "&units=imperial&cnt=40&appid=" + myAPI;

//     $.ajax({
//         url: fiveDay,
//         method: 'GET'
//     }).then(function(response){
//         $('.forecast').empty()

//         // let date = new Date(Date.UTC(response.list[0].dt_txt))
//         // console.log(date.toLocaleString('en-US'))

//         console.log(response)
//         console.log(response.list[0].main.temp)
//         console.log(response.list[0].main.humidity)
//         console.log(response.list[0].dt_txt)
//         console.log(response.list[0].weather[0].description)


//         for (var i = 0; i < response.list.length; i++) {
//             var iconFive = 'http://openweathermap.org/img/wn/'+ response.list[i].weather[0].icon + '@2x.png'
//             var iconFiveImg = $('<img>')
//             iconFiveImg.attr('src', iconFive)

//             $('.forecast').append(
//                 '<div class="card box">'+ iconFiveImg +
//                 '<div>'+response.list[i].dt_txt+'</div>'+
//                 '<div>Temperature: '+response.list[i].main.temp+'ºF</div>'+
//                 '<div>Humidity: '+response.list[i].main.humidity+'%</div>'+
//                 '<div>'+response.list[i].weather[0].description+'</div>'+
                
//                 '</div>'
//             )
       
//         }    
        
//     })

 })
