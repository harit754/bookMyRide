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


});