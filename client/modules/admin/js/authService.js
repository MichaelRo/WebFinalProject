/**
 * Michael Roytman
 * Itay Desalto
 * Marom Felz
 */
angular.module('adminApp').factory('AuthService', ['$q', '$timeout', '$http',
    function ($q, $timeout, $http) {
       var user = null;

        // return available functions for use in controllers
        return ({
            isLoggedIn: isLoggedIn,
            getUserStatus: getUserStatus,
            login: login,
            logout: logout
        });

        function isLoggedIn() {
            return user;
        }

        function getUserStatus() {
            return user;
        }

        function login(username, password) {
            var deferred = $q.defer();

            $http.post('/api/login', {username: username, password: password})
                .success(function (data, status) {
                    if(status === 200 && data.status){
                        user = true;
                        deferred.resolve();
                    } else {
                        user = false;
                        deferred.reject();
                    }
                }).error(function (data) {
                    user = false;
                    deferred.reject();
                });

            return deferred.promise;
        }

        function logout() {
            var deferred = $q.defer();

            $http.get('/api/logout')
                .success(function (data) {
                    user = false;
                    deferred.resolve();
                }).error(function (data) {
                    user = false;
                    deferred.reject();
                });

            return deferred.promise;
        }
    }]);