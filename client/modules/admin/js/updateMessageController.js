/**
 * Michael Roytman
 * Itay Desalto
 * Marom Felz
 */
angular.module('adminApp').controller('updateMessageController', ['$scope', '$uibModalInstance', 'initial',
    function ($scope, $uibModalInstance, initial) {

        // Define a new variable to hold the value of the new message
        $scope.message = cloneMessageToMessageWithDates(initial);

        //
        // Calls when modal is being closed by the OK button
        //
        $scope.ok = function() {

            var editedMessage = cloneMessageToMessageWithTimestamps($scope.message);
            $uibModalInstance.close(editedMessage);
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
        $scope.removeTimeframe = function(timeframe){

            // delete only when there is atleast one timeframe left
            if ($scope.message.timeFrames.length > 1)
            {
                // find index of timeframe to delete
                var index = $scope.message.timeFrames.indexOf(timeframe);
                // if timeframe found
                if (index > -1) {
                    $scope.message.timeFrames.splice(index, 1);
                }
            }
        }

        function cloneMessageToMessageWithDates(messageWithTimestamps)
        {
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

            // parse timeframes from timestamps to date objects
            messageWithTimestamps.timeFrames.forEach(function(timeframe, index, timeframes) {
                newMessage.timeFrames.push({
                        startDate: new Date(timeframe.startDate*1000),
                        startTime: timeframe.startTime,
                        endDate: new Date(timeframe.endDate*1000),
                        endTime: timeframe.endTime,
                        daysInWeek: timeframe.daysInWeek
                });
            });

            return newMessage;
        }



        function cloneMessageToMessageWithTimestamps(messageWithDates)
        {
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
                    startDate: parseInt(timeframe.startDate.getTime()/1000),
                    startTime: timeframe.startTime,
                    endDate: parseInt(timeframe.endDate.getTime()/1000),
                    endTime: timeframe.endTime,
                    daysInWeek: _.map( timeframe.daysInWeek, function(day){ return parseInt(day); })
                });
            });

            return newMessage;
        }

    }]);