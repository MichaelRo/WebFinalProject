/**
 * Michael Roytman
 * Itay Desalto
 * Marom Felz
 */
// global namespace
var app = app || {};


app.Message = function (name) {
    this.name = name;
    this.textArr = [];
    this.imageArr = [];
    this.videoPath = "";
    this.screensArray = [];
    this.templateUrl = "";
    this.displayLength = 5; // Default length of 60 seconds
    this.timeFrames = [];
}


app.Message.prototype.addImage = function(imagePath) {
    if (this.imageArr.length <= 5)
    {
        this.imageArr[this.imageArr.length] = imagePath;
    }
}


app.Message.prototype.addText = function(text) {
    if (this.textArr.length <= 10)
    {
        this.textArr[this.textArr.length] = text;
    }
}

app.Message.prototype.addTimeFrame = function(startDate, endDate, daysInWeek, startTime, endTime)
{
    this.timeFrames[this.timeFrames.length] = new app.TimeFrame(startDate, endDate, daysInWeek, startTime, endTime);
}