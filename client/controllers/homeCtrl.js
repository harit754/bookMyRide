angular.module('bookMyRide').controller('homeCtrl', function ($scope, $http, $location) {

    $scope.bookARide = function () {
        $location.path('/booking')
    }
    $scope.aboutCompany = function () {
        $location.path('/about')
    }
});