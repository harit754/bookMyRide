angular.module('bookMyRide').controller('driver-cabCtrl', function ($scope, $http, $location, $window) {
    init();
    function init() {
        $scope.showCab = true;
        $scope.newUser = {};
    }

    $scope.signUp = function () {
        this.newUser.role = 'Driver';
        $http.post('/user/sign-up', $scope.newUser).then(function (response) {
            console.log('Data Saved Successfully');
            init();
        });
    }


});