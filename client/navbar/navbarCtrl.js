angular.module('bookMyRide').controller('NavbarCtrl', ['$scope', '$location', 'Auth', '$localStorage', function
($scope, $location, Auth, $localStorage) {
    var socket = io();
    $scope.$localStorage = $localStorage;
    $scope.logout = function () {
        if ($localStorage.user.role == 'user') { socket.emit('user-out', $localStorage.user.email); }
        else if ($localStorage.user.role == 'driver') { socket.emit('driver-out', $localStorage.user.email); }

        Auth.logout();

    }

}]);