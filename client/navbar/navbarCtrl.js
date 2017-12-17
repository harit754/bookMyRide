angular.module('bookMyRide').controller('NavbarCtrl', ['$scope', '$location', 'Auth', '$localStorage', function
($scope, $location, Auth, $localStorage) {
    var socket = io();
    $scope.$localStorage = $localStorage;
    $scope.logout = function () {
        if ($localStorage.user.role.toLowerCase() == 'user') { socket.emit('user-out', $localStorage.user); }
        else if ($localStorage.user.role.toLowerCase() == 'driver') { socket.emit('driver-out', $localStorage.user); }

        Auth.logout();

    }

}]);