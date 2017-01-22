var map;
  var directionDisplay;
  var directionsService;
  var stepDisplay;
  var markerArray = [];
  var position;
  var marker = null;
  var polyline = null;
  var poly2 = null;
  var speed = 0.0000005, wait = 1;
  var infowindow = null;
  
    var myPano;   
    var panoClient;
    var nextPanoId;
  var timerHandle = null;
  var passengers = '{"data" : [' +
  '{"name" : "Dahlia", "currentlat" : 38.569413, "currentlong" : -121.767905, "destlat" : 37.784043, "destlong": -122.399297},' +
  '{"name" : "Nausheen", "currentlat" : 38.253451, "currentlong" : -122.045822, "destlat": 37.784043, "destlong": -122.399297},' +
  '{"name" : "Phoenix", "currentlat": 38.569413, "currentlong": -121.767905, "destlat" : 38.253451, "destlong" : -122.045822},' +
  '{"name" : "Yoke", "currentlat": 38.108624, "currentlong": -122.246387, "destlat" : 37.784043, "destlong" : -122.399297},' +
  '{"name" : "Mary", "currentlat" : 38.194672, "currentlong": -122.186855, "destlatitude" : 37.784043, "destlong" : -122.399297},' +
  '{"name" : "Lily", "currentlat" : 37.846425, "currentlong" : -122.292675,  "destlat" : 37.784043, "destlong": -122.399297},' +
  '{"name" : "Andrew", "currentlat" : 37.846425, "currentlong": -122.292675, "destlat" : 37.784043, "destlong" : -122.399297},' +
  '{"name" : "Christopher", "currentlat" : 37.253222, "currentlong" : -121.956809, "destlat": 37.784043, "destlong": -122.399297},' +
  '{"name" : "Zaidi", "currentlat" : 37.885081, "currentlong" : -122.307821, "destlat": 37.784043, "destlong": -122.399297},' +
  '{"name" : "Vicky", "currentlat" : 37.885081, "currentlong" : -122.307821, "destlat" : 37.784043, "destlong": -122.399297},' +
  '{"name" : "Andy", "currentlat": 38.539781, "currentlong": -121.736101, "destlat" : 37.784043, "destlong" : -122.399297},' +
  '{"name" : "Betsy", "currentlat": 38.569413, "currentlong": -121.767905, "destlatitude" : 37.784043, "destlongitude" : -122.399297},' +
  '{"name" : "Danny", "currentlat" : 38.569413, "currentlong" : -121.767905, "destlat" : 37.784043, "destlongitude": -122.399297},' +
  '{"name" : "Mia", "currentlat" : 38.470324, "currentlong" : -121.831044, "destlat" : 37.784043, "destlongitude": -122.399297}' +
']}';
  var obj = JSON.parse(passengers);

function createMarker(latlng, label, html) {
// alert("createMarker("+latlng+","+label+","+html+","+color+")");
    var contentString = '<b>'+label+'</b><br>'+html;
    var marker = new google.maps.Marker({
        position: latlng,
        map: map,
        title: label,
        zIndex: Math.round(latlng.lat()*-100000)<<5
        //icon: 'images/CarMarker.png'
        });
        marker.myname = label;
        // gmarkers.push(marker);

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(contentString); 
        infowindow.open(map,marker);
        });
    return marker;
}


