/// <reference path="../app.ts" />
'use strict';
App.FeaturedContentMixin = Em.Mixin.create({
    layoutName: 'components/featured-content',
    classNames: ['featured-content'],
    currentItemIndex: 0,
    hasMultipleItems: Em.computed('model', function () {
        return this.get('model.length') > 1;
    }),
    currentItem: Em.computed('model', 'currentItemIndex', function () {
        var model = this.get('model');
        if (!Em.isEmpty(model)) {
            return this.get('model')[this.get('currentItemIndex')];
        }
        return null;
    }),
    lastIndex: Em.computed('model', function () {
        return this.get('model.length') - 1;
    }),
    /**
     * @desc Keep pagination up to date
     */
    currentItemIndexObserver: Em.observer('currentItemIndex', function () {
        var $pagination = this.$('.featured-content-pagination');
        $pagination.find('.current').removeClass('current');
        $pagination.find(`li[data-index=${this.get('currentItemIndex')}]`).addClass('current');
    }).on('didInsertElement'),
    prevItem: function () {
        if (this.get('hasMultipleItems')) {
            if (this.get('currentItemIndex') === 0) {
                this.set('currentItemIndex', this.get('lastIndex'));
            }
            else {
                this.decrementProperty('currentItemIndex');
            }
        }
    },
    nextItem: function () {
        if (this.get('hasMultipleItems')) {
            if (this.get('currentItemIndex') >= this.get('lastIndex')) {
                this.set('currentItemIndex', 0);
            }
            else {
                this.incrementProperty('currentItemIndex');
            }
        }
    }
});
