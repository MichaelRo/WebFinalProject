/**
 * Michael Roytman
 * Itay Desalto
 * Marom Felz
 */
angular.module('adminApp').factory('AuthService', ['$q', '$timeout', '$http',
    function ($q, $timeout, $http) {
       var user = null;

        // Return available functions for use in controllers
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

        /**
         * This method login a user by username and password
         * @param username - The username
         * @param password - The password
         * @returns - the result of the login process
         */
        function login(username, password) {
            var deferred = $q.defer();

            // Login to the server by post request
            $http.post('/api/login', {username: username, password: password})
                .success(function (data, status) {
                    // If user authorized success else reject
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

        /**
         * This method logout the current connected user.
         * @returns - The result of the logout process
         */
        function logout() {
            var deferred = $q.defer();
            // Logout from server by get request
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