/// <reference path="../app.ts" />
/// <reference path="./GalleryMediaComponent.ts" />
'use strict';
App.LinkedGalleryMediaComponent = App.GalleryMediaComponent.extend({
    tagName: 'div',
    classNames: ['linked-gallery'],
    layoutName: 'components/linked-gallery-media',
    limit: 4,
    // This is set the same as the limit property to prevent "empty" images
    // from showing before "View more" button is clicked
    incrementLimitValue: 4,
    canShowMore: Em.computed('media', 'limit', function () {
        return this.get('media').length > this.get('limit');
    }),
    setUp: function () {
        this._super();
        this.set('media', this.get('media').sort(this.sortMedia));
    },
    /**
     * Sorts media by a simple criterion: if it's linked or not; use this method as compression function
     *
     * @param {ArticleMedia} a
     * @param {ArticleMedia} b
     * @returns {number}
     */
    sortMedia: function (a, b) {
        if (a.link && typeof b.link === 'undefined') {
            return 1;
        }
        else if (b.link && typeof a.link === 'undefined') {
            return -1;
        }
        return 0;
    },
    load: function () {
        var _this = this;
        this.setUp();
        this.loadImages(0, this.limit);
        this.$().on('scroll', function () { return _this.onScroll; });
    },
    actions: {
        showMore: function () {
            var previousLimit = this.get('limit'), mediaLength = this.get('media').length;
            this.set('limit', mediaLength);
            this.loadImages(previousLimit, (previousLimit + mediaLength));
            this.$('button').remove();
        }
    }
});
