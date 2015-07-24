/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />
'use strict';
App.MainPageIndexRoute = Em.Route.extend({
    model: function () {
        return App.MainPageModel.find();
    },
    afterModel: function (model) {
        var mainPageTitle = M.String.normalizeToWhitespace(Em.get(Mercury, 'wiki.mainPageTitle'));
        document.title = mainPageTitle + ' - ' + Em.getWithDefault(Mercury, 'wiki.siteName', 'Wikia');
        this.controllerFor('mainPage').setProperties({
            adsContext: model.get('adsContext'),
            isRoot: true,
            ns: model.get('ns'),
            title: Em.getWithDefault(Mercury, 'wiki.siteName', 'Wikia')
        });
    },
    renderTemplate: function (controller, model) {
        if (model.isCuratedMainPage) {
            this.render('main-page', {
                controller: 'mainPage',
                model: model
            });
        }
        else {
            this.render('article', {
                view: 'article',
                model: model
            });
        }
    }
});
