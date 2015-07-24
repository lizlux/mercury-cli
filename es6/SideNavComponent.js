/// <reference path="../app.ts" />
'use strict';
App.SideNavComponent = Em.Component.extend({
    tagName: 'nav',
    classNames: ['side-nav'],
    classNameBindings: ['isCollapsed:collapsed:slide-into-view'],
    isCollapsed: true,
    isInSearchMode: false,
    searchQuery: '',
    searchPlaceholderLabel: Em.computed(function () {
        return i18n.t('app.search-label');
    }),
    actions: {
        clearSearch: function () {
            this.set('searchQuery', '');
        },
        collapse: function () {
            this.set('isCollapsed', true);
            this.send('searchCancel');
        },
        expand: function () {
            this.set('isCollapsed', false);
        },
        searchCancel: function () {
            this.set('isInSearchMode', false);
            this.send('clearSearch');
        },
        searchFocus: function () {
            this.set('isInSearchMode', true);
            // Track when search is opened
            M.track({
                action: M.trackActions.click,
                category: 'search'
            });
        },
        loadRandomArticle: function () {
            this.sendAction('loadRandomArticle');
        },
        /**
         * TODO: Refactor, use api
         *
         * Temporary solution for enter on search, will be refactored to be a route in mercury
         * @param value of input
         */
        enter: function (value) {
            if (value === void 0) { value = ''; }
            window.location.assign('%@Special:Search?search=%@&fulltext=Search'.fmt(Mercury.wiki.articlePath, value));
        }
    },
    isCollapsedObserver: Em.observer('isCollapsed', function () {
        var trackLabel = this.get('isCollapsed') ? 'close' : 'open';
        M.track({
            action: M.trackActions.click,
            category: 'menu',
            label: trackLabel
        });
    }),
    /**
     * Every time we exit search mode, regardless of if it was through the Cancel
     * link or through clicking a search result, we want to clear out the query
     * so that the search bar will clear.
     */
    isInSearchModeObserver: Em.observer('isInSearchMode', function () {
        if (!this.get('isInSearchMode')) {
            this.send('clearSearch');
        }
    }).on('didInsertElement')
});
