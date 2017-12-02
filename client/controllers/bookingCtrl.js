angular.module('bookMyRide').controller('bookingCtrl', function ($scope, $http, $location, $window) {

    $scope.initMap = function () {
        var pos = { lat: 28.4595, lng: 77.0266 };
        $scope.geocoder = new google.maps.Geocoder();
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 16,
            center: pos

        });
        // var infoWindow = new google.maps.InfoWindow({ map: map });

        // HTML5 geolocation.
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