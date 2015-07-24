/// <reference path="../app.ts" />
/// <reference path="../../../../typings/hammerjs/hammerjs" />
/// <reference path="../mixins/FeaturedContentMixin.ts" />
/// <reference path="../mixins/TrackClickMixin.ts"/>
/// <reference path="../../mercury/utils/track.ts"/>
'use strict';
App.FeaturedContentVariation1Component = Em.Component.extend(App.FeaturedContentMixin, App.TrackClickMixin, {
    classNames: ['featured-content-variation-1'],
    gestures: {
        swipeLeft: function () {
            M.VariantTesting.trackEvent('featured-content-next');
            this.nextItem();
        },
        swipeRight: function () {
            M.VariantTesting.trackEvent('featured-content-prev');
            this.prevItem();
        },
    },
    click: function () {
        M.VariantTesting.trackEvent('featured-content-click');
        this.trackClick('modular-main-page', 'featured-content');
    }
});
