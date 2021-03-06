/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />
'use strict';
App.AddPhotoRoute = Em.Route.extend({
    actions: {
        error: function (error, transition) {
            this.controllerFor('application').addAlert('alert', i18n.t('app.addphoto-load-error'));
            M.track({
                action: M.trackActions.impression,
                category: 'sectionaddphoto',
                label: 'addphoto-load-error'
            });
            return true;
        },
        willTransition: function (transition) {
            var _this = this;
            transition.then(function () {
                _this.controllerFor('application').set('fullPage', false);
            });
            return true;
        },
        didTransition: function () {
            // AddPhotoRoute works in "fullPage mode" (unlike ArticleRoute) which means that it takes
            // over whole page (so navigation, share feature, etc. are not displayed). To understand
            // better take a look at application.hbs.
            this.controllerFor('application').set('fullPage', true);
            window.scrollTo(0, 0);
            M.track({
                action: M.trackActions.impression,
                category: 'sectionaddphoto',
                label: 'addphoto-loaded'
            });
            return true;
        }
    }
});
