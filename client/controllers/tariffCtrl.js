angular.module('bookMyRide').controller('tariffCtrl', function ($scope, $http, $location, $window) {
    init();
    getTariff();
    function init() {
        $scope.newTariff = {};
    }

    $scope.addTariff = function () {

        $http.post('/tariff', $scope.newTariff).then(function (response) {
            console.log('Data Saved Successfully');
            init();
        });
    }

    function getTariff() {
        $http.get('/tariff').then(function (response) {
            $scope.allTariffs = response.data;
            console.log(response.data);
        });

    }

    $scope.deleteTariff = function (tariff) {
        $http.delete('/tariff/' + tariff._id).then(function (response) {
            console.log('Data Removed Successfully');
            alert('Tariff Deleted Successfully!');
        });
    }

    $scope.editTariff = function (tariff) {
        $scope.editTariff = angular.copy(tariff);
    }

    $scope.updateTariff = function () {
        $http.put('/tariff/' + $scope.editTariff._id, $scope.editTariff).then(function (response) {
            console.log('Data Updated');
            alert('Data Updated');
        });
    }


});