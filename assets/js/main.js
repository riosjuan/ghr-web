/**
 * Created by Juan Rios on 25/11/2016.
 */
// decending sort

function parse(xml){

    xmlDoc = $.parseXML(xml),
        $xml = $( xmlDoc );

    stationLoc = $xml.find("weerstations > weerstation").map(function() {
        return  {
            name: $(this).find("stationnaam").attr("regio"),
            id:  $(this).find("stationcode").text()
        }
    }).get();

    $.each(stationLoc, function(key, value) {
        $("#stations")
            .append($("<option></option>")
                .attr("value", value.id)
                .text(value.name));
    });
}

$(document).ready(function(){

    $.ajax({
        url: "https://xml.buienradar.nl/",
        dataType: "text",
        success: parse,
        error: function(){alert("Error: Oops! something went wrong");}
    });

    /*Background color*/

    var now = new Date(Date.now());
        formated = now.getHours();

        console.log("time " + formated)

    if (formated > 17 && formated < 6 ) {
        $('body').removeClass().addClass("night-gradient"); // Night
    } else {
        $('body').removeClass().addClass("day-gradient"); // Day
    }
});

function selectionLoc() {

    $("#infoCard").fadeIn(500);

    // var selectedLoc = $("#stations :selected").text();
        selectedID = $("#stations :selected").val();

    var currentTemp = $xml.find("weerstation#" + selectedID + "> temperatuurGC"); // Current temperature
        currentDate = $xml.find("weerstation#" + selectedID + "> datum"); // Current date
        locatie = $xml.find("weerstation#"+ selectedID + "> stationnaam").attr("regio");
        pressure = $xml.find("weerstation#" + selectedID + "> luchtdruk"); // Current atmospheric pressure
        rain = $xml.find("weerstation#" + selectedID + "> regenMMPU").text(); // Rain index
        bar = 10;
        pressureBar = pressure.text() / bar; // Converts hPa to kPa

    console.log(pressureBar);
    console.log(pressureBar > 100.914 && pressureBar < 101.9148 && rain > 0);
    console.log(rain);

    $("#temperature").html(Math.round(currentTemp.text())).append("&#x2103;");
    $("#date").html(currentDate).prepend("Last updated: ");
    $("#station").html(locatie).prepend("📍");


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
        $("#forecast-sub").html("There is no rain expected in the next two hours");
    }

}