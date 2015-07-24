/// <reference path="../app.ts" />
/// <reference path="../../baseline/mercury.d.ts" />
/// <reference path="../mixins/VisibilityStateManager.ts" />
'use strict';
App.ArticleController = Em.Controller.extend({
    needs: ['application'],
    noAds: Em.computed.alias('controllers.application.noAds'),
    commentsPage: Em.computed.alias('controllers.application.commentsPage'),
    init: function () {
        this.setProperties({
            mainPageTitle: Em.get(Mercury, 'wiki.mainPageTitle'),
            siteName: Em.getWithDefault(Mercury, 'wiki.siteName', 'Wikia')
        });
    },
    actions: {
        updateHeaders: function (headers) {
            var article = this.get('model');
            article.set('sections', headers);
        },
        edit: function (title, sectionIndex) {
            App.VisibilityStateManager.reset();
            this.transitionToRoute('edit', title, sectionIndex);
            M.track({
                action: M.trackActions.click,
                category: 'sectioneditor',
                label: 'edit',
                value: sectionIndex
            });
        },
        addPhoto: function (title, sectionIndex, photoData) {
            this.transitionToRoute('addPhoto', App.AddPhotoModel.load(title, sectionIndex, photoData));
        },
        articleRendered: function () {
            this.send('handleLightbox');
        }
    }
});
