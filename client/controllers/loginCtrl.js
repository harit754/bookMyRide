angular.module('bookMyRide').controller('loginCtrl', function ($scope, $http, $location, $window, Auth, $localStorage) {
    init();
    function init() {
        $scope.showLogin = true;
        $scope.newUser = {};
        $scope.loginUser = {};
        $scope.changePassword = {};
        $scope.myAlert = '';
    }

    $scope.changePassword = function () {
        if ($scope.newPassword === $scope.confirmPassword) {
            $scope.changePassword.newPassword = $scope.newPassword;
            $scope.changePassword.oldPassword = $scope.oldPassword;
            $http.put('/user/change-password/' + $localStorage.user.email, $scope.changePassword).then(function (response) {
                if (response.data) {
                    $scope.myAlert = 'User already exist! Please enter a different email-address!';
                } else {
                    console.log('Password Changed');
                    alert('Password Changed');
                    $scope.myAlert = 'Old Password is not correct !'
                }
            });
        } else {
            $scope.myAlert = 'New passwords did not match, Please confirm new password !'
        }
    }

    $scope.signUp = function () {
        this.newUser.role = 'User';

        $http.get('/user/get-user/' + this.newUser.email).then(function (response) {
            if (response.data) {
                $scope.alert = 'User already exist! Please enter a different email-address!';


            }
            else {
                Auth.signup($scope.newUser).then(function (response) {
                    console.log('Data Saved Successfully');
                    init();
                    $scope.alert = '';
                });
            }
        });
    }

    $scope.login = function () {
        Auth.login($scope.loginUser).then(function (response) {
            console.log('Login was Successfull');
            $localStorage.token = response.data.token;
            $localStorage.user = response.data.user;
            console.log($localStorage.user);
            console.log(response);

            if ($localStorage.user.role.toLowerCase() == 'user') {
                $location.path('/booking');
            }
            else if ($localStorage.user.role.toLowerCase() == 'driver') {
                $location.path('/driver');
            }
            else if ($localStorage.user.role.toLowerCase() == 'admin') {
                $location.path('/tariff');
            }
        });
    }

});