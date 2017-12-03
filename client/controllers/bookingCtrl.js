angular.module('bookMyRide').controller('bookingCtrl', function ($scope, $http, $location, $window) {
    /************global variables for map manipulation start ***************************/
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


    mapObj.initPos = { lat: 28.4595, lng: 77.0266 };
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

    mapObj.pickInfoWindow = new google.maps.InfoWindow();
    mapObj.dropInfoWindow = new google.maps.InfoWindow();

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
            mapObj.dropInfoWindow.close(mapObj.map, mapObj.dropMarker);
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
            mapObj.pickInfoWindow.close(mapObj.map, mapObj.pickMarker);
            mapObj.dropInfoWindow.open(mapObj.map, mapObj.dropMarker);
        }); //autocomplete.Drop function ends here.


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
                // var marker = new google.maps.Marker({
                //     position: pos,
                //     draggable: true,
                //     map: map,
                //     icon: manIcon,
                //     title: 'Your position'
                // });

                mapObj.pickMarker.setPosition(pos);

                // infoWindow.setPosition(pos);
                // infoWindow.setContent('Location found.');
                mapObj.map.setCenter(pos);

                updateMarkerPosition(mapObj.pickMarker.getPosition());
                geocodePosition(pos);

                // Add dragging event listeners.
                google.maps.event.addListener(mapObj.pickMarker, 'dragstart', function () {
                    updateMarkerAddress('Dragging...');
                });

                google.maps.event.addListener(mapObj.pickMarker, 'drag', function () {
                    updateMarkerStatus('Dragging...');
                    updateMarkerPosition(mapObj.pickMarker.getPosition());
                });

                google.maps.event.addListener(mapObj.pickMarker, 'dragend', function () {
                    updateMarkerStatus('Drag ended');
                    geocodePosition(mapObj.pickMarker.getPosition());
                    mapObj.map.panTo(mapObj.pickMarker.getPosition());
                });

                google.maps.event.addListener(map, 'click', function (e) {
                    updateMarkerPosition(e.latLng);
                    geocodePosition(mapObj.pickMarker.getPosition());
                    marker.setPosition(e.latLng);
                    mapObj.map.panTo(mapObj.pickMarker.getPosition());
                });

            }, function () {
                handleLocationError(true, infoWindow, mapObj.map.getCenter());
            });
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, mapObj.map.getCenter());
        }
    }


    function geocodePosition(pos) {
        mapObj.geocoder.geocode({
            latLng: pos
        }, function (responses) {
            if (responses && responses.length > 0) {
                updateMarkerAddress(responses[0].formatted_address);
            } else {
                updateMarkerAddress('Cannot determine address at this location.');
            }
        });
    }

    function updateMarkerStatus(str) {
        document.getElementById('markerStatus').innerHTML = str;
    }

    function updateMarkerPosition(latLng) {
        document.getElementById('info').innerHTML = [
            latLng.lat(),
            latLng.lng()
        ].join(', ');
    }

    function updateMarkerAddress(str) {
        document.getElementById('address').innerHTML = str;
        mapObj.inputPick.value = str;

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