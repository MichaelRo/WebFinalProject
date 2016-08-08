/**
 * Michael Roytman
 * Itay Desalto
 * Marom Felz
 */
// setup admin controller
angular.module('adminApp').controller('statsCtrl', ['$scope',
    function ($scope) {

        // load statistics controls
        loadSunburstSequenceControl();
        loadBarChartControl();

    }]);