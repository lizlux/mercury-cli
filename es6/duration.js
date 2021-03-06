/// <reference path="../app.ts" />
/**
 * @desc Formats a number of seconds into a duration, in the form HH:MM:SS
 */
Em.Handlebars.registerBoundHelper('duration', function (value) {
    var hours = Math.floor(value / 3600), minutes = Math.floor((value - (hours * 3600)) / 60), seconds = Math.floor(value - (hours * 3600) - (minutes * 60)), duration = '';
    if (hours > 0) {
        duration += (hours < 10 ? '0' : '') + hours + ':';
    }
    duration += (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    return duration;
});
