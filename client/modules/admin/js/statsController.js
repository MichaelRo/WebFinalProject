/**
 * Michael Roytman
 * Itay Desalto
 * Marom Felz
 */
// setup admin controller
angular.module('adminApp').controller('statsController', ['$scope',
    function ($scope) {

        // load statistics controls
        loadSunburstSequenceControl();
        loadBarChartControl();

    }]);