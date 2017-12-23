angular.module('bookMyRide').controller('driverCtrl', function ($scope, $http, $location, $window, $localStorage) {

    // <------------------------------------------Socket.io code----------------------------------------->

    var socket = io();
    var allUserMarkers = [];
    function eraseMarkers() {
        while (allUserMarkers.length) {
            allUserMarkers.pop().setMap(null);
        }
    }

    function drawUsersMarker(allUsers, map) {
        /*For loop
        Draw Man Icon at Pos of every user
        */
        eraseMarkers();
        var i;
        for (i = 0; i < allUsers.length; i++) {
            // var obj = allDrivers[i];
            // console.log(obj);
            var pos = allUsers[i].user.pos;
            userMarker = new google.maps.Marker({
                position: pos,
                map: map,
                icon: manIcon
            });


            // map.setCenter(pos);
            allUserMarkers.push(userMarker);
        }
    }

    function initSocket(map) {
        socket.on('re-draw-driver-map', function (allUsers) {
            drawUsersMarker(allUsers, map);
        });
        socket.on('new-booking', function (newBooking) {
            $scope.newBooking = angular.copy(newBooking);
            //If The dRIVER email matches equaks to my email.
            //Show modal for new Booking User


        });
    }

    // <--------------------------------------Google Map Code------------------------------------------->
    var mapObj = {};
    mapObj.geocoder = new google.maps.Geocoder();
    var infoWindow = new google.maps.InfoWindow;
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
    mapObj.map = new google.maps.Map(document.getElementById('driver-map'), {
        zoom: 16,
        center: mapObj.initPos
    });

    initSocket(mapObj.map);

    mapObj.carMarker = new google.maps.Marker({
        position: mapObj.initPos,
        draggable: true,
        map: mapObj.map,
        icon: carIcon
    });

    $scope.initMap = function () {


        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                infoWindow.setPosition(pos);
                infoWindow.setContent('Location found.');
                infoWindow.close(mapObj.map);
                mapObj.map.setCenter(pos);
                mapObj.map.setZoom(17);
                mapObj.carMarker.setPosition(pos);

                //broadcast Driver + Position to server
                $localStorage.user.pos = pos;
                socket.emit('driver-in', $localStorage.user);

            }, function () {
                handleLocationError(true, infoWindow, mapObj.map.getCenter());
            });
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, mapObj.map.getCenter());
        }
    }

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(mapObj.map);
    }




});

