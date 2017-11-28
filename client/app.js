var app = angular.module('bookMyRide', ['ngRoute']);
app.config(function ($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('');
    $routeProvider
        .when('/employees', {
            templateUrl: './views/employees.html',
            controller: 'HomeController'
        })
        .when('/departments', {
            templateUrl: './views/departments.html',
            controller: 'DepartmentController'
        });
});