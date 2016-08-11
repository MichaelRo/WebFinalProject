/**
 * Michael Roytman
 * Itay Desalto
 * Marom Felz
 */

// setup admin controller
angular.module('adminApp').controller('adminController', ['$scope', '$state', '$location', '$window', 'AuthService',
    function ($scope, $state, $location, $window, AuthService) {
        // transition between views
        $scope.go = function(state) {
            $state.go(state);
        };

        // Select messages tab by default
        if ($state.current.name === 'dashboard') {
            $state.go('dashboard.messages');
        }

        // Setup the tabs
        $scope.adminTabs = [
            {
                heading: 'Messages',
                route:   'dashboard.messages'
            },
            {
                heading: 'Statistics',
                route:   'dashboard.stats'
            },
            {
                heading: 'Pokédex',
                route:   'dashboard.pokedex'
            },
            {
                heading: 'Logout',
                route:   'logout'
            }
        ];

        // Is logged in
        $scope.isLoggedIn = function() {
            return AuthService.isLoggedIn();
        }

        // Login form functionality
        $scope.login = function () {
            $scope.error = false;
            $scope.disabled = true;

            // Call login from service
            AuthService.login($scope.loginForm.username, $scope.loginForm.password)
                // Handle success
                .then(function () {
                    $scope.error = false;
                    $scope.errorMessage = "";
                    $scope.disabled = false;
                    $scope.loginForm = {};
                    $state.go('dashboard');
                })
                // Handle error
                .catch(function () {
                    $scope.error = true;
                    $scope.errorMessage = "Invalid username or password";
                    $scope.disabled = false;
                    $scope.loginForm = {};
                });
        };
    }]);