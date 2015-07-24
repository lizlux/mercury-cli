/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />
App.MainPageCategoryRoute = Em.Route.extend({
    model: function (params) {
        return App.CuratedContentModel.find(params.categoryName, 'category');
    },
    afterModel: function (model) {
        var categoryName, title = model.get('title'), mainPageController = this.controllerFor('mainPage'), adsContext = $.extend({}, M.prop('mainPageData.adsContext'));
        try {
            categoryName = decodeURIComponent(decodeURI(title));
        }
        catch (error) {
            categoryName = decodeURIComponent(title);
        }
        categoryName = M.String.normalizeToWhitespace(categoryName);
        document.title = categoryName + ' - ' + Em.getWithDefault(Mercury, 'wiki.siteName', 'Wikia');
        mainPageController.setProperties({
            isRoot: false,
            title: categoryName,
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
                this.controllerFor('application').addAlert('warning', i18n.t('app.curated-content-error-category-not-found'));
            }
            else {
                this.controllerFor('application').addAlert('warning', i18n.t('app.curated-content-error-other'));
            }
            this.transitionTo('mainPage');
            return true;
        }
    }
});
