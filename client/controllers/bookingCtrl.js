angular.module('bookMyRide').controller('bookingCtrl', function ($scope, $http, $location, $window, $localStorage) {

    getTariff();
    $scope.allTariffs = [];
    $scope.distance = {};
    $scope.bookData = {};
    $scope.alert = '';
    $scope.bookData.cabType = '';
    $localStorage.bookData = {};
    $scope.newBooking = {};
    $scope.scheduledBooking = {};
    // Calculate Fare---------------------------------->

    function getTariff() {
        $http.get('/tariff').then(function (response) {
            $scope.allTariffs = response.data;
            console.log(response.data);
        });
    }

    function calculateFare() {

        if ($scope.bookData.cabType == '' || $scope.bookData.cabType == undefined) {
            $scope.alert = 'Please Select a Cab Type!!'
            return;
        }

        var i = 0;
        for (i; i < $scope.allTariffs.length; i++) {
            if ($scope.allTariffs[i].cabType.toLowerCase() == $scope.bookData.cabType) {

                $scope.baseFare = $scope.allTariffs[i].baseFare;
                $scope.normalRate = $scope.allTariffs[i].normalRate;
                $scope.peakRate = $scope.allTariffs[i].peakRate;
                $scope.startPeakTime = $scope.allTariffs[i].startPeakTime;
                $scope.endPeakTime = $scope.allTariffs[i].endPeakTime;
                break;
            }

        }

        var rate = parseInt($scope.normalRate);
        var currentTime = moment().format('hh:mm');
        if (currentTime >= $scope.startPeakTime && currentTime <= $scope.endPeakTime) {
            rate = parseInt($scope.peakRate);
        }

        $scope.totalFare = parseInt($scope.baseFare) + (rate * parseInt($scope.distance.value) / 1000)
        $scope.$apply();

    }

    // Schedule Later nd Book Later Function------------------>
    $scope.bookLater = function () {
        $http.post('/booking', $scope.scheduledBooking).then(function (response) {
            console.log('Data Saved Successfully');
        });
    }

    $scope.scheduleLater = function () {
        $scope.scheduledBooking.role = 'Client';
        $scope.scheduledBooking.type = 'Scheduled Booking';
        $scope.scheduledBooking.fare = $scope.totalFare;
        $scope.scheduledBooking.firstName = $localStorage.user.firstName;
        $scope.scheduledBooking.lastName = $localStorage.user.lastName;
        $scope.scheduledBooking.phoneNumber = $localStorage.user.phoneNumber;
        $scope.scheduledBooking.pickupLocation = mapObj.inputPick.value;
        $scope.scheduledBooking.destination = mapObj.inputDrop.value;
        $scope.scheduledBooking.cabType = $scope.bookData.cabType;
    }

    // Book-Now Function---------------------------->

    $scope.bookNow = function () {
        nearestCab();
        $localStorage.bookData.pickupLocation = mapObj.inputPick.value;
        $localStorage.bookData.destination = mapObj.inputDrop.value;
        $localStorage.bookData.estDistance = $scope.distance;
        $localStorage.bookData.estTime = $scope.duration;
        $localStorage.bookData.estFare = $scope.totalFare;
        $localStorage.bookData.cabType = $scope.bookData.cabType;

        $scope.newBooking.role = 'Client';
        $scope.newBooking.type = 'Current Booking';
        $scope.newBooking.firstName = $localStorage.user.firstName;
        $scope.newBooking.lastName = $localStorage.user.lastName;
        $scope.newBooking.phoneNumber = $localStorage.user.phoneNumber;
        $scope.newBooking.pickupLocation = mapObj.inputPick.value;
        $scope.newBooking.destination = mapObj.inputDrop.value;
        $scope.newBooking.cabType = $localStorage.bookData.cabType;
        $scope.newBooking.fare = $scope.totalFare;
        $scope.newBooking.date = moment().format("Do MMM");
        $scope.newBooking.time = moment().format('h:mm:ss a');

        alert($scope.newBooking);
        socket.emit('user-booking', $scope.newBooking);
        $http.post('/booking', $scope.newBooking).then(function (response) {
            console.log('Data Saved Successfully');
        });
    }


    // Assign Driver ----------------------------------------.
    function distance(p1, p2) {
        var a = new google.maps.LatLng(p1.lat, p1.lng);
        var b = new google.maps.LatLng(p2.lat, p2.lng);
        return google.maps.geometry.spherical.computeDistanceBetween(a, b);
    }

    function nearestCab() {
        var minDist = distance($localStorage.user.pos, $scope.allDrivers[0].driver.pos);
        var nearCab = $scope.allDrivers[0].driver;
        for (var i = 1; i < $scope.allDrivers.length; i++) {
            var dist = distance($localStorage.user.pos, $scope.allDrivers[i].driver.pos);
            if (dist < minDist) {
                minDist = dist;
                nearCab = $scope.allDrivers[i].driver;
            }
        }
        alert(JSON.stringify(nearCab));
        //Show Modal for Selected Cab

        //Emit Selected cab to every one
        $scope.newBooking.driver = nearCab;
        // return nearCab;

    }

    //   Estimate Details ----------------------------->
    $scope.bookData = {};
    $scope.selectCab = function (cabType) {

        angular.element('#' + cabType).addClass('selected');
        $scope.bookData.cabType = cabType;
        $scope.alert = null;
        switch (cabType) {
            case 'micro':
                angular.element('#mini,#prime,#sedan,#suv').removeClass('selected');
                break;
            case 'mini':
                angular.element('#micro,#prime,#sedan,#suv').removeClass('selected');
                break;
            case 'prime':
                angular.element('#mini,#micro,#sedan,#suv').removeClass('selected');
                break;
            case 'sedan':
                angular.element('#mini,#prime,#micro,#suv').removeClass('selected');
                break;
            case 'suv':
                angular.element('#mini,#prime,#sedan,#micro').removeClass('selected');
                break;
            default:
                angular.element('#mini,#prime,#sedan,#micro,#suv').removeClass('selected');

        }
        console.log($scope.bookData.cabType);
    }


    /************global variables for map manipulation start ***************************/

    var socket = io();
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var allDriverMarkers = [];

    var mapObj = {};
    mapObj.initPos = { lat: 20.5937, lng: 78.9629 };
    mapObj.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: mapObj.initPos
    });

    // Google Distance Matrix API----------------------------------------->

    function getTimeAndDistance() {
        var service = new google.maps.DistanceMatrixService();
        var origin = mapObj.inputPick.value;
        var destination = mapObj.inputDrop.value;
        service.getDistanceMatrix(
            {
                origins: [origin],
                destinations: [destination],
                travelMode: 'DRIVING',
                // transitOptions: TransitOptions,
                // drivingOptions: DrivingOptions,
                unitSystem: google.maps.UnitSystem.METERIC,
                avoidHighways: false,
                avoidTolls: false,
            }, function (response, status) {
                var element0 = response.rows[0].elements[0];
                if (status == 'OK' && element0.status != 'ZERO_RESULTS') {

                    console.log(JSON.stringify(element0));
                    // element0.distance.text ; element0.distance.value
                    $scope.distance = element0.distance;
                    $scope.duration = element0.duration;
                    calculateFare();

                } else {
                    alert('Unable to find Distance Via Road');
                }

            });
    }



    initSocket(mapObj.map);
    function eraseMarkers() {
        while (allDriverMarkers.length) {
            allDriverMarkers.pop().setMap(null);
        }
    }
    function initSocket(map) {

        socket.on('re-draw-user-map', function (allDrivers) {
            // console.log(allDrivers);
            /*For loop
            Draw cab Icon at Pos of every driver
            */
            $scope.allDrivers = allDrivers;
            eraseMarkers();
            var i;
            for (i = 0; i < allDrivers.length; i++) {
                // var obj = allDrivers[i];
                // console.log(obj);

                var pos = allDrivers[i].driver.pos;
                driverMarker = new google.maps.Marker({
                    position: pos,
                    map: map,
                    icon: carIcon
                });


                // map.setCenter(pos);
                allDriverMarkers.push(driverMarker);
            }
        });

    }

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
            // debugger;
            updateMarkerStatus('Dragging...');
            updateMarkerPosition(marker.getPosition());
        });

        google.maps.event.addListener(marker, 'dragend', function () {
            updateMarkerStatus('Drag ended');
            geocodePosition(marker.getPosition(), input);
            mapObj.map.panTo(marker.getPosition());
        });

        // google.maps.event.addListener(mapObj.map, 'click', function (e) {
        //     // debugger;
        //     updateMarkerPosition(e.latLng);
        //     geocodePosition(marker.getPosition(), input);
        //     marker.setPosition(e.latLng);
        //     mapObj.map.panTo(marker.getPosition());
        // });

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
            // mapObj.pickMarker.setVisible(false);
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

            var pos = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
            };
            $localStorage.user.pos = pos;
            socket.emit('user-position-change', $localStorage.user);

            // mapObj.pickMarker.setVisible(true);

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
        // debugger;
        // marker.setPosition(pos);
        updateMarkerPosition(marker.getPosition());
        // updateMarkerPosition(pos);
        geocodePosition(pos, input);


    } //end function createDragMarker() //

    $scope.estimate = function () {
        //direction service
        directionsDisplay.setMap(mapObj.map);

        calculateAndDisplayRoute(directionsService, directionsDisplay);
        getTimeAndDistance();


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