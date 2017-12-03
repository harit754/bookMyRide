angular.module('bookMyRide').controller('bookingCtrl', function ($scope, $http, $location, $window) {

    $scope.initMap = function () {
        var pos = { lat: 28.4595, lng: 77.0266 };
        $scope.geocoder = new google.maps.Geocoder();
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 16,
            center: pos
        });
        var input = document.getElementById('pac-input');
        var autocomplete = new google.maps.places.Autocomplete(input);
        // Bind the map's bounds (viewport) property to the autocomplete object,
        // so that the autocomplete requests use the current map bounds for the
        // bounds option in the request.
        autocomplete.bindTo('bounds', map);

        var infowindow = new google.maps.InfoWindow();
        var infowindowContent = document.getElementById('infowindow-content');
        infowindow.setContent(infowindowContent);
        // var infoWindow = new google.maps.InfoWindow({ map: map });
        var image = {
            url: "./public/images/man8.png", // url
            scaledSize: new google.maps.Size(70, 60), // scaled size
            origin: new google.maps.Point(0, 0), // origin
            anchor: new google.maps.Point(35, 60) // anchor
        };

        var marker = new google.maps.Marker({
            position: pos,
            draggable: true,
            map: map,
            icon: image
        });
        marker.addListener('click', toggleBounce);
        function toggleBounce() {
            if (marker.getAnimation() !== null) {
                marker.setAnimation(null);
            } else {
                marker.setAnimation(google.maps.Animation.BOUNCE);
            }
        }

        autocomplete.addListener('place_changed', function () {
            infowindow.close();
            marker.setVisible(false);
            var place = autocomplete.getPlace();
            if (!place.geometry) {
                // User entered the name of a Place that was not suggested and
                // pressed the Enter key, or the Place Details request failed.
                window.alert("No details available for input: '" + place.name + "'");
                return;
            }

            // If the place has a geometry, then present it on a map.
            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
                map.setZoom(18);
            } else {
                map.setCenter(place.geometry.location);
                map.setZoom(17);  // Why 17? Because it looks good.
            }
            marker.setPosition(place.geometry.location);
            marker.setVisible(true);

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
            infowindow.open(map, marker);
        });


        // HTML5 geolocation.
        // Using MyLocation
        $scope.myLocation = function () {
            input.value = "";
            if ($window.navigator.geolocation) {
                $window.navigator.geolocation.getCurrentPosition(function (position) {
                    var pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    var marker = new google.maps.Marker({
                        position: pos,
                        draggable: true,
                        map: map,
                        icon: image,
                        title: 'Your position'
                    });

                    // infoWindow.setPosition(pos);
                    // infoWindow.setContent('Location found.');
                    map.setCenter(pos);

                    updateMarkerPosition(marker.getPosition());
                    geocodePosition(pos);

                    // Add dragging event listeners.
                    google.maps.event.addListener(marker, 'dragstart', function () {
                        updateMarkerAddress('Dragging...');
                    });

                    google.maps.event.addListener(marker, 'drag', function () {
                        updateMarkerStatus('Dragging...');
                        updateMarkerPosition(marker.getPosition());
                    });

                    google.maps.event.addListener(marker, 'dragend', function () {
                        updateMarkerStatus('Drag ended');
                        geocodePosition(marker.getPosition());
                        map.panTo(marker.getPosition());
                    });

                    google.maps.event.addListener(map, 'click', function (e) {
                        updateMarkerPosition(e.latLng);
                        geocodePosition(marker.getPosition());
                        marker.setPosition(e.latLng);
                        map.panTo(marker.getPosition());
                    });

                }, function () {
                    handleLocationError(true, infoWindow, map.getCenter());
                });
            } else {
                // Browser doesn't support Geolocation
                handleLocationError(false, infoWindow, map.getCenter());
            }
        }
        var icon = {
            url: "./public/images/car.png", // url
            scaledSize: new google.maps.Size(50, 25), // scaled size
            origin: new google.maps.Point(0, 0), // origin
            anchor: new google.maps.Point(0, 32) // anchor
        };
        var image = {
            url: "./public/images/man8.png", // url
            scaledSize: new google.maps.Size(70, 60), // scaled size
            origin: new google.maps.Point(0, 0), // origin
            anchor: new google.maps.Point(35, 60) // anchor
        };

    } //initMap() Function ends here.

    function geocodePosition(pos) {
        $scope.geocoder.geocode({
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