/**
 * Michael Roytman
 * Itay Desalto
 * Marom Felz
 */
// global namespace
var app = app || {};


app.TimeFrame = function (startDate, endDate, daysInWeek, startTime, endTime) {
    this.startDate = startDate;
    this.endDate= endDate;
    this.daysInWeek= daysInWeek;
    this.startTime = startTime;
    this.endTime = endTime;
}