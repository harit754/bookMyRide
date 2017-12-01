angular.module('bookMyRide').controller('bookingCtrl', function ($scope, $http, $location) {

    $scope.initMap = function () {
        var pos = { lat: -25.363, lng: 131.044 };
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 4,
            center: pos
        });
        var marker = new google.maps.Marker({
            position: pos,
            map: map
        });
    }

});