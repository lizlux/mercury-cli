/// <reference path="../app.ts" />
/// <reference path="../../baseline/mercury.d.ts" />
/// <reference path="../../mercury/modules/Thumbnailer.ts" />
/// <reference path="../mixins/VisibleMixin.ts" />
/// <reference path="../models/MediaModel.ts" />
'use strict';
App.MediaComponent = Em.Component.extend(App.VisibleMixin, {
    tagName: 'figure',
    classNames: ['media-component'],
    width: null,
    height: null,
    ref: null,
    emptyGif: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAQAIBRAA7',
    visible: false,
    media: null,
    thumbnailer: Mercury.Modules.Thumbnailer,
    limitHeight: false,
    //thumb widths
    thumbSize: {
        small: 340,
        medium: 660,
        large: 900
    },
    //if media inside infobox, don't display caption
    noCaption: Em.computed.equal('media.context', 'infobox'),
    //icon width depends on it's real dimensions
    iconHeight: 20,
    iconWidth: Em.computed('media', 'iconHeight', function () {
        var media = this.get('media'), iconHeight = this.get('iconHeight');
        return Math.floor(iconHeight * media.width / media.height);
    }),
    normalizeThumbWidth: function (width) {
        if (width <= this.thumbSize.small) {
            return this.thumbSize.small;
        }
        else if (width <= this.thumbSize.medium) {
            return this.thumbSize.medium;
        }
        return this.thumbSize.medium;
    },
    getThumbURL: function (url, options) {
        if (options.mode === Mercury.Modules.Thumbnailer.mode.thumbnailDown) {
            options.width = this.normalizeThumbWidth(options.width);
        }
        if (!this.get('limitHeight')) {
            options.height = options.width;
        }
        url = this.thumbnailer.getThumbURL(url, options);
        return url;
    },
    /**
     * @desc caption for current media
     */
    caption: Em.computed('media', {
        get() {
            var media = this.get('media'), noCaption = this.get('noCaption');
            if (media && typeof media.caption === 'string' && !noCaption) {
                return media.caption;
            }
        },
        set(key, value) {
            return value;
        }
    }),
    actions: {
        onVisible: function () {
            this.load();
        },
        clickLinkedImage: function () {
            M.track({
                action: M.trackActions.click,
                category: 'linked-image'
            });
        }
    }
});
App.MediaComponent.reopenClass({
    newFromMedia: function (media) {
        if (Em.isArray(media)) {
            if (media.some(function (media) { return !!media.link; })) {
                return App.LinkedGalleryMediaComponent.create();
            }
            else {
                return App.GalleryMediaComponent.create();
            }
        }
        else if (media.type === 'video') {
            return App.VideoMediaComponent.create();
        }
        else {
            return App.ImageMediaComponent.create();
        }
    }
});
