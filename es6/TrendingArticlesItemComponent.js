/// <reference path="../app.ts" />
/// <reference path="../mixins/ViewportMixin.ts"/>
/// <reference path="../../mercury/modules/Thumbnailer.ts" />
/// <reference path="../mixins/TrackClickMixin.ts"/>
'use strict';
App.TrendingArticlesItemComponent = Em.Component.extend(App.ViewportMixin, App.TrackClickMixin, {
    tagName: 'a',
    classNames: ['trending-articles-item'],
    attributeBindings: ['href', 'style'],
    cropMode: Mercury.Modules.Thumbnailer.mode.topCrop,
    thumbnailer: Mercury.Modules.Thumbnailer,
    emptyGif: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAQAIBRAA7',
    style: null,
    imageWidth: 250,
    currentlyRenderedImageUrl: Em.computed.oneWay('emptyGif'),
    href: Em.computed.oneWay('url'),
    imageHeight: Em.computed(function () {
        return Math.floor(this.get('imageWidth') * 9 / 16);
    }),
    viewportObserver: Em.observer('viewportDimensions.width', function () {
        this.updateImageSize(this.get('viewportDimensions.width'));
    }),
    willInsertElement: function () {
        this.updateImageSize(this.get('viewportDimensions.width'));
    },
    didInsertElement: function () {
        if (this.get('imageUrl')) {
            this.lazyLoadImage();
        }
    },
    click: function () {
        this.trackClick('modular-main-page', 'trending-articles');
    },
    lazyLoadImage: function () {
        var options = {
            width: this.get('imageWidth'),
            height: this.get('imageHeight'),
            mode: this.get('cropMode')
        }, imageUrl = this.thumbnailer.getThumbURL(this.get('imageUrl'), options);
        this.set('currentlyRenderedImageUrl', imageUrl);
    },
    updateImageSize: function (viewportWidth) {
        var imageWidth = Math.floor((viewportWidth - 20) / 2), imageWidthString = String(imageWidth), imageHeightString = String(Math.floor(imageWidth * 9 / 16));
        this.set('style', Em.String.htmlSafe(`width: ${imageWidthString}px;`));
        this.set('imageStyle', Em.String.htmlSafe(`height: ${imageHeightString}px;`));
    }
});
