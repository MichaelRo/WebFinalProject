/**
 * Michael Roytman
 * Itay Desalto
 * Marom Felz
 */
angular.module('adminApp').controller('updateMsgCtrl', ['$scope', '$uibModalInstance', 'initial',
    function ($scope, $uibModalInstance, initial) {

        // Define a new variable to hold the value of the new msg
        $scope.msg = cloneMessageToMessageWithDates(initial);

        //
        // Calls when modal is being closed by the OK button
        //
        $scope.ok = function() {

            var editedMsg = cloneMessageToMessageWithTimestamps($scope.msg);
            $uibModalInstance.close(editedMsg);
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
        $scope.addTimeframe = function()
        {
            $scope.msg.timeframes.push({
                fromDate: new Date(),
                toDate: new Date(),
                daysInWeek: [],
                fromTime: 1,
                toTime: 23
            })
        };


        /*
         *      remove timeframe
         */
        $scope.removeTimeframe = function(timeframe){

            // delete only when there is atleast one timeframe left
            if ($scope.msg.timeframes.length > 1)
            {
                // find index of timeframe to delete
                var index = $scope.msg.timeframes.indexOf(timeframe);
                // if timeframe found
                if (index > -1) {
                    $scope.msg.timeframes.splice(index, 1);
                }
            }
        }

        function cloneMessageToMessageWithDates(msgWithTimestamps)
        {
            // Define a new variable to hold the value of the new bid
            var newMsg = {
                _id: msgWithTimestamps._id,
                name: msgWithTimestamps.name,
                textArr: msgWithTimestamps.textArr,
                imageArr: msgWithTimestamps.imageArr,
                videoPath: msgWithTimestamps.videoPath,
                screensArr: msgWithTimestamps.screensArr,
                templateUrl: msgWithTimestamps.templateUrl,
                displayLength: msgWithTimestamps.displayLength,
                timeframes: []
            };

            // parse timeframes from timestamps to date objects
            msgWithTimestamps.timeframes.forEach(function(timeframe, index, timeframes) {
                newMsg.timeframes.push({
                        fromDate: new Date(timeframe.fromDate*1000),
                        fromTime: timeframe.fromTime,
                        toDate: new Date(timeframe.toDate*1000),
                        toTime: timeframe.toTime,
                        daysInWeek: timeframe.daysInWeek
                });
            });

            return newMsg;
        }



        function cloneMessageToMessageWithTimestamps(msgWithDates)
        {
            // Define a new variable to hold the value of the new bid
            var newMsg = {
                _id: msgWithDates._id,
                name: msgWithDates.name,
                textArr: msgWithDates.textArr,
                imageArr: msgWithDates.imageArr,
                videoPath: msgWithDates.videoPath,
                screensArr: _.map( msgWithDates.screensArr, function(screen){ return parseInt(screen); }),
                templateUrl: msgWithDates.templateUrl,
                displayLength: msgWithDates.displayLength,
                timeframes: []
            };

            // parse timeframes from date objects to timestamps
            msgWithDates.timeframes.forEach(function(timeframe, index, timeframes) {
                newMsg.timeframes.push({
                    fromDate: parseInt(timeframe.fromDate.getTime()/1000),
                    fromTime: timeframe.fromTime,
                    toDate: parseInt(timeframe.toDate.getTime()/1000),
                    toTime: timeframe.toTime,
                    daysInWeek: _.map( timeframe.daysInWeek, function(day){ return parseInt(day); })
                });
            });

            return newMsg;
        }

    }]);