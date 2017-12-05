var app = angular.module('bookMyRide', ['ngRoute']);
app.config(function ($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('');
    $routeProvider
        .when('/', {
            templateUrl: './views/home.html',
            controller: 'homeCtrl'
        })
        .when('/home', {
            templateUrl: './views/home.html',
            controller: 'homeCtrl'
        })
        .when('/booking', {
            templateUrl: './views/booking.html',
            controller: 'bookingCtrl'
        })
        .when('/about', {
            templateUrl: './views/about.html',

        })
        .when('/login', {
            templateUrl: './views/login.html',
            controller: 'loginCtrl'
        });
});