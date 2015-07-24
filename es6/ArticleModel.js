/// <reference path="../../baseline/mercury" />
/// <reference path="../app.ts" />
/// <reference path="../../mercury/utils/string.ts" />
/// <reference path="../../mercury/modules/Ads.ts" />
/// <reference path="../../../../typings/i18next/i18next.d.ts" />
App.ArticleModel = Em.Object.extend({
    article: null,
    basePath: null,
    categories: [],
    cleanTitle: null,
    comments: 0,
    description: null,
    isMainPage: false,
    mainPageData: null,
    media: [],
    mediaUsers: [],
    sections: [],
    title: null,
    user: null,
    users: [],
    wiki: null,
});
App.ArticleModel.reopenClass({
    url: function (params) {
        var redirect = '';
        if (params.redirect) {
            redirect += '?redirect=' + encodeURIComponent(params.redirect);
        }
        return App.get('apiBase') + '/article/' + params.title + redirect;
    },
    find: function (params) {
        var _this = this;
        var model = App.ArticleModel.create(params);
        return new Em.RSVP.Promise(function (resolve, reject) {
            if (M.prop('firstPage') && !M.prop('asyncArticle')) {
                _this.setArticle(model);
                resolve(model);
                return;
            }
            Em.$.ajax({
                url: _this.url(params),
                dataType: 'json',
                success: function (data) {
                    _this.setArticle(model, data);
                    resolve(model);
                },
                error: function (err) {
                    if (err.status === 404) {
                        _this.setArticle(model, {
                            error: err.responseJSON
                        });
                        resolve(model);
                    }
                    else {
                        // TODO we currently abort transition when there was an error other than 404
                        reject($.extend(err, model));
                    }
                }
            });
        });
    },
    getArticleRandomTitle: function () {
        return new Em.RSVP.Promise(function (resolve, reject) {
            Em.$.ajax({
                url: App.get('apiBase') + '/article?random&titleOnly',
                cache: false,
                dataType: 'json',
                success: function (data) {
                    if (data.title) {
                        resolve(data.title);
                    }
                    else {
                        reject({
                            message: 'Data from server doesn\'t include article title',
                            data: data
                        });
                    }
                },
                error: function (err) {
                    reject(err);
                }
            });
        });
    },
    getPreloadedData: function () {
        var article = Mercury.article, adsInstance, instantGlobals = Wikia.InstantGlobals || {};
        M.prop('firstPage', false);
        // On first page load the article content is available only in HTML
        article.content = $('#preloadedContent').html();
        delete Mercury['article'];
        return article;
    },
    setArticle: function (model, source) {
        if (source === void 0) { source = this.getPreloadedData(); }
        var data = {};
        if (source.error) {
            var error = source.error;
            data = {
                article: error.details,
                cleanTitle: M.String.normalizeToWhitespace(model.title),
                error: error
            };
        }
        else if (source) {
            // TODO temporary, remove in CONCF-670
            var descriptionCopied = false;
            if (source.details) {
                var details = source.details;
                data = $.extend(data, {
                    ns: details.ns,
                    cleanTitle: details.title,
                    comments: details.comments,
                    id: details.id,
                    user: details.revision.user_id
                });
                // TODO temporary, extend with the rest above in CONCF-670
                if (details.description) {
                    data.description = details.description;
                    descriptionCopied = true;
                }
            }
            if (source.article) {
                var article = source.article;
                data = $.extend(data, {
                    article: article.content || source.content,
                    mediaUsers: article.users,
                    type: article.type,
                    media: App.MediaModel.create({
                        media: article.media
                    }),
                    categories: article.categories
                });
                // TODO temporary, remove in CONCF-670
                if (!descriptionCopied && article.description) {
                    data.description = article.description;
                }
            }
            if (source.relatedPages) {
                /**
                 * Code to combat a bug observed on the Karen Traviss page on the Star Wars wiki, where there
                 * are no relatedPages for some reason. Moving forward it would be good for the Wikia API
                 * to handle this and never return malformed structures.
                 */
                data.relatedPages = source.relatedPages;
            }
            if (source.adsContext) {
                data.adsContext = source.adsContext;
            }
            if (source.topContributors) {
                // Same issue: the response to the ajax should always be valid and not undefined
                data.topContributors = source.topContributors;
            }
            data.isMainPage = source.isMainPage || false;
            if (source.mainPageData) {
                data.mainPageData = source.mainPageData;
                data.isCuratedMainPage = true;
            }
        }
        // We could keep whole article in global but we want to discourage that but
        // We need to update global article.type
        // to allow eg. for analytics to use it
        // TODO: Should analytics be part of ember? That should simplify how to pass stuff around.
        M.prop('article.type', data.type, true);
        model.setProperties(data);
    }
});
