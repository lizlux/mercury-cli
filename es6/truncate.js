/// <reference path="../app.ts" />
Em.Handlebars.registerBoundHelper('truncate', function (string, maxLength) {
    if (maxLength === void 0) { maxLength = 48; }
    var truncatedString, lastSpacePosition, ellipsisCharacter = '\u2026';
    if (string.length <= maxLength) {
        return string;
    }
    truncatedString = string.substr(0, maxLength);
    lastSpacePosition = truncatedString.lastIndexOf(' ');
    if (lastSpacePosition === maxLength || lastSpacePosition < 0) {
        return truncatedString + ellipsisCharacter;
    }
    return truncatedString.substr(0, lastSpacePosition) + ellipsisCharacter;
});
