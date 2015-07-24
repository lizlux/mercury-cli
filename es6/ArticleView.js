/// <reference path="../app.ts" />
/// <reference path="../models/ArticleModel.ts" />
/// <reference path="../components/MediaComponent.ts" />
/// <reference path="../components/PortableInfoboxComponent.ts" />
/// <reference path="../components/WikiaMapComponent.ts" />
/// <reference path="../mixins/ViewportMixin.ts" />
'use strict';
App.ArticleView = Em.View.extend(App.AdsMixin, App.LanguagesMixin, App.ViewportMixin, {
    classNames: ['article-wrapper'],
    noAds: Em.computed.alias('controller.noAds'),
    hammerOptions: {
        touchAction: 'auto',
        cssProps: {
            /**
             * @see https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-touch-callout
             * 'default' displays the callout
             * 'none' disables the callout
             * hammer.js sets it to 'none' by default so we have to override
             */
            touchCallout: 'default'
        }
    },
    gestures: {
        swipeLeft: function (event) {
            // Track swipe events
            if ($(event.target).parents('.article-table').length) {
                M.track({
                    action: M.trackActions.swipe,
                    category: 'tables'
                });
            }
            else if ($(event.target).parents('.article-gallery').length) {
                M.track({
                    action: M.trackActions.paginate,
                    category: 'gallery',
                    label: 'next'
                });
            }
        },
        swipeRight: function (event) {
            // Track swipe events
            if ($(event.target).parents('.article-gallery').length) {
                M.track({
                    action: M.trackActions.paginate,
                    category: 'gallery',
                    label: 'previous'
                });
            }
        }
    },
    didInsertElement: function () {
        this.get('controller').send('articleRendered');
    },
    contributionFeatureEnabled: Em.computed('controller.model.isMainPage', function () {
        return !this.get('controller.model.isMainPage') && this.get('isJapaneseWikia');
    }),
    articleObserver: Em.observer('controller.model.article', function () {
        // This check is here because this observer will actually be called for views wherein the state is actually
        // not valid, IE, the view is in the process of preRender
        Em.run.scheduleOnce('afterRender', this, this.performArticleTransforms);
    }).on('willInsertElement'),
    modelObserver: Em.observer('controller.model', function () {
        var model = this.get('controller.model');
        if (model) {
            document.title = model.get('cleanTitle') + ' - ' + Mercury.wiki.siteName;
            $('meta[name="description"]').attr('content', (typeof model.get('description') === 'undefined') ? '' : model.get('description'));
        }
    }),
    /**
     * @desc Handle clicks on media and bubble up to Application if anything else was clicked
     *
     * @param event
     * @returns {boolean}
     */
    click: function (event) {
        var $anchor = Em.$(event.target).closest('a'), target;
        // Here, we want to handle media only, no links
        if ($anchor.length === 0) {
            target = event.target;
            if (this.shouldHandleMedia(target, target.tagName.toLowerCase())) {
                this.handleMedia(target);
                event.preventDefault();
                // Don't bubble up
                return false;
            }
        }
        // Bubble up to ApplicationView#click
        return true;
    },
    performArticleTransforms: function () {
        var model = this.get('controller.model'), article = model.get('article');
        if (article && article.length > 0) {
            if (this.get('contributionFeatureEnabled')) {
                this.setupContributionButtons();
            }
            this.loadTableOfContentsData();
            this.injectAds();
            this.setupAdsContext(model.get('adsContext'));
            M.setTrackContext({
                a: model.title,
                n: model.ns
            });
            M.trackPageView(model.get('adsContext.targeting'));
        }
        return true;
    },
    setupContributionButtons: function () {
        var _this = this;
        // TODO: There should be a helper for generating this HTML
        var pencil = '<div class="edit-section"><svg class="icon pencil" role="img"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#pencil"></use></svg></div>', photo = '<div class="upload-photo"><svg class="icon camera" role="img"><use xlink:href="#camera"></use></svg><input class="file-input" type="file" accept="image/*"/></div>', iconsWrapper = '<div class="icon-wrapper">' + pencil + photo + '</div>', $photoZero = this.$('.upload-photo');
        $photoZero.on('change', function () {
            _this.onPhotoIconChange($photoZero, 0);
        }).on('click', function () {
            M.track({
                action: M.trackActions.click,
                category: 'sectioneditor',
                label: 'addPhoto',
                value: 0
            });
        });
        this.$(':header[section]').each(function (i, item) {
            var $sectionHeader = _this.$(item);
            $sectionHeader.prepend(iconsWrapper).addClass('short-header');
        });
        this.setupButtonsListeners();
    },
    setupButtonsListeners: function () {
        var _this = this;
        this.$('.article-content').on('click', '.pencil', function (event) {
            var $sectionHeader = $(event.target).closest(':header[section]');
            _this.get('controller').send('edit', _this.get('controller.model.cleanTitle'), $sectionHeader.attr('section'));
        }).on('click', '.upload-photo', function (event) {
            var $sectionHeader = $(event.target).closest(':header[section]'), sectionIndex = parseInt($sectionHeader.attr('section'), 10);
            M.track({
                action: M.trackActions.click,
                category: 'sectioneditor',
                label: 'addPhoto',
                value: sectionIndex
            });
        }).on('change', '.upload-photo', function (event) {
            var $uploadPhotoContainer = $(event.target).parent(), sectionIndex = parseInt($(event.target).closest(':header[section]').attr('section'), 10);
            _this.onPhotoIconChange($uploadPhotoContainer, sectionIndex);
        });
    },
    onPhotoIconChange: function (uploadPhotoContainer, sectionNumber) {
        var photoData = uploadPhotoContainer.find('.file-input')[0].files[0];
        this.get('controller').send('addPhoto', this.get('controller.model.cleanTitle'), sectionNumber, photoData);
    },
    /**
     * @desc Generates table of contents data based on h2 elements in the article
     * TODO: Temporary solution for generating Table of Contents
     * Ideally, we wouldn't be doing this as a post-processing step, but rather we would just get a JSON with
     * ToC data from server and render view based on that.
     */
    loadTableOfContentsData: function () {
        var headers = this.$('h2[section]').map(function (i, elem) {
            if (elem.textContent) {
                return {
                    level: elem.tagName,
                    name: elem.textContent,
                    id: elem.id
                };
            }
        }).toArray();
        this.get('controller').send('updateHeaders', headers);
    },
    /**
     * @desc Returns true if handleMedia() should be executed
     * @param {EventTarget} target
     * @param {string} tagName clicked tag name
     * @returns {boolean}
     */
    shouldHandleMedia: function (target, tagName) {
        return (tagName === 'img' || tagName === 'figure') && $(target).children('a').length === 0;
    },
    /**
     * Opens media lightbox for given target
     *
     * @param target
     */
    handleMedia: function (target) {
        var $target = $(target), galleryRef = $target.closest('[data-gallery-ref]').data('gallery-ref'), $mediaElement = $target.closest('[data-ref]'), mediaRef = $mediaElement.data('ref'), media;
        if (mediaRef >= 0) {
            Em.Logger.debug('Handling media:', mediaRef, 'gallery:', galleryRef);
            if (!$mediaElement.hasClass('is-small')) {
                media = this.get('controller.model.media');
                this.get('controller').send('openLightbox', 'media', {
                    media: media,
                    mediaRef: mediaRef,
                    galleryRef: galleryRef
                });
            }
            else {
                Em.Logger.debug('Image too small to open in lightbox', target);
            }
            if (galleryRef >= 0) {
                M.track({
                    action: M.trackActions.click,
                    category: 'gallery'
                });
            }
        }
        else {
            Em.Logger.debug('Missing ref on', target);
        }
    }
});
