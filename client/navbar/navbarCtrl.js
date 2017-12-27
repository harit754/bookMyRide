angular.module('bookMyRide').controller('NavbarCtrl', ['$scope', '$location', 'Auth', '$localStorage', function
($scope, $location, Auth, $localStorage) {
    var socket = io();
    $scope.$localStorage = $localStorage;
    $scope.logout = function () {
        if ($localStorage.user.role.toLowerCase() == 'user') { socket.emit('user-out', $localStorage.user); }
        else if ($localStorage.user.role.toLowerCase() == 'driver') { socket.emit('driver-out', $localStorage.user); }

        Auth.logout();

    }

    $scope.home = function () {
        if ($localStorage.user.role.toLowerCase() == 'user') {
            $location.path('/booking');
        }
        else if ($localStorage.user.role.toLowerCase() == 'driver') {
            $location.path('/driver');
        }
        else if ($localStorage.user.role.toLowerCase() == 'admin') {
            $location.path('/tariff');
        }
        else {
            $location.path('/');
        }
    }

}]);