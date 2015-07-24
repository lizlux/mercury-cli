/// <reference path="../app.ts" />
/// <reference path="../../mercury/modules/Thumbnailer.ts" />
/**
 * @desc Helper to generate img element with link to thumbnail as the src attribute
 * Use case: {{thumbnail url width=100 height=100 mode=thumbMode alt=name}}
 * Only the first parameter (url) is required, rest is optional
 */
Em.Handlebars.registerBoundHelper('thumbnail', function (url, options) {
    var thumbnailer = Mercury.Modules.Thumbnailer, className = '', defaultMode = thumbnailer.mode.fixedAspectRatio, defaultWidth = 100, defaultHeight = 100, 
    // empty gif
    src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAQAIBRAA7', mode, width, height, alt;
    // validate thumbnailer mode
    if (options.hash.mode) {
        for (var key in thumbnailer.mode) {
            if (thumbnailer.mode.hasOwnProperty(key) && thumbnailer.mode[key] === options.hash.mode) {
                mode = options.hash.mode;
                break;
            }
        }
    }
    if (typeof mode === 'undefined') {
        mode = defaultMode;
    }
    width = Em.getWithDefault(options, 'hash.width', defaultWidth);
    height = Em.getWithDefault(options, 'hash.height', defaultHeight);
    alt = Em.Handlebars.Utils.escapeExpression(Em.get(options, 'hash.alt'));
    className = Em.Handlebars.Utils.escapeExpression(Em.get(options, 'hash.className')) || className;
    if (url) {
        src = thumbnailer.getThumbURL(url, {
            mode: mode,
            width: width,
            height: height
        });
    }
    return new Em.Handlebars.SafeString(`<img src="${src}" alt="${alt}" class="${className}">`);
});
