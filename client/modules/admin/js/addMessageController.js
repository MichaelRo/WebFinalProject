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

        // Modal is being closed by the OK button
        $scope.ok = function() {
            $uibModalInstance.close(cloneMessageIncludingTimestamps($scope.message));
        };

        // Modal is being closed by the Cancel button
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };

       // Adds a new time frame
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

        // Removes existing time frame
        $scope.removeTimeFrame = function(timeFrame) {
            // Get the index of time frame to delete
            var index = $scope.message.timeFrames.indexOf(timeFrame);

            // If time frame found
            if (index > -1) {
                $scope.message.timeFrames.splice(index, 1);
            }
        }

        /**
         * This method clones a message with it's time stamps
         * @param messageWithDates - The message
         * @returns - The new message with time stamps
         */
        function cloneMessageIncludingTimestamps(messageWithDates) {
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

            // Parse time frames from date objects to timestamps
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