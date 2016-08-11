/**
 * Michael Roytman
 * Itay Desalto
 * Marom Felz
 */

angular.module('adminApp').controller('updateMessageController', ['$scope', '$uibModalInstance', 'initial',
    function ($scope, $uibModalInstance, initial) {
        $scope.message = cloneMessageToMessageWithDates(initial);

        // Modal is being closed by the OK button
        $scope.ok = function() {
            $uibModalInstance.close(cloneMessageToMessageWithTimestamps($scope.message));
        };

        // Modal is being closed by the Cancel button
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };

        // Adds a new time frame
        $scope.addTimeFrame = function() {
            $scope.message.timeFrames.push({
                startDate: new Date(),
                endDate: new Date(),
                daysInWeek: [],
                startTime: 1,
                endTime: 23
            })
        };


        // remove specific time frame
        $scope.removeTimeFrame = function(timeFrame) {
            // delete only if at least one timeFrame left
            if ($scope.message.timeFrames.length > 1) {
                // find index of timeFrame to delete
                var index = $scope.message.timeFrames.indexOf(timeFrame);

                // if timeFrame found
                if (index > -1) {
                    $scope.message.timeFrames.splice(index, 1);
                }
            }
        }

        /**
         * This method clones a message with dates
         * @param messageWithDates - The message
         * @returns - The new message with dates
         */
        function cloneMessageToMessageWithDates(messageWithTimestamps) {
            // Define a new variable to hold the value of the new bid
            var newMessage = {
                _id: messageWithTimestamps._id,
                name: messageWithTimestamps.name,
                textArray: messageWithTimestamps.textArray,
                imageArray: messageWithTimestamps.imageArray,
                videoPath: messageWithTimestamps.videoPath,
                screensArray: messageWithTimestamps.screensArray,
                templateUrl: messageWithTimestamps.templateUrl,
                displayLength: messageWithTimestamps.displayLength,
                timeFrames: []
            };

            // parse timeFrames from timestamps to date objects
            messageWithTimestamps.timeFrames.forEach(function(timeFrame, index, timeFrames) {
                newMessage.timeFrames.push({
                    startDate: new Date(timeFrame.startDate * 1000),
                    startTime: timeFrame.startTime,
                    endDate: new Date(timeFrame.endDate * 1000),
                    endTime: timeFrame.endTime,
                    daysInWeek: timeFrame.daysInWeek
                });
            });

            return newMessage;
        }


        /**
         * This method clones a message with it's time stamps
         * @param messageWithDates - The message
         * @returns - The new message with time stamps
         */
        function cloneMessageToMessageWithTimestamps(messageWithDates) {
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

            // parse timeFrames from date objects to timestamps
            messageWithDates.timeFrames.forEach(function(timeFrame, index, timeFrames) {
                newMessage.timeFrames.push({
                    startDate: parseInt(timeFrame.startDate.getTime() / 1000),
                    startTime: timeFrame.startTime,
                    endDate: parseInt(timeFrame.endDate.getTime() / 1000),
                    endTime: timeFrame.endTime,
                    daysInWeek: _.map(timeFrame.daysInWeek, function(day){ return parseInt(day); })
                });
            });

            return newMessage;
        }
    }]);