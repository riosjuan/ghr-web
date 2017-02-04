/**
 * Created by Juan Rios on 25/11/2016.
 */


// decending sort
$.fn.extend({
    sortSelect() {
        let options = $(this).find("option"),
            arr = options.map(function(_, o) { return { t: $(o).text(), v: o.value }; }).get();

        arr.sort((o1, o2) => { // sort select
            let t1 = o1.t.toLowerCase(),
            t2 = o2.t.toLowerCase();
        return t1 > t2 ? 1 : t1 < t2 ? -1 : 0;
    });

        options.each((i, o) => {
            o.value = arr[i].v;
        $(o).text(arr[i].t);
    });
    }
});


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
                .text(value.name)).sortSelect();
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

    let now = new Date(Date.now());
        formated = now.getHours();

        console.log("Hour " + formated)

    if (formated > 18 ) {
        $('body').removeClass().addClass("night-gradient"); // Night
        console.log("Night");
    } else if (formated > 5 ) {
        $('body').removeClass().addClass("day-gradient"); // Day
        console.log("Day");
    } else {
        $('body').removeClass().addClass("night-gradient"); // Night
        console.log("Night");
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

    console.log(locatie);
    console.log(pressureBar);
    console.log(pressureBar > 100.914 && pressureBar < 101.9148 && rain > 0);
    console.log(rain);
    console.log(currentTemp.text());

    $("#temperature").html(Math.round(currentTemp.text())).append("&#x2103;");
    $("#date").html(currentDate).prepend("Laaste update: ");
    $("#station").html(locatie).prepend("📍");

        // Very light rain
    if (pressureBar > 100.914 && pressureBar < 101.9148 && rain < 0.05) { //102.269
        $("#forecast").html("Misschien");
        $("#forecast-sub").html("Het kan een klein beetje regen vallen in de komende uur");

        // Light rain
    } else if (pressureBar > 100.914 && pressureBar < 101.9148 && rain < 2.5) {
        $("#forecast").html("Ja");
        $("#forecast-sub").html("Er is licht regen verwacht in de komende uur");

        // Moderate rain
    } else if (pressureBar > 100.914 && pressureBar < 101.9148 && rain > 2.5 && rain < 7.6  ) {
        $("#forecast").html("Ja");
        $("#forecast-sub").html("Er is matige regen verwacht in de komende uur");

        // Heavy rain
    }  else if (pressureBar > 100.914 && pressureBar < 101.9148 && rain > 7.6 && rain < 50  ) {
        $("#forecast").html("Ja");
        $("#forecast-sub").html("Er is zware regen verwacht in de komende uur");

        // Violent rain
    } else if (pressureBar > 100.914 && pressureBar < 101.9148 && rain > 50  ) {
        $("#forecast").html("Ja");
        $("#forecast-sub").html("Er is heftige regen verwacht in de komende uur");

        // No rain
    } else {
        $("#forecast").html("Nee");
        $("#forecast-sub").html("Er is geen regen verwacht in de komende uur");
    }

}