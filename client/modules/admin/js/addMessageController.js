/**
 * Michael Roytman
 * Itay Desalto
 * Marom Felz
 */
angular.module('adminApp').controller('addMessageController', ['$scope', '$uibModalInstance',
    function ($scope, $uibModalInstance) {

        // Define a new variable to hold the value of the new message
        $scope.message = {
            name: "",
            textArray: [],
            imageArray: [],
            videoPath: "",
            screensArray: [],
            templateUrl: "",
            displayLength: 0,
            timeFrames: [{
                startDate: new Date(),
                endDate: new Date(),
                daysInWeek: [],
                startTime: 1,
                endTime: 23
            }]
        };

        //
        // Calls when modal is being closed by the OK button
        //
        $scope.ok = function() {
            $uibModalInstance.close(cloneMessageIncludingTimestamps($scope.message));
        };

        //
        // Calls when modal is being closed by the Cancel button
        //
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };

        /*
         *      Adds a new timeframe
         */
        $scope.addTimeFrame = function()
        {
            $scope.message.timeFrames.push({
                startDate: new Date(),
                endDate: new Date(),
                daysInWeek: [],
                startTime: 1,
                endTime: 23
            })
        };

        /*
         *      remove timeframe
         */
        $scope.removeTimeFrame = function(timeFrame) {
            // delete only when there is at least one timeFrame left
            if ($scope.message.timeFrames.length > 1) {
                // find index of timeFrame to delete
                var index = $scope.message.timeFrames.indexOf(timeFrame);

                // if timeFrame found
                if (index > -1) {
                    $scope.message.timeFrames.splice(index, 1);
                }
            }
        }

        function cloneMessageIncludingTimestamps(messageWithDates) {
            // Define a new variable to hold the value of the new bid
            var newMessage = {
                _id: messageWithDates._id,
                name: messageWithDates.name,
                textArray: messageWithDates.textArray,
                imageArray: messageWithDates.imageArray,
                videoPath: messageWithDates.videoPath,
                screensArray: _.map( messageWithDates.screensArray, function(screen){ return parseInt(screen); }),
                templateUrl: messageWithDates.templateUrl,
                displayLength: messageWithDates.displayLength,
                timeFrames: []
            };

            // parse timeframes from date objects to timestamps
            messageWithDates.timeFrames.forEach(function(timeframe, index, timeframes) {
                newMessage.timeFrames.push({
                    startDate: parseInt(timeframe.startDate.getTime() / 1000),
                    startTime: timeframe.startTime,
                    endDate: parseInt(timeframe.endDate.getTime() / 1000),
                    endTime: timeframe.endTime,
                    daysInWeek: _.map( timeframe.daysInWeek, function(day){ return parseInt(day); })
                });
            });

            return newMessage;
        }
    }]);