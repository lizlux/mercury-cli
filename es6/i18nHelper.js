/// <reference path="../app.ts" />
Em.Handlebars.registerBoundHelper('i18n', function () {
    var _this = this;
    var options = Array.prototype.pop.call(arguments), params = {}, value, namespace = 'main';
    if (arguments.length > 1) {
        value = Array.prototype.join.call(arguments, '.');
    }
    else {
        value = arguments[0];
    }
    Object.keys(options.hash).forEach(function (key) {
        if (key === 'ns') {
            namespace = options.hash[key];
        }
        else if (key !== 'boundOptions' && options.hash[key]) {
            params[key] = _this.get('parentView').get(String(options.hash[key]));
        }
    });
    return i18n.t(namespace + ':' + value, params);
});
