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
          crime["Time"], crime["Comments"], crime["Disposition"])
      });
      marker.addListener('click', function() {
        infowindow.open(map, marker);
      });

      markersArray.push(marker);

      // google.maps.event.addListener(marker,"click",function(){});

    } else if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
      setTimeout(function() { addMarker(map, marker_geocoder, crime) }, 200);
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

  isWithInPointFourMiles(other) {
    return  ( 3959 * Math.acos( Math.cos( this.degreesToRadians(this.lat) ) * Math.cos( this.degreesToRadians(other.lat) ) * 
      Math.cos( this.degreesToRadians(other.long) - this.degreesToRadians(this.long) ) + 
      Math.sin( this.degreesToRadians(this.lat) ) * Math.sin( this.degreesToRadians(other.lat) ) ) ) <= .4;
  }
}

//returns a GSC object with longitude and latitude for specified address
function getLongLat(crime, targetGSC) {
  marker_geocoder.geocode({'address': crime["Location"] + " Chicago 60637"}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      var curGSC = new GSC(results[0].geometry.location.lng(), results[0].geometry.location.lat());
      if (targetGSC.isWithInPointFourMiles(curGSC)) {

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
      setTimeout(function() { getLongLat(crime["Location"]) }, 200);
    }
  });
}


function markWithinXDist(addresses, targetAddress) {

  if (addresses.length == 0) {
    $("#notes").html("<h5>A crime-free time! </br> (At least around here.) </h5>");
  } else {
    marker_geocoder.geocode({'address': targetAddress + " Chicago 60637"}, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        var targetGSC = new GSC(results[0].geometry.location.lng(), results[0].geometry.location.lat());
        for (var i = 0; i < addresses.length; i++) {
          if (addresses[i]["Location"] && addresses[i]["Location"].indexOf(":") === -1 && 
            addresses[i]["Location"].toLowerCase().indexOf("void") === -1) {
             getLongLat(addresses[i], targetGSC);
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

        if (data.hasOwnProperty("address")) {
          clearOverlays();
          addMarker(map, marker_geocoder, data["address"] + " Chicago 60637");
        } else if (data.hasOwnProperty("notes")) {
          $("#notes").html(data["notes"]);
        } else if (data.hasOwnProperty("searchaddr")) {
          clearOverlays();
          markWithinXDist(data["addresses"], data["searchaddr"]);
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
