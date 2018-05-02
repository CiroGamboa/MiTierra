
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

// function googleMapAdmin2() {

//     var autocomplete;
//     var geocoder = new google.maps.Geocoder();
//     var map;
//     var marker;

//     var geolocationId = 'id_geolocation';
//     var addressId = 'id_address';

//     var self = {
//         initialize: function(initData) {
//             //var lat = 0;
//             //var lng = 0;
//             //var zoom = 2;

//             var lat = 7.078179;
//             var lng = -73.108048;
//             var zoom = 12;
//             // set up initial map to be world view. also, add change
//             // event so changing address will update the map
//             var existinglocation = self.getExistingLocation();

//             if (existinglocation) {
//                 lat = existinglocation[0];
//                 lng = existinglocation[1];
//                 zoom = 18;
//             }

//             var latlng = new google.maps.LatLng(lat,lng);

//             // Plot markers in existing locations
//             for (var i in initData)
//             {
//                 var lat_in = initData[i].lat;
//                 var lon_in = initData[i].lon;
//                 console.log(lat_in);
//                 console.log(lon_in);
//                 var lalo = new google.maps.LatLng(lat_in,lon_in);
//                 self.addOldMarkers(lalo);
//             }


//             var myOptions = {
//               zoom: zoom,
//               center: latlng,
//               mapTypeId: self.getMapType()
//             };
//             map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
//             if (existinglocation) {
//                 self.setMarker(latlng);
//             }

//             autocomplete = new google.maps.places.Autocomplete(
//                 /** @type {!HTMLInputElement} */(document.getElementById(addressId)),
//                 {types: ['geocode']});

//             // this only triggers on enter, or if a suggested location is chosen
//             // todo: if a user doesn't choose a suggestion and presses tab, the map doesn't update
//             autocomplete.addListener("place_changed", self.codeAddress);

//             // don't make enter submit the form, let it just trigger the place_changed event
//             // which triggers the map update & geocode
//             $("#" + addressId).keydown(function (e) {
//                 if (e.keyCode == 13) {  // enter key
//                     e.preventDefault();
//                     return false;
//                 }
//             });
//         },



//         getMapType : function() {
//             // https://developers.google.com/maps/documentation/javascript/maptypes
//             var geolocation = document.getElementById(addressId);
//             var allowedType = ['roadmap', 'satellite', 'hybrid', 'terrain'];
//             var mapType = geolocation.getAttribute('data-map-type');

//             if (mapType && -1 !== allowedType.indexOf(mapType)) {
//                 return mapType;
//             }

//             return google.maps.MapTypeId.HYBRID;
//         },

//         getExistingLocation: function() {
//             var geolocation = document.getElementById(geolocationId).value;
//             console.log("LA CLAVE");
//             console.log(geolocation);
//             if (geolocation) {
//                 return geolocation.split(',');
//             }
//         },

//         codeAddress: function() {
//             var place = autocomplete.getPlace();

//             if(place.geometry !== undefined) {
//                 self.updateWithCoordinates(place.geometry.location);
//             }
//             else {
//                 geocoder.geocode({'address': place.name}, function(results, status) {
//                     if (status == google.maps.GeocoderStatus.OK) {
//                         var latlng = results[0].geometry.location;
//                         self.updateWithCoordinates(latlng);
//                     } else {
//                         alert("Geocode was not successful for the following reason: " + status);
//                     }
//                 });
//             }
//         },

//         updateWithCoordinates: function(latlng) {
//             map.setCenter(latlng);
//             map.setZoom(18);
//             self.setMarker(latlng);
//             self.updateGeolocation(latlng);
//         },

//         setMarker: function(latlng) {
//             if (marker) {
//                 self.updateMarker(latlng);
//             } else {
//                 self.addMarker({'latlng': latlng, 'draggable': true});
//             }
//         },



