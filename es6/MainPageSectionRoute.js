/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />
App.MainPageSectionRoute = Em.Route.extend({
    model: function (params) {
        return App.CuratedContentModel.find(params.sectionName, 'section');
    },
    afterModel: function (model) {
        var sectionName, title = model.get('title'), mainPageController = this.controllerFor('mainPage'), adsContext = $.extend({}, M.prop('mainPageData.adsContext'));
        try {
            sectionName = decodeURIComponent(decodeURI(title));
        }
        catch (error) {
            sectionName = decodeURIComponent(title);
        }
        sectionName = M.String.normalizeToWhitespace(sectionName);
        document.title = sectionName + ' - ' + Em.getWithDefault(Mercury, 'wiki.siteName', 'Wikia');
        mainPageController.setProperties({
            isRoot: false,
            title: sectionName,
            adsContext: adsContext,
            ns: M.prop('mainPageData.ns')
        });
    },
    renderTemplate: function (controller, model) {
        this.render('main-page', {
            controller: 'mainPage',
            model: {
                curatedContent: model
            }
        });
    },
    actions: {
        error: function (error) {
            if (error && error.status === 404) {
                this.controllerFor('application').addAlert('warning', i18n.t('app.curated-content-error-section-not-found'));
            }
            else {
                this.controllerFor('application').addAlert('warning', i18n.t('app.curated-content-error-other'));
            }
            this.transitionTo('mainPage');
            return true;
        }
    }
});
