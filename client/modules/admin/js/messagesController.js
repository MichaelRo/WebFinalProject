/**
 * Michael Roytman
 * Itay Desalto
 * Marom Felz
 */

// setup admin controller
angular.module('adminApp').controller('messagesController', ['$scope', '$http', '$uibModal', '$filter',
    function ($scope, $http, $uibModal, $filter) {
        $scope.messages = [];

        $scope.gridOptions = {
            enableSorting: true,
            enableFiltering: true,
            columnDefs: [
                { name: 'ID', field: 'id', visible: false},
                { name:'Name', field: 'name' },
                { name: 'Template' , field: 'templateUrl' },
                { name:'Display length', field: 'displayLength' },
                { name: 'Actions', cellTemplate: '<div><a href="" ng-click="grid.appScope.deleteMessage(row.entity)">Delete</a> | ' +
                '                                      <a href="" ng-click="grid.appScope.updateMessage(row.entity)">Update</a></div>'}
            ],
            enableRowSelection: false,
            enableFullRowSelection: false,
            enableSelectAll: false,
            multiSelect: false,
            enableHorizontalScrollbar: 2,
            enableVerticalScrollbar: 2
        };

        $scope.searchParams = {
            textFieldsCount: 0,
            imageFieldsCount: 0,
            minDisplayLength: 0
        };

        /*
         *      Get Messages
         */
        $scope.getMessages = function() {
            $http({
                method: 'GET',
                url: '/api/messages'
            }).then(function (messages) {
                $scope.messages = messages.data;

                // set messages as the grid's data
                $scope.gridOptions.data = $scope.messages;

                // apply current filter on messages
                $scope.filterMessages();

            }, function (err) {
                console.log(err);
            });
        };

        /*
         *      Delete Message
         */
        $scope.deleteMessage = function(message) {
            $http({
                method: 'POST',
                url: '/api/messages/delete',
                data: message
            }).then(function (result) {
                console.log(result);

                // In case the deletion was successful
                if (result && result.data && result.data.deleted)
                    $scope.getMessages();
            }, function (err) {
                console.log(err);
            });
        };

        /*
         *      Update Message
         */
        $scope.updateMessage = function(message) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/messageDetails.html',
                controller: 'updateMessageController',
                size: 'lg',
                resolve: {
                    initial: function() {
                        return message;
                    }
                }
            });

            modalInstance.result.then(function(message) {
                    $http({
                        method: 'POST',
                        url: '/api/messages/update',
                        data: message
                    }).then(function (result) {
                        console.log(result);

                        // if update was successful
                        if (result && result.data && result.data.updated)
                            $scope.getMessages();

                    }, function (err) {
                        console.log(err);
                    });
                },
                function() {
                    console.log('Modal dismissed at: ' + new Date());
                });
        };

        /*
         *      Add Message
         */
        $scope.addMessage = function() {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/messageDetails.html',
                controller: 'addMessageController',
                size: 'lg',
                resolve: {}
            });

            modalInstance.result.then(function(message) {
                    $http({
                        method: 'POST',
                        url: '/api/messages/add',
                        data: message
                    }).then(function (result) {
                        console.log(result);

                        // if update was successful
                        if (result && result.data && result.data.inserted)
                            $scope.getMessages();

                    }, function (err) {
                        console.log(err);
                    });
                },
                function() {
                    console.log('Modal dismissed at: ' + new Date());
                });
        };

        /*
         *      Filter Messages
         */
        $scope.filterMessages = function() {
            $scope.gridOptions.data = $filter('filter')($scope.messages, $scope.searchText, undefined);
        };

        /*
         *     Search Messages
         */
        $scope.searchMessages = function(queryType) {
            // set query type
            $scope.searchParams.queryType = queryType;

            $http({
                method: 'GET',
                url: '/api/messages/search',
                params: $scope.searchParams
            }).then(function (messages) {
                $scope.messages = messages.data;

                // set messages as the grid's data
                $scope.gridOptions.data = $scope.messages;

                // apply current filter on messages
                $scope.filterMessages();
            }, function (err) {
                console.log(err);
            });
        };

        $scope.getPokemon = function() {
            $scope.pokemon = {};
            $scope.pokemonID = 0;

            $http({
                method: 'GET',
                url: ('http://pokeapi.co/api/v2/pokemon/' + $scope.pokemonName + '/')
            }).then(function (response) {
                $scope.pokemon = response.data;
                $scope.pokemonIconURL = 'http://pokedream.com/pokedex/images/blackwhite/front/' + $scope.pad(response.data.id, 3) + '.png';
            }, function (err) {
                console.log(err);
            });
        }

        $scope.pad = function(stringToPad, width, paddingCharacter) {
            paddingCharacter = paddingCharacter || '0';
            stringToPad = stringToPad + '';
            return stringToPad.length >= width ? stringToPad : new Array(width - stringToPad.length + 1).join(paddingCharacter) + stringToPad;
        }

        $scope.getMessages();
    }]);