//         addMarker: function(Options) {
//             marker = new google.maps.Marker({
//                 map: map,
//                 position: Options.latlng
//             });

//             var draggable = Options.draggable || false;
//             if (draggable) {
//                 self.addMarkerDrag(marker);
//             }
//         },

//         addOldMarkers: function(lalo) {
//             console.log("ENTRO");
//             var marker2 = new google.maps.Marker({
//                 map: map,
//                 position: lalo
//             });

//             google.maps.event.addListener(marker2,"click",function (event){
//                 infoWindow.setContent(this.position);
//                 infoWindow.open(map, this);
//             });

//             // var draggable = Options.draggable || false;
//             // if (draggable) {
//             //     self.addMarkerDrag(marker);
//             // }
//         },

//         addMarkerDrag: function() {
//             marker.setDraggable(true);
//             google.maps.event.addListener(marker, 'dragend', function(new_location) {
//                 self.updateGeolocation(new_location.latLng);
//             });
//         },

//         updateMarker: function(latlng) {
//             marker.setPosition(latlng);
//         },

//         updateGeolocation: function(latlng) {
//             document.getElementById(geolocationId).value = latlng.lat() + "," + latlng.lng();
//             $("#" + geolocationId).trigger('change');
//         }
//     };

//     return self;
// }

var globalQuery;

