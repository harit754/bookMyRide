angular.module('bookMyRide')

    .directive('navbar', function () {
        return {
            restrict: 'E',
            templateUrl: './navbar.html',
            controller: 'NavbarCtrl',
        };
    });