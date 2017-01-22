var map;

var dCurLat = 38.552165;
var dCurLong = -121.742714;
var dDesLat = 37.731325;
var dDesLong = -122.443098;
    
var interval = 80;

function setMap() {
    map = new google.maps.Map(document.getElementById('googleMap'), {
        zoom: 9,
        center: {lat: 37.013411, lng: -121.604306},  // Brooklyn.
        disableDefaultUI: true,
        mapTypeControlOptions: {
            mapTypeIds: [google.maps.MapTypeId.ROADMAP]
        }
    });

    //map.mapTypes.set(customMapTypeId, customMapType);
    //map.setMapTypeId(customMapTypeId);
    
    
    // Create the search box and link it to the UI element.
        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(document.getElementById('search-input'));
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
          searchBox.setBounds(map.getBounds());
        });
        
        var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
          var places = searchBox.getPlaces();

          if (places.length === 0) {
            return;
          }

          // Clear out the old markers.
          markers.forEach(function(marker) {
            marker.setMap(null);
          });
          markers = [];

          // For each place, get the icon, name and location.
          var bounds = new google.maps.LatLngBounds();
          places.forEach(function(place) {
            var icon = {
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
              map: map,
              icon: icon,
              title: place.name,
              position: place.geometry.location
            }));

            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          map.fitBounds(bounds);
        });

        addPassengers();
}

function addPassengers() {
    //var json = getPassengers():
    
    var myLatLng = {lat: 37.310820, lng: -121.940776};

    var button = '<button type="button" class="btn btn-success" onclick="myFunction()">Accept</button>';
    var infowindow = new google.maps.InfoWindow({
          content: button
        });

        
    var marker = new google.maps.Marker({
          position: myLatLng,
          map: map,
          title: 'Hello World!'
        });
    marker.addListener('click', function() {
          infowindow.open(map, marker);
        });
}


function getDriver() {

    
    
}


