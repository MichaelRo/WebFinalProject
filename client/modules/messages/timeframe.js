/**
 * Michael Roytman
 * Itay Desalto
 * Marom Felz
 */
// global namespace
var app = app || {};


app.Timeframe = function (fromDate, toDate, daysInWeek, fromTime, toTime) {
    this.startDate = fromDate;
    this.endDate= toDate;
    this.daysInWeek= daysInWeek;
    this.startTime = fromTime;
    this.endTime = toTime;
}