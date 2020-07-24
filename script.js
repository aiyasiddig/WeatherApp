$(document).ready(function() {
    $('#submit').click(function(){

       var city = $('#city').val();
       localStorage.setItem('city', city);
       $('#city').val() = localStorage.getItem('city'); 

       if(city != ''){
           $.ajax( {
               url: "http://api.openweathermap.org/data/2.5/weather?q="
                + city + "&units=imperial" + "&APPID=2f0d7745f820d66ebaf17295dbd69c5b",
               type: "GET",
           }).then(function(response){
                document.getElementById('displaycity').innerHTML = city;
                var icon = response.weather[0].icon;
                var iconURL = 'http://openweathermap.org/img/w/'

                var latitude = response.coord.lat;
                var longitude = response.coord.lon;
                console.log(longitude);


                $.ajax( {
                    url: "http://api.openweathermap.org/data/2.5/uvi?=" 
                        + "&APPID=2f0d7745f820d66ebaf17295dbd69c5b" 
                        + "&lat=" + latitude
                        + "&lon=" + longitude,
                        type: "GET",
                }).then(function(secondResponse){
                
                console.log(secondResponse);
                $('.uvIndex').text('UV Index: ' + secondResponse.value);
                });


        
            //generating text to the page
                $('#wicon').attr('src', 'http://openweathermap.org/img/w/' + icon + '.png');   
                $('.cityName').html('<h2>' + response.name + "</h1>" );
                $('.temp').text(response.main.temp +'°F');
                $('.humidity').text('Humidity: ' + response.main.humidity + '%');
                $('.wind').text('Wind Speed: ' + response.wind.speed + ' MPH');
                
            

    })
       }
       else  {
           $("error").html('Field cannot be empty');
       }
    });
    });




            
        



    (function()
    {
      var NowMoment = moment().format("ll");
      
      
      var eDisplayMoment = document.getElementById('displayMoment');
      eDisplayMoment.innerHTML = NowMoment;
      
    })();

    one = document.getElementById('one');
    two = document.getElementById('two');
    three = document.getElementById('three');
    four = document.getElementById('four');
    five = document.getElementById('five');

    const formatDate = (d) => {
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        return d.toLocaleDateString("en-US", options).replace(',','');
      }
      const tomorrow = new Date()
      tomorrow.setDate(new Date().getDate() + 1);
      one.innerHTML = (formatDate(tomorrow));
      tomorrow.setDate(tomorrow.getDate() + 1);
      two.innerHTML = (formatDate(tomorrow));
      tomorrow.setDate(tomorrow.getDate() + 1);
      three.innerHTML = (formatDate(tomorrow));
      tomorrow.setDate(tomorrow.getDate() + 1);
      four.innerHTML = (formatDate(tomorrow));
      tomorrow.setDate(tomorrow.getDate() + 1);
      five.innerHTML = (formatDate(tomorrow)); 
    
    
