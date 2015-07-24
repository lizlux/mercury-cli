/// <reference path="../app.ts" />
/// <reference path="../../baseline/mercury" />
/// <reference path="../mixins/EditMixin.ts" />
'use strict';
App.EditModel = Em.Object.extend({
    content: null,
    originalContent: null,
    timestamp: null,
    title: null,
    sectionIndex: null,
    isDirty: Em.computed('content', 'originalContent', function () {
        return this.get('content') !== this.get('originalContent');
    })
});
App.EditModel.reopenClass(App.EditMixin, {
    publish: function (model) {
        var _this = this;
        return new Em.RSVP.Promise(function (resolve, reject) {
            _this.getEditToken(model.title).then(function (token) {
                Em.$.ajax({
                    url: M.buildUrl({ path: '/api.php' }),
                    data: {
                        action: 'edit',
                        title: model.title,
                        section: model.sectionIndex,
                        text: model.content,
                        token: token,
                        format: 'json'
                    },
                    dataType: 'json',
                    method: 'POST',
                    success: function (resp) {
                        if (resp && resp.edit && resp.edit.result === 'Success') {
                            resolve();
                        }
                        else if (resp && resp.error) {
                            reject(resp.error.code);
                        }
                        else {
                            reject();
                        }
                    },
                    error: function (err) {
                        reject(err);
                    }
                });
            }, function (err) {
                reject(err);
            });
        });
    },
    load: function (title, sectionIndex) {
        return new Em.RSVP.Promise(function (resolve, reject) {
            Em.$.ajax(M.buildUrl({ path: '/api.php' }), {
                dataType: 'json',
                cache: false,
                data: {
                    action: 'query',
                    prop: 'revisions',
                    // FIXME: It should be possible to pass props as an array
                    rvprop: 'content|timestamp',
                    titles: title,
                    rvsection: sectionIndex,
                    format: 'json'
                }
            }).done(function (resp) {
                var pages, revision;
                if (resp.error) {
                    reject(resp.error.code);
                    return;
                }
                pages = Em.get(resp, 'query.pages');
                if (pages) {
                    // FIXME: MediaWiki API, seriously?
                    revision = pages[Object.keys(pages)[0]].revisions[0];
                    resolve(App.EditModel.create({
                        title: title,
                        sectionIndex: sectionIndex,
                        content: revision['*'],
                        originalContent: revision['*'],
                        timestamp: revision.timestamp
                    }));
                }
                else {
                    reject();
                }
            }).fail(function (err) {
                reject(err);
            });
        });
    }
});