function googleMapAdmin()
{
    var autocomplete;
    var geocoder = new google.maps.Geocoder();
    var map;
    var addressId = 'id_address';
    var geolocationId = 'id_geolocation';
    var markerAdded = false;
    var service;
    var radius = 500;
    var actualLatLng;
    var dummy = 0;
    var current_marker;
    var markers = [];

    var self = {
        initialize: function(initData) {

            globalQuery = initData;
            //var lat = 7.078179;
            //var lng = -73.108048;

            // Inicializar centrandose en el ultimo activo agregado
            var ultimoActivo = initData[initData.length-1];
            var lat = ultimoActivo.lat;
            var lng = ultimoActivo.lon;


            var zoom = 12;


            var existinglocation = self.getExistingLocation();

            if (existinglocation) {
                lat = existinglocation[0];
                lng = existinglocation[1];
                zoom = 18;
            }

            var latlng = new google.maps.LatLng(lat,lng);

            var myOptions = {
              zoom: zoom,
              center: latlng,
              mapTypeId: google.maps.MapTypeId.SATELLITE
            };

            map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

            // Estar pendiente del cambio en el filtro


            filtro = document.getElementById("filtro");
            google.maps.event.addDomListener(filtro,'change', function() {

                if(!document.URL.includes("change"))
                {
                    self.deleteMarkers(); console.log(globalQuery); 
                    var opcion = document.getElementById("filtro").value;

                    axios.get('../../../../../getLastActivos/'+opcion+'/').then(function (response) { 
                        this.initData = response.data;
                        self.addOldMarkers(this.initData);
                    }); 
                }

            });

            map.addListener("click", function(event) {
                // get lat/lon of click


                if(markerAdded)
                {
                    current_marker.setMap(null);
                    markerAdded = false;
                }

                if(!markerAdded && !existinglocation)
                {
                    var clickLat = event.latLng.lat();
                    var clickLon = event.latLng.lng();


 
                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(clickLat,clickLon),
                        map: map
                    });

                    current_marker = marker;



                    self.updateGeolocation(marker.position);
                    self.addMarkerDrag(marker);

                    markerAdded = true;
                }



            });

            // Put marker of a existing place
            if (existinglocation) {
                self.addMarkerByLaLo(latlng);
            }
            else
            {// Plot markers in existing locations
                self.addOldMarkers(initData);
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

        addOldMarkers: function(initData) {
            //console.log("ENTRO");
              var image = {
                url: "https://cdn1.iconfinder.com/data/icons/map-objects/154/map-object-tree-park-forest-point-place-512.png",
                // This marker is 20 pixels wide by 32 pixels high.
                scaledSize: new google.maps.Size(30, 38),
                // The origin for this image is (0, 0).
                origin: new google.maps.Point(0, 0),
                // The anchor for this image is the base of the flagpole at (0, 32).
                anchor: new google.maps.Point(0, 32)
              };

            for (var i in initData)
            {
                var lat_in = initData[i].lat;
                var lon_in = initData[i].lon;
                var tipo = initData[i].tipo;
                //console.log(tipo);

                if(tipo == "Arbol")
                {
                    image.url = "https://cdn1.iconfinder.com/data/icons/map-objects/154/map-object-tree-park-forest-point-place-512.png";
                }
                else if(tipo == "Arbusto")
                {
                    image.url = "https://cdn1.iconfinder.com/data/icons/map-objects/154/map-object-fir-forest-park-512.png";
                }
                else
                {
                    image.url = "https://cdn2.iconfinder.com/data/icons/places-4/100/leaf_place_marker_location_nature_eco-512.png";
                }

                //console.log(lat_in);
                //console.log(lon_in);
                var marker = new google.maps.Marker({
                    position: {lat: lat_in, lng: lon_in},
                    map: map,
                    icon: image
                });

                markers.push(marker);

            }

        },

        addMarkerByLaLo: function(latlng) {

            var marker = new google.maps.Marker({
                position: latlng,
                map: map
            });

            self.updateGeolocation(marker.position);
            self.addMarkerDrag(marker);
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

            if(document.URL.includes("change"))
            {
                dummy = dummy + 1;
                if(dummy >= 2)
                {
                    self.getClosestPlace(latlng);  
                }
               
            }
            else
            {
               self.getClosestPlace(latlng);  
            }

            

            
            // // Get nearest place
            //   var request = {
            //     location: latlng,
            //     radius: radius,
            //     //type: ['restaurant']
            //   };

            //   service = new google.maps.places.PlacesService(map);
            //   service.nearbySearch(request, self.callback);




        },

        getClosestPlace: function(latlng){

            // Get nearest place
              var request = {
                location: latlng,
                radius: radius,
                //type: ['restaurant']
              };

              service = new google.maps.places.PlacesService(map);
              service.nearbySearch(request, self.callback);
              actualLatLng = latlng;

        },

        getExistingLocation: function() {
            var geolocation = document.getElementById(geolocationId).value;
            //console.log(geolocation);
            if (geolocation) {
                return geolocation.split(',');
            }
        },

        codeAddress: function() {
            var place = autocomplete.getPlace();
            //console.log(place);

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
            //self.setMarker(latlng);
            self.updateGeolocation(latlng);
        },

        setMapOnAll: function(map){
            for (var i = 0; i < markers.length; i++)
            {
                markers[i].setMap(map);
            }
        },


        clearMarkers: function(){
            self.setMapOnAll(null);
        },

        deleteMarkers: function(){
            self.clearMarkers();
            markers = [];
        },


        callback: function(results, status) {
            //console.log("CALLLLLLLLLLL");
            //console.log(results);
            //console.log(status);
              if (status == google.maps.places.PlacesServiceStatus.OK) {
                //for (var i = 0; i < results.length; i++) {
                  //var place = results[i];
                  //console.log(results[i]);
                //}
                //console.log(results[0]);
                radius = 500;
                document.getElementById(addressId).value = results[0].name;
              }
              else
              {
                radius = radius*2;
                self.getClosestPlace(actualLatLng);
              }
        },

    };

    return self;
}













