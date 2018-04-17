
/*
Integration for Google Maps in the django admin.

How it works:

You have an address field on the page.
Enter an address and an on change event will update the map
with the address. A marker will be placed at the address.
If the user needs to move the marker, they can and the geolocation
field will be updated.

Only one marker will remain present on the map at a time.

This script expects:

<input type="text" name="address" id="id_address" />
<input type="text" name="geolocation" id="id_geolocation" />

<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"></script>

*/

function googleMapAdmin2() {

    var autocomplete;
    var geocoder = new google.maps.Geocoder();
    var map;
    var marker;

    var geolocationId = 'id_geolocation';
    var addressId = 'id_address';

    var self = {
        initialize: function(initData) {
            //var lat = 0;
            //var lng = 0;
            //var zoom = 2;

            var lat = 7.078179;
            var lng = -73.108048;
            var zoom = 12;
            // set up initial map to be world view. also, add change
            // event so changing address will update the map
            var existinglocation = self.getExistingLocation();

            if (existinglocation) {
                lat = existinglocation[0];
                lng = existinglocation[1];
                zoom = 18;
            }

            var latlng = new google.maps.LatLng(lat,lng);

            // Plot markers in existing locations
            for (var i in initData)
            {
                var lat_in = initData[i].lat;
                var lon_in = initData[i].lon;
                console.log(lat_in);
                console.log(lon_in);
                var lalo = new google.maps.LatLng(lat_in,lon_in);
                self.addOldMarkers(lalo);
            }


            var myOptions = {
              zoom: zoom,
              center: latlng,
              mapTypeId: self.getMapType()
            };
            map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
            if (existinglocation) {
                self.setMarker(latlng);
            }

            autocomplete = new google.maps.places.Autocomplete(
                /** @type {!HTMLInputElement} */(document.getElementById(addressId)),
                {types: ['geocode']});

            // this only triggers on enter, or if a suggested location is chosen
            // todo: if a user doesn't choose a suggestion and presses tab, the map doesn't update
            autocomplete.addListener("place_changed", self.codeAddress);

            // don't make enter submit the form, let it just trigger the place_changed event
            // which triggers the map update & geocode
            $("#" + addressId).keydown(function (e) {
                if (e.keyCode == 13) {  // enter key
                    e.preventDefault();
                    return false;
                }
            });
        },



        getMapType : function() {
            // https://developers.google.com/maps/documentation/javascript/maptypes
            var geolocation = document.getElementById(addressId);
            var allowedType = ['roadmap', 'satellite', 'hybrid', 'terrain'];
            var mapType = geolocation.getAttribute('data-map-type');

            if (mapType && -1 !== allowedType.indexOf(mapType)) {
                return mapType;
            }

            return google.maps.MapTypeId.HYBRID;
        },

        getExistingLocation: function() {
            var geolocation = document.getElementById(geolocationId).value;
            console.log("LA CLAVE");
            console.log(geolocation);
            if (geolocation) {
                return geolocation.split(',');
            }
        },

        codeAddress: function() {
            var place = autocomplete.getPlace();

            if(place.geometry !== undefined) {
                self.updateWithCoordinates(place.geometry.location);
            }
            else {
                geocoder.geocode({'address': place.name}, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        var latlng = results[0].geometry.location;
                        self.updateWithCoordinates(latlng);
                    } else {
                        alert("Geocode was not successful for the following reason: " + status);
                    }
                });
            }
        },

        updateWithCoordinates: function(latlng) {
            map.setCenter(latlng);
            map.setZoom(18);
            self.setMarker(latlng);
            self.updateGeolocation(latlng);
        },

        setMarker: function(latlng) {
            if (marker) {
                self.updateMarker(latlng);
            } else {
                self.addMarker({'latlng': latlng, 'draggable': true});
            }
        },



        addMarker: function(Options) {
            marker = new google.maps.Marker({
                map: map,
                position: Options.latlng
            });

            var draggable = Options.draggable || false;
            if (draggable) {
                self.addMarkerDrag(marker);
            }
        },

        addOldMarkers: function(lalo) {
            console.log("ENTRO");
            var marker2 = new google.maps.Marker({
                map: map,
                position: lalo
            });

            google.maps.event.addListener(marker2,"click",function (event){
                infoWindow.setContent(this.position);
                infoWindow.open(map, this);
            });

            // var draggable = Options.draggable || false;
            // if (draggable) {
            //     self.addMarkerDrag(marker);
            // }
        },

        addMarkerDrag: function() {
            marker.setDraggable(true);
            google.maps.event.addListener(marker, 'dragend', function(new_location) {
                self.updateGeolocation(new_location.latLng);
            });
        },

        updateMarker: function(latlng) {
            marker.setPosition(latlng);
        },

        updateGeolocation: function(latlng) {
            document.getElementById(geolocationId).value = latlng.lat() + "," + latlng.lng();
            $("#" + geolocationId).trigger('change');
        }
    };

    return self;
}


function googleMapAdmin()
{

    var geolocationId = 'id_geolocation';
    var markerAdded = false;
    var self = {
        initialize: function(initData) {

            var lat = 7.078179;
            var lng = -73.108048;
            var zoom = 12;


            var latlng = new google.maps.LatLng(lat,lng);

            var myOptions = {
              zoom: zoom,
              center: latlng
            };

            map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

            map.addListener("click", function(event) {
                // get lat/lon of click

                if(!markerAdded)
                {
                    var clickLat = event.latLng.lat();
                    var clickLon = event.latLng.lng();

 
                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(clickLat,clickLon),
                        map: map
                    });

                    self.updateGeolocation(marker.position);
                    self.addMarkerDrag(marker);

                    markerAdded = true;
                }

            });

            // Plot markers in existing locations
            self.addOldMarkers(map,initData);
 


            

        },

        addOldMarkers: function(map, initData) {
            console.log("ENTRO");

            for (var i in initData)
            {
                var lat_in = initData[i].lat;
                var lon_in = initData[i].lon;
                console.log(lat_in);
                console.log(lon_in);
                var marker = new google.maps.Marker({
                    position: {lat: lat_in, lng: lon_in},
                    map: map,
                });

            }

        },

        addMarkerDrag: function(marker) {
            marker.setDraggable(true);
            google.maps.event.addListener(marker, 'dragend', function(new_location) {
                self.updateGeolocation(new_location.latLng);
            });
        },

        updateMarker: function(latlng,marker) {
            marker.setPosition(latlng);
        },

        updateGeolocation: function(latlng) {
            document.getElementById(geolocationId).value = latlng.lat() + "," + latlng.lng();
            $("#" + geolocationId).trigger('change');
        },

        };

    return self;
}













$(document).ready(function() {

    console.log("Aqui");
        axios.get('../../../../../getActivos/').then(function (response) { 
        this.initData = response.data;
        console.log(this.initData);
        var googlemap = googleMapAdmin();
        googlemap.initialize(this.initData);
        console.log("Hiiiieeeeerrrr");
    }); 

        //Falta incluir axios, hacer la URL, el controlador, sacar lat, long y tipo de cada activo desde la db, buscar iconos para representar cada uno
    //var googlemap = googleMapAdmin();
    //googlemap.initialize();
    //console.log("Hiiiieeeeerrrr");
});














function googleMapAdmin3() {

    var self = {
        initialize: function(initData) {
            
        },



        
    };

    return self;
}