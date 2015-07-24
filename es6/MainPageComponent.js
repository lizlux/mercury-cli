/// <reference path="../app.ts" />
/// <reference path="../mixins/AdsMixin.ts" />
'use strict';
App.MainPageComponent = Em.Component.extend(App.AdsMixin, App.TrackClickMixin, {
    classNames: ['main-page-modules', 'main-page-body', 'mw-content'],
    tagName: 'section',
    featuredContentComponentVariation: Em.computed(function () {
        var experimentIds = {
            prod: '3079180094',
            dev: '3054131385'
        }, variationNumber = Mercury.Utils.VariantTesting.getExperimentVariationNumber(experimentIds);
        switch (variationNumber) {
            case 1:
                return 'featured-content-variation-1';
            case 2:
                return 'featured-content-variation-2';
            case 3:
                return 'featured-content-variation-3';
            default:
                return 'featured-content';
        }
    }),
    /**
     * @desc Component is reused so we have to observe on curatedContent to detect transitions between routes
     */
    curatedContentObserver: Em.observer('curatedContent', function () {
        var _this = this;
        Em.run.schedule('afterRender', this, function () {
            _this.injectMainPageAds();
            _this.setupAdsContext(_this.get('adsContext'));
        });
        M.setTrackContext({
            a: this.get('title'),
            n: this.get('ns')
        });
        M.trackPageView(this.get('adsContext.targeting'));
    }).on('didInsertElement'),
    actions: {
        openLightbox: function (lightboxType, lightboxData) {
            this.sendAction('openLightbox', lightboxType, lightboxData);
        },
        openCuratedContentItem: function (item) {
            this.sendAction('openCuratedContentItem', item);
        }
    }
});
