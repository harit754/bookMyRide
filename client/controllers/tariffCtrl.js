angular.module('bookMyRide').controller('tariffCtrl', function ($scope, $http, $location, $window) {
    init();
    function init() {
        $scope.newTariff = {};
    }


    $scope.addTariff = function () {

        $http.post('/user/add-tariff', $scope.newTariff).then(function (response) {
            console.log('Data Saved Successfully');
            init();
        });
    }


});