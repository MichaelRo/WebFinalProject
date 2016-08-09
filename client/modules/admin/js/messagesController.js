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
            // Get all the messages to display
            $http({
                method: 'GET',
                url: '/api/messages'
            }).then(function (messages) {
                // update data
                $scope.messages = messages.data;
                // set messages as the grid's data
                $scope.gridOptions.data = $scope.messages;
                // apply current filter on messages
                $scope.filterMessages();

            }, function (err) {
                // log
                console.log(err);
            });
        };

        /*
         *      Delete Message
         */
        $scope.deleteMessage = function(message) {
            // Issue delete request to the server
            $http({
                method: 'POST',
                url: '/api/messages/delete',
                data: message
            }).then(function (result) {
                console.log(result);

                // if deletion was successful
                if (result && result.data && result.data.deleted)
                    $scope.getMessages();
            }, function (err) {
                // log
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
                    // Issue update request to the server
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
                        // log
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
                    // Issue update request to the server
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
                        // log
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
                // update data
                $scope.messages = messages.data;
                // set messages as the grid's data
                $scope.gridOptions.data = $scope.messages;
                // apply current filter on messages
                $scope.filterMessages();
            }, function (err) {
                // log
                console.log(err);
            });
        };

        /*
         *      Yoda Speak
         */
        $scope.yodalize = function() {
            $http({
                method: 'GET',
                url: 'https://yoda.p.mashape.com/yoda',
                params: {sentence: $scope.yodaSentence },
                headers: {
                    'X-Mashape-Key': 'BaiiIKpF50mshxlhBM5NyhdzJkuqp17njAvjsnHd54ouD9mL2x'
                }
            }).then(function (yodaSentence) {
                $scope.yodaSentence = yodaSentence.data;
            }, function (err) {
                console.log(err);
            });
        }

        $scope.getMessages();
    }]);