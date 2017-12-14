angular.module('bookMyRide').controller('loginCtrl', function ($scope, $http, $location, $window, Auth) {
    init();
    function init() {
        $scope.showLogin = true;
        $scope.newUser = {};
        $scope.loginUser = {};
    }

    $scope.signUp = function () {
        this.newUser.role = 'User';

        Auth.signup($scope.newUser).then(function (response) {
            console.log('Data Saved Successfully');
            init();
        });
    }

    $scope.login = function () {

        Auth.login($scope.loginUser).then(function (response) {
            console.log('Login was Successfull');
            $localStorage.token = response.data.token;
            console.log(response);
        });
    }

});