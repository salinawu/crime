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

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 41.79, lng: -87.6},
    zoom: 15
  });

  // var geocoder = new google.maps.Geocoder();

  // document.getElementById('submit').addEventListener('click', function() {
  //   geocodeAddress(geocoder, map);
  // });

  marker_geocoder = new google.maps.Geocoder();
  var address = "5717 South Kimbark Ave. 60637";
  addMarker(map, marker_geocoder, address);

  // var crime_list = ["Chicago"];
  // for (var i = 0; i < crime_list.length; i++) {
  //   addMarker(map, marker_geocoder, crime_list[i]);
  // }
}

function addMarker(map, marker_geocoder, addr) {
  marker_geocoder.geocode({'address': addr}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      var marker = new google.maps.Marker({
        map: map,
        label: 'A',
        position: results[0].geometry.location
      });
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

function markAddresses(map, marker_geocoder, addresses) {
  for (var i = 0; i < addresses.length; i++) {
    addMarker(map, marker_geocoder, addresses[i]);
  }
}

function geocodeAddress(geocoder, resultsMap) {
  var address = document.getElementById('address').value;
  geocoder.geocode({'address': address}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      resultsMap.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
        map: resultsMap,
        position: results[0].geometry.location
      });
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

$(document).ready(function() {

    $("#submit").on("submit", function(event) {
      event.preventDefault();
      $.post($("#form").attr("action"), $("#form").serialize(), "JSON", function(data) {
        $.each(data, function(index, addressses) {
            addMarker(map, marker_geocoder, data[index]);
        });
    });
  });

});
