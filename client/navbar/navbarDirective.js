angular.module('bookMyRide')

    .directive('navbar', function () {
        return {
            restrict: 'E',
            templateUrl: '../client/navbar/navbar.html',
            controller: 'NavbarCtrl',
        };
    });