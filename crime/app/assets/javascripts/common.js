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

function addMarker(map, marker_geocoder, addr) {
  marker_geocoder.geocode({'address': addr}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      var marker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location
      });
      markersArray.push(marker);
      google.maps.event.addListener(marker,"click",function(){});
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

function markAddresses(map, marker_geocoder, addresses) {
  for (var i = 0; i < addresses.length; i++) {
    addMarker(map, marker_geocoder, addresses[i], i);
  }
}

$(document).ready(function() {

    $("#submit").on("click", function(event) {
        event.preventDefault();
        $.post($("#form").attr("action"), $("#form").serialize(), function(data) {

          if (data.hasOwnProperty("address")) {
            clearOverlays();
            addMarker(map, marker_geocoder, data["address"] + " Chicago 60637");
          } else if (data.hasOwnProperty("key_words")) {

          } else {
            clearOverlays();
            $.each(data, function(index, addressses) {
                addMarker(map, marker_geocoder, data[index]["Location"] + " Chicago 60637");
            });
          } 

        }, "json");
    });

});