function initialize() {
  infowindow = new google.maps.InfoWindow(
    { 
      size: new google.maps.Size(150,50)
    });
    // Instantiate a directions service.
    directionsService = new google.maps.DirectionsService();
    
    // Create a map and center it on Manhattan.
    var myOptions = {
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

    address = 'new york'
    geocoder = new google.maps.Geocoder();
	geocoder.geocode( { 'address': address}, function(results, status) {
       map.setCenter(results[0].geometry.location);
	});
    
    // Create a renderer for directions and bind it to the map.
    var rendererOptions = {
      map: map
    }
    directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
    
    // Instantiate an info window to hold step text.
    stepDisplay = new google.maps.InfoWindow();

    polyline = new google.maps.Polyline({
	path: [],
	strokeColor: '#FF0000',
	strokeWeight: 3
    });
    poly2 = new google.maps.Polyline({
	path: [],
	strokeColor: '#FF0000',
	strokeWeight: 3
    });
  }

  
  
	var steps = []

	function calcRoute(){

if (timerHandle) { clearTimeout(timerHandle); }
if (marker) { marker.setMap(null);}
polyline.setMap(null);
poly2.setMap(null);
directionsDisplay.setMap(null);
    polyline = new google.maps.Polyline({
	path: [],
	strokeColor: '#FF0000',
	strokeWeight: 3
    });
    poly2 = new google.maps.Polyline({
	path: [],
	strokeColor: '#FF0000',
	strokeWeight: 3
    });
    // Create a renderer for directions and bind it to the map.
    var rendererOptions = {
      map: map
    }
directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);

	    var start = document.getElementById("start").value;
	    var end = document.getElementById("end").value;
		var travelMode = google.maps.DirectionsTravelMode.DRIVING;

	    var request = {
	        origin: start,
	        destination: end,
	        travelMode: travelMode
	    };

		// Route the directions and pass the response to a
		// function to create markers for each step.
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK){
	directionsDisplay.setDirections(response);

        var bounds = new google.maps.LatLngBounds();
        var route = response.routes[0];
        startLocation = new Object();
        endLocation = new Object();

        // For each route, display summary information.
	var path = response.routes[0].overview_path;
	var legs = response.routes[0].legs;
        for (i=0;i<legs.length;i++) {
          if (i == 0) { 
            startLocation.latlng = legs[i].start_location;
            startLocation.address = legs[i].start_address;
            // marker = google.maps.Marker({map:map,position: startLocation.latlng});
            marker = createMarker(legs[i].start_location,"start",legs[i].start_address,"green");
          }
          endLocation.latlng = legs[i].end_location;
          endLocation.address = legs[i].end_address;
          var steps = legs[i].steps;
          for (j=0;j<steps.length;j++) {
            var nextSegment = steps[j].path;
            for (k=0;k<nextSegment.length;k++) {
              polyline.getPath().push(nextSegment[k]);
              bounds.extend(nextSegment[k]);



            }
          }
        }

        polyline.setMap(map);
        map.fitBounds(bounds);
//        createMarker(endLocation.latlng,"end",endLocation.address,"red");
	map.setZoom(18);
	startAnimation();
    }                                                    
 });
}
  

  
      var step = 50; // 5; // metres
      var tick = 100; // milliseconds
      var eol;
      var k=0;
      var stepnum=0;
      var speed = "";
      var lastVertex = 1;


//=============== animation functions ======================
      function updatePoly(d) {
        // Spawn a new polyline every 20 vertices, because updating a 100-vertex poly is too slow
        if (poly2.getPath().getLength() > 20) {
          poly2=new google.maps.Polyline([polyline.getPath().getAt(lastVertex-1)]);
          // map.addOverlay(poly2)
        }

        if (polyline.GetIndexAtDistance(d) < lastVertex+2) {
           if (poly2.getPath().getLength()>1) {
             poly2.getPath().removeAt(poly2.getPath().getLength()-1)
           }
           poly2.getPath().insertAt(poly2.getPath().getLength(),polyline.GetPointAtDistance(d));
        } else {
          poly2.getPath().insertAt(poly2.getPath().getLength(),endLocation.latlng);
        }
      }


      function animate(d) {
// alert("animate("+d+")");
        if (d>eol) {
          map.panTo(endLocation.latlng);
          marker.setPosition(endLocation.latlng);
          return;
        }
        var p = polyline.GetPointAtDistance(d);
        map.panTo(p);
        marker.setPosition(p);
        updatePoly(d);
        setPassengers(p.lat(), p.lng());
        //alert(typeof(p.lat()));
        timerHandle = setTimeout("animate("+(d+step)+")", tick);
      }

function setPassengers(latitude, longitude) {
    var driverLatLng = {lat: latitude, lng: longitude};
    var destination = {lat: 37.784043, lng: -122.399297};

    var json = getPassengers(driverLatLng, destination);
    for (var i = 0; i<json.length;i++) {
        var passLatLng = {lat: json[i].currentlat, lng: json[i].currentlong};
        var button = '<div class="thumbnail">'+
                        '<img src="..." alt="...">'+
                        '<div class="caption">'+
                            '<h3>'+ json[i].name +'</h3>'+
                            '<p>UC Davis student.</p>'+
                            '<p><a href="#" class="btn btn-primary" role="button">Accept</a></p>'+
                        '</div>'+
    '               </div>';
    var infowindow = new google.maps.InfoWindow({
          content: button
        });

        
    var marker = new google.maps.Marker({
          position: passLatLng,
          map: map,
          title: 'Hello World!'
        });
    marker.addListener('click', function() {
          infowindow.open(map, marker);
        });
    }
    
}

function getPassengers(driverLatLng, destination) {
    var arr = [];
    for (var i = 0; i < obj.data.length; i++) {
        if (Math.abs(driverLatLng.lat - obj.data[i].currentlat) < 0.1 && Math.abs(driverLatLng.lng - obj.data[i].currentlong) < 0.1 && Math.abs(destination.lat - obj.data[i].destlat) < 0.8 && Math.abs(destination.lng - obj.data[i].destlong) < 0.8) {
            arr.push(obj.data[i]);
        }
    }
    return arr;
}

