angular.module('bookMyRide')

    .controller('NavbarCtrl', ['$scope', '$location', 'Auth', '$localStorage', function
($scope, $location, Auth, $localStorage) {
        $scope.$localStorage = $localStorage;
        $scope.logout = function () {
            Auth.logout();

        }

    }]);