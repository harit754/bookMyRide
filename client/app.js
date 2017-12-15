var app = angular.module('bookMyRide', ['ngRoute', 'ngStorage', 'ui.router']);
app.config(function ($routeProvider, $locationProvider, $httpProvider) {
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
        .when('/driver-cab', {
            templateUrl: './views/driver-cab.html',
            controller: 'driver-cabCtrl'
        })
        .when('/tariff', {
            templateUrl: './views/tariff.html',
            controller: 'tariffCtrl'
        })
        .when('/login', {
            templateUrl: './views/login.html',
            controller: 'loginCtrl'
        })
        .when('/access-denied', {
            templateUrl: './views/unauthorized-access.html',
        });


    $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function ($q, $location, $localStorage) {
        return {
            'request': function (config) {
                config.headers = config.headers || {};
                if ($localStorage.token) {
                    config.headers.Authorization = 'Bearer ' + $localStorage.token;
                }
                return config;
            },
            'responseError': function (response) {
                if (response.status === 401 || response.status === 403) {
                    delete $localStorage.token;
                    $location.path('/login');
                }
                return $q.reject(response);
            }
        };
    }]);

    //  $httpProvider.interceptors.push Ends here.
});

app.run(['$rootScope', '$location', '$localStorage', function ($rootScope, $location, $localStorage) {
    $rootScope.$on("$routeChangeStart", function (event, next) {
        if ($localStorage.token == null) {

            var publicURL = ['/login', '/home', '/', '/access-denied'];
            var publicURLfound = publicURL.indexOf($location.path()) > -1;

            if (!publicURLfound) {
                $location.path("/login");
            }
        }
    });
}]); 