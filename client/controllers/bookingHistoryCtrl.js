angular.module('bookMyRide').controller('bookingHistoryCtrl', function ($scope, $http, $location, $window, $localStorage) {
    $scope.allbookings = [];
    getBookings();

    function getBookings() { }
    $http.get('/booking').then(function (response) {
        $scope.allbookings = response.data;
        console.log(response.data);
    });
});