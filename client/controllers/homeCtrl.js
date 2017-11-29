angular.module('bookMyRide').controller('homeCtrl', function ($scope, $http, $location) {

    $scope.bookARide = function () {
        alert('Working');
        $location.path('/booking')
    }

});