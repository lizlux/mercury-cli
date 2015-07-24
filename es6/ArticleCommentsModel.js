/// <reference path="../app.ts" />
'use strict';
App.ArticleCommentsModel = Em.Object.extend({
    articleId: null,
    comments: 0,
    users: null,
    pagesCount: 0,
    page: 0,
    fetch: Em.observer('page', 'articleId', function () {
        var _this = this;
        var page = this.get('page'), articleId = this.get('articleId');
        if (page && page >= 0 && articleId) {
            return new Em.RSVP.Promise(function (resolve, reject) {
                Em.$.ajax({
                    url: _this.url(articleId, page),
                    success: function (data) {
                        _this.setProperties(data.payload);
                        resolve(_this);
                    },
                    error: function (data) {
                        reject(data);
                    }
                });
            });
        }
    }),
    reset: Em.observer('articleId', function () {
        this.setProperties({
            comments: 0,
            users: null,
            pagesCount: 0
        });
    }),
    url: function (articleId, page) {
        if (page === void 0) { page = 0; }
        return App.get('apiBase') + '/article/comments/' + articleId + '/' + page;
    }
});
