/**
 * Created by juanrios on 25/11/2016.
 */
$(document).ready(function(){

    // check for Geolocation support
    if (navigator.geolocation) {
        console.log('Geolocation is supported!');
    }
    else {
        console.log('Geolocation is not supported for this Browser/OS.');
    }

    window.onload = function() {
        var startPos;
        var geoSuccess = function(position) {
            startPos = position;
            document.getElementById('startLat').innerHTML = startPos.coords.latitude;
            document.getElementById('startLon').innerHTML = startPos.coords.longitude;
        };
        navigator.geolocation.getCurrentPosition(geoSuccess);
        console.log();
    };


    /*Background color*/

    ///////////////////////////

    var now = new Date(Date.now());
    formatted = now.getHours();

    if (formatted > 17) { // Night
        $('body').removeClass();
        $('body').addClass("night-gradient");
    } else { // Day
        $('body').removeClass();
        $('body').addClass("day-gradient");
    }

    ///////////////////////////



    function parse(xml){

        var xmlDoc = $.parseXML( xml ),
            $xml = $( xmlDoc );

        var currentTemp = $xml.find("weerstation#6344 > temperatuurGC"); // Current temperature
        currentDate = $xml.find("weerstation#6344 > datum"); // Current date
        city = $xml.find("weerstation#6344 > stationnaam").text();
        pressure = $xml.find("weerstation#6344 > luchtdruk"); // Current atmospheric pressure
        rain = $xml.find("weerstation#6344 > regenMMPU").text(); // Rain index
        bar = 10;
        pressureBar = pressure.text() / bar; // Converts hPa to kPa

        console.log(pressureBar);
        console.log(pressureBar > 100.914 && pressureBar < 101.9148 && rain > 0);
        console.log(rain);
        console.log(city);

        $("#temperature").html(Math.round(currentTemp.text())).append("&#x2103;");
        $("#date").html(currentDate).prepend("Laaste update: ");

        if (pressureBar < 100.914) {
            $("#forecast").html("storm");
        } else if (pressureBar > 100.914 && pressureBar < 101.9148 && rain < 0.05) { //102.269
            $("#forecast").html("it might rain");
        } else if (pressureBar > 100.914 && pressureBar < 101.9148 && rain < 2.5) {
            $("#forecast").html("Light rain");
        } else if (pressureBar > 100.914 && pressureBar < 101.9148 && rain > 2.5 && rain < 7.6  ) {
            $("#forecast").html("Moderate rain");
        }  else if (pressureBar > 100.914 && pressureBar < 101.9148 && rain > 7.6 && rain < 50  ) {
            $("#forecast").html("Heavy rain");
        } else if (pressureBar > 100.914 && pressureBar < 101.9148 && rain > 50  ) {
            $("#forecast").html("Yes");
            $("#forecast-sub").html("There is violent rain expected in the next two hours");
        } else {
            $("#forecast").html("No");
            $("#forecast-sub").html("There is not rain expected in the next two hours");
        }
    }


    $.ajax({
        url: 'https://xml.buienradar.nl/', // name of file you want to parse
        dataType: "text",
        success: parse,
        error: function(){alert("Error: Oops! something went wrong");}
    });
});