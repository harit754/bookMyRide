angular.module('bookMyRide').controller('bookingCtrl', function ($scope, $http, $location, $window, $localStorage) {
    /************global variables for map manipulation start ***************************/

    var socket = io();
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var allDriverMarkers = [];
    socket.on('re-draw-user-map', function (allDrivers) {
        console.log(allDrivers);
        /*For loop
        Draw cab Icon at Pos of every driver
        */
        var i;
        for (i; i < allDrivers.length; i++) {
            var pos = allDrivers[i].user.pos;
            driverMarker = new google.maps.Marker({
                position: pos,
                map: mapObj.map,
                icon: carIcon
            });
            allDriverMarkers.push(driverMarker);
        }
    });

    var mapObj = {};

    var carIcon = {
        url: "./public/images/car.png", // url
        scaledSize: new google.maps.Size(50, 25), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 32) // anchor
    };
    var manIcon = {
        url: "./public/images/man8.png", // url
        scaledSize: new google.maps.Size(70, 60), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(35, 60) // anchor
    };


    mapObj.initPos = { lat: 20.5937, lng: 78.9629 };
    mapObj.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: mapObj.initPos
    });
    mapObj.geocoder = new google.maps.Geocoder();

    mapObj.inputPick = document.getElementById('pickLocation');
    mapObj.autocompletePick = new google.maps.places.Autocomplete(mapObj.inputPick);
    mapObj.inputDrop = document.getElementById('dropLocation');
    mapObj.autocompleteDrop = new google.maps.places.Autocomplete(mapObj.inputDrop);

    mapObj.pickMarker = new google.maps.Marker({
        position: mapObj.initPos,
        draggable: true,
        map: mapObj.map,
        icon: manIcon
    });

    mapObj.dropMarker = new google.maps.Marker({
        draggable: true,
        map: mapObj.map

    });

    initMarkerEvents(mapObj.pickMarker, mapObj.inputPick);
    initMarkerEvents(mapObj.dropMarker, mapObj.inputDrop);

    mapObj.pickInfoWindow = new google.maps.InfoWindow();
    mapObj.dropInfoWindow = new google.maps.InfoWindow();

    function initMarkerEvents(marker, input) {
        google.maps.event.addListener(marker, 'dragstart', function () {
            updateMarkerAddress('Dragging...');
        });

        google.maps.event.addListener(marker, 'drag', function () {
            debugger;
            updateMarkerStatus('Dragging...');
            updateMarkerPosition(marker.getPosition());
        });

        google.maps.event.addListener(marker, 'dragend', function () {
            updateMarkerStatus('Drag ended');
            geocodePosition(marker.getPosition(), input);
            mapObj.map.panTo(marker.getPosition());
        });

        google.maps.event.addListener(mapObj.map, 'click', function (e) {
            debugger;
            updateMarkerPosition(e.latLng);
            geocodePosition(marker.getPosition(), input);
            marker.setPosition(e.latLng);
            mapObj.map.panTo(marker.getPosition());
        });

    }
    /************global variables for map manipulation END ***************************/

    $scope.initMap = function () {

        // Bind the map's bounds (viewport) property to the autocomplete object,
        // so that the autocomplete requests use the current map bounds for the
        // bounds option in the request.
        mapObj.autocompletePick.bindTo('bounds', mapObj.map);
        mapObj.autocompleteDrop.bindTo('bounds', mapObj.map);

        var infowindowContent = document.getElementById('infowindow-content');


        // var infoWindow = new google.maps.InfoWindow({ map: map });

        //  picmarker.setlocation.



        mapObj.pickMarker.addListener('click', function () {
            if (mapObj.pickMarker.getAnimation() !== null) {
                mapObj.pickMarker.setAnimation(null);
            } else {
                mapObj.pickMarker.setAnimation(google.maps.Animation.BOUNCE);
            }
        });
        //Auto complete for Pick
        google.maps.event.addListener(mapObj.autocompletePick, 'place_changed', function () {
            mapObj.pickInfoWindow.close();
            mapObj.pickMarker.setVisible(false);
            var place = mapObj.autocompletePick.getPlace();

            if (!place.geometry) {
                // User entered the name of a Place that was not suggested and
                // pressed the Enter key, or the Place Details request failed.
                window.alert("No details available for input: '" + place.name + "'");
                return;
            }

            // If the place has a geometry, then present it on a map.
            if (place.geometry.viewport) {
                mapObj.map.fitBounds(place.geometry.viewport);
                mapObj.map.setZoom(18);
            } else {
                mapObj.map.setCenter(place.geometry.location);
                mapObj.map.setZoom(17);  // Why 17? Because it looks good.
            }

            mapObj.pickMarker.setPosition(place.geometry.location);
            mapObj.pickMarker.setVisible(true);

            var address = '';
            if (place.address_components) {
                address = [
                    (place.address_components[0] && place.address_components[0].short_name || ''),
                    (place.address_components[1] && place.address_components[1].short_name || ''),
                    (place.address_components[2] && place.address_components[2].short_name || '')
                ].join(' ');
            }

            infowindowContent.children['place-icon'].src = place.icon;
            infowindowContent.children['place-name'].textContent = place.name;
            infowindowContent.children['place-address'].textContent = address;
            mapObj.pickInfoWindow.setContent(infowindowContent);
            // mapObj.dropInfoWindow.close(mapObj.map, mapObj.dropMarker);
            mapObj.pickInfoWindow.open(mapObj.map, mapObj.pickMarker);
        }); //  END  mapObj.autocompletePick.addListener('place_changed' function()

        //Auto complete for Drop
        google.maps.event.addListener(mapObj.autocompleteDrop, 'place_changed', function () {
            mapObj.dropInfoWindow.close();
            mapObj.dropMarker.setVisible(false);
            var place = mapObj.autocompleteDrop.getPlace();

            if (!place.geometry) {
                // User entered the name of a Place that was not suggested and
                // pressed the Enter key, or the Place Details request failed.
                window.alert("No details available for input: '" + place.name + "'");
                return;
            }

            // If the place has a geometry, then present it on a map.
            if (place.geometry.viewport) {
                mapObj.map.fitBounds(place.geometry.viewport);
                mapObj.map.setZoom(18);
            } else {
                mapObj.map.setCenter(place.geometry.location);
                mapObj.map.setZoom(17);  // Why 17? Because it looks good.
            }

            mapObj.dropMarker.setPosition(place.geometry.location);
            mapObj.dropMarker.setVisible(true);

            var address = '';
            if (place.address_components) {
                address = [
                    (place.address_components[0] && place.address_components[0].short_name || ''),
                    (place.address_components[1] && place.address_components[1].short_name || ''),
                    (place.address_components[2] && place.address_components[2].short_name || '')
                ].join(' ');
            }

            infowindowContent.children['place-icon'].src = place.icon;
            infowindowContent.children['place-name'].textContent = place.name;
            infowindowContent.children['place-address'].textContent = address;
            mapObj.dropInfoWindow.setContent(infowindowContent);

            // mapObj.pickInfoWindow.close(mapObj.map, mapObj.pickMarker);
            mapObj.dropInfoWindow.open(mapObj.map, mapObj.dropMarker);
        }); //autocomplete.Drop function ends here.

        $scope.myLocation();
    } //initMap() Function ends here.


    // HTML5 geolocation.
    // Using MyLocation
    $scope.myLocation = function () {
        mapObj.inputPick.value = "";
        if ($window.navigator.geolocation) {
            $window.navigator.geolocation.getCurrentPosition(function (position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                $localStorage.user.pos = pos;
                socket.emit('user-in', $localStorage.user);

                var infowindow = mapObj.pickInfoWindow;

                mapObj.geocoder.geocode({ 'location': pos }, function (results, status) {
                    if (status === 'OK') {
                        if (results[0]) {
                            mapObj.map.setZoom(16);
                            createDragMarker(mapObj.pickMarker, pos, mapObj.inputPick);

                            mapObj.inputPick.value = mapObj.pinAddress;
                            infowindow.setContent(results[0].formatted_address);
                            infowindow.open(mapObj.map, mapObj.pickMarker);
                        } else {
                            window.alert('No results found');
                        }
                    } else {
                        window.alert('Geocoder failed due to: ' + status);
                    }
                });


            }, function () {
                handleLocationError(true, infoWindow, mapObj.map.getCenter());
            });
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, mapObj.map.getCenter());
        }
    };


    function createDragMarker(marker, pos, input) {
        marker.setPosition(pos);

        // infoWindow.setPosition(pos);
        mapObj.map.setCenter(pos);
        debugger;
        // marker.setPosition(pos);
        updateMarkerPosition(marker.getPosition());
        // updateMarkerPosition(pos);
        geocodePosition(pos, input);


    } //end function createDragMarker() //

    $scope.estimate = function () {
        //direction service
        directionsDisplay.setMap(mapObj.map);

        calculateAndDisplayRoute(directionsService, directionsDisplay);

    }

    function calculateAndDisplayRoute(directionsService, directionsDisplay) {

        var pickPos = mapObj.pickMarker.getPosition();
        var dropPos = mapObj.dropMarker.getPosition();

        var origin = pickPos || mapObj.inputPick.value;
        var destination = dropPos || mapObj.inputDrop.value;
        // alert(JSON.stringify(origin));
        directionsService.route({
            origin: origin,
            destination: destination,
            travelMode: 'DRIVING'
        }, function (response, status) {
            if (status === 'OK') {
                directionsDisplay.setDirections(response);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }

    function geocodePosition(pos, input) {
        mapObj.geocoder.geocode({
            latLng: pos
        }, function (responses) {
            if (responses && responses.length > 0) {
                updateMarkerAddress(responses[0].formatted_address);
                input.value = responses[0].formatted_address;

                mapObj.pickInfoWindow.setContent(mapObj.inputPick.value);
                mapObj.dropInfoWindow.setContent(mapObj.inputDrop.value);


            } else {
                updateMarkerAddress('Cannot determine address at this location.');
            }
        });
    }

    function updateMarkerStatus(str) {
        document.getElementById('markerStatus').innerHTML = str;
    }

    function updateMarkerPosition(latLng) {
        var pos = {
            lat: latLng.lat(),
            lng: latLng.lng()
        };
        $localStorage.user.pos = pos;
        socket.emit('user-position-change', $localStorage.user);

        document.getElementById('info').innerHTML = [
            latLng.lat(),
            latLng.lng()
        ].join(', ');
    }

    function updateMarkerAddress(str) {
        document.getElementById('address').innerHTML = str;
    }


    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
        var marker = new google.maps.Marker({
            position: pos,
            map: map,
            icon: image
        });
    }

});