function startAnimation() {
        eol=google.maps.geometry.spherical.computeLength(polyline.getPath());
        map.setCenter(polyline.getPath().getAt(0));
        // map.addOverlay(new google.maps.Marker(polyline.getAt(0),G_START_ICON));
        // map.addOverlay(new GMarker(polyline.getVertex(polyline.getVertexCount()-1),G_END_ICON));
        // marker = new google.maps.Marker({location:polyline.getPath().getAt(0)} /* ,{icon:car} */);
        // map.addOverlay(marker);
        poly2 = new google.maps.Polyline({path: [polyline.getPath().getAt(0)], strokeColor:"#0000FF", strokeWeight:10});
        // map.addOverlay(poly2);
        setTimeout("animate(50)",2000);  // Allow time for the initial map display
}


//=============== ~animation funcitons =====================


google.maps.event.addDomListener(window, "load", initialize);
/*********************************************************************\
*                                                                     *
* epolys.js                                          by Mike Williams *
* updated to API v3                                  by Larry Ross    *
*                                                                     *
* A Google Maps API Extension                                         *
*                                                                     *
* Adds various Methods to google.maps.Polygon and google.maps.Polyline *
*                                                                     *
* .Contains(latlng) returns true is the poly contains the specified   *
*                   GLatLng                                           *
*                                                                     *
* .Area()           returns the approximate area of a poly that is    *
*                   not self-intersecting                             *
*                                                                     *
* .Distance()       returns the length of the poly path               *
*                                                                     *
* .Bounds()         returns a GLatLngBounds that bounds the poly      *
*                                                                     *
* .GetPointAtDistance() returns a GLatLng at the specified distance   *
*                   along the path.                                   *
*                   The distance is specified in metres               *
*                   Reurns null if the path is shorter than that      *
*                                                                     *
* .GetPointsAtDistance() returns an array of GLatLngs at the          *
*                   specified interval along the path.                *
*                   The distance is specified in metres               *
*                                                                     *
* .GetIndexAtDistance() returns the vertex number at the specified    *
*                   distance along the path.                          *
*                   The distance is specified in metres               *
*                   Returns null if the path is shorter than that      *
*                                                                     *
* .Bearing(v1?,v2?) returns the bearing between two vertices          *
*                   if v1 is null, returns bearing from first to last *
*                   if v2 is null, returns bearing from v1 to next    *
*                                                                     *
*                                                                     *
***********************************************************************
*                                                                     *
*   This Javascript is provided by Mike Williams                      *
*   Blackpool Community Church Javascript Team                        *
*   http://www.blackpoolchurch.org/                                   *
*   http://econym.org.uk/gmap/                                        *
*                                                                     *
*   This work is licenced under a Creative Commons Licence            *
*   http://creativecommons.org/licenses/by/2.0/uk/                    *
*                                                                     *
***********************************************************************
*                                                                     *
* Version 1.1       6-Jun-2007                                        *
* Version 1.2       1-Jul-2007 - fix: Bounds was omitting vertex zero *
*                                add: Bearing                         *
* Version 1.3       28-Nov-2008  add: GetPointsAtDistance()           *
* Version 1.4       12-Jan-2009  fix: GetPointsAtDistance()           *
* Version 3.0       11-Aug-2010  update to v3                         *
*                                                                     *
\*********************************************************************/


google.maps.LatLng.prototype.latRadians = function() {
  return this.lat() * Math.PI/180;
}

google.maps.LatLng.prototype.lngRadians = function() {
  return this.lng() * Math.PI/180;
}


// === A method which returns a GLatLng of a point a given distance along the path ===
// === Returns null if the path is shorter than the specified distance ===
google.maps.Polyline.prototype.GetPointAtDistance = function(metres) {
  // some awkward special cases
  if (metres == 0) return this.getPath().getAt(0);
  if (metres < 0) return null;
  if (this.getPath().getLength() < 2) return null;
  var dist=0;
  var olddist=0;
  for (var i=1; (i < this.getPath().getLength() && dist < metres); i++) {
    olddist = dist;
    dist += google.maps.geometry.spherical.computeDistanceBetween(this.getPath().getAt(i),this.getPath().getAt(i-1));
  }
  if (dist < metres) {
    return null;
  }
  var p1= this.getPath().getAt(i-2);
  var p2= this.getPath().getAt(i-1);
  var m = (metres-olddist)/(dist-olddist);
  return new google.maps.LatLng( p1.lat() + (p2.lat()-p1.lat())*m, p1.lng() + (p2.lng()-p1.lng())*m);
}

// === A method which returns the Vertex number at a given distance along the path ===
// === Returns null if the path is shorter than the specified distance ===
google.maps.Polyline.prototype.GetIndexAtDistance = function(metres) {
  // some awkward special cases
  if (metres == 0) return this.getPath().getAt(0);
  if (metres < 0) return null;
  var dist=0;
  var olddist=0;
  for (var i=1; (i < this.getPath().getLength() && dist < metres); i++) {
    olddist = dist;
    dist += google.maps.geometry.spherical.computeDistanceBetween(this.getPath().getAt(i),this.getPath().getAt(i-1));
  }
  if (dist < metres) {return null;}
  return i;
}








