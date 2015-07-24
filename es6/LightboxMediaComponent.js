/// <reference path="../models/MediaModel.ts" />
'use strict';
App.LightboxMediaComponent = Em.Component.extend(App.ThirdsClickMixin, {
    classNames: ['lightbox-media', 'lightbox-content-inner'],
    // This is needed for keyDown event to work
    attributeBindings: ['tabindex'],
    tabindex: 0,
    videoPlayer: null,
    /**
     * @desc gets current media from model
     *
     * @return object
     */
    current: Em.computed('model.media', 'model.mediaRef', function () {
        var mediaModel = this.get('model.media');
        if (mediaModel instanceof App.MediaModel) {
            return mediaModel.find(this.get('model.mediaRef'));
        }
        else {
            Em.Logger.error('Media model is not an instance of App.MediaModel');
            return null;
        }
    }),
    /**
     * @desc gets current media or current media from gallery
     *
     * @return object
     */
    currentMedia: Em.computed('current', 'isGallery', 'currentGalleryRef', function () {
        var current = this.get('current');
        return this.get('isGallery') ? current[this.get('currentGalleryRef')] : current;
    }),
    currentGalleryRef: Em.computed('model.galleryRef', {
        get() {
            return this.get('model.galleryRef') || 0;
        },
        set(key, value) {
            var galleryLength = this.get('galleryLength') - 1;
            if (value < 0) {
                return galleryLength;
            }
            else if (value > galleryLength) {
                return 0;
            }
            return value;
        }
    }),
    galleryLength: Em.computed('isGallery', 'current', function () {
        return this.get('isGallery') ? this.get('current').length : -1;
    }),
    /**
     * @desc checks if current displayed media is a gallery
     *
     * @return boolean
     */
    isGallery: Em.computed('current', function () {
        return Em.isArray(this.get('current'));
    }),
    /**
     * @desc checks if current media is a video or image
     * and which lightbox component to render
     *
     * @return string
     */
    lightboxComponent: Em.computed('currentMedia', function () {
        var currentMedia = this.get('currentMedia');
        return currentMedia && currentMedia.url && currentMedia.type ? 'lightbox-' + currentMedia.type : null;
    }),
    modelObserver: Em.observer('model', 'currentMedia', function () {
        this.updateHeader();
        this.updateFooter();
        this.sendAction('setQueryParam', 'file', M.String.normalizeToUnderscore(this.get('currentMedia.title')));
    }).on('didInsertElement'),
    didInsertElement: function () {
        // This is needed for keyDown event to work
        this.$().focus();
    },
    click: function (event) {
        if (this.get('isGallery')) {
            this.callClickHandler(event, true);
        }
        else {
            this._super(event);
        }
    },
    keyDown: function (event) {
        if (this.get('isGallery')) {
            if (event.keyCode === 39) {
                //handle right arrow
                this.nextMedia();
            }
            else if (event.keyCode === 37) {
                //handle left arrow
                this.prevMedia();
            }
        }
        this._super(event);
    },
    gestures: {
        swipeLeft: function () {
            if (this.get('isGallery')) {
                this.nextMedia();
            }
        },
        swipeRight: function () {
            if (this.get('isGallery')) {
                this.prevMedia();
            }
        }
    },
    rightClickHandler: function () {
        this.nextMedia();
        return true;
    },
    leftClickHandler: function () {
        this.prevMedia();
        return true;
    },
    centerClickHandler: function () {
        // Bubble up
        return false;
    },
    nextMedia: function () {
        this.incrementProperty('currentGalleryRef');
        M.track({
            action: M.trackActions.paginate,
            category: 'lightbox',
            label: 'next'
        });
    },
    prevMedia: function () {
        this.decrementProperty('currentGalleryRef');
        M.track({
            action: M.trackActions.paginate,
            category: 'lightbox',
            label: 'previous'
        });
    },
    updateHeader: function () {
        var header = null;
        if (this.get('isGallery')) {
            header = (this.get('currentGalleryRef') + 1) + ' / ' + this.get('galleryLength');
        }
        this.sendAction('setHeader', header);
    },
    updateFooter: function () {
        var currentMedia = this.get('currentMedia'), footer = null;
        if (currentMedia && currentMedia.caption) {
            footer = currentMedia.caption.htmlSafe();
        }
        this.sendAction('setFooter', footer);
    }
});
