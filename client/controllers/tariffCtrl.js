angular.module('bookMyRide').controller('tariffCtrl', function ($scope, $http, $location, $window) {
    init();
    function init() {
        $scope.newTariff = {};
        getTariff();
    }

    $scope.addTariff = function () {

        $http.post('/tariff', $scope.newTariff).then(function (response) {
            console.log('Data Saved Successfully');
            init();
        });
    }

    var getTariff = function () {
        $http.get('/GetTariffs').then(function (response) {
            $scope.allTariffs = response.data;
        });
        console.log(response.data);
    }


});