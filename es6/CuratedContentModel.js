/// <reference path="../app.ts" />
'use strict';
App.CuratedContentModel = Em.Object.extend({
    title: null,
    type: null,
    items: [],
    offset: null
});
App.CuratedContentModel.reopenClass({
    find: function (sectionName, sectionType, offset) {
        if (sectionType === void 0) { sectionType = 'section'; }
        if (offset === void 0) { offset = null; }
        return new Em.RSVP.Promise(function (resolve, reject) {
            var url = App.get('apiBase'), curatedContentGlobal = M.prop('curatedContent'), params = {}, modelInstance = App.CuratedContentModel.create({
                title: sectionName,
                type: sectionType
            });
            // If this is first PV we have model for curated content already so we don't need to issue another request
            // When resolving promise we need to set Mercury.curatedContent to null
            // because this data gets outdated on following PVs
            if (curatedContentGlobal && curatedContentGlobal.items) {
                modelInstance.setProperties({
                    items: App.CuratedContentModel.sanitizeItems(curatedContentGlobal.items),
                    offset: curatedContentGlobal.offset
                });
                resolve(modelInstance);
                M.prop('curatedContent', null);
            }
            else {
                url += (sectionType === 'section') ? '/main/section/' + sectionName : '/main/category/' + sectionName;
                if (offset) {
                    params.offset = offset;
                }
                Em.$.ajax({
                    url: url,
                    data: params,
                    success: function (data) {
                        modelInstance.setProperties({
                            items: App.CuratedContentModel.sanitizeItems(data.items),
                            offset: data.offset || null
                        });
                        resolve(modelInstance);
                    },
                    error: function (data) {
                        reject(data);
                    }
                });
            }
        });
    },
    loadMore: function (model) {
        return new Em.RSVP.Promise(function (resolve, reject) {
            // Category type is hardcoded because only Categories API supports offset.
            var newModelPromise = App.CuratedContentModel.find(model.get('title'), 'category', model.get('offset'));
            newModelPromise.then(function (newModel) {
                model.items.pushObjects(newModel.items);
                model.set('offset', newModel.offset);
                resolve(model);
            }).catch(function (reason) {
                reject(reason);
            });
        });
    },
    sanitizeItems: function (rawData) {
        var _this = this;
        var sanitizedItems = [];
        if (Em.isArray(rawData)) {
            sanitizedItems = rawData.map(function (item) {
                return _this.sanitizeItem(item);
            });
        }
        return sanitizedItems;
    },
    sanitizeItem: function (rawData) {
        var item, categoryName, url, articlePath = Em.get(Mercury, 'wiki.articlePath');
        if (rawData.type === 'section') {
            item = {
                label: rawData.title,
                imageUrl: rawData.image_url,
                type: 'section'
            };
        }
        else if (rawData.type === 'category') {
            // MercuryApi (categories for section) returns article_local_url, ArticlesApi (subcategories) returns url
            url = rawData.url ? rawData.url : rawData.article_local_url;
            try {
                categoryName = decodeURIComponent(url);
            }
            catch (error) {
                categoryName = url;
            }
            // Remove /wiki/
            categoryName = categoryName.replace(articlePath, '');
            // Remove Category: prefix
            categoryName = categoryName.substr(categoryName.indexOf(':') + 1);
            item = {
                label: rawData.label || rawData.title,
                imageUrl: rawData.image_url,
                type: 'category',
                categoryName: categoryName
            };
        }
        else {
            item = {
                label: rawData.title,
                imageUrl: rawData.thumbnail,
                type: rawData.type,
                url: rawData.url
            };
            // ArticlesApi doesn't return type for blog posts so we need to look at the namespace
            if (Em.isEmpty(rawData.type) && rawData.ns === 500) {
                item.type = 'blog';
            }
        }
        return item;
    }
});