$(document).ready(function() {

    //console.log("Aqui");
    //console.log(document.URL);
        var opcion = document.getElementById("filtro").value;

        axios.get('../../../../../getLastActivos/'+opcion+'/').then(function (response) { 
            this.initData = response.data;
            globalQuery = this.initData;
            //console.log(this.initData);
            var googlemap = googleMapAdmin();
            googlemap.initialize(this.initData);
            //console.log("Hiiiieeeeerrrr");
    }); 

        //Falta incluir axios, hacer la URL, el controlador, sacar lat, long y tipo de cada activo desde la db, buscar iconos para representar cada uno
    //var googlemap = googleMapAdmin();
    //googlemap.initialize();
    //console.log("Hiiiieeeeerrrr");
});





            globalQuery = this.initData;
            console.log("Globarl");
            console.log(globalQuery);
            //var opcion = "todos";
            window.test = function(e){

                deleteRows();
                drawTable();
                /*if(e.value === '1'){
                    //console.log("Opcion 1");
                    //deleteRows();
                }
                else if (e.value === '2') {
                    console.log("Opcion 2");

                }
                else if (e.value === '3') {
                    //console.log("Opcion 3");
                    //deleteRows();
                }
                else if (e.value === 'ultimos') {
                    //console.log("Opcion ultimos");
                    //deleteRows();
                }
                else if (e.value === 'todos') {
                    //console.log("Opcion todos");
                    //deleteRows();
                }
                else{
                    //console.log("NINGUNA OPCION");
                }*/
            }

            function deleteRows(){
                var tbl = document.getElementById('result_list');
                 
                var rowCount = tbl.rows.length;
                for(var i = rowCount - 1; i > 0; i--)
                {
                    tbl.deleteRow(i);
                }
            }

        

                function drawTable() {

                    // make request
                    /*var xhttp = new XMLHttpRequest();
                    xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        document.getElementById("demo").innerHTML = this.responseText;
                    }
                    };
                    xhttp.open("GET", "demo_get.asp", true);
                    xhttp.send();*/

                    var opcion = document.getElementById("filtro").value;
                    //console.log("VALOR ADQUIRIDO");
                    //console.log(opcion);

                    axios.get('../../../../../getLastActivos/'+opcion+'/').then(function (response) { 
                        this.initData = response.data;
                        globalQuery = this.initData;
                        //console.log("CARGAR 10 ACTIVOS")
                        //console.log(this.initData);
                        var totalRows = this.initData.length;

                    // get the reference for the body
                    //var div1 = document.getElementById('div1');
             
                    // creates a <table> element
                    //var tbl = document.createElement("table");
                        var tbl = document.getElementById('result_list');
                 
                        // creating rows
                        
                        for (var r = 0; r < totalRows; r++) {

                            activo = this.initData[r];
                            //console.log("INFO");
                            //console.log(activo.id);
                            //console.log(activo.tipo);
                            //console.log(activo.ubicacion);


                            
                            if(r%2 == 0)
                            {
                                var clase = "row1";
                            }
                            else
                            {
                                var clase = "row2";
                            }

                            var row = document.createElement("tr");
                            
                            row.className = clase;

                             // create cells in row
                             
                             
                             //var cellText_Tipo = document.createTextNode("Arbol");
                             //cell_Tipo.innerHTML=  '<a href="'+whatever+'">'+fname[j]+'</a>';
                             
                             //cellText_Tipo.appendChild(link);
                             //cell_Tipo.appendChild(cellText_Tipo);
                             var cell_Tipo = document.createElement("td");
                             cell_Tipo.innerHTML=  '<a href="/admin/mvc/activo/'+activo.id+'/change/" title="Modificar">'+activo.tipo+'</a>';
                             row.appendChild(cell_Tipo);

                             var cell_Ubicacion = document.createElement("td");
                             cell_Ubicacion.innerHTML=  '<a href="/admin/mvc/activo/'+activo.id+'/change/" title="Modificar">'+activo.ubicacion+'</a>';
                             row.appendChild(cell_Ubicacion);


                             tbl.appendChild(row); // add the row to the end of the table body
                        }
                
                 //div1.appendChild(tbl); // appends <table> into <div1>

             }); //axios
            }
            window.onload=drawTable; 


