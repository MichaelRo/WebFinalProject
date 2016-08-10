/**
 * Michael Roytman
 * Itay Desalto
 * Marom Felz
 */

var app = app || {};

app.Message = function (name) {
    this.name = name;
    this.textArray = [];
    this.imageArrary = [];
    this.videoPath = "";
    this.screensArray = [];
    this.templateUrl = "";
    this.displayLength = 5; // Default length of 60 seconds
    this.timeFrames = [];
}

app.Message.prototype.addImage = function(imagePath) {
    if (this.imageArrary.length <= 5) {
        this.imageArrary[this.imageArrary.length] = imagePath;
    }
}

app.Message.prototype.addText = function(text) {
    if (this.textArray.length <= 10) {
        this.textArray[this.textArray.length] = text;
    }
}

app.Message.prototype.addTimeFrame = function(startDate, endDate, daysInWeek, startTime, endTime) {
    this.timeFrames[this.timeFrames.length] = new app.TimeFrame(startDate, endDate, daysInWeek, startTime, endTime);
}