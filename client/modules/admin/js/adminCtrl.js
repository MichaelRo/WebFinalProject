/**
 * Michael Roytman
 * Itay Desalto
 * Marom Felz
 */
// setup admin controller
angular.module('adminApp').controller('adminCtrl', ['$scope', '$state', '$location', '$window', 'AuthService',
    function ($scope, $state, $location, $window, AuthService) {

        /*
         *      Handles transition between views
         */
        $scope.go = function(state) {
            $state.go(state);
        };

        // To select the messages tab by default, go the the message sub state
        // if navigation to dashboard as conducted
        if ($state.current.name === 'dashboard') {
            $state.go('dashboard.msgs');
        }


        /*
         *      Setup tabs
         */
        $scope.adminTabs   = [
            {
                heading: 'Messages',
                route:   'dashboard.msgs'
            },
            {
                heading: 'Statistics',
                route:   'dashboard.stats'
            },
            {
                heading: 'Logout',
                route:   'logout'
            }
        ];

        /*
         *      IsLoggedIn
         */
        $scope.isLoggedIn = function()
        {
            return AuthService.isLoggedIn();
        }

        /*
         *      Login
         */
        $scope.login = function () {

            // initial values
            $scope.error = false;
            $scope.disabled = true;

            // call login from service
            AuthService.login($scope.loginForm.username, $scope.loginForm.password)
                // handle success
                .then(function () {
                    $scope.error = false;
                    $scope.errorMessage = "";
                    $scope.disabled = false;
                    $scope.loginForm = {};
                    $state.go('dashboard');
                })
                // handle error
                .catch(function () {
                    $scope.error = true;
                    $scope.errorMessage = "Invalid username and/or password";
                    $scope.disabled = false;
                    $scope.loginForm = {};
                });
        };
    }]);