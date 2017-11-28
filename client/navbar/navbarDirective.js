angular.module('bookMyRide')

    .directive('navbar', function () {
        return {
            restrict: 'E',
            templateUrl: './navbar/navbar.html',
            controller: 'NavbarCtrl',
        };
    });