/// <reference path="../app.ts" />
/// <reference path="../../../../typings/numeraljs/numeraljs.d.ts" />
Em.Handlebars.registerBoundHelper('numeral', function (numberToFormat, format) {
    return numeral(numberToFormat).format(format);
});
