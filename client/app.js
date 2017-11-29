var app = angular.module('bookMyRide', ['ngRoute']);
app.config(function ($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('');
    $routeProvider
        .when('/', {
            templateUrl: '../client/views/home.html',
            controller: 'homeCtrl'
        })
        .when('/home', {
            templateUrl: '../client/views/home.html',
            controller: 'homeCtrl'
        })
        .when('/booking', {
            templateUrl: '../client/views/booking.html',
            controller: 'bookingCtrl'
        })
        .when('/about', {
            templateUrl: '../client/views/about.html',

        });
});