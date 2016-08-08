/**
 * Michael Roytman
 * Itay Desalto
 * Marom Felz
 */
// global namespace
var app = app || {};


app.Timeframe = function (fromDate, toDate, daysInWeek, fromTime, toTime) {
    this.fromDate = fromDate;
    this.toDate= toDate;
    this.daysInWeek= daysInWeek;
    this.fromTime = fromTime;
    this.toTime = toTime;
}