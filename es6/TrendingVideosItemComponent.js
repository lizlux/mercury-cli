/// <reference path="../app.ts" />
/// <reference path="../mixins/ViewportMixin.ts"/>
/// <reference path="../../mercury/modules/Thumbnailer.ts" />
/// <reference path="../mixins/TrackClickMixin.ts"/>
'use strict';
App.TrendingVideosItemComponent = Em.Component.extend(App.ViewportMixin, App.TrackClickMixin, {
    tagName: 'a',
    classNames: ['trending-videos-item'],
    attributeBindings: ['href', 'style'],
    thumbnailer: Mercury.Modules.Thumbnailer,
    cropMode: Mercury.Modules.Thumbnailer.mode.topCrop,
    emptyGif: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAQAIBRAA7',
    style: null,
    video: null,
    imageWidth: 250,
    href: Em.computed.oneWay('video.fileUrl'),
    imageHeight: Em.computed(function () {
        return Math.floor(this.get('imageWidth') * 9 / 16);
    }),
    thumbUrl: Em.computed('video.url', function () {
        var options = {
            width: this.get('imageWidth'),
            height: this.get('imageHeight'),
            mode: this.get('cropMode')
        }, videoUrl = this.get('video.url');
        if (videoUrl) {
            return this.thumbnailer.getThumbURL(videoUrl, options);
        }
        else {
            return this.emptyGif;
        }
    }),
    viewportObserver: Em.observer('viewportDimensions.width', function () {
        this.updateImageSize(this.get('viewportDimensions.width'));
    }),
    willInsertElement: function () {
        this.updateImageSize(this.get('viewportDimensions.width'));
    },
    click: function () {
        this.trackClick('modular-main-page', 'trending-videos');
        this.sendAction('action', this.get('video'));
        return false;
    },
    updateImageSize: function (viewportWidth) {
        var imageHeightString = String(Math.floor((viewportWidth - 10) * 9 / 16));
        this.set('imageStyle', Em.String.htmlSafe(`height: ${imageHeightString}px;`));
    }
});
