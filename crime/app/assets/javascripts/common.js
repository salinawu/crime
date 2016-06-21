$(function () {
    $('#timepickerstart').datetimepicker({
    	format: 'MM/DD/YYYY'
    });
    $('#timepickerend').datetimepicker({
    	format: 'MM/DD/YYYY',
        useCurrent: false //Important! See issue #1075
    });
    $("#timepickerstart").on("dp.change", function (e) {
        $('#timepickerend').data("DateTimePicker").minDate(e.date);
    });
    $("#timepickerend").on("dp.change", function (e) {
        $('#timepickerstart').data("DateTimePicker").maxDate(e.date);
    });
});

var map;
var marker_geocoder;
var markersArray = [];

function clearOverlays() {
  for (i in markersArray) markersArray[i].setMap(null); markersArray = [];
}

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 41.79, lng: -87.6},
    zoom: 15
  });
  marker_geocoder = new google.maps.Geocoder();
}

function addMarker(map, marker_geocoder, crime) {
  marker_geocoder.geocode({'address': crime["Location"] + " Chicago 60637"}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      var marker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location
      });

      var infowindow = new google.maps.InfoWindow({
        content: generateInfoString(crime["Incident"], crime["Location"],
          crime["Time"], crime["Comments"], crime["Disposition"]),
        maxWidth: 200
      });

      marker.addListener('click', function() {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
          infowindow.close();
        } else {
          infowindow.open(map, marker);
        }
      });

      markersArray.push(marker);

    } else if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
      setTimeout(function() { addMarker(map, marker_geocoder, crime) }, 100);
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
}

function markAddresses(map, marker_geocoder, addresses) {
  for (var i = 0; i < addresses.length; i++) {
    addMarker(map, marker_geocoder, addresses[i]);
  }
}

function generateInfoString(incid, loc, time, comm, disposit) {
  return "<div id='infobox'><h5>" + incid + "</h5>"
    + "<span class='infolabel'>Location: </span> <div class='infocontent'>" + loc + "</div> </ br>"
    + "<span class='infolabel'>Time: </span> <div class='infocontent'>" + time + "</div> </ br>"
    + "<span class='infolabel'>Comments: </span> <div class='infocontent'>" + comm + "</div> </ br>"
    + "<span class='infolabel'>Status: </span> <div class='infocontent'>" + disposit + "</div> </ br>"
    +  "</div>";
}

class GSC {
  constructor(long, lat) {
    this.long = long;
    this.lat = lat;
  }

  degreesToRadians(deg) {
    return deg * (Math.PI / 180);
  }

  isWithInPointFourMiles(other, dist) {
    return  ( 3959 * Math.acos( Math.cos( this.degreesToRadians(this.lat) ) * Math.cos( this.degreesToRadians(other.lat) ) *
      Math.cos( this.degreesToRadians(other.long) - this.degreesToRadians(this.long) ) +
      Math.sin( this.degreesToRadians(this.lat) ) * Math.sin( this.degreesToRadians(other.lat) ) ) ) <= dist;
  }
}

//returns a GSC object with longitude and latitude for specified address
function getLongLat(crime, targetGSC) {
  marker_geocoder.geocode({'address': crime["Location"] + " Chicago 60637"}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      var curGSC = new GSC(results[0].geometry.location.lng(), results[0].geometry.location.lat());
      if (targetGSC.isWithInPointFourMiles(curGSC, .4)) {
        var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
        });
        var infowindow = new google.maps.InfoWindow({
          content: generateInfoString(crime["Incident"], crime["Location"],
            crime["Time"], crime["Comments"], crime["Disposition"])
        });
        marker.addListener('click', function() {
          infowindow.open(map, marker);
        });

        markersArray.push(marker);
      }
    } else if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
      setTimeout(function() { getLongLat(crime, targetGSC) }, 100);
    }
  });
}

//bc UCPD's data is forever messed up. must check that crimes are not void or empty
function isValidEntry(crime) {
  return !crime["Location"] ||
        (crime["Location"] && crime["Location"].indexOf(":") === -1 &&
          crime["Location"].toLowerCase().indexOf("void") === -1);
}

function markWithinXDist(addresses, targetAddress) {

  if (addresses.length == 0) {
    $("#notes").html("<h5>A crime-free time! </br> (At least around here.) </h5>");
  } else {

    marker_geocoder.geocode({'address': targetAddress + " Chicago 60637"}, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        var targetGSC = new GSC(results[0].geometry.location.lng(), results[0].geometry.location.lat());
        if (typeof targetGSC !== undefined) {
          for (var i = 0; i < addresses.length; i++) {
            // if (isValidEntry(addresses[i])) {
               getLongLat(addresses[i], targetGSC);
            // }
          }
        }
      }
    });
  }
}

$(document).ready(function() {

    $("#submit").on("click", function(event) {
      event.preventDefault();
      $("#notes").empty();

      $.post($("#form").attr("action"), $("#form").serialize(), function(data) {

        if (data.hasOwnProperty("notes")) {
          $("#notes").html(data["notes"]);
        } else if (data.hasOwnProperty("addresses")) {
          clearOverlays();
          markWithinXDist(data["addresses"], document.getElementById("address").value);
        } else {
          clearOverlays();
          $.each(data, function(index, addressses) {
            addMarker(map, marker_geocoder, data[index]);
          });
        }

      }, "json");
    });

    $("#footer-toggle").on("click", function() {
       $("#footer").toggle();
    });
});

function toggle_note() {
	var element = document.getElementById("toggle");
	var text = document.getElementById("text");
	if(element.style.display == "block") {
    		element.style.display = "none";
		text.innerHTML = "Note";
  	}
	else {
		element.style.display = "block";
		text.innerHTML = "Hide note";
	}
}

function toggle_info() {
	var why = document.getElementById("why");
	var info = document.getElementById("info");
	if(why.style.display == "block") {
    		why.style.display = "none";
		info.innerHTML = "Why was this created?";
  	}
	else {
		why.style.display = "block";
		info.innerHTML = "Hide info";
	}
}
