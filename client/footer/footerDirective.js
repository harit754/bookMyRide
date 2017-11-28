angular.module('bookMyRide')

    .directive('myFooter', function () {
        return {
            restrict: 'E',
            templateUrl: './footer/footer.html',
            controller: 'footerCtrl',
        };
    });