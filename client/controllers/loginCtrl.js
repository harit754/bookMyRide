angular.module('bookMyRide').controller('loginCtrl', function ($scope, $http, $location, $window) {
    $scope.showLogin = true;
    $scope.newUser = {};
    $scope.loginUser = {};
    $scope.signUp = function () {
        this.newUser.role = 'User';

    }
});