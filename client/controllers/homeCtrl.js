angular.module('bookMyRide').controller('homeCtrl', function ($scope, $http, $location) {

    $scope.bookARide = function () {
        $location.path('/booking')
    }

});