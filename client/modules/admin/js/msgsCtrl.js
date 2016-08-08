/**
 * Michael Roytman
 * Itay Desalto
 * Marom Felz
 */
// setup admin controller
angular.module('adminApp').controller('msgsCtrl', ['$scope', '$http', '$uibModal', '$filter',
    function ($scope, $http, $uibModal, $filter) {

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

        $scope.msgs = [];

        $scope.searchParams = {
            txtFieldsCount: 0,
            imgFieldsCount: 0,
            minDisplayLength: 0
        };


        /*
         *      Get Messages
         */
        $scope.getMessages = function()
        {
            // Get all the messages to display
            $http({
                method: 'GET',
                url: '/api/msgs'
            }).then(function (msgs) {

                // update data
                $scope.msgs = msgs.data;
                // set msgs as the grid's data
                $scope.gridOptions.data = $scope.msgs;
                // apply current filter on msgs
                $scope.filterMessages();

            }, function (err) {
                // log
                console.log(err);
            });
        };


        /*
         *      Delete Message
         */
        $scope.deleteMessage = function(msg) {

            // Issue delete request to the server
            $http({
                method: 'POST',
                url: '/api/msgs/delete',
                data: msg
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
        $scope.updateMessage = function(msg) {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/msgDetails.html',
                controller: 'updateMsgCtrl',
                size: 'lg',
                resolve: {
                    initial: function() {
                        return msg;
                    }
                }
            });

            modalInstance.result.then(function(msg) {

                    // Issue update request to the server
                    $http({
                        method: 'POST',
                        url: '/api/msgs/update',
                        data: msg
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
                templateUrl: '../partials/msgDetails.html',
                controller: 'addMsgCtrl',
                size: 'lg',
                resolve: {}
            });

            modalInstance.result.then(function(msg) {

                    // Issue update request to the server
                    $http({
                        method: 'POST',
                        url: '/api/msgs/add',
                        data: msg
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
            $scope.gridOptions.data = $filter('filter')($scope.msgs, $scope.searchText, undefined);
        };


        /*
         *     Search Messages
         */
        $scope.searchMessages = function(queryType) {

            // set query type
            $scope.searchParams.queryType = queryType;

            $http({
                method: 'GET',
                url: '/api/msgs/search',
                params: $scope.searchParams
            }).then(function (msgs) {

                // update data
                $scope.msgs = msgs.data;
                // set msgs as the grid's data
                $scope.gridOptions.data = $scope.msgs;
                // apply current filter on msgs
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
                // log
                console.log(err);
            });
        }

        // get messages
        $scope.getMessages();

    }]);