(function () {
    'use strict';

    angular.module('bookMyRide')
        .factory('Auth', ['$http', '$localStorage', function ($http, $localStorage) {

            function urlBase64Decode(str) {
                var output = str.replace('-', '+').replace('_', '/');
                switch (output.length % 4) {
                    case 0:
                        break;
                    case 2:
                        output += '==';
                        break;
                    case 3:
                        output += '=';
                        break;
                    default:
                        throw 'Illegal base64url string!';
                }
                return window.atob(output);
            }

            function getClaimsFromToken() {
                var token = $localStorage.token;
                var user = {};
                if (typeof token !== 'undefined') {
                    var encoded = token.split('.')[1];
                    user = JSON.parse(urlBase64Decode(encoded));
                }
                return user;
            }

            var tokenClaims = getClaimsFromToken();

            return {
                signup: function (data) {
                    return $http.post('/user/sign-up', data);
                },
                login: function (data) {
                    return $http.post('/user/login', data);
                },
                logout: function () {
                    tokenClaims = {};
                    delete $localStorage.token;
                    delete $localStorage.user;
                    return $http.get('/user/logout');
                },
                getTokenClaims: function () {
                    return tokenClaims;
                }
            };
        }
        ]);

})();