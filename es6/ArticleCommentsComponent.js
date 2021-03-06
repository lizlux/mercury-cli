/// <reference path="../app.ts" />
/// <reference path="../models/ArticleCommentsModel.ts" />
'use strict';
App.ArticleCommentsComponent = Em.Component.extend({
    page: null,
    articleId: null,
    commentsCount: null,
    classNames: ['article-comments', 'mw-content'],
    model: null,
    isCollapsed: true,
    nextButtonShown: false,
    prevButtonShown: false,
    showComments: Em.computed.bool('page'),
    /**
     * @desc scrolls to top of article's container, used for pagination
     */
    scrollToTop: function () {
        window.scrollTo(0, this.$().offset().top);
    },
    didInsertElement: function () {
        this.set('model', App.ArticleCommentsModel.create({
            articleId: this.get('articleId')
        }));
        if (this.get('page')) {
            this.scrollToTop();
        }
    },
    /**
     * @desc observes changes to page property, applies limit `1 <= page <= model.pagesCount`
     * and updates model, so it can load a page of comments
     */
    pageObserver: Em.observer('page', 'model.comments', function () {
        var _this = this;
        Em.run.scheduleOnce('afterRender', this, function () {
            var page = _this.get('page'), count = _this.get('model.pagesCount'), currentPage = page, currentPageInteger, isFirstPage;
            // since those can be null we intentionally correct the types
            if (page != null && count != null) {
                currentPage = Math.max(Math.min(page, count), 1);
            }
            currentPageInteger = parseInt(currentPage, 10);
            isFirstPage = currentPageInteger === 1;
            _this.setProperties({
                nextButtonShown: (isFirstPage || currentPageInteger < count) && count > 1,
                prevButtonShown: !isFirstPage && (currentPageInteger > 1),
                page: currentPage
            });
            _this.set('model.page', currentPage);
        });
    }),
    /**
     * @desc watches changes to model, and scrolls to top of comments
     */
    commentsObserver: Em.observer('model.comments', function () {
        if (this.get('model.comments')) {
            this.scrollToTop();
        }
    }),
    /**
     * @desc if articleId changes, updates model
     */
    articleIdObserver: Em.observer('articleId', function () {
        this.setProperties({
            'model.articleId': this.get('articleId'),
            page: null
        });
        this.rerender();
    }),
    actions: {
        nextPage: function () {
            this.incrementProperty('page');
        },
        prevPage: function () {
            this.decrementProperty('page');
        },
        toggleComments: function () {
            this.set('page', this.get('page') ? null : 1);
            this.toggleProperty('isCollapsed');
            M.track({
                action: M.trackActions.click,
                category: 'comments',
                label: this.get('page') ? 'open' : 'close'
            });
        }
    }
});
