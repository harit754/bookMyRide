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




});