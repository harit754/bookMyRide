import { read } from "fs";

angular.module('bookMyRide').controller('loginCtrl', function ($scope, $http, $location, $window) {
    init();
    function init() {
        $scope.showLogin = true;
        $scope.newUser = {};
        $scope.loginUser = {};
    }

    $scope.signUp = function () {
        this.newUser.role = 'User';
        $http.post('/user/sign-up', $scope.newUser).then(function (response) {
            console.log('Data Saved Successfully');
            init();
        });
    }
    $scope.login = function () {
        $http.post('/user/sign-up', $scope.loginUser).then(function (response) {
            console.log('Login was Successfull');
            console.log(response.data);
        });
    }

});