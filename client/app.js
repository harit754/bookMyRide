var app = angular.module('bookMyRide', ['ngRoute']);
app.config(function ($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('');
    $routeProvider
        .when('/home', {
            templateUrl: '../client/views/home.html',
            controller: 'HomeController'
        })
        .when('/about', {
            templateUrl: '../client/views/about.html',

        });
});