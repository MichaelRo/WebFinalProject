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
    this.screensArr = [];
    this.templateUrl = "";
    this.displayLength = 5; // Default length of 60 seconds
    this.timeframes = [];
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

app.Message.prototype.addTimeframe = function(fromDate, toDate, daysInWeek, fromTime, toTime)
{
    this.timeframes[this.timeframes.length] = new app.Timeframe(fromDate, toDate, daysInWeek, fromTime, toTime);
}