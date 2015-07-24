/// <reference path="../app.ts" />
/// <reference path="../../mercury/utils/dateTime.ts" />
/**
 * @desc Helper to give textual representation of time interval between past date
 * and the current time/date in the form
 *
 * {timeAgo unixTimestamp}
 *
 * which returns something like '2 days ago'
 */
Em.Handlebars.registerBoundHelper('timeAgo', function (unixTimestamp) {
    var fromDate = new Date(unixTimestamp * 1000), interval = M.DateTime.timeAgo(fromDate);
    switch (interval.type) {
        case 0 /* Now */:
            return i18n.t('app.now-label');
        case 1 /* Second */:
            return i18n.t('app.seconds-ago-label', { count: interval.value });
        case 2 /* Minute */:
            return i18n.t('app.minutes-ago-label', { count: interval.value });
        case 3 /* Hour */:
            return i18n.t('app.hours-ago-label', { count: interval.value });
        case 4 /* Day */:
            return i18n.t('app.days-ago-label', { count: interval.value });
        case 5 /* Month */:
            return i18n.t('app.months-ago-label', { count: interval.value });
        case 6 /* Year */:
            return i18n.t('app.years-ago-label', { count: interval.value });
        default:
            Em.Logger.error('Unexpected date interval for timestamp', unixTimestamp);
            return '';
    }
});
