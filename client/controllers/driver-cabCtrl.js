angular.module('bookMyRide').controller('driver-cabCtrl', function ($scope, $http, $location, $window) {
    init();
    function init() {
        $scope.showCab = true;
        $scope.newUser = {};
    }

    $scope.addDriver = function () {
        alert('hello');
        this.newUser.role = 'Driver';
        $http.post('/user/add-driver', $scope.newUser).then(function (response) {
            console.log('Data Saved Successfully');
            init();
        });
    }


});