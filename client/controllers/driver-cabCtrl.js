angular.module('bookMyRide').controller('driver-cabCtrl', function ($scope, $http, $location, $window) {
    init();
    function init() {
        $scope.showCab = true;
        $scope.newUser = {};
        $scope.stepsModel = [];

        $scope.imageUpload = function (element) {
            var reader = new FileReader();
            reader.onload = $scope.imageIsLoaded;
            reader.readAsDataURL(element.files[0]);
        }

        $scope.imageIsLoaded = function (e) {
            $scope.$apply(function () {
                $scope.stepsModel[0] = e.target.result;
            });
        }
    }

    $scope.addDriver = function () {
        this.newUser.role = 'Driver';
        $http.post('/user/add-driver', $scope.newUser).then(function (response) {
            console.log('Data Saved Successfully');
            init();
        });
    }

    function getDriver() {
        $http.get('/user/driver').then(function (response) {
            $scope.allDrivers = response.data;
            console.log(response.data);
        });

    }

    $scope.deleteDriver = function (driver) {
        $http.delete('/user/driver/' + driver._id).then(function (response) {
            console.log('Data Removed Successfully');
            alert('Driver Deleted Successfully!');
        });
    }

    $scope.editDriver = function (driver) {
        $scope.editDriver = angular.copy(driver);
    }

    $scope.updateDriver = function () {
        $http.put('/user/driver/' + $scope.editDriver._id, $scope.editDriver).then(function (response) {
            console.log('Data Updated');
            alert('Data Updated');
        });
    }